import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ManageAvailability() {
  const { availability, addAvailabilitySlot, deleteAvailabilitySlot } = useAuth();
  
  // Custom states for date and time editing inputs
  const [targetDate, setTargetDate] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [notice, setNotice] = useState("");

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!targetDate || !targetTime) return;

    // Convert raw time inputs to a natural 12-hour display string format
    const timePieces = targetTime.split(":");
    let hours = parseInt(timePieces[0]);
    const minutes = timePieces[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const cleanTimeStr = `${hours}:${minutes} ${ampm}`;

    await addAvailabilitySlot({ date: targetDate, time: cleanTimeStr });
    setNotice("Consultation availability hour slot published successfully!");
    setTargetDate("");
    setTargetTime("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consultation Scheduler</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Configure your open consultation windows for student self-booking.</p>
        </div>

        {notice && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold p-4 rounded-xl mb-6 flex justify-between items-center">
            <span>🎉 {notice}</span>
            <button onClick={() => setNotice("")} className="text-emerald-400 hover:text-emerald-600 text-sm cursor-pointer">✕</button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* CONTROL BOX PANEL */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left">
            <h3 className="text-xs font-mono font-black tracking-wider text-slate-400 uppercase mb-4">Open New Window</h3>
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Date</label>
                <input type="date" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 cursor-pointer focus:bg-white outline-none" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Start Time</label>
                <input type="time" className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 cursor-pointer focus:bg-white outline-none" value={targetTime} onChange={e => setTargetTime(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white font-bold py-2.5 rounded-xl text-xs tracking-wide shadow-md shadow-red-800/10 cursor-pointer">
                PUBLISH LIVE SLOT
              </button>
            </form>
          </div>

          {/* OPEN ACTIVE LIST SLOTS */}
          <div className="md:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left">
            <h3 className="text-xs font-mono font-black tracking-wider text-slate-400 uppercase mb-4">Your Published Openings</h3>
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {availability.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-12">No active consultation windows published yet.</p>
              ) : (
                availability.map((slot) => (
                  <div key={slot.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex justify-between items-center hover:border-slate-200 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">⏰</span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{slot.time}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">{slot.date}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteAvailabilitySlot(slot.id)} className="text-xs font-bold text-slate-400 hover:text-red-700 bg-white border border-slate-200/60 hover:border-red-100 p-1.5 px-3 rounded-lg cursor-pointer shadow-xs transition-colors">
                      REMOVE
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}