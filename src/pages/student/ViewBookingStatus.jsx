import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import Badge from "../../components/ui/Badge";

// Utility to format date into "Wednesday, Jun 17, 2026"
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

export default function ViewBookingStatus() {
  const { profile, bookings } = useAuth();

  // Filter only the bookings belonging to the current student
  const myBookings = (bookings || [])
    .filter((b) => b.studentId === profile?.uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-full w-full p-8 font-sans animate-fade-in">

        {/* --- PAGE HEADER --- */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">My Requests</h1>
            <p className="text-slate-500 font-medium text-lg">Track the status of your consultation bookings</p>
          </div>

          <Link
            to="/student/find"
            className="bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <span className="text-xl leading-none font-light">+</span> New Booking
          </Link>
        </div>

        <div className="w-full flex flex-col gap-6">

          {myBookings.length > 0 ? (
            <div className="flex flex-col gap-6">
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >

                  {/* Top Row: Lecturer Info & Status Badge */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-900 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                        {booking.lecturerName ? booking.lecturerName.charAt(0).toUpperCase() : "L"}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 leading-tight mb-1">
                          {booking.lecturerName}
                        </h3>
                        <span className="text-slate-500 font-medium text-sm">
                          Consultation Session
                        </span>
                      </div>
                    </div>

                    <Badge status={booking.status} />
                  </div>

                  {/* Middle Row: Date & Time Box */}
                  <div className="bg-slate-50 rounded-xl p-5 mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <svg className="w-5 h-5 text-red-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {formatLongDate(booking.date)}
                    </div>
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <svg className="w-5 h-5 text-red-900 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {booking.time}
                    </div>
                  </div>

                  {/* Bottom Row: Topic / Description */}
                  <div className="mt-6 flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-slate-500 font-medium">
                      "{booking.description || "No specific details provided."}"
                    </p>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-1">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900">No requests found</h4>
              <p className="text-slate-500 font-medium max-w-sm">
                You haven't made any booking requests yet.
              </p>
              <Link
                to="/student/find"
                className="bg-red-900 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors mt-2"
              >
                Find a Lecturer
              </Link>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}