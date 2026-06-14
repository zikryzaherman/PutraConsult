import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ManageAvailability() {
  const { availability, profile, addSlot, deleteSlot, updateSlotTime } = useAuth();
  const [date, setDate] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("08:00 AM - 09:00 AM");
  const [customTime, setCustomTime] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editingTimeText, setEditingTimeText] = useState("");

  const mySlots = availability.filter(s => s.lecturerId === profile?.uid);

  const presets = [
    "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM", "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM"
  ];

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!date) return;
    const finalTime = isCustomMode ? customTime : selectedPreset;
    if (!finalTime.trim()) return;
    await addSlot(date, finalTime);
    setCustomTime("");
  };

  const handleSaveEdit = async (id) => {
    if (!editingTimeText.trim()) return;
    await updateSlotTime(id, editingTimeText);
    setEditingSlotId(null);
  };

  return (
    <DashboardLayout>
      <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-6">Putra Consult › Manage Availability</div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ADD TIME SLOT CONTROL CARD */}
        <div className="bg-white border border-zinc-300 p-5 rounded shadow-xs h-fit">
          <div className="font-mono text-xs font-black tracking-wider text-zinc-900 border-b pb-2 mb-4 uppercase">Add time slot</div>
          <form onSubmit={handleBroadcast} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-zinc-500 font-bold mb-1 uppercase">Date:</label>
              <input type="date" className="w-full p-2 border bg-zinc-50 rounded" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-zinc-500 font-bold uppercase">Time Slot Configuration:</label>
                <button type="button" onClick={() => setIsCustomMode(!isCustomMode)} className="text-[10px] text-blue-700 underline font-bold uppercase">
                  {isCustomMode ? "Use Hour Presets" : "Custom Customization"}
                </button>
              </div>

              {isCustomMode ? (
                <input type="text" placeholder="e.g. 10:30 AM - 11:15 AM" className="w-full p-2 border bg-zinc-50 rounded" value={customTime} onChange={e => setCustomTime(e.target.value)} required />
              ) : (
                <select className="w-full p-2 border bg-zinc-50 rounded bg-white" value={selectedPreset} onChange={e => setSelectedPreset(e.target.value)}>
                  {presets.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )}
            </div>

            <button type="submit" className="w-full bg-zinc-900 text-white font-black py-2.5 rounded tracking-widest uppercase hover:bg-black transition">Add</button>
          </form>
        </div>

        {/* TIME SLOTS LIST VIEW DISPLAY */}
        <div className="md:col-span-2 space-y-4">
          <div className="font-mono text-xs font-black tracking-widest text-zinc-400 uppercase">List of Available Consultation Time:</div>
          
          {mySlots.length === 0 ? (
            <div className="bg-zinc-50 border border-dashed border-zinc-300 p-8 text-center font-mono text-xs text-zinc-400 rounded">
              No hourly consultation periods broadcasted to dashboard yet. Click "+ Add time slot" on the side control panel.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {mySlots.map(slot => (
                <div key={slot.id} className="bg-white border border-zinc-300 p-4 rounded shadow-xs flex flex-col justify-between space-y-3">
                  <div className="font-mono text-xs">
                    <p className="font-bold text-zinc-900">📅 {slot.date}</p>
                    {editingSlotId === slot.id ? (
                      <div className="mt-2 flex items-center space-x-1">
                        <input type="text" className="p-1 border text-xs bg-zinc-50 font-mono w-full rounded" value={editingTimeText} onChange={e => setEditingTimeText(e.target.value)} />
                        <button onClick={() => handleSaveEdit(slot.id)} className="bg-zinc-800 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Save</button>
                        <button onClick={() => setEditingSlotId(null)} className="text-zinc-400 text-[10px] px-1 font-bold">✕</button>
                      </div>
                    ) : (
                      <p className="text-zinc-500 font-bold mt-1">⏰ TIME SLOT: {slot.time}</p>
                    )}
                  </div>

                  <div className="flex justify-end items-center space-x-3 border-t pt-2 border-zinc-100">
                    {editingSlotId !== slot.id && (
                      <button onClick={() => { setEditingSlotId(slot.id); setEditingTimeText(slot.time); }} className="text-zinc-500 hover:text-black font-mono text-[10px] font-bold uppercase">✏️ Edit slot</button>
                    )}
                    <button onClick={() => deleteSlot(slot.id)} className="text-red-700 hover:underline font-mono text-[10px] font-bold uppercase">🗑️ Remove</button>
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