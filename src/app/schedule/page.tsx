"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiTimeLine, RiMapPinLine, RiFlagLine, RiNotification3Line } from "react-icons/ri";

const timelineEvents = {
  day1: [
    { time: "09:30 AM - 10:30 AM", title: "Official Inauguration", stage: "Main Auditorium", cat: "General", desc: "Lighting of the lamp, welcome address by chief patrons." },
    { time: "11:00 AM - 01:00 PM", title: "Urumi Gaming League - Phase 1", stage: "Esports Arena Room", cat: "Gaming", desc: "Valorant & FIFA qualifiers matches." },
    { time: "11:30 AM - 04:30 PM", title: "Byte & Code 24H Hackathon Start", stage: "MCA Lab 3", cat: "Technical", desc: "Problem statement launch and design sprint phase." },
    { time: "02:00 PM - 04:30 PM", title: "Corporate Brains Pitching", stage: "Seminar Hall A", cat: "Management", desc: "Mock startup valuation and strategy presentations." },
  ],
  day2: [
    { time: "09:30 AM - 12:30 PM", title: "Hackathon Final Presentations", stage: "MCA Lab 3", cat: "Technical", desc: "Team pitches to the external jury panel." },
    { time: "10:30 AM - 01:00 PM", title: "Gaming Arena Finals", stage: "Esports Arena Room", cat: "Gaming", desc: "BGMI & FIFA grand finales." },
    { time: "01:30 PM - 04:30 PM", title: "Choreo Video Matchups", stage: "Main Stage Area", cat: "Cultural", desc: "Live stage performances and visual evaluations." },
    { time: "04:30 PM - 05:30 PM", title: "Awards & Closing Ceremony", stage: "Main Auditorium", cat: "General", desc: "Trophies presentation, medals distributions." },
    { time: "06:00 PM - 10:00 PM", title: "Dusk 'N Dawn Pro concert", stage: "Athletic Grounds", cat: "Cultural", desc: "Live DJ battles and EDM performance." },
  ]
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredTimeline = timelineEvents[activeDay].filter((item) => {
    return stageFilter === "all" || item.stage.toLowerCase().includes(stageFilter.toLowerCase());
  });

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Interactive <span className="gradient-text-gold neon-gold">Schedule</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Track live and parallel events, check stage listings, and trigger personalized bookmarks.
          </p>
        </div>

        {/* Tab & Filter Panel */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Day Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDay("day1")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeDay === "day1"
                    ? "bg-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Day 01 — 15 Nov
              </button>
              <button
                onClick={() => setActiveDay("day2")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeDay === "day2"
                    ? "bg-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Day 02 — 16 Nov
              </button>
            </div>

            {/* Stage filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none text-xs font-bold uppercase tracking-wider text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <option value="all" className="bg-festival-dark-card">All Stages</option>
              <option value="Auditorium" className="bg-festival-dark-card">Main Auditorium</option>
              <option value="Arena" className="bg-festival-dark-card">Esports Arena</option>
              <option value="Lab" className="bg-festival-dark-card">MCA Lab</option>
              <option value="Grounds" className="bg-festival-dark-card">Athletic Grounds</option>
            </select>
          </div>
        </div>

        {/* Live Timeline Tracker */}
        <div className="relative border-l border-white/10 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay + stageFilter}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {filteredTimeline.map((slot, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[31px] md:-left-[39px] top-2 w-4 h-4 rounded-full border-2 border-festival-gold bg-festival-dark group-hover:bg-festival-gold transition-colors" />
                  
                  {/* Item wrapper */}
                  <div className="glass p-6 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all duration-300 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-festival-gold text-xs font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                        <RiTimeLine />
                        <span>{slot.time}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] uppercase tracking-widest text-white/40 border border-white/10 ml-2">
                          {slot.cat}
                        </span>
                      </div>

                      {/* Reminder icon */}
                      <button
                        onClick={() => alert(`Reminder registered for ${slot.title}!`)}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-festival-gold self-start sm:self-center transition-colors uppercase tracking-wider font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        <RiNotification3Line />
                        <span>Remind</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-festival-gold transition-colors duration-300">
                        {slot.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {slot.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                      <RiMapPinLine className="text-festival-cyan" />
                      <span>{slot.stage}</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTimeline.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  No events found matching current criteria.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
