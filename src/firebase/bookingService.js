import { db } from "./config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  getDoc
} from "firebase/firestore";

// --- LECTURER ACTIONS ---

// Broadcast a new open consultation slot
export const addAvailabilitySlot = async (lecturerId, date, time) => {
  const slotRef = collection(db, "slots");
  return await addDoc(slotRef, {
    lecturerId,
    date,        // Format: "YYYY-MM-DD"
    time,        // Format: "HH:MM"
    isBooked: false
  });
};

// Fetch incoming consultation requests for a specific lecturer
export const getLecturerRequests = async (lecturerId) => {
  const q = query(collection(db, "bookings"), where("lecturerId", "==", lecturerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Process (Approve/Reject) a student request
export const updateBookingStatus = async (bookingId, slotId, targetStatus) => {
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, { status: targetStatus });

  // If rejected, free up the slot again so other students can see it
  if (targetStatus === "rejected") {
    const slotRef = doc(db, "slots", slotId);
    await updateDoc(slotRef, { isBooked: false });
  }
};


// --- STUDENT ACTIONS ---

// Fetch all registered lecturers for the browse registry search view
export const getAllLecturers = async () => {
  const q = query(collection(db, "users"), where("role", "==", "lecturer"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch unbooked slots for a chosen lecturer
export const getAvailableSlots = async (lecturerId) => {
  const q = query(
    collection(db, "slots"), 
    where("lecturerId", "==", lecturerId),
    where("isBooked", "==", false)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Dispatch a booking request to a lecturer
export const submitBookingRequest = async (studentId, studentName, lecturerId, slotId, slotDetails, agenda) => {
  // 1. Instantly reserve the slot locally so nobody else double-books it
  const slotRef = doc(db, "slots", slotId);
  await updateDoc(slotRef, { isBooked: true });

  // 2. Submit the record into our bookings schema collection
  const bookingRef = collection(db, "bookings");
  return await addDoc(bookingRef, {
    studentId,
    studentName,
    lecturerId,
    slotId,
    slotDetails, // Object tracking: { date, time }
    agenda,
    status: "pending", // Statuses: pending, approved, rejected
    createdAt: new Date().toISOString()
  });
};

// Fetch booking records history for the active student dashboard list
export const getStudentBookings = async (studentId) => {
  const q = query(collection(db, "bookings"), where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};