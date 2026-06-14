import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function FindLecturer() {
  const { users, availability, addBooking } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const lecturers = users.filter(u => u.role === "lecturer" && u.name.toLowerCase().includes(search.toLowerCase()));

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    await addBooking(selectedLecturer.uid, selectedSlot.id, selectedSlot, notes);
    setSuccess(true);
    setSelectedSlot(null);
    setNotes("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Consultation Hub</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Discover faculty members, inspect real-time hours, and route requests instantly[cite: 1].</p>
      </div>
      
      {success && (
        <div className="bg-emerald-600 text-white font-sans text-xs font-bold py-3 px-4 mb-6 text-center tracking-wide rounded-xl shadow-lg shadow-emerald-600/10 border border-emerald-500 animate-fade-in">
          🎉 TRANSACTION COMPLETED — Your appointment request has been successfully routed!
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT SEARCH & REGISTRY CARDS VIEW */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4 h-fit">
          <div>
            <h3 className="font-bold text-xs tracking-wider text-slate-400 uppercase">Search Directory[cite: 1]</h3>
            <input type="text" placeholder="🔍 Search faculty by name..." className="w-full mt-2 p-2.5 border border-slate-200 rounded-xl font-medium text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-800/10 focus:border-red-800 transition-all outline-none" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
            {lecturers.map(lec => (
              <div key={lec.uid} onClick={() => { setSelectedLecturer(lec); setSelectedSlot(null); }} className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between group ${selectedLecturer?.uid === lec.uid ? "bg-red-800/5 border-red-800 text-red-900 shadow-xs" : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700"}`}>
                <div>
                  <p className={`text-xs font-extrabold uppercase tracking-wide group-hover:text-red-800 transition-colors ${selectedLecturer?.uid === lec.uid ? "text-red-900" : "text-slate-800"}`}>{lec.name}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">Staff Code: {lec.idCode || "FACULTY"}</p>
                </div>
                <span className={`text-base transition-transform group-hover:translate-x-1 ${selectedLecturer?.uid === lec.uid ? "translate-x-0 text-red-800" : "text-slate-300"}`}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MULTI-MODE CONSOLE INTERFACE */}
        <div className="md:col-span-2">
          {selectedLecturer ? (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col h-full animate-fade-in">
              <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-5">
                <div className="flex items-center space-x-3">
                  <div className="h-11 w-11 bg-slate-100 rounded-xl border border-slate-200/60 flex items-center justify-center text-lg font-bold">🎓</div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-900 uppercase">{selectedLecturer.name}</h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">Faculty Desk: {selectedLecturer.idCode || "N/A"}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLecturer(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/40 transition-all">✕ CLOSE</button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 items-start">
                {/* CALENDAR DESIGN DECORATOR WIREFRAME */}
                <div className="border border-slate-100 p-4 bg-slate-50/50 rounded-2xl">
                  <div className="font-mono text-[10px] font-black tracking-widest text-slate-400 mb-3 uppercase text-center">Preferred Date Selection[cite: 1]</div>
                  <div className="aspect-video bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center p-4 shadow-xs text-center border-b-2">
                    <span className="text-2xl mb-1 text-red-700">📅</span>
                    <span className="font-sans font-extrabold text-xs text-slate-800 tracking-tight">CALENDAR ENGINE</span>
                    <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-wider">Synced Live via Firestore</span>
                  </div>
                </div>

                {/* SLOTS RENDER */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] font-black tracking-widest text-slate-400 mb-2 uppercase">Available Windows[cite: 1]:</div>
                  {availability.filter(s => s.lecturerId === selectedLecturer.uid).length === 0 ? (
                    <div className="text-slate-400 font-sans text-xs italic p-6 text-center border border-dashed rounded-xl bg-slate-50">
                      No consultation openings published today.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {availability.filter(s => s.lecturerId === selectedLecturer.uid).map(slot => (
                        <button key={slot.id} type="button" onClick={() => setSelectedSlot(slot)} className={`w-full p-3 border rounded-xl font-sans text-xs text-left transition-all duration-200 flex justify-between items-center ${selectedSlot?.id === slot.id ? "bg-red-800 text-white border-red-900 font-bold shadow-md shadow-red-800/10" : "bg-white border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
                          <span className="flex items-center space-x-2">
                            <span className={selectedSlot?.id === slot.id ? "text-white" : "text-red-700"}>⏰</span>
                            <span>{slot.time}</span>
                          </span>
                          <span className={`text-[10px] font-mono tracking-wider ${selectedSlot?.id === slot.id ? "text-red-200" : "text-slate-400"}`}>{slot.date}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedSlot && (
                <form onSubmit={handleBookSubmit} className="space-y-4 border-t border-slate-100 pt-5 mt-6 animate-fade-in">
                  <div>
                    <label className="block font-sans text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Consultation Scope & Topics[cite: 1]:</label>
                    <textarea placeholder="Briefly summarize what specific conceptual models or presentation blocks you require feedback on..." className="w-full p-3 border border-slate-200 rounded-xl font-medium text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-800/10 focus:border-red-800 transition-all outline-none" rows="3" value={notes} onChange={e => setNotes(e.target.value)} required />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-red-800 text-white hover:bg-red-900 font-bold text-xs px-6 py-3 tracking-wide rounded-xl shadow-md shadow-red-800/10 hover:shadow-lg hover:shadow-red-800/20 transition-all duration-200">
                      SUBMIT REQUEST OVERLAY[cite: 1]
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-slate-200/60 border-dashed rounded-2xl p-16 text-center font-sans text-xs text-slate-400 font-medium flex flex-col items-center justify-center space-y-2">
              <span className="text-3xl">👈</span>
              <p className="uppercase tracking-wider">Select a faculty card from the registry to mount the interactive consultation interface[cite: 1].</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}