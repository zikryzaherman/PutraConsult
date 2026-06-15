// Sidebar component for the application [cite: 34]
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ profile }) {
  const location = useLocation();
  const isLecturer = profile?.role === "lecturer";

  // Navigation Items Arrays
  const studentLinks = [
    { name: "🔍 Find & Book Lecturer", path: "/student/find" },
    { name: "📋 View Booking Status", path: "/student/status" }
  ];

  const lecturerLinks = [
    { name: "📅 Manage Availability", path: "/lecturer/availability" },
    { name: "📥 Manage Requests", path: "/lecturer/requests" }
  ];

  const activeLinks = isLecturer ? lecturerLinks : studentLinks;

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-100 p-6 space-y-6">
      <div>
        <h4 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-3">
          Navigation Dashboard
        </h4>
        <nav className="flex flex-col space-y-1">
          {activeLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`p-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-red-800 text-white shadow-md shadow-red-800/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Account Info Box Card */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs font-mono text-slate-500">
        <span className="font-bold text-slate-400 block mb-1 uppercase text-[9px] tracking-wider">System ID Code:</span>
        <span className="text-slate-800 font-bold uppercase">{profile?.idCode || "NOT_SET"}</span>
      </div>
    </aside>
  );
}