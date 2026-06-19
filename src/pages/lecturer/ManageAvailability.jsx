import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

// --- Time & Date Utility Functions ---
const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const to12Hour = (time24) => {
  if (!time24) return "";
  let [hours, minutes] = time24.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const to24Hour = (time12) => {
  if (!time12) return "";
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

export default function ManageAvailability() {
  const { currentUser, availability, addSlot, updateSlotTime, deleteSlot } = useAuth();
  
  // --- Calendar & Selection State ---
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());
  
  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [editingSlotId, setEditingSlotId] = useState(null);
  
  // Form State uses 24h format for native HTML time inputs
  const [formData, setFormData] = useState({ date: selectedDate, startTime: "09:00", endTime: "10:00" });

  // Filter slots for the logged-in lecturer and the selected calendar date
  const mySlots = (availability || []).filter(
    (slot) => slot.lecturerId === currentUser?.uid && slot.date === selectedDate
  );

  // --- Handlers ---
  const openAddModal = () => {
    setModalMode("add");
    setFormData({ date: selectedDate, startTime: "09:00", endTime: "10:00" });
    setIsModalOpen(true);
  };

  const openEditModal = (slot) => {
    setModalMode("edit");
    setEditingSlotId(slot.id);
    
    // Parse "09:00 AM - 10:00 AM" back into inputs
    const [start12, end12] = slot.time.split(" - ");
    setFormData({ 
      date: slot.date, 
      startTime: to24Hour(start12), 
      endTime: to24Hour(end12) 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (slotId) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      await deleteSlot(slotId);
    }
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    
    // Combine inputs into backend format: "09:00 AM - 10:00 AM"
    const formattedTimeRange = `${to12Hour(formData.startTime)} - ${to12Hour(formData.endTime)}`;

    try {
      if (modalMode === "add") {
        await addSlot(formData.date, formattedTimeRange);
      } else {
        await updateSlotTime(editingSlotId, formattedTimeRange);
      }
      setIsModalOpen(false);
      setSelectedDate(formData.date);
      // Ensure calendar view jumps to the month of the added slot
      setCurrentViewMonth(new Date(formData.date));
    } catch (error) {
      console.error("Failed to save slot:", error);
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
  const displayDateHeader = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-full w-full p-8 font-sans animate-fade-in">

        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Availability</h1>
            <p className="text-slate-500 mt-1">Set your consultation hours for students</p>
          </div>
          <button 
            onClick={openAddModal}
            className="bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add Time Slot
          </button>
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CUSTOM CALENDAR WIDGET */}
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

            <div className="grid grid-cols-7 text-center gap-y-2">
              {allCalendarCells.map((dayNum, idx) => {
                if (!dayNum) return <div key={`blank-${idx}`} className="w-10 h-10"></div>;
                
                const cellDate = new Date(currentViewMonth.getFullYear(), currentViewMonth.getMonth(), dayNum);
                const cellDateStr = getLocalDateString(cellDate);
                const isSelected = selectedDate === cellDateStr;
                const isToday = getLocalDateString(new Date()) === cellDateStr;

                return (
                  <div key={dayNum} className="flex justify-center items-center">
                    <button
                      onClick={() => setSelectedDate(cellDateStr)}
                      className={`w-10 h-10 flex flex-col items-center justify-center rounded-full text-sm transition-colors ${
                        isSelected 
                          ? "bg-red-900 text-white font-bold shadow-md shadow-red-900/30" 
                          : "text-slate-700 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <span>{dayNum}</span>
                      {/* Optional red dot indicator for today if not selected */}
                      {isToday && !isSelected && <span className="w-1 h-1 bg-red-400 rounded-full mt-0.5"></span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

         {/* RIGHT: SLOTS LISTING */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Slots for {displayDateHeader}
              </h3>
              
              {/* Dynamic Slot Counter */}
              <div className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full text-sm font-bold border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="bg-white border border-slate-200 w-6 h-6 rounded-full flex items-center justify-center text-slate-800 shadow-xs">
                  {mySlots.length}
                </span>
                {mySlots.length === 1 ? 'Slot' : 'Slots'}
              </div>
            </div>

            {mySlots.length === 0 ? (
              // Empty State matching Figma
              <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium mb-6">No time slots available on this date.</p>
                <button 
                  onClick={openAddModal}
                  className="border border-red-900 text-red-900 hover:bg-red-50 px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Add a Slot
                </button>
              </div>
            ) : (
              // Active Slots State
              <div className="flex flex-col gap-3">
                {mySlots.map(slot => (
                  <div key={slot.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-red-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                        🕒
                      </div>
                      <span className="font-bold text-slate-800 text-base">{slot.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(slot)} className="text-slate-400 hover:text-slate-800 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(slot.id)} className="text-slate-400 hover:text-red-600 px-3 py-2 bg-slate-50 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* --- ADD/EDIT MODAL OVERLAY --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-xl">
                  {modalMode === "add" ? "Add New Slot" : "Edit Slot"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSaveSlot} className="p-8 flex flex-col gap-6">
                
                {/* Full Width Date Field */}
                <div>
                  <label className="block text-sm text-slate-500 mb-2">Date</label>
                  <input 
                    type="date"
                    required
                    disabled={modalMode === "edit"}
                    min={getLocalDateString(new Date())}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                {/* Split Time Fields Layout */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-slate-500 mb-2">Start Time</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-slate-500 mb-2">End Time</label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="mt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border border-red-900 text-red-900 font-medium py-3 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-red-900 hover:bg-red-800 text-white font-medium py-3 rounded-xl shadow-md transition-colors"
                  >
                    Save
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}