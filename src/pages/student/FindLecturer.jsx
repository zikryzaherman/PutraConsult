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
        // Reset everything after success
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
        {lecturers.length === 0 && (
          <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500 font-medium">
            No lecturers found matching your search.
          </div>
        )}
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
              <span className="text-red-900">📅</span> 
              {monthNames[currentViewMonth.getMonth()]} {currentViewMonth.getFullYear()}
            </div>
            <div className="flex gap-4">
              <button onClick={prevMonth} className="text-slate-400 hover:text-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextMonth} className="text-slate-400 hover:text-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center mb-4">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-medium text-slate-400">{day}</div>
            ))}
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
                  <button
                    onClick={() => {
                      setSelectedDate(cellDateStr);
                      setSelectedSlot(null); // Reset slot choice when changing days
                    }}
                    className={`w-10 h-10 flex flex-col items-center justify-center rounded-full text-sm transition-colors ${
                      isSelected 
                        ? "bg-red-900 text-white font-bold shadow-md shadow-red-900/30" 
                        : "text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <span>{dayNum}</span>
                  </button>
                  {/* Red dot indicator for available slots */}
                  {hasAvailableSlots && !isSelected && (
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute bottom-0.5"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TIME SLOTS */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-900">🕒</span>
            <h3 className="text-lg font-bold text-slate-900">
              Available Time on {formatLongDate(selectedDate)}
            </h3>
          </div>

          {availableSlotsOnDate.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm flex-1">
              <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-slate-600 font-medium">No available slots on this date.</p>
              <p className="text-slate-400 text-sm mt-1">Please select a date with a dot indicator.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSlotsOnDate.map(slot => {
                  const isSlotSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSlotSelected 
                          ? "bg-red-50 border-red-900 text-red-900 shadow-sm ring-1 ring-red-900" 
                          : "bg-white border-slate-200 text-slate-700 hover:border-red-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-bold text-base">{slot.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button 
              disabled={!selectedSlot}
              onClick={() => setStep(3)}
              className={`px-10 py-3.5 rounded-xl font-bold shadow-sm transition-all text-sm tracking-widest uppercase ${
                selectedSlot 
                  ? "bg-[#BC858C] hover:bg-[#a67077] text-white" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Schedule
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Confirm Your Booking</h1>
        <p className="text-slate-500 text-lg">Please review the details before confirming.</p>
      </div>

      <form onSubmit={handleConfirmBooking} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Booking Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Lecturer Info */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-red-50 text-red-900 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-0.5">Lecturer</span>
              <p className="font-bold text-slate-900">{selectedLecturer?.name}</p>
              <p className="text-xs text-slate-500">{selectedLecturer?.department || "Faculty Department"}</p>
            </div>
          </div>

          {/* Date Info */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-red-50 text-red-900 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-0.5">Date</span>
              <p className="font-bold text-slate-900">{formatLongDate(selectedDate)}</p>
            </div>
          </div>

          {/* Time Slot Info */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-red-50 text-red-900 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 mb-0.5">Time Slot</span>
              <p className="font-bold text-slate-900 text-lg">{selectedSlot?.time}</p>
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <label className="text-sm font-bold text-slate-600">Topic or Description (Optional)</label>
          </div>
          <textarea 
            rows="4"
            placeholder="Briefly describe what you'd like to discuss..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 resize-none"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-2">
          <button 
            type="button"
            onClick={() => setStep(2)}
            className="flex-1 bg-white border border-red-900 text-red-900 hover:bg-red-50 font-bold py-3.5 rounded-xl transition-colors tracking-wide"
          >
            CANCEL
          </button>
          
          <button 
            type="submit"
            disabled={processState === "processing"}
            className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors tracking-wide disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {processState === "processing" ? (
              <><span className="animate-spin text-xl leading-none">⏳</span> Processing...</>
            ) : (
              "CONFIRM BOOKING"
            )}
          </button>
        </div>
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