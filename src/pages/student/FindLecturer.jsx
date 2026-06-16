import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function FindLecturer() {
  const { users, availability, addBooking } = useAuth();
  
  const [search, setSearch] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [processState, setProcessState] = useState("idle"); // "idle" | "processing" | "success"

  const lecturers = (users || []).filter(u => 
    u.role === "lecturer" && u.name.toLowerCase().includes(search.toLowerCase())
  );

  const availableSlots = selectedLecturer 
    ? (availability || []).filter(s => s.lecturerId === selectedLecturer.uid)
    : [];

  const handleBookSubmit = async (slot) => {
    setProcessState("processing");
    try {
      await addBooking(selectedLecturer.uid, slot.id, slot, "Standard Booking");
      setProcessState("success");
      setTimeout(() => {
        setProcessState("idle");
        setSelectedLecturer(null);
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      setProcessState("idle");
    }
  };

  // Dynamic Header Title
  let stepTitle = "Find Lecturer";
  if (processState === "processing" || processState === "success") stepTitle = "PROCESS";
  else if (selectedLecturer) stepTitle = "Choose Preferred Date";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full pt-4 pb-12 font-sans animate-fade-in">

        {/* --- HEADER (Matches S-BOOKING structure but polished) --- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">PutraConsult</h1>
          <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
          <h2 className="text-xl font-medium text-slate-500">{stepTitle}</h2>
        </div>

        {/* --- SUCCESS STATE --- */}
        {processState === "success" && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-4 px-6 mb-8 rounded-2xl shadow-sm text-center animate-fade-in flex flex-col items-center gap-2">
            <span className="text-3xl">🎉</span>
            <p>Booking Completed Successfully! Returning to directory...</p>
          </div>
        )}

        {/* --- STEP 1: DIRECTORY SEARCH (S - BOOKING 1) --- */}
        {!selectedLecturer && processState === "idle" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Polished Search Bar */}
            <div className="relative shadow-sm rounded-2xl">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-lg">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name, department..." 
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-all"
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>

            {/* Polished Lecturer List */}
            <div className="flex flex-col gap-3">
              {lecturers.map(lec => (
                <button 
                  key={lec.uid} 
                  onClick={() => setSelectedLecturer(lec)} 
                  className="w-full bg-white border border-slate-100 hover:border-red-200 hover:shadow-md hover:bg-slate-50 rounded-2xl p-5 flex items-center justify-between group transition-all duration-200"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl border border-slate-200 group-hover:bg-red-50 group-hover:text-red-700 transition-colors">
                      👤
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-slate-800 text-base group-hover:text-red-900 transition-colors">
                        {lec.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">Staff Code: {lec.idCode || "FACULTY"}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-red-700 group-hover:translate-x-1 transition-all text-xl">
                    →
                  </span>
                </button>
              ))}

              {lecturers.length === 0 && (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-sm font-medium">
                  No faculty members match your search criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 2 & 3: CALENDAR & SLOTS (S - BOOKING 2 & 3) --- */}
        {selectedLecturer && (
          <div className="flex flex-col gap-8 animate-fade-in">
            
            {/* Navigation & Lecturer Profile Card */}
            <div>
              <button 
                onClick={() => setSelectedLecturer(null)}
                className="text-xs font-bold text-slate-400 hover:text-red-700 mb-4 flex items-center gap-1 transition-colors"
              >
                ← BACK TO DIRECTORY
              </button>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center text-xl border border-red-100">
                  👤
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedLecturer.name}</h3>
                  <p className="text-xs font-mono text-slate-400">Faculty Desk: {selectedLecturer.idCode || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Polished Calendar Engine Mockup */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl aspect-[21/9] flex flex-col items-center justify-center shadow-inner">
              <span className="text-4xl mb-3 text-red-700">📅</span>
              <span className="font-sans font-extrabold text-sm text-slate-800 tracking-tight uppercase">Interactive Calendar Engine</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1 tracking-wider">Synced Live via Database</span>
            </div>

            {/* Slot Selection Area */}
            <div>
              <h4 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-4">Available Slots</h4>
              
              {processState === "processing" ? (
                /* Processing State (S-BOOKING 3) */
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
                  <span className="text-3xl animate-spin mb-4">⏳</span>
                  <p className="text-sm font-bold text-slate-600 tracking-widest uppercase animate-pulse">
                    Routing Request to Faculty...
                  </p>
                </div>
              ) : (
                /* Slot Buttons (S-BOOKING 2) */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableSlots.length > 0 ? (
                    availableSlots.map(slot => (
                      <button 
                        key={slot.id} 
                        onClick={() => handleBookSubmit(slot)}
                        className="bg-white border border-slate-200 hover:border-red-700 hover:bg-red-50 hover:shadow-md hover:-translate-y-0.5 transition-all rounded-xl p-4 flex flex-col items-center justify-center gap-1 group cursor-pointer"
                      >
                        <span className="text-sm font-bold text-slate-700 group-hover:text-red-900 transition-colors">
                          {slot.time}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-red-400">
                          {slot.date}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm font-medium">
                      No availability windows have been posted by this lecturer today.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}