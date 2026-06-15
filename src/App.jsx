import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    <Routes>
      <Route path="find" element={<FindLecturer />} />
      <Route path="status" element={<ViewBookingStatus />} />
    </Routes>
  );
}

function LecturerLayout() {
  return (
    <Routes>
      <Route path="requests" element={<ManageRequests />} />
      <Route path="availability" element={<ManageAvailability />} />
    </Routes>
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