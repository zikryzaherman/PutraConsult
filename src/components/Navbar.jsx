// Navigation shell present across the app
import React from "react";

export default function Navbar({ profile, notifications, onNotificationClick, onLogout }) {
  return (
    <nav className="w-full bg-white border-b border-slate-200 h-16 flex justify-between items-center px-6 sticky top-0 z-50 shadow-xs">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-red-700 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xs">
          P
        </div>
        <div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
            PutraConsult
          </span>
          <span className="block text-[10px] tracking-wider text-slate-400 font-bold uppercase">
            UPM PORTAL
          </span>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick} 
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <span className="text-xl block">🔔</span>
          {notifications?.length > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        {/* User Badging */}
        <div className="items-center space-x-3 hidden sm:flex">
          <div className="text-right">
            <span className="font-sans font-bold text-slate-800 block text-sm leading-none">
              {profile?.name || "User Profile"}
            </span>
            <span className="inline-block mt-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wide border border-red-100">
              {profile?.role || "Student"}
            </span>
          </div>
          <div className="h-9 w-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-700 font-semibold text-sm shadow-xs">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout} 
          className="text-xs font-semibold text-slate-500 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 cursor-pointer"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}