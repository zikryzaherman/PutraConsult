import React from "react";

// Centralized "status pill" styling.
// Every page that shows a status (booking status, request status, etc.)
// pulls from here so padding, radius, and type treatment never drift
// between pages the way they currently do.
//
// Usage:
//   <Badge status={booking.status} />                 -> looks up label + color
//   <Badge variant="new">New Booking Request</Badge>  -> custom label, fixed color

const STYLES = {
  pending: { classes: "bg-[#FDF3D9] text-[#B47C10]", label: "Pending" },
  approved: { classes: "bg-emerald-100 text-emerald-800", label: "Approved" },
  declined: { classes: "bg-red-100 text-red-800", label: "Declined" },
  new: { classes: "bg-amber-100 text-amber-800", label: "New" },
  neutral: { classes: "bg-slate-100 text-slate-600", label: "—" },
};

const normalize = (value) => {
  const key = (value || "pending").toLowerCase();
  if (key === "accepted") return "approved";
  if (key === "rejected") return "declined";
  return key;
};

export default function Badge({ status, variant, children }) {
  const key = normalize(variant || status);
  const style = STYLES[key] || STYLES.neutral;

  return (
    <span
      className={`${style.classes} px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase whitespace-nowrap`}
    >
      {children ?? style.label}
    </span>
  );
}