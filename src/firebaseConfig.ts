// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACUlx5efLJKcUlBgmYnYgvbDMz-RR1FK4",
  authDomain: "bugta-13358.firebaseapp.com",
  projectId: "bugta-13358",
  storageBucket: "bugta-13358.firebasestorage.app",
  messagingSenderId: "990341908196",
  appId: "1:990341908196:web:e0454d2111db2be6b78ef1",
  measurementId: "G-JWC9WZ5XN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
