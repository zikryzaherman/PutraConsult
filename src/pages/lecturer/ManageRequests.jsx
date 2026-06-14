import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ManageRequests() {
  const { bookings, profile, handleRequest } = useAuth();
  const incomingRequests = bookings.filter(b => b.lecturerId === profile?.uid);

  return (
    <DashboardLayout>
      <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Putra Consult › Manage Request</div>
      <div className="font-mono text-xs font-black tracking-widest text-zinc-400 mb-4 uppercase">LIST OF REQUEST</div>
      
      {incomingRequests.length === 0 ? (
        <div className="bg-white border border-zinc-300 p-12 text-center rounded font-mono text-xs text-zinc-400">
          [ PROCESS QUEUE CLEAR — NO ACTIVE BOOKING TRANSACTIONS SENT ]
        </div>
      ) : (
        <div className="space-y-3">
          {incomingRequests.map(req => (
            <div key={req.id} className="bg-white border border-zinc-300 p-4 rounded shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${req.status === "approved" ? "bg-green-900 text-white" : req.status === "declined" ? "bg-zinc-400 text-white" : "bg-zinc-900 text-white animate-pulse"}`}>
                    [{req.status.toUpperCase()}]
                  </span>
                  <span className="font-black text-sm text-zinc-900 font-sans">{req.studentName}</span>
                  <span className="text-zinc-400 text-[10px]">({req.studentIdCode})</span>
                </div>
                <p className="text-zinc-600 font-bold">📅 {req.date} @ {req.time}</p>
                <p className="text-zinc-500 text-[11px] bg-zinc-50 border p-2 rounded max-w-xl mt-1">
                  <strong className="text-[10px] uppercase text-zinc-400 block mb-0.5">[BOOKING DETAILS]</strong> 
                  "{req.description}"
                </p>
              </div>

              {req.status === "pending" && (
                <div className="flex items-center space-x-2 shrink-0 font-mono text-xs w-full sm:w-auto justify-end">
                  <button onClick={() => handleRequest(req.id, req.slotId, "declined")} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900 px-4 py-2 font-bold rounded border tracking-wide">DECLINE</button>
                  <button onClick={() => handleRequest(req.id, req.slotId, "approved")} className="bg-zinc-900 hover:bg-black text-white px-4 py-2 font-bold rounded tracking-wide shadow-sm">ACCEPT</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}