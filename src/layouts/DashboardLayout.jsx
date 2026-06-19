import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { profile, logout, notifications } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // UI States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Initialize readIds from LocalStorage so it survives page changes
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("putraConsult_readNotifs");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Sync to LocalStorage automatically whenever readIds changes
  useEffect(() => {
    localStorage.setItem("putraConsult_readNotifs", JSON.stringify(Array.from(readIds)));
  }, [readIds]);
  
  const isLecturer = profile?.role === "lecturer";

  // Calculate unread notifications based on our local tracker
  const unreadNotifications = (notifications || []).filter(n => !readIds.has(n.id));
  const unreadCount = unreadNotifications.length;

  // Dynamically set navigation links based on user role
  const navLinks = isLecturer 
    ? [
        { path: "/lecturer/availability", label: "Manage Availability", icon: "📅" },
        { path: "/lecturer/requests", label: "Manage Requests", icon: "📬" }
      ]
    : [
        { path: "/student/find", label: "Find & Book Lecturer", icon: "🔍" },
        { path: "/student/status", label: "My Requests", icon: "📋" }
      ];

  // --- Handlers ---
  const handleMarkAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setReadIds(allIds);
  };

  const handleViewClick = (notif) => {
    setReadIds(prev => new Set(prev).add(notif.id));
    setIsNotifOpen(false);
    
    if (isLecturer) {
      navigate("/lecturer/requests");
    } else {
      navigate("/student/status");
    }
  };

  // Helper to get the correct icon based on notification type
  const getNotifIcon = (notif) => {
    if (notif.title?.includes("APPROVED") || notif.title?.includes("REMINDER")) {
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden font-sans relative">
      
      {/* --- TOP NAVBAR --- */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center font-bold text-lg">P</div>
          <div><h1 className="font-black text-slate-900 leading-none tracking-tight text-lg">PutraConsult</h1></div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors focus:outline-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>
          
          <div className="w-px h-6 bg-slate-200"></div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <h3 className="font-bold text-slate-900 text-sm leading-none mb-1">{profile?.name || "Loading..."}</h3>
              <span className="text-[10px] text-slate-400 lowercase font-medium">{profile?.role || "user"}</span>
            </div>
            <div className="w-10 h-10 bg-red-50 text-red-900 rounded-full flex items-center justify-center font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-slate-800 transition-colors ml-2 cursor-pointer" title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* --- BOTTOM ROW --- */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6">
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => {
                const isActive = location.pathname.includes(link.path);
                return (
                  <Link key={link.path} to={link.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? "text-red-900 bg-red-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                    <span>{link.icon}</span>{link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
        </main>
      </div>
      
      {/* --- NOTIFICATION DRAWER --- */}
      {isNotifOpen && <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setIsNotifOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isNotifOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-white">
          <div className="flex gap-3 items-center">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            <div><h2 className="font-bold text-slate-900 text-lg leading-tight">Notifications</h2><p className="text-sm text-slate-500">{profile?.name}</p></div>
          </div>
          <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-800 p-1 transition-colors cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="px-6 py-4 flex justify-between items-center bg-white z-10">
          <span className="text-sm text-slate-600 font-medium">{unreadCount} unread</span>
          <button onClick={handleMarkAllRead} disabled={unreadCount === 0} className="text-sm text-red-900 hover:text-red-700 font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Mark all as read</button>
        </div>

        <div className="p-6 pt-2 flex-1 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
          {(!notifications || notifications.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-slate-500 font-medium">No new notifications</p>
            </div>
          ) : (
            [...notifications]
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .map((notif, index) => {
                const isUnread = !readIds.has(notif.id);
                return (
                  <div key={notif.id || index} className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative group hover:border-red-200 transition-colors ${!isUnread ? "opacity-75 bg-slate-50/50" : ""}`}>
                    {isUnread && <div className="absolute top-5 right-5 w-2 h-2 bg-red-600 rounded-full"></div>}
                    <div className="flex items-start gap-4 pr-4">
                      {getNotifIcon(notif)}
                      <div className="flex-1">
                        <p className={`text-sm leading-snug mb-1 ${isUnread ? "font-bold text-slate-800" : "font-medium text-slate-600"}`}>
                          {notif.message || notif.title}
                        </p>
                        <span className="text-xs text-slate-400 block mb-3">
                          {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "just now"}
                        </span>
                        <button onClick={() => handleViewClick(notif)} className="bg-red-50 text-red-900 hover:bg-red-100 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer">View</button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}