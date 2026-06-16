import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

// Utility to get safe local YYYY-MM-DD strings
const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Standard time slots matching the student booking dropdowns
const TIME_SLOTS = [
  "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM"
];

export default function ManageAvailability() {
  // Correctly pulled functions from AuthContext
  const { currentUser, availability, addSlot, updateSlotTime, deleteSlot } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [editingSlotId, setEditingSlotId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ date: selectedDate, time: TIME_SLOTS[0] });

  // Filter slots for the logged-in lecturer and the currently selected calendar date
  const mySlots = (availability || []).filter(
    (slot) => slot.lecturerId === currentUser?.uid && slot.date === selectedDate
  );

  // --- Handlers ---
  const openAddModal = () => {
    setModalMode("add");
    setFormData({ date: selectedDate, time: TIME_SLOTS[0] });
    setIsModalOpen(true);
  };

  const openEditModal = (slot) => {
    setModalMode("edit");
    setEditingSlotId(slot.id);
    setFormData({ date: slot.date, time: slot.time });
    setIsModalOpen(true);
  };

  const handleDelete = async (slotId) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      try {
        await deleteSlot(slotId);
      } catch (error) {
        console.error("Failed to delete slot:", error);
      }
    }
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        // Pushes to Firebase using your specific addSlot parameters
        await addSlot(formData.date, formData.time);
      } else {
        // Updates the time in Firebase using your specific updateSlotTime function
        await updateSlotTime(editingSlotId, formData.time);
      }
      setIsModalOpen(false);
      // Auto-switch calendar to the date they just added/edited
      setSelectedDate(formData.date);
    } catch (error) {
      console.error("Failed to save slot:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full pt-4 pb-12 font-sans animate-fade-in relative">

        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">PutraConsult</h1>
          <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
          <h2 className="text-xl font-medium text-slate-500">Manage Availability</h2>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* --- INTERACTIVE CALENDAR ENGINE --- */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h4 className="font-bold text-slate-800 tracking-tight">Select Date to Manage</h4>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getLocalDateString(new Date())}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl py-2 px-3 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 cursor-pointer"
              />
            </div>

            {/* 7-Day Quick Selection Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {[...Array(7)].map((_, index) => {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() + index);
                const iterDateString = getLocalDateString(dateObj);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const isSelected = selectedDate === iterDateString;

                return (
                  <button
                    key={iterDateString}
                    onClick={() => setSelectedDate(iterDateString)}
                    className={`flex flex-col items-center justify-center min-w-[72px] py-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-red-700 border-red-700 text-white shadow-md shadow-red-700/20" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:bg-red-50"
                    }`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                      {index === 0 ? 'Today' : dayName}
                    </span>
                    <span className="text-2xl font-black">{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- SLOTS LIST & ADD BUTTON --- */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                List of Available Consultation Time:
              </h3>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-xs"
              >
                <span>+</span> Add time slot...
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {mySlots.length > 0 ? (
                mySlots.map(slot => (
                  <div key={slot.id} className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-xs group hover:border-red-200 transition-colors">
                    <span className="font-bold text-slate-700 group-hover:text-red-900 tracking-wide text-sm">
                      {slot.time}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      {/* Edit Button */}
                      <button 
                        onClick={() => openEditModal(slot)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Slot"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(slot.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Slot"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm font-medium">
                  You have no open consultation windows published for {selectedDate}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- MODAL OVERLAY --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-lg">
                  {modalMode === "add" ? "Add time slot" : "Edit time slot"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSaveSlot} className="p-6 flex flex-col gap-5">
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date:</label>
                  <input 
                    type="date"
                    required
                    disabled={modalMode === "edit"} // Date cannot be edited based on Firebase structure
                    min={getLocalDateString(new Date())}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Time:</label>
                  <select
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                  >
                    <option value="" disabled>Select time.....</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    {modalMode === "add" ? "Add" : "Save"}
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