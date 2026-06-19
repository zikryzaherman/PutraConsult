import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

// --- Date Formatting Utilities ---
const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

export default function FindLecturer() {
  const { users, availability, addBooking } = useAuth();
  
  // --- Navigation & Process State ---
  const [step, setStep] = useState(1); // 1: Directory | 2: Date & Time | 3: Confirm
  const [processState, setProcessState] = useState("idle"); 
  
  // --- Booking Data State ---
  const [search, setSearch] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [description, setDescription] = useState("");

  // --- Filtering ---
  const lecturers = (users || []).filter(u => 
    u.role === "lecturer" && 
    (u.name.toLowerCase().includes(search.toLowerCase()) || 
     (u.department || "").toLowerCase().includes(search.toLowerCase()))
  );

  // All slots for selected lecturer (used for calendar dots)
  const lecturerSlots = selectedLecturer 
    ? (availability || []).filter(s => s.lecturerId === selectedLecturer.uid)
    : [];

  // Slots for the specifically selected date
  const availableSlotsOnDate = lecturerSlots.filter(s => s.date === selectedDate);

  // Helper to check if a specific day has available slots
  const dateHasSlots = (dateStr) => {
    return lecturerSlots.some(s => s.date === dateStr);
  };

  // --- Handlers ---
  const handleSelectLecturer = (lec) => {
    setSelectedLecturer(lec);
    setSelectedDate(getLocalDateString(new Date()));
    setCurrentViewMonth(new Date());
    setSelectedSlot(null);
    setDescription("");
    setStep(2);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setProcessState("processing");
    try {
      await addBooking(selectedLecturer.uid, selectedSlot.id, selectedSlot, description || "Standard Booking");
      setProcessState("success");
      setTimeout(() => {
        setProcessState("idle");
        setStep(1);
        setSelectedLecturer(null);
        setSelectedSlot(null);
        setDescription("");
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      setProcessState("idle");
    }
  };

  // --- Calendar Builder Logic ---
  const nextMonth = () => setCurrentViewMonth(new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentViewMonth(new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() - 1, 1));
  
  const daysInMonth = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), 1).getDay();
  
  const blanks = Array.from({ length: firstDayOfMonth }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allCalendarCells = [...blanks, ...days];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // --- RENDER HELPERS ---
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center pt-20 animate-fade-in">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-500 font-medium">Your request has been routed to {selectedLecturer?.name}.</p>
    </div>
  );

  const renderStep1 = () => (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="text-center mb-10 mt-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Find a Lecturer</h1>
        <p className="text-slate-500 text-lg">Search for your lecturer to book a consultation session.</p>
      </div>

      <div className="w-full max-w-3xl mb-12 relative shadow-sm rounded-2xl">
        <input 
          type="text" 
          placeholder="Search by name, department..." 
          className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 text-base font-medium text-slate-800 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all placeholder:text-slate-400"
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lecturers.map(lec => (
          <div key={lec.uid} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-red-50 text-red-900 rounded-full flex items-center justify-center text-xl font-bold border border-red-100 shrink-0">
                {lec.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{lec.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  {lec.department || "Faculty Department"}
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <button 
                onClick={() => handleSelectLecturer(lec)} 
                className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-3.5 rounded-xl shadow-sm transition-colors text-sm uppercase tracking-wide"
              >
                View Availability
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
      <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Lecturers
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Choose Preferred Date</h1>
        <p className="text-slate-500 text-lg">
          Consultation with <span className="text-red-900 font-bold">{selectedLecturer?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: CALENDAR */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              {monthNames[currentViewMonth.getMonth()]} {currentViewMonth.getFullYear()}
            </div>
            <div className="flex gap-4">
              <button onClick={prevMonth} className="text-slate-400 hover:text-slate-800 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
              <button onClick={nextMonth} className="text-slate-400 hover:text-slate-800 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (<div key={day} className="text-xs font-medium text-slate-400">{day}</div>))}
          </div>

          <div className="grid grid-cols-7 text-center gap-y-3">
            {allCalendarCells.map((dayNum, idx) => {
              if (!dayNum) return <div key={`blank-${idx}`} className="w-10 h-10"></div>;
              const cellDate = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), dayNum);
              const cellDateStr = getLocalDateString(cellDate);
              const isSelected = selectedDate === cellDateStr;
              const hasAvailableSlots = dateHasSlots(cellDateStr);
              return (
                <div key={dayNum} className="flex justify-center items-center relative">
                  <button onClick={() => setSelectedDate(cellDateStr)} className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ${isSelected ? "bg-red-900 text-white font-bold" : "text-slate-700 hover:bg-slate-100"}`}>
                    <span>{dayNum}</span>
                  </button>
                  {hasAvailableSlots && !isSelected && (<span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute bottom-0.5"></span>)}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TIME SLOTS */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-slate-900">Available Time on {formatLongDate(selectedDate)}</h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
            {availableSlotsOnDate.length === 0 ? (
              <p className="text-slate-500 text-center py-10">No available slots on this date.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSlotsOnDate.map(slot => (
                  <button key={slot.id} onClick={() => setSelectedSlot(slot)} className={`p-4 rounded-xl border text-left transition-all ${selectedSlot?.id === slot.id ? "bg-red-50 border-red-900 text-red-900 ring-1 ring-red-900" : "bg-white border-slate-200"}`}>
                    <div className="font-bold text-base">{slot.time}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button disabled={!selectedSlot} onClick={() => setStep(3)} className={`px-10 py-3.5 rounded-xl font-bold transition-all uppercase ${selectedSlot ? "bg-[#7B1822] text-white" : "bg-slate-200 text-slate-400"}`}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6">← Back to Schedule</button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Confirm Your Booking</h1>
        <p className="text-slate-500 text-lg">Please review the details before confirming.</p>
      </div>

      <form onSubmit={handleConfirmBooking} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 border-b pb-4">Booking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div><span className="block text-xs font-bold text-slate-400">Lecturer</span><p className="font-bold text-slate-900">{selectedLecturer?.name}</p></div>
          <div><span className="block text-xs font-bold text-slate-400">Date</span><p className="font-bold text-slate-900">{formatLongDate(selectedDate)}</p></div>
          <div><span className="block text-xs font-bold text-slate-400">Time Slot</span><p className="font-bold text-slate-900 text-lg">{selectedSlot?.time}</p></div>
        </div>
        <textarea rows="4" placeholder="Briefly describe what you'd like to discuss..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 focus:border-red-900 resize-none"></textarea>
        <button type="submit" disabled={processState === "processing"} className="w-full bg-[#7B1822] text-white font-bold py-4 rounded-xl mt-6">
          {processState === "processing" ? "Processing..." : "CONFIRM BOOKING"}
        </button>
      </form>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-full w-full p-8 font-sans">
        {processState === "success" ? renderSuccess() : (
          <>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}