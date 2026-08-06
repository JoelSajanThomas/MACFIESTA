"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiMapPinLine, RiTimeLine, RiArrowRightLine, RiFlashlightLine } from "react-icons/ri";

const scheduleData = {
  day1: [
    { time: "09:30 AM", title: "Inauguration & Sanctum Assembling", venue: "Main Auditorium", type: "General" },
    { time: "11:00 AM", title: "Urumi Esports Gaming Arena", venue: "Esports Arena", type: "Gaming" },
    { time: "12:00 PM", title: "Byte & Code 24H Hackathon", venue: "Stark Lab 3", type: "Technical" },
    { time: "02:00 PM", title: "Corporate Showdown & Case Study", venue: "Seminar Hall", type: "Management" },
  ],
  day2: [
    { time: "10:00 AM", title: "Parallel Stage Technicals & AI Sprints", venue: "All Labs & Halls", type: "Technical" },
    { time: "01:30 PM", title: "Choreo Dance Finals & Beatboxing", venue: "Main Stage", type: "Cultural" },
    { time: "04:30 PM", title: "Valedictory & S.H.I.E.L.D. Trophy", venue: "Main Auditorium", type: "General" },
    { time: "06:00 PM", title: "Dusk 'N Dawn Pro Show Concert", venue: "Main Arena Grounds", type: "Cultural" },
  ],
};

export function SchedulePreview() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");

  return (
    <section className="relative bg-[#080B14] section-padding border-t border-white/10 overflow-hidden min-h-[600px] font-mono">
      {/* Background Marvel Doctor Strange Artwork — Face 100% Clearly Visible */}
      <div className="absolute inset-0 z-0 opacity-90 pointer-events-none overflow-hidden">
        <Image
          src="/MARVEL/Doctor Strange.png"
          alt="Doctor Strange Schedule Background"
          fill
          priority
          className="object-cover object-top filter brightness-105 contrast-125 saturate-135 drop-shadow-[0_0_50px_rgba(0,212,255,0.4)] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-[#080B14]/40 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(8,11,20,0.85)_90%)] z-[1]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-arc-cyan/15 blur-[140px] z-[1]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Container */}
        <div className="text-center space-y-4 mb-10 bg-black/75 backdrop-blur-md border border-white/15 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-arc-cyan/40 bg-arc-cyan/15 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,212,255,0.3)]"
          >
            <RiFlashlightLine className="animate-pulse" />
            <span>SANCTUM TIME REALM CHRONOLOGY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Schedule <span className="marvel-bang-comic-gradient font-black">Preview</span>
          </motion.h2>

          {/* Day selectors */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveDay("day1")}
              className={`px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeDay === "day1"
                  ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_20px_#ED1D24] scale-105"
                  : "bg-black/60 text-white/70 border-white/15 hover:border-white/40 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Day 01 — 24 Sep
            </button>
            <button
              onClick={() => setActiveDay("day2")}
              className={`px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeDay === "day2"
                  ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_20px_#ED1D24] scale-105"
                  : "bg-black/60 text-white/70 border-white/15 hover:border-white/40 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Day 02 — 25 Sep
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="relative border-l-2 border-arc-cyan/40 ml-4 md:ml-6 pl-6 md:pl-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {scheduleData[activeDay].map((slot, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline point */}
                  <div className="absolute -left-[31px] md:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-arc-cyan bg-black shadow-[0_0_12px_#00D4FF] group-hover:bg-arc-cyan group-hover:scale-125 transition-all duration-300" />
                  
                  {/* Timeline card */}
                  <div className="marvel-card p-5 rounded-2xl border border-white/15 bg-black/80 backdrop-blur-md group-hover:border-arc-cyan/60 group-hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-metallic-gold text-xs font-bold tracking-wider">
                        <RiTimeLine className="text-arc-cyan" />
                        <span>{slot.time}</span>
                        <span className="px-2.5 py-0.5 rounded bg-arc-cyan/15 text-[9px] uppercase tracking-widest text-arc-cyan font-extrabold border border-arc-cyan/30 ml-2">
                          {slot.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wide group-hover:text-metallic-gold transition-colors duration-300" style={{ fontFamily: "var(--font-heading)" }}>
                        {slot.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-white/90 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 md:self-center">
                      <RiMapPinLine className="text-arc-cyan text-sm" />
                      <span>{slot.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/schedule"
            className="btn-primary px-8 py-3 text-xs tracking-widest uppercase inline-flex items-center gap-2 shadow-[0_0_25px_#ED1D24]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span>View Full Interactive Schedule</span>
            <RiArrowRightLine className="text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
