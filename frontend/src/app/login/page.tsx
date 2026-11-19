"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SentinelLogo } from "@/components/ui/SentinelLogo";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail, hasWorkspace } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const hasWs = await loginWithGoogle();
      if (hasWs) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/workspace");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const hasWs = await loginWithEmail(email, password);
      if (hasWs) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding/workspace");
      }
    } catch (err: any) {
      if (err?.code === "auth/invalid-credential" || err?.code === "auth/wrong-password") {
        setError("Invalid email or password. Please try again.");
      } else if (err?.code === "auth/user-not-found") {
        setError("No account found with this email. Please create one.");
      } else {
        setError(err?.message || "Authentication error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] flex flex-col items-center justify-center px-4 relative select-none">
      {/* Centered Auth Card Matching Linear Screenshot */}
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
        {/* Monochromatic Logo */}
        <Link href="/" className="transition-transform hover:scale-105">
          <SentinelLogo className="w-9 h-9 text-white" />
        </Link>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-medium tracking-tight text-[#f7f8f8]">
            Sign in to Sentinel
          </h1>
          <p className="text-xs text-[#8a8f98]">
            Financial threat intelligence & verification
          </p>
        </div>

        {error && (
          <div className="w-full p-2.5 rounded-lg bg-[#eb5757]/10 border border-[#eb5757]/20 text-[11px] text-[#eb5757] text-left animate-fade-in">
            {error}
          </div>
        )}

        {/* Action Buttons Stack (Exact Match to Linear Screenshot) */}
        <div className="w-full space-y-2.5 pt-2">
          {/* 1. Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#5e6ad2] hover:bg-[#6f7be8] text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-[#5e6ad2]/20 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* 2. Continue with Email Form */}
          {!showEmailForm ? (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#141518] hover:bg-[#1c1d22] border border-white/[0.08] text-[#f7f8f8] text-xs font-medium transition-colors"
            >
              Continue with email
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-2.5 text-left animate-fade-in pt-1">
              <div>
                <label className="text-[10px] text-[#8a8f98] font-mono uppercase block mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#62666d] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8a8f98] font-mono uppercase block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#62666d] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-white/[0.1] hover:bg-white/[0.15] text-xs font-medium text-white transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{loading ? "Signing in..." : "Sign In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* 3. Continue with SAML SSO */}
          <button
            type="button"
            onClick={() => {
              setError("SAML SSO available on Enterprise tier. Use Google or email.");
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[#141518] hover:bg-[#1c1d22] border border-white/[0.08] text-[#f7f8f8] text-xs font-medium transition-colors"
          >
            Continue with SAML SSO
          </button>
        </div>

        {/* Legal Disclaimer matching Linear */}
        <p className="text-[11px] text-[#62666d] leading-relaxed pt-2">
          By signing up, you agree to our{" "}
          <span className="text-[#8a8f98] underline cursor-pointer">Terms of Service</span>,{" "}
          <span className="text-[#8a8f98] underline cursor-pointer">Privacy Policy</span>, and{" "}
          <span className="text-[#8a8f98] underline cursor-pointer">Data Processing Agreement</span>.
        </p>

        {/* Bottom Switch Link */}
        <div className="pt-4 border-t border-white/[0.06] w-full text-xs text-[#8a8f98]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
