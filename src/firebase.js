// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";          // 👈 Add this for Authentication
import { getFirestore } from "firebase/firestore";  // 👈 Add this for Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsP_T1_EnGFpWa6RVZPXzcMcfjXgrZXJA",
  authDomain: "putraconsult-baddie888.firebaseapp.com",
  projectId: "putraconsult-baddie888",
  storageBucket: "putraconsult-baddie888.firebasestorage.app",
  messagingSenderId: "862735939895",
  appId: "1:862735939895:web:caa34ce62aec951c18c2b2",
  measurementId: "G-8HS4H1P8R1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and Export services so you can use them in other files
export const auth = getAuth(app);             // 👈 Add this
export const db = getFirestore(app);          // 👈 Add this