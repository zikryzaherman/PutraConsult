import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Sign Up Handler
export const registerUser = async (email, password, name, role, department) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra data into our matching users database collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      email,
      role, // Must strictly be "student" or "lecturer"
      department,
      createdAt: new Date().toISOString()
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Login Handler
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Logout Handler
export const logoutUser = async () => {
  await signOut(auth);
};