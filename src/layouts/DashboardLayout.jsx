import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { profile, logout, notifications, handleRequest } = useAuth();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [focusedNotif, setFocusedNotif] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-red-500/10 selection:text-red-800">
      {/* MODERN GLASSY HEADER */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 transition-all">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-gradient-to-tr from-red-800 to-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-800/20">
            <span className="text-white text-lg font-bold">P</span>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">PutraConsult</span>
            <span className="block text-[10px] font-mono tracking-wider text-slate-400 font-bold -mt-1 uppercase">UPM PORTAL</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* NOTIFICATION TRIGGER */}
          <button onClick={() => setShowNotifModal(true)} className="relative p-2 text-slate-500 hover:text-red-700 rounded-xl hover:bg-slate-50 transition-all duration-200 group">
            <span className="text-xl group-hover:scale-110 block transition-transform">🔔</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {/* USER PROFILE MINIMAL BADGE */}
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-6 hidden sm:flex">
            <div className="text-right">
              <span className="font-sans font-bold text-slate-800 block text-sm">
                {profile?.name ? profile.name : "Profile Name"}
              </span>
              <span className="font-mono bg-red-50 text-red-700 text-[9px] px-2 py-0.5 rounded-full font-black tracking-wide uppercase border border-red-100/60 inline-block mt-0.5">
                {profile?.role}
              </span>
            </div>
            <div className="h-9 w-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-sm">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <button onClick={logout} className="text-xs font-semibold text-slate-500 hover:text-red-700 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg bg-white shadow-xs transition-all duration-200">
            LOGOUT
          </button>
        </div>
      </nav>

      {/* BODY CONTENT CONTAINER */}
      <main className="max-w-6xl mx-auto p-8 animate-fade-in">{children}</main>

      {/* MODERN GLASS NOTIFICATION DRAWER OVERLAY */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 transition-opacity duration-300">
          <div className="w-full max-w-md bg-white h-full flex flex-col p-6 shadow-2xl transition-transform duration-300 transform translate-x-0">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900">Notifications</h3>
                <p className="text-xs font-mono tracking-wider text-slate-400 uppercase mt-0.5">Live Update Feed[cite: 1]</p>
              </div>
              <button onClick={() => setShowNotifModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 text-sm transition-all">✕</button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center text-slate-400 py-16 flex flex-col items-center justify-center space-y-2">
                  <span className="text-3xl">☕</span>
                  <p className="text-sm font-medium italic">Everything is up to date.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:bg-slate-100/50 transition-all duration-200 group flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-xs border border-slate-200/60 flex items-center justify-center text-lg">
                        {n.type === "incoming" ? "📥" : "📅"}
                      </div>
                      <div>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md font-mono uppercase tracking-wide inline-block">{n.title}</span>
                        {n.type === "incoming" && <p className="text-xs font-bold text-slate-800 mt-1">{n.studentName}[cite: 1]</p>}
                        {n.type === "status" && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{n.message}</p>}
                      </div>
                    </div>
                    <button onClick={() => setFocusedNotif(n)} className="bg-white hover:bg-red-800 hover:text-white border border-slate-200 hover:border-red-800 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-lg transition-all shadow-xs shrink-0">
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODERN GLASS CENTER MODAL (Booking Requests & Updates) */}
      {focusedNotif && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 transform transition-all scale-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-mono font-extrabold tracking-wider text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase">
                {focusedNotif.title}[cite: 1]
              </span>
              <button onClick={() => setFocusedNotif(null)} className="text-slate-400 hover:text-slate-600 text-sm p-1">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 text-xl font-bold shadow-xs">
                  👤
                </div>
                <div>
                  {focusedNotif.type === "incoming" ? (
                    <>
                      <h4 className="text-base font-extrabold text-slate-900">{focusedNotif.studentName}</h4>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">Matrics ID: <span className="text-slate-700 font-bold">{focusedNotif.studentIdCode}</span></p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{focusedNotif.message}</p>
                  )}
                </div>
              </div>

              {focusedNotif.type === "incoming" && (
                <>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-medium text-slate-600">
                    <div>📅 Date: <span className="text-slate-900 font-bold block mt-0.5">{focusedNotif.date}</span></div>
                    <div>⏰ Time Window: <span className="text-slate-900 font-bold block mt-0.5">{focusedNotif.time}</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs text-slate-700">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1 uppercase tracking-wider">Student Objective Statement[cite: 1]:</span>
                    <p className="italic font-medium text-slate-600">"{focusedNotif.message}"</p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                {focusedNotif.type === "incoming" ? (
                  <>
                    <button onClick={async () => { await handleRequest(focusedNotif.id, focusedNotif.slotId, "declined"); setFocusedNotif(null); }} className="bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold py-2.5 rounded-xl text-xs tracking-wide border border-slate-200/60 hover:border-red-200/60 transition-all">
                      DECLINE
                    </button>
                    <button onClick={async () => { await handleRequest(focusedNotif.id, focusedNotif.slotId, "approved"); setFocusedNotif(null); }} className="bg-red-800 hover:bg-red-900 text-white font-bold py-2.5 rounded-xl text-xs tracking-wide shadow-md shadow-red-800/10 transition-all">
                      ACCEPT & BOOK
                    </button>
                  </>
                ) : (
                  <button onClick={() => setFocusedNotif(null)} className="col-span-2 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs tracking-wide transition-all">
                    DISMISS
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}