// BACKEND JOB: Restricts views based on Auth and Role

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading PutraConsult...</div>;
  }

  if (!user) {
    // Force kick back to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    // If user doesn't possess the required permission level, reroute to entry
    return <Navigate to="/" replace />;
  }

  return children;
};