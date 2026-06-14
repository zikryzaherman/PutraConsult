import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsP_T1_EnGFpWa6RVZPXzcMcfjXgrZXJA",
  authDomain: "putraconsult-baddie888.firebaseapp.com",
  projectId: "putraconsult-baddie888",
  storageBucket: "putraconsult-baddie888.firebasestorage.app",
  messagingSenderId: "862735939895",
  appId: "1:862735939895:web:caa34ce62aec951c18c2b2",
  measurementId: "G-8HS4H1P8R1"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);