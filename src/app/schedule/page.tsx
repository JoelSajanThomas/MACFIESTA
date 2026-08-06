"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiTimeLine, RiMapPinLine, RiNotification3Line, RiFlashlightLine, RiShieldFlashLine, RiRadarLine } from "react-icons/ri";

const timelineEvents = {
  day1: [
    { time: "09:30 AM - 10:30 AM", title: "S.H.I.E.L.D. Official Inauguration & Protocol Briefing", stage: "Main Auditorium", cat: "General", desc: "Lighting of the arc reactor core, welcome address by chief patrons & S.H.I.E.L.D. directors." },
    { time: "11:00 AM - 01:00 PM", title: "Thor Gaming Arena — Phase 1 (BGMI & Valorant)", stage: "Asgard Esports Hall", cat: "Gaming", desc: "Esports qualifiers & tactical battlegrounds." },
    { time: "11:30 AM - 04:30 PM", title: "Iron Man Code Warfare 24H Hackathon Kickoff", stage: "Stark Labs (MCA 3)", cat: "Technical", desc: "Problem statement reveal & intense algorithmic sprint." },
    { time: "02:00 PM - 04:30 PM", title: "Wakanda Innovation Pitch", stage: "Seminar Hall A", cat: "Management", desc: "Vibranium startup valuations and pitch presentations." },
  ],
  day2: [
    { time: "09:30 AM - 12:30 PM", title: "Hackathon Final Jury Demonstrations", stage: "Stark Labs (MCA 3)", cat: "Technical", desc: "Project defense & live prototype judging." },
    { time: "10:30 AM - 01:00 PM", title: "Thor Gaming Arena Grand Finale", stage: "Asgard Esports Hall", cat: "Gaming", desc: "Championship showdown for Mjolnir trophy." },
    { time: "01:30 PM - 04:30 PM", title: "Sanctum Stage Performance Matchups", stage: "Main Stage Arena", cat: "Cultural", desc: "Beatboxing, choreo battles, and live musical showdowns." },
    { time: "04:30 PM - 05:30 PM", title: "Hall of Heroes Awards & Victory Ceremony", stage: "Main Auditorium", cat: "General", desc: "Trophy distribution, medals, and S.H.I.E.L.D. honors." },
    { time: "06:00 PM - 10:00 PM", title: "Sanctum Pro-Show Concert & DJ Night", stage: "Athletic Grounds", cat: "Cultural", desc: "Live EDM concert and grand celebration." },
  ]
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");
  const [stageFilter, setStageFilter] = useState("all");

  const filteredTimeline = timelineEvents[activeDay].filter((item) => {
    return stageFilter === "all" || item.stage.toLowerCase().includes(stageFilter.toLowerCase());
  });

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Video Project 4.mp4 Loop (High Visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPause={(e) => e.currentTarget.play()}
          onEnded={(e) => e.currentTarget.play()}
          className="w-full h-full object-cover object-center filter brightness-110 contrast-115"

        >
          <source src="/MARVEL/Video Project 4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-[#05050A]/60 to-[#05050A]/90" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arc-cyan/40 bg-arc-cyan/10 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase">
            <RiRadarLine className="animate-spin-slow text-sm" />
            <span>S.H.I.E.L.D. TACTICAL MISSION RADAR</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            MISSION <span className="gradient-text-gold neon-gold">TIMELINE</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            Track real-time parallel operations across Avengers Command venues.
          </p>
        </div>

        {/* Tab & Filter Panel */}
        <div className="glass p-6 rounded-2xl border border-arc-cyan/20 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Day Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveDay("day1")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeDay === "day1"
                    ? "bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Phase 01 — 24 Sep
              </button>
              <button
                onClick={() => setActiveDay("day2")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeDay === "day2"
                    ? "bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Phase 02 — 25 Sep
              </button>
            </div>

            {/* Stage filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-4 py-2.5 bg-black/80 border border-arc-cyan/30 rounded-xl focus:outline-none text-xs font-bold uppercase tracking-wider text-arc-cyan"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <option value="all">All Sectors</option>
              <option value="Auditorium">Main Auditorium</option>
              <option value="Esports">Asgard Esports</option>
              <option value="Stark">Stark Labs</option>
              <option value="Grounds">Athletic Grounds</option>
            </select>
          </div>
        </div>

        {/* Live Timeline Tracker */}
        <div className="relative border-l-2 border-arc-cyan/30 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
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
                  <div className="absolute -left-[31px] md:-left-[39px] top-2 w-4 h-4 rounded-full border-2 border-arc-cyan bg-[#05050A] group-hover:bg-arc-cyan transition-colors shadow-[0_0_10px_#00D4FF]" />
                  
                  <div className="marvel-card p-6 rounded-2xl border border-white/10 group-hover:border-arc-cyan/40 transition-all duration-300 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-arc-cyan text-xs font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                        <RiTimeLine />
                        <span>{slot.time}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] uppercase tracking-widest text-metallic-gold border border-metallic-gold/30 ml-2">
                          {slot.cat}
                        </span>
                      </div>

                      <button
                        onClick={() => alert(`J.A.R.V.I.S. alert set for ${slot.title}!`)}
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-arc-cyan transition-colors uppercase tracking-wider font-bold"
                      >
                        <RiNotification3Line />
                        <span>Set Alert</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white group-hover:text-metallic-gold transition-colors duration-300 uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                        {slot.title}
                      </h3>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {slot.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-arc-cyan uppercase tracking-widest">
                      <RiMapPinLine className="text-arc-cyan" />
                      <span>Sector: {slot.stage}</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTimeline.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  No mission operations logged in selected sector.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
