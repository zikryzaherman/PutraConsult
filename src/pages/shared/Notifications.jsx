import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Notifications() {
  const { notifications, handleRequest } = useAuth();
  const [selectedNotif, setSelectedNotif] = useState(null);
  
  // Local active collection management for dismissals
  const [activeDismissedIds, setActiveDismissedIds] = useState([]);
  const visibleFeeds = notifications.filter(n => !activeDismissedIds.includes(n.id));

  const dismissItem = (id, e) => {
    e.stopPropagation();
    setActiveDismissedIds(prev => [...prev, id]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto text-left">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Inbox Alerts</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Track request progress updates and booking confirmations instantly.</p>
        </div>

        <div className="space-y-2">
          {visibleFeeds.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-xs">
              <span className="text-3xl block mb-2">☕</span>
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Inbox Clear — No New Updates</p>
            </div>
          ) : (
            visibleFeeds.map((notif) => (
              <div key={notif.id} onClick={() => setSelectedNotif(notif)} className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs hover:border-slate-200 transition-all flex justify-between items-center gap-4 cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                    {notif.type === "incoming" ? "📥" : "✨"}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">{notif.title || "UPDATE"}</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{notif.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={(e) => dismissItem(notif.id, e)} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    DISMISS
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DETAILED SUMMARY OVERLAY CONTAINER */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 text-left">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="text-xs font-mono font-extrabold text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase">Appointment Sheet</span>
              <button onClick={() => setSelectedNotif(null)} className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">"{selectedNotif.message}"</p>
              {selectedNotif.type === "incoming" && (
                <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-600">
                  <div>📅 Date: <span className="text-slate-900 block mt-0.5">{selectedNotif.date}</span></div>
                  <div>⏰ Time: <span className="text-slate-900 block mt-0.5">{selectedNotif.time}</span></div>
                </div>
              )}
              <button onClick={() => setSelectedNotif(null)} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs tracking-wide transition-all cursor-pointer">
                CLOSE WINDOW
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}