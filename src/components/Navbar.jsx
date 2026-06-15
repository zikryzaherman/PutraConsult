// Navigation shell present across the app [cite: 34]
import React from "react";

export default function Navbar({ profile, notifications, onNotificationClick, onLogout }) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 transition-all">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 bg-gradient-to-tr from-red-800 to-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-800/20">
          <span className="text-white text-lg font-bold">P</span>
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">PutraConsult</span>
          <span className="block text-[10px] font-mono tracking-wider text-slate-400 font-bold -mt-1 uppercase">UPM PORTAL</span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick} 
          className="relative p-2 text-slate-500 hover:text-red-700 rounded-xl hover:bg-slate-50 transition-all duration-200 group cursor-pointer"
        >
          <span className="text-xl group-hover:scale-110 block transition-transform">🔔</span>
          {notifications?.length > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>

        {/* User Badging */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 hidden sm:flex">
          <div className="text-right">
            <span className="font-sans font-bold text-slate-800 block text-sm">
              {profile?.name || "User Profile"}
            </span>
            <span className="font-mono bg-red-50 text-red-700 text-[9px] px-2 py-0.5 rounded-full font-black tracking-wide uppercase border border-red-100/60 inline-block mt-0.5">
              {profile?.role}
            </span>
          </div>
          <div className="h-9 w-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout} 
          className="text-xs font-semibold text-slate-500 hover:text-red-700 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg bg-white shadow-xs transition-all duration-200 cursor-pointer"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}