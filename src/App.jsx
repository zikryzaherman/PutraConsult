import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FindLecturer from "./pages/student/FindLecturer";
import ViewBookingStatus from "./pages/student/ViewBookingStatus";
import ManageAvailability from "./pages/lecturer/ManageAvailability";
import ManageRequests from "./pages/lecturer/ManageRequests";

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, profile } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRole && profile?.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { profile } = useAuth();
  if (profile?.role === "lecturer") return <Navigate to="/lecturer/requests" replace />;
  return <Navigate to="/student/find" replace />;
}

function StudentLayout() {
  return (
    <div>
      <div className="bg-white border-b flex justify-center space-x-8 py-2 text-sm font-bold shadow-sm">
        <Link to="/student/find" className="text-red-800 hover:underline">🔍 Search & Book Lecturer</Link>
        <Link to="/student/status" className="text-red-800 hover:underline">📋 View Booking Status</Link>
      </div>
      <Routes>
        <Route path="find" element={<FindLecturer />} />
        <Route path="status" element={<ViewBookingStatus />} />
      </Routes>
    </div>
  );
}

function LecturerLayout() {
  return (
    <div>
      <div className="bg-white border-b flex justify-center space-x-8 py-2 text-sm font-bold shadow-sm">
        <Link to="/lecturer/requests" className="text-red-800 hover:underline">📥 Manage Requests</Link>
        <Link to="/lecturer/availability" className="text-red-800 hover:underline">⏳ Broadcast Availability</Link>
      </div>
      <Routes>
        <Route path="requests" element={<ManageRequests />} />
        <Route path="availability" element={<ManageAvailability />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
          <Route path="/student/*" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>} />
          <Route path="/lecturer/*" element={<ProtectedRoute allowedRole="lecturer"><LecturerLayout /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}