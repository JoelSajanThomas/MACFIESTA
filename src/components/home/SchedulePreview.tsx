"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RiMapPinLine, RiTimeLine, RiArrowRightLine } from "react-icons/ri";

const scheduleData = {
  day1: [
    { time: "09:30 AM", title: "Inauguration Ceremony", venue: "Main Auditorium", type: "General" },
    { time: "11:00 AM", title: "Urumi Gaming Arena Kickoff", venue: "Esports Arena", type: "Gaming" },
    { time: "12:00 PM", title: "Byte & Code Hackathon", venue: "Lab 3", type: "Technical" },
    { time: "02:00 PM", title: "Corporate Showdown", venue: "Seminar Hall", type: "Management" },
  ],
  day2: [
    { time: "10:00 AM", title: "Parallel Stage Technicals", venue: "All Labs & Halls", type: "Technical" },
    { time: "01:30 PM", title: "Choreo Video Finals", venue: "Main Stage", type: "Cultural" },
    { time: "04:30 PM", title: "Valedictory & Awards", venue: "Main Auditorium", type: "General" },
    { time: "06:00 PM", title: "Dusk 'N Dawn Pro Show", venue: "Main Grounds", type: "Cultural" },
  ],
};

export function SchedulePreview() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");

  return (
    <section className="relative bg-festival-dark section-padding border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Interactive Timeline
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-white"
          >
            Schedule <span className="gradient-text-gold neon-gold">Preview</span>
          </motion.h2>

          {/* Day selectors */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveDay("day1")}
              className={`px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeDay === "day1"
                  ? "bg-festival-gold text-festival-dark border-festival-gold shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  : "bg-transparent text-white/60 border-white/10 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Day 01 — 15 Nov
            </button>
            <button
              onClick={() => setActiveDay("day2")}
              className={`px-6 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                activeDay === "day2"
                  ? "bg-festival-gold text-festival-dark border-festival-gold shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  : "bg-transparent text-white/60 border-white/10 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Day 02 — 16 Nov
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="relative border-l border-white/10 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
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
                  <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-festival-gold bg-festival-dark group-hover:bg-festival-gold group-hover:scale-125 transition-all duration-300" />
                  
                  {/* Timeline card */}
                  <div className="glass p-5 rounded-xl border border-white/5 group-hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-festival-gold text-xs font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                        <RiTimeLine />
                        <span>{slot.time}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] uppercase tracking-widest text-white/40 border border-white/10 ml-2">
                          {slot.type}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-festival-gold transition-colors duration-300">
                        {slot.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/40 md:self-end">
                      <RiMapPinLine className="text-festival-cyan" />
                      <span>{slot.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 text-xs font-bold text-festival-gold tracking-widest uppercase hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            View Full Interactive Schedule
            <RiArrowRightLine />
          </Link>
        </div>
      </div>
    </section>
  );
}
