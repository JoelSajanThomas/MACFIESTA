"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiMapPinLine, RiTimeLine, RiArrowRightLine, RiFlashlightLine } from "react-icons/ri";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const typeColors: Record<string, { bg: string; text: string; border: string; rgb: string }> = {
  General:    { bg: "bg-arc-cyan/15",         text: "text-arc-cyan",     border: "border-arc-cyan/30",     rgb: "0,212,255"   },
  Gaming:     { bg: "bg-vibranium-purple/15",  text: "text-vibranium-purple", border: "border-vibranium-purple/30", rgb: "123,47,190" },
  Technical:  { bg: "bg-metallic-gold/15",     text: "text-metallic-gold", border: "border-metallic-gold/30", rgb: "212,175,55" },
  Management: { bg: "bg-marvel-red/15",         text: "text-marvel-red",  border: "border-marvel-red/30",   rgb: "237,29,36"   },
  Cultural:   { bg: "bg-vibranium-purple/15",  text: "text-vibranium-purple", border: "border-vibranium-purple/30", rgb: "123,47,190" },
};

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

/* ─── Individual 3D schedule row card ─── */
function ScheduleCard({ slot, idx }: { slot: typeof scheduleData.day1[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tc = typeColors[slot.type] ?? typeColors.General;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative group"
      style={{ perspective: "1000px" }}
    >
      {/* Timeline point */}
      <div
        className="absolute -left-[27px] sm:-left-[31px] md:-left-[39px] top-5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 bg-black group-hover:scale-150 transition-all duration-300 z-10"
        style={{
          borderColor: `rgba(${tc.rgb},0.8)`,
          boxShadow: `0 0 10px rgba(${tc.rgb},0.6)`,
          backgroundColor: `rgba(${tc.rgb},0.1)`,
        }}
      />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-aurora p-4 sm:p-5 rounded-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 cursor-default"
      >
        {/* Accent top border on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${tc.rgb},0.8), transparent)` }}
        />
        <div className="space-y-1.5" style={{ transform: "translateZ(8px)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <RiTimeLine className="text-arc-cyan text-sm shrink-0" />
            <span className="text-metallic-gold text-xs font-bold tracking-wider font-excon-bold">{slot.time}</span>
            <span
              className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-[0.14em] font-black border font-excon-black ${tc.bg} ${tc.text} ${tc.border}`}
            >
              {slot.type}
            </span>
          </div>
          <h3
            className="text-base sm:text-lg font-black text-white uppercase tracking-tight group-hover:text-metallic-gold transition-colors duration-300 font-excon-black"
          >
            {slot.title}
          </h3>
        </div>

        <div
          className="flex items-center gap-2 text-xs font-bold text-white/85 bg-white/5 px-3.5 py-2 rounded-xl border border-white/10 md:self-center shrink-0 font-excon-bold self-start md:self-auto"
          style={{ transform: "translateZ(8px)" }}
        >
          <RiMapPinLine className="text-arc-cyan text-sm shrink-0" />
          <span>{slot.venue}</span>
        </div>

        {/* Hover glow shadow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ boxShadow: "none" }}
          whileHover={{ boxShadow: `0 0 30px rgba(${tc.rgb},0.15)` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}

export function SchedulePreview() {
  const [activeDay, setActiveDay] = useState<"day1" | "day2">("day1");

  return (
    <section className="relative bg-transparent section-padding border-t border-metallic-gold/20 overflow-hidden min-h-[600px]">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0 opacity-85 pointer-events-none overflow-hidden">
        <Image
          src="/MARVEL/Doctor Strange.png"
          alt="Doctor Strange Schedule Background"
          fill
          priority
          className="object-cover object-top filter brightness-105 contrast-125 saturate-135 scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/60 via-transparent to-[#05050A]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.65)_95%)]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <Reveal y={60} duration={0.7} margin="-100px">
          <div
            className="text-center space-y-4 mb-8 sm:mb-10 glass-aurora border border-white/15 p-4 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,212,255,0.08)]"
            style={{ perspective: "1000px" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-arc-cyan/40 bg-arc-cyan/15 text-arc-cyan text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(0,212,255,0.3)] font-space">
              <RiFlashlightLine className="animate-pulse" />
              <span>SANCTUM TIME REALM CHRONOLOGY</span>
            </div>

            <h2 className="section-title text-white uppercase font-anton">
              <span className="shimmer-text">Schedule</span>{" "}
              <span className="gradient-text-plasma">Preview</span>
            </h2>

            {/* Day toggle with 3D spring */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2 w-full max-w-md mx-auto">
              {(["day1", "day2"] as const).map((day, i) => (
                <motion.button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.16em] transition-colors duration-300 cursor-pointer font-space text-center ${
                    activeDay === day
                      ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_20px_#ED1D24]"
                      : "bg-black/60 text-white/75 border-white/15 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {day === "day1" ? "⚡ Day 1 — Technical & Gaming" : "🏆 Day 2 — Finals & Pro Show"}
                </motion.button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Schedule List */}
        <div className="relative border-l-2 border-arc-cyan/30 ml-3 sm:ml-4 md:ml-6 pl-5 sm:pl-6 md:pl-8 space-y-4 sm:space-y-5">
          {/* Animated scan line */}
          <motion.div
            className="absolute left-0 w-0.5 h-16 bg-gradient-to-b from-transparent via-arc-cyan to-transparent"
            animate={{ y: ["0%", "calc(100% - 64px)", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {scheduleData[activeDay].map((slot, idx) => (
                <ScheduleCard key={idx} slot={slot} idx={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/schedule"
              className="btn-primary px-8 py-3 text-xs tracking-[0.16em] uppercase inline-flex items-center gap-2 shadow-[0_0_25px_#ED1D24] font-excon-bold"
            >
              <span className="font-black">View Full Interactive Schedule</span>
              <RiArrowRightLine className="text-sm" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
