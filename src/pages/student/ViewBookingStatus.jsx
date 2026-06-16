import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ViewBookingStatus() {
  const { profile, bookings } = useAuth();

  // Filter only the bookings belonging to the current student
  const myBookings = (bookings || []).filter(
    (b) => b.studentId === profile?.uid
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

  // Dynamic styling configuration based on Firebase status
  // Dynamic styling configuration based on Firebase status
  const getStatusConfig = (status) => {
    // Normalize the text so we don't miss anything
    const currentStatus = status?.toLowerCase() || "pending";

    if (currentStatus === "approved" || currentStatus === "accepted") {
      return {
        cardBorder: "border-l-emerald-500",
        badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
        icon: "✅",
        label: "APPROVED"
      };
    }
    
    if (currentStatus === "declined" || currentStatus === "rejected") {
      return {
        cardBorder: "border-l-red-500",
        badgeBg: "bg-red-50 border-red-200 text-red-700",
        icon: "❌",
        label: "DECLINED"
      };
    }

    // Default fallback
    return {
      cardBorder: "border-l-amber-400",
      badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
      icon: "⏳",
      label: "PENDING REVIEW"
    };
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto w-full pt-4 pb-12 font-sans animate-fade-in">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-10 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">PutraConsult</h1>
          <div className="hidden sm:block w-px h-6 bg-slate-300"></div>
          <h2 className="text-xl font-medium text-slate-500">Request Monitor</h2>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-2">
            Your Sent Logs
          </h3>

          {myBookings.length > 0 ? (
            <div className="flex flex-col gap-5">
              {myBookings.map((booking) => {
                const config = getStatusConfig(booking.status);

                return (
                  <div 
                    key={booking.id} 
                    className={`bg-white border-y border-r border-l-4 border-slate-200 ${config.cardBorder} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-start justify-between gap-6`}
                  >
                    {/* Left Side: Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{config.icon}</span>
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                          {booking.lecturerName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-4 ml-8">
                        <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-slate-700">
                          📅 {booking.date}
                        </span>
                        <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-slate-700">
                          ⏰ {booking.time}
                        </span>
                      </div>

                      <div className="ml-8 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 shadow-inner">
                        <span className="font-bold text-slate-400 text-xs uppercase tracking-wider block mb-1.5">
                          [Booking Details]
                        </span>
                        {booking.description || "No specific details provided."}
                      </div>
                    </div>

                    {/* Right Side: Status Badge & TX ID */}
                    <div className="flex flex-col items-start sm:items-end justify-between min-w-[140px] border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                      <div className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest border ${config.badgeBg}`}>
                        {config.label}
                      </div>
                      
                      <div className="mt-4 sm:mt-auto text-[10px] font-mono text-slate-400 uppercase bg-slate-50 px-2 py-1 border border-slate-100 rounded">
                        TX_ID: {booking.id.slice(0, 8)}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="text-4xl">📭</span>
              <h4 className="font-bold text-slate-700">No requests sent yet</h4>
              <p className="text-sm font-medium text-slate-500">
                When you book a consultation, the tracking logs will appear here.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}