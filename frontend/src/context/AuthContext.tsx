"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  db,
  isFirebaseConfigured,
} from "@/lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  getAdditionalUserInfo,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  region: string;
  role: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface UserProfile {
  accountType: "individual" | "business";
  fullName: string;
  roleTitle: string;
  avatarUrl?: string;
  businessDetails?: {
    legalName: string;
    country: string;
    industry?: string;
    monthlyVolume?: string;
  };
  completed: boolean;
}

export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: UserSession | null;
  profile: UserProfile | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  pendingEmail: string;
  expectedCode: string;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (email: string, pass: string) => Promise<void>;
  verifyEmailCode: (code: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  hasWorkspace: () => boolean;
  createWorkspace: (data: { name: string; slug: string; region: string }) => Promise<Workspace>;
  switchWorkspace: (workspaceId: string) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string>("");
  const [expectedCode, setExpectedCode] = useState<string>("849201");

  // Load persistent session from local storage & sync with Firebase
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("sentinel_user");
      const storedWorkspaces = localStorage.getItem("sentinel_workspaces");
      const storedActiveWs = localStorage.getItem("sentinel_active_ws");
      const storedProfile = localStorage.getItem("sentinel_profile");
      const storedPending = sessionStorage.getItem("sentinel_pending_email");
      const storedCode = sessionStorage.getItem("sentinel_verify_code");

      if (storedPending) setPendingEmail(storedPending);
      if (storedCode) setExpectedCode(storedCode);

      if (storedUser) {
        setUser(JSON.parse(storedUser));

        if (storedWorkspaces) {
          const parsed: Workspace[] = JSON.parse(storedWorkspaces);
          setWorkspaces(parsed);
          if (storedActiveWs) {
            const active = parsed.find((w: Workspace) => w.id === storedActiveWs);
            if (active) setActiveWorkspace(active);
            else if (parsed.length > 0) setActiveWorkspace(parsed[0]);
          } else if (parsed.length > 0) {
            setActiveWorkspace(parsed[0]);
          }
        }

        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      }
    } catch (e) {
      console.warn("Storage hydration exception:", e);
    } finally {
      setIsLoading(false);
    }

    // Listen to live Firebase Auth state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const session: UserSession = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "user@sentinel.app",
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Analyst",
            photoURL: firebaseUser.photoURL || undefined,
          };
          setUser(session);
          localStorage.setItem("sentinel_user", JSON.stringify(session));

          // Fetch profile and workspaces from Firestore if exists
          if (db) {
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              if (userDoc.exists()) {
                const liveProfile = userDoc.data() as UserProfile;
                setProfile(liveProfile);
                localStorage.setItem("sentinel_profile", JSON.stringify(liveProfile));
              } else {
                setProfile(null);
                localStorage.removeItem("sentinel_profile");
              }

              // Load workspaces from Firestore
              const wsQuery = query(collection(db, "workspaces"), where("ownerUid", "==", firebaseUser.uid));
              const wsSnap = await getDocs(wsQuery);
              if (!wsSnap.empty) {
                const loadedWs: Workspace[] = wsSnap.docs.map((d) => d.data() as Workspace);
                setWorkspaces(loadedWs);
                localStorage.setItem("sentinel_workspaces", JSON.stringify(loadedWs));
                if (!activeWorkspace && loadedWs.length > 0) {
                  setActiveWorkspace(loadedWs[0]);
                  localStorage.setItem("sentinel_active_ws", loadedWs[0].id);
                }
              } else {
                setWorkspaces([]);
                setActiveWorkspace(null);
                localStorage.removeItem("sentinel_workspaces");
                localStorage.removeItem("sentinel_active_ws");
              }
            } catch (e) {
              console.warn("Firestore user sync error:", e);
            }
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const hasWorkspace = (): boolean => {
    return workspaces.length > 0 && !!activeWorkspace;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      let uid = "";
      let isNewUser = false;
      if (isFirebaseConfigured && auth) {
        const res = await signInWithPopup(auth, googleProvider);
        uid = res.user.uid;
        const additionalInfo = getAdditionalUserInfo(res);
        isNewUser = additionalInfo?.isNewUser ?? false;

        const session: UserSession = {
          uid: res.user.uid,
          email: res.user.email || "google-user@sentinel.app",
          displayName: res.user.displayName || "Sentinel User",
          photoURL: res.user.photoURL || undefined,
        };
        setUser(session);
        localStorage.setItem("sentinel_user", JSON.stringify(session));
      } else {
        uid = `g-${Date.now()}`;
        const mockGoogleUser: UserSession = {
          uid,
          email: "analyst@sentinel.app",
          displayName: "Sentinel Analyst",
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop",
        };
        setUser(mockGoogleUser);
        localStorage.setItem("sentinel_user", JSON.stringify(mockGoogleUser));
      }

      // If Firebase explicitly notes a new user account, enforce onboarding workflow!
      if (isNewUser) {
        setWorkspaces([]);
        setActiveWorkspace(null);
        setProfile(null);
        localStorage.removeItem("sentinel_workspaces");
        localStorage.removeItem("sentinel_active_ws");
        localStorage.removeItem("sentinel_profile");
        return false;
      }

      // Check if user already has workspaces in Firestore
      if (isFirebaseConfigured && db && uid) {
        try {
          const wsQuery = query(collection(db, "workspaces"), where("ownerUid", "==", uid));
          const wsSnap = await getDocs(wsQuery);
          if (!wsSnap.empty) {
            const loadedWs: Workspace[] = wsSnap.docs.map((d) => d.data() as Workspace);
            setWorkspaces(loadedWs);
            localStorage.setItem("sentinel_workspaces", JSON.stringify(loadedWs));
            setActiveWorkspace(loadedWs[0]);
            localStorage.setItem("sentinel_active_ws", loadedWs[0].id);

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              const liveProfile = userDoc.data() as UserProfile;
              setProfile(liveProfile);
              localStorage.setItem("sentinel_profile", JSON.stringify(liveProfile));
            }
            return true; // Already has workspace
          } else {
            // User exists in Auth but has no workspaces yet!
            setWorkspaces([]);
            setActiveWorkspace(null);
            setProfile(null);
            localStorage.removeItem("sentinel_workspaces");
            localStorage.removeItem("sentinel_active_ws");
            localStorage.removeItem("sentinel_profile");
            return false;
          }
        } catch (e) {
          console.warn("Firestore workspace check error:", e);
        }
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      let uid = "";
      if (isFirebaseConfigured && auth) {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        uid = res.user.uid;
        const session: UserSession = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || email.split("@")[0],
        };
        setUser(session);
        localStorage.setItem("sentinel_user", JSON.stringify(session));
      } else {
        uid = `usr-${Date.now()}`;
        const session: UserSession = {
          uid,
          email,
          displayName: email.split("@")[0],
        };
        setUser(session);
        localStorage.setItem("sentinel_user", JSON.stringify(session));
      }

      // Check if user already has workspaces in Firestore
      if (isFirebaseConfigured && db && uid) {
        try {
          const wsQuery = query(collection(db, "workspaces"), where("ownerUid", "==", uid));
          const wsSnap = await getDocs(wsQuery);
          if (!wsSnap.empty) {
            const loadedWs: Workspace[] = wsSnap.docs.map((d) => d.data() as Workspace);
            setWorkspaces(loadedWs);
            localStorage.setItem("sentinel_workspaces", JSON.stringify(loadedWs));
            setActiveWorkspace(loadedWs[0]);
            localStorage.setItem("sentinel_active_ws", loadedWs[0].id);

            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              const liveProfile = userDoc.data() as UserProfile;
              setProfile(liveProfile);
              localStorage.setItem("sentinel_profile", JSON.stringify(liveProfile));
            }
            return true; // Returning user with workspace!
          } else {
            setWorkspaces([]);
            setActiveWorkspace(null);
            setProfile(null);
            localStorage.removeItem("sentinel_workspaces");
            localStorage.removeItem("sentinel_active_ws");
            localStorage.removeItem("sentinel_profile");
            return false;
          }
        } catch (e) {
          console.warn("Firestore check error:", e);
        }
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      // Generate a 6-digit verification code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setPendingEmail(email);
      setExpectedCode(generatedCode);
      sessionStorage.setItem("sentinel_pending_email", email);
      sessionStorage.setItem("sentinel_verify_code", generatedCode);

      if (isFirebaseConfigured && auth) {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        // Send email verification via Firebase
        try {
          await sendEmailVerification(res.user);
        } catch (verErr) {
          console.warn("Firebase email verification send note:", verErr);
        }

        const session: UserSession = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: email.split("@")[0],
        };
        setUser(session);
        localStorage.setItem("sentinel_user", JSON.stringify(session));
      } else {
        const session: UserSession = {
          uid: `usr-${Date.now()}`,
          email,
          displayName: email.split("@")[0],
        };
        setUser(session);
        localStorage.setItem("sentinel_user", JSON.stringify(session));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailCode = async (code: string): Promise<boolean> => {
    // Check if code matches generated code or developer bypass code
    const trimmed = code.trim();
    if (trimmed === expectedCode || trimmed === "849201" || trimmed === "123456") {
      sessionStorage.removeItem("sentinel_verify_code");
      return true;
    }

    // Also check Firebase reload for email verification link
    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          sessionStorage.removeItem("sentinel_verify_code");
          return true;
        }
      } catch (e) {
        console.warn("Firebase email verification reload check:", e);
      }
    }

    return false;
  };

  const resendVerificationEmail = async () => {
    const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(freshCode);
    sessionStorage.setItem("sentinel_verify_code", freshCode);

    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (e) {
        console.warn("Resend email verification exception:", e);
      }
    }
  };

  const createWorkspace = async (data: {
    name: string;
    slug: string;
    region: string;
  }) => {
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
      region: data.region || "European Union",
      role: "Owner / Admin",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    setActiveWorkspace(newWs);
    localStorage.setItem("sentinel_workspaces", JSON.stringify(updated));
    localStorage.setItem("sentinel_active_ws", newWs.id);

    // Save to Firestore if configured
    if (isFirebaseConfigured && db && user) {
      try {
        await setDoc(doc(db, "workspaces", newWs.id), {
          ...newWs,
          ownerUid: user.uid,
        });
      } catch (e) {
        console.warn("Firestore save error:", e);
      }
    }

    return newWs;
  };

  const switchWorkspace = (workspaceId: string) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target) {
      setActiveWorkspace(target);
      localStorage.setItem("sentinel_active_ws", target.id);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated: UserProfile = {
      accountType: profile?.accountType || "business",
      fullName: profile?.fullName || "",
      roleTitle: profile?.roleTitle || "",
      ...profile,
      ...data,
      completed: true,
    };
    setProfile(updated);
    localStorage.setItem("sentinel_profile", JSON.stringify(updated));

    if (isFirebaseConfigured && db && user) {
      try {
        await setDoc(doc(db, "users", user.uid), updated, { merge: true });
      } catch (e) {
        console.warn("Firestore user profile save error:", e);
      }
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    setProfile(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    localStorage.removeItem("sentinel_user");
    localStorage.removeItem("sentinel_workspaces");
    localStorage.removeItem("sentinel_active_ws");
    localStorage.removeItem("sentinel_profile");
    sessionStorage.removeItem("sentinel_pending_email");
    sessionStorage.removeItem("sentinel_verify_code");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        workspaces,
        activeWorkspace,
        isLoading,
        pendingEmail,
        expectedCode,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        verifyEmailCode,
        resendVerificationEmail,
        hasWorkspace,
        createWorkspace,
        switchWorkspace,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
