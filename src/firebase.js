import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgnZF9D69YL2HXEaVMcEOn3wE5FuvONqU",
  authDomain: "ecopulse-ac920.firebaseapp.com",
  projectId: "ecopulse-ac920",
  storageBucket: "ecopulse-ac920.firebasestorage.app",
  messagingSenderId: "156290410831",
  appId: "1:156290410831:web:9765a982810a1e9a5afd3a",
  measurementId: "G-67XC41NQ94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
