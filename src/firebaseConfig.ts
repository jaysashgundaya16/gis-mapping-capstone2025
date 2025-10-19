// firebaseConfig.ts

// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACUlx5efLJKcUlBgmYnYgvbDMz-RR1FK4",
  authDomain: "bugta-13358.firebaseapp.com",
  projectId: "bugta-13358",
  // 🔧 FIXED: must be .appspot.com
  storageBucket: "bugta-13358.appspot.com",
  messagingSenderId: "990341908196",
  appId: "1:990341908196:web:e0454d2111db2be6b78ef1",
  measurementId: "G-JWC9WZ5XN7",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ Initialize Analytics (only if supported)
export let analytics: any = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});
