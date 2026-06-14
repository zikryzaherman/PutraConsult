import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ViewBookingStatus() {
  const { bookings, profile } = useAuth();
  const myBookings = bookings.filter(b => b.studentId === profile?.uid);

  return (
    <DashboardLayout>
      <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Putra Consult › Request Monitor</div>
      <div className="font-mono text-xs font-black tracking-widest text-zinc-400 mb-4 uppercase">YOUR SENT LOGS</div>

      {myBookings.length === 0 ? (
        <div className="bg-white border border-zinc-300 p-8 rounded text-center font-mono text-xs text-zinc-400 shadow-xs">
          No historical appointment logs submitted.
        </div>
      ) : (
        <div className="space-y-3">
          {myBookings.map(b => (
            <div key={b.id} className="bg-white border border-zinc-300 p-4 rounded shadow-xs font-mono text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white uppercase ${b.status === "approved" ? "bg-green-900" : b.status === "declined" ? "bg-red-900" : "bg-zinc-900"}`}>
                    {b.status}
                  </span>
                  <h4 className="font-black font-sans text-sm text-zinc-900 uppercase">{b.lecturerName}</h4>
                </div>
                <p className="text-zinc-600 font-bold mt-1">📅 TIMEFRAME: {b.date} ({b.time})</p>
                <p className="text-[11px] text-zinc-500 bg-zinc-50 p-2 border rounded mt-1"><strong>[BOOKING DETAILS]</strong> "{b.description}"</p>
              </div>
              <div className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-1 rounded border">TX_ID: {b.id.substring(0, 8).toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}