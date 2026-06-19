import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc, deleteDoc, updateDoc, onSnapshot, query, where } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) setProfile(docSnap.data());
      } else {
        setCurrentUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setAvailability([]); setBookings([]); setNotifications([]); return;
    }
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(d => d.data()));
    });
    const unsubSlots = onSnapshot(
      query(collection(db, "slots"), where("isBooked", "==", false)), 
      (snapshot) => {
        setAvailability(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );
    const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubUsers(); unsubSlots(); unsubBookings(); };
  }, [currentUser]);

  useEffect(() => {
    if (!profile) return;
    if (profile.role === "lecturer") {
      const pending = bookings.filter(b => b.lecturerId === profile.uid && b.status === "pending");
      setNotifications(pending.map(b => ({
        id: b.id,
        type: "incoming",
        title: "NEW BOOKING REQUEST",
        studentName: b.studentName,
        studentIdCode: b.studentIdCode,
        message: b.description,
        date: b.date,
        time: b.time,
        slotId: b.slotId
      })));
    } else if (profile.role === "student") {
      const reviewed = bookings.filter(b => b.studentId === profile.uid);
      setNotifications(reviewed.map(b => ({
        id: b.id,
        type: "status",
        title: b.status === "approved" ? "REMINDER APPOINTMENT" : "YOUR REQUEST UPDATED",
        message: `Your appointment request with ${b.lecturerName} for ${b.date} at ${b.time} is ${b.status.toUpperCase()}.`
      })));
    }
  }, [bookings, profile]);

  // Add 'department' to the parameters here
const register = async (email, password, name, role, idCode, department) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Include department in the object saved to Firestore
    const newUserData = { 
      uid: cred.user.uid, 
      email, 
      name, 
      role, 
      idCode, 
      department: department || "Faculty Department", // Defaults to this if empty
      createdAt: new Date().toISOString() 
    };
    await setDoc(doc(db, "users", cred.user.uid), newUserData);
    setProfile(newUserData);
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
};

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (err) {
      return { error: "Invalid credentials mismatch." };
    }
  };

  const logout = () => signOut(auth);

  const addBooking = async (lecturerId, slotId, selectedSlotObj, description) => {
    await updateDoc(doc(db, "slots", slotId), { isBooked: true });
    const lecturerDoc = users.find(u => u.uid === lecturerId);
    await addDoc(collection(db, "bookings"), {
      studentId: profile.uid,
      studentName: profile.name,
      studentIdCode: profile.idCode || "N/A",
      lecturerId,
      lecturerName: lecturerDoc?.name || "Faculty Lecturer",
      date: selectedSlotObj.date,
      time: selectedSlotObj.time,
      slotId,
      description,
      status: "pending",
      createdAt: new Date().toISOString()
    });
  };

  const addSlot = async (date, time) => {
    await addDoc(collection(db, "slots"), { lecturerId: profile.uid, date, time, isBooked: false });
  };

  const deleteSlot = async (slotId) => {
    await deleteDoc(doc(db, "slots", slotId));
  };

  const updateSlotTime = async (slotId, newTime) => {
    await updateDoc(doc(db, "slots", slotId), { time: newTime });
  };

  const handleRequest = async (bookingId, slotId, decision) => {
    await updateDoc(doc(db, "bookings", bookingId), { status: decision });
    if (decision === "declined") {
      await updateDoc(doc(db, "slots", slotId), { isBooked: false });
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser, profile, users, availability, bookings, notifications,
      register, login, logout, addBooking, addSlot, deleteSlot, updateSlotTime, handleRequest
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);