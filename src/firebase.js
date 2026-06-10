// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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