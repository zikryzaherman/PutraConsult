import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

// Utility to format date into "Wednesday, Jun 17, 2026"
const formatLongDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export default function ManageRequests() {
  const { bookings, profile, handleRequest } = useAuth();
  
  // Filter for this lecturer and sort newest first
  const myRequests = (bookings || [])
    .filter(b => b.lecturerId === profile?.uid)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pendingRequests = myRequests.filter(req => req.status === "pending");
  const processedRequests = myRequests.filter(req => req.status !== "pending");

  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-full w-full p-8 font-sans animate-fade-in">
        
        {/* --- PAGE HEADER --- */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Manage Requests</h1>
          <p className="text-slate-500 font-medium">Review and respond to student consultation requests</p>
        </div>

        <div className="max-w-5xl flex flex-col gap-8">
          
          {/* --- PENDING REQUESTS SECTION --- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-slate-800">Pending Requests</h2>
              <span className="bg-red-50 text-red-800 font-bold px-3 py-0.5 rounded-full text-sm">
                {pendingRequests.length}
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                <span className="text-4xl mb-4 block">☕</span>
                <h3 className="text-lg font-bold text-slate-700">All caught up!</h3>
                <p className="text-slate-500">You have no pending requests to review.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    
                    {/* Top Row: User Info & Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                      
                      <div className="flex flex-col gap-3">
                        {/* Status Badge */}
                        <span className="bg-amber-100 text-amber-800 text-xs font-black tracking-wider uppercase px-3 py-1 rounded-md w-fit">
                          New Booking Request
                        </span>
                        
                        {/* Profile Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">
                              {req.studentName}
                            </h3>
                            <span className="text-sm text-slate-400 font-medium uppercase">
                              ID: {req.studentIdCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => handleRequest(req.id, req.slotId, "approved")} 
                          className="flex-1 md:flex-none bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          ACCEPT
                        </button>
                        <button 
                          onClick={() => handleRequest(req.id, req.slotId, "declined")} 
                          className="flex-1 md:flex-none bg-[#EF4444] hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                          DECLINE
                        </button>
                      </div>

                    </div>

                    {/* Middle Row: Date & Time Box */}
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12 mb-4">
                      <div className="flex items-center gap-3 text-slate-700 font-medium">
                        <svg className="w-5 h-5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {formatLongDate(req.date)}
                      </div>
                      <div className="flex items-center gap-3 text-slate-700 font-medium">
                        <svg className="w-5 h-5 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {req.time}
                      </div>
                    </div>

                    {/* Bottom Row: Topic / Description */}
                    <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                      <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 mb-1">Topic / Description</span>
                        <p className="text-slate-700 font-medium">{req.description}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- HISTORY SECTION (Processed Requests) --- */}
          {processedRequests.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-500 mb-4 uppercase tracking-wider text-sm">Processed History</h2>
              <div className="flex flex-col gap-4 opacity-75">
                {processedRequests.map(req => (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        req.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {req.status}
                      </span>
                      <span className="font-bold text-slate-800">{req.studentName}</span>
                      <span className="text-slate-400 text-sm hidden sm:block">({req.date} @ {req.time})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}