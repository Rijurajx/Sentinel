import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read from .env.local if present
let apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
let projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
let authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
let storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
let messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
let appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (key === "NEXT_PUBLIC_FIREBASE_API_KEY") apiKey = val;
      if (key === "NEXT_PUBLIC_FIREBASE_PROJECT_ID") projectId = val;
      if (key === "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") authDomain = val;
      if (key === "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") storageBucket = val;
      if (key === "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") messagingSenderId = val;
      if (key === "NEXT_PUBLIC_FIREBASE_APP_ID") appId = val;
    }
  });
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionsToWipe = [
  "investigations",
  "suppliers",
  "evidence",
  "entities",
  "invoices",
  "inbox_alerts",
  "reviews",
  "dossiers",
];

async function wipe() {
  console.log("Connecting to Firestore project:", projectId);
  try {
    const wsSnap = await getDocs(collection(db, "workspaces"));
    console.log(`Found ${wsSnap.size} workspaces in Firestore.`);
    
    for (const wsDoc of wsSnap.docs) {
      const wsId = wsDoc.id;
      console.log(`Cleaning workspace [${wsId}]...`);
      for (const colName of collectionsToWipe) {
        try {
          const subCol = collection(db, "workspaces", wsId, colName);
          const subSnap = await getDocs(subCol);
          if (subSnap.size > 0) {
            console.log(`  -> ${colName}: deleting ${subSnap.size} docs...`);
            for (const d of subSnap.docs) {
              await deleteDoc(doc(db, "workspaces", wsId, colName, d.id));
            }
          }
        } catch (err) {
          console.error(`  Error in ${colName}:`, err.message);
        }
      }
    }

    console.log("Firestore collections wipe complete.");
    process.exit(0);
  } catch (e) {
    console.error("Wipe failed:", e);
    process.exit(1);
  }
}

wipe();
