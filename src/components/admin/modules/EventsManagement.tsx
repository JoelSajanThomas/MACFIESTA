"use client";

import { useState } from "react";
import { DataTable, Column } from "../shared/DataTable";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCalendarLine,
  RiMapPinLine,
  RiTrophyLine,
  RiGroupLine,
  RiEyeLine,
} from "react-icons/ri";

export interface EventRecord {
  _id: string;
  title: string;
  slug: string;
  category: string;
  venue: string;
  description?: string;
  timeSlot?: string;
  prizePool?: number;
  seatsAvailable?: number;
  status?: string;
  rules?: string;
}

interface EventsManagementProps {
  events: EventRecord[];
  onOpenCreateModal: () => void;
  onEditEvent: (event: EventRecord) => void;
  onDeleteEvent: (id: string) => void;
  onRefresh?: () => void;
}

export function EventsManagement({
  events,
  onOpenCreateModal,
  onEditEvent,
  onDeleteEvent,
  onRefresh,
}: EventsManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === "all") return true;
    return ev.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const columns: Column<EventRecord>[] = [
    {
      key: "title",
      header: "Event Name & Category",
      render: (row) => (
        <div>
          <p className="font-extrabold text-white text-xs tracking-wide">{row.title}</p>
          <span className="text-[9px] font-bold uppercase tracking-wider text-festival-gold">
            {row.category || "General"}
          </span>
        </div>
      ),
    },
    {
      key: "venue",
      header: "Venue & Timing",
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-white/80 flex items-center gap-1">
            <RiMapPinLine size={12} className="text-festival-gold" />
            <span>{row.venue || "Main Auditorium"}</span>
          </p>
          <p className="text-[10px] text-white/40 flex items-center gap-1">
            <RiCalendarLine size={12} />
            <span>{row.timeSlot || "Day 1, 10:00 AM"}</span>
          </p>
        </div>
      ),
    },
    {
      key: "prizePool",
      header: "Prize Pool",
      render: (row) => (
        <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
          <RiTrophyLine size={13} /> ₹{(row.prizePool || 10000).toLocaleString()}
        </span>
      ),
    },
    {
      key: "seatsAvailable",
      header: "Seats Available",
      render: (row) => (
        <span className="text-xs font-bold text-white/80 flex items-center gap-1">
          <RiGroupLine size={13} className="text-indigo-400" />
          <span>{row.seatsAvailable ?? 50} Seats</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar: Create Event & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "gaming", "cultural", "technical", "sports", "general"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.25)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary text-xs flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl shadow-lg shrink-0 cursor-pointer"
        >
          <RiAddLine size={16} />
          <span>Add New Festival Event</span>
        </button>
      </div>

      {/* Events Data Table */}
      <DataTable
        title="MacFiesta 2K26 Event Roster"
        columns={columns}
        data={filteredEvents}
        searchKey="title"
        searchPlaceholder="Search event title, venue, category..."
        onRefresh={onRefresh}
        exportFileName="macfiesta_events_roster"
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => onEditEvent(row)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-xs cursor-pointer"
              title="Edit event details"
            >
              <RiEditLine size={14} />
            </button>
            <button
              onClick={() => onDeleteEvent(row._id)}
              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs cursor-pointer"
              title="Delete event"
            >
              <RiDeleteBinLine size={14} />
            </button>
          </div>
        )}
      />
    </div>
  );
}
