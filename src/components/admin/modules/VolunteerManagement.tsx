"use client";

import { useState } from "react";
import {
  RiUserHeartLine,
  RiShieldUserLine,
  RiCheckDoubleLine,
  RiPhoneLine,
  RiTimeLine,
  RiAddLine,
} from "react-icons/ri";

interface VolunteerStaff {
  id: string;
  name: string;
  phone: string;
  department: string;
  shift: string;
  duty: string;
  assignedVenue: string;
  status: "CHECKED_IN" | "ASSIGNED" | "OFF_DUTY";
  performanceRating: number;
}

export function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState<VolunteerStaff[]>([
    {
      id: "vol-101",
      name: "Kiran Kumar",
      phone: "+91 98470 12001",
      department: "Security & Gate Control",
      shift: "Morning (08:30 AM - 01:30 PM)",
      duty: "Main Gate Entry & QR Scanning",
      assignedVenue: "Campus Entry Gate",
      status: "CHECKED_IN",
      performanceRating: 5,
    },
    {
      id: "vol-102",
      name: "Sneha Roy",
      phone: "+91 98470 12002",
      department: "Stage & VIP Escort",
      shift: "Afternoon (01:00 PM - 06:00 PM)",
      duty: "VIP Guest Escort & Stage Support",
      assignedVenue: "Main Auditorium",
      status: "ASSIGNED",
      performanceRating: 5,
    },
    {
      id: "vol-103",
      name: "Arjun Nair",
      phone: "+91 98470 12003",
      department: "Technical & Esports",
      shift: "Full Day (09:00 AM - 05:00 PM)",
      duty: "Esports Technical Setup & LAN Check",
      assignedVenue: "Computer Lab 1",
      status: "CHECKED_IN",
      performanceRating: 4,
    },
  ]);

  const toggleCheckIn = (id: string) => {
    setVolunteers((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const next = v.status === "CHECKED_IN" ? "OFF_DUTY" : "CHECKED_IN";
          return { ...v, status: next };
        }
        return v;
      })
    );
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="glass p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <RiUserHeartLine className="text-rose-400 text-lg" />
            <span>Volunteer Staffing & Department Shifts Roster</span>
          </h2>
          <p className="text-xs text-white/40">Assign volunteer crews to gate control, stage escort, technical labs, and track attendance</p>
        </div>
        <button
          onClick={() => {
            const name = prompt("Volunteer Name:");
            const dept = prompt("Department (e.g. Stage Support):");
            if (name && dept) {
              setVolunteers([
                ...volunteers,
                {
                  id: `vol-${Date.now()}`,
                  name,
                  phone: "+91 98000 00000",
                  department: dept,
                  shift: "Full Day (09:00 AM - 05:00 PM)",
                  duty: "General Venue Crowd Control",
                  assignedVenue: "Main Foyer",
                  status: "ASSIGNED",
                  performanceRating: 5,
                },
              ]);
            }
          }}
          className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer"
        >
          <RiAddLine size={16} /> Register Volunteer
        </button>
      </div>

      {/* Volunteers Table */}
      <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Volunteer Shift & Task Duty Roster
          </h3>
          <span className="text-[10px] font-bold text-emerald-400">
            {volunteers.filter((v) => v.status === "CHECKED_IN").length} Checked-In On Duty
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest font-black text-[10px]">
                <th className="py-3 px-3">Volunteer Name</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Shift Hours</th>
                <th className="py-3 px-3">Assigned Task & Venue</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {volunteers.map((vol) => (
                <tr key={vol.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-extrabold text-white">{vol.name}</p>
                    <span className="text-[10px] text-white/40">{vol.phone}</span>
                  </td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{vol.department}</td>
                  <td className="py-3 px-3 font-mono text-festival-gold">{vol.shift}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white/90">{vol.duty}</p>
                    <span className="text-[10px] text-white/40">{vol.assignedVenue}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${vol.status === "CHECKED_IN"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : vol.status === "ASSIGNED"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                        }`}
                    >
                      {vol.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleCheckIn(vol.id)}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold cursor-pointer"
                    >
                      {vol.status === "CHECKED_IN" ? "Check-Out" : "Check-In"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
