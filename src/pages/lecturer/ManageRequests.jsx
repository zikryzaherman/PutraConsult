import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ManageRequests() {
  const { bookings, profile, handleRequest } = useAuth();
  
  // Filter for this lecturer and sort newest first
  const incomingRequests = (bookings || [])
    .filter(b => b.lecturerId === profile?.uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Approved</span>;
      case "declined":
        return <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Declined</span>;
      default:
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase animate-pulse">Pending Review</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full pt-4 pb-12 font-sans animate-fade-in">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">PutraConsult</h1>
          <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
          <h2 className="text-xl font-medium text-slate-500">Manage Requests</h2>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-2">
            Incoming Consultation Queue
          </h3>

          {incomingRequests.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-4xl"> inbox_zero </span>
              <h4 className="font-bold text-slate-700">Your queue is clear</h4>
              <p className="text-sm font-medium text-slate-500">
                You currently have no active booking requests from students.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {incomingRequests.map(req => (
                <div 
                  key={req.id} 
                  className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-all ${
                    req.status === "pending" ? "border-l-4 border-l-amber-400 hover:shadow-md" : "opacity-70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    
                    {/* Left Side: Student Info & Request Details */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xl font-bold">
                          {req.studentName ? req.studentName.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">
                            {req.studentName}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">
                            Matric: {req.studentIdCode}
                          </span>
                        </div>
                        <div className="sm:ml-auto">
                          {getStatusBadge(req.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-4">
                        <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
                          📅 {req.date}
                        </span>
                        <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700">
                          ⏰ {req.time}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 shadow-inner">
                        <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest block mb-1.5">
                          [ Booking Details & Scope ]
                        </span>
                        {req.description}
                      </div>
                    </div>

                    {/* Right Side: Action Buttons (Only show if pending) */}
                    {req.status === "pending" && (
                      <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button 
                          onClick={() => handleRequest(req.id, req.slotId, "approved")} 
                          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-bold text-sm rounded-xl shadow-md transition-colors text-center cursor-pointer"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRequest(req.id, req.slotId, "declined")} 
                          className="flex-1 sm:flex-none bg-white hover:bg-red-50 text-red-600 border border-red-200 px-6 py-3 font-bold text-sm rounded-xl transition-colors text-center cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}