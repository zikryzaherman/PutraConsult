//home layout
import React, { useEffect } from "react";
import { useAuth } from "./../context/AuthContext";
import DashboardLayout from "./../layouts/DashboardLayout";

export default function Home() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If auth data is still downloading from Firestore, standby
    if (loading) return;

    if (profile) {
      // Role-Based Smart Router Redirect map
      if (profile.role === "lecturer") {
        navigate("/lecturer/availability");
      } else {
        navigate("/student/find");
      }
    } else {
      // If no valid auth profile token exists, protect path by kicking back to portal door
      navigate("/login");
    }
  }, [profile, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        {/* Modern Brand Logo Graphic Frame Mock */}
        <div className="h-12 w-12 bg-gradient-to-tr from-red-800 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-800/20">
          <span className="text-white text-2xl font-black">P</span>
        </div>
        <div className="text-center">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
            Syncing Workspace Channels
          </h2>
          <p className="text-[11px] font-mono font-bold text-slate-400 mt-0.5 tracking-widest">
            LOADING PUTRACONSULT ENGINE...
          </p>
        </div>
      </div>
    </div>
  );
}