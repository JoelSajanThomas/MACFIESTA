"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RiCalendarEventLine, RiFlashlightLine, RiShieldFlashLine, RiTrophyLine } from "react-icons/ri";

const TIMELINE_STEPS = [
  {
    phase: "PHASE I: RECRUITMENT",
    title: "Mission Directives & Registrations Open",
    date: "August 1, 2026",
    desc: "Agents assemble teams across India. Portal opens for online mission enrollment.",
    icon: RiShieldFlashLine,
    color: "text-arc-cyan",
  },
  {
    phase: "PHASE II: SPOT INFILTRATION",
    title: "Spot Registration & Campus Access",
    date: "September 24, 2026 — 08:00 AM",
    desc: "On-site verification at MACFAST Avengers Command. Badge & QR ID issue.",
    icon: RiFlashlightLine,
    color: "text-marvel-red",
  },
  {
    phase: "PHASE III: WARFARE",
    title: "Coding Sprint, Robo Race & Gaming Prelims",
    date: "September 24, 2026 — 10:30 AM",
    desc: "High-intensity battles across technical and gaming arenas.",
    icon: RiCalendarEventLine,
    color: "text-metallic-gold",
  },
  {
    phase: "PHASE IV: GRAND FINALE",
    title: "Hall of Heroes & Pro-Show Concert",
    date: "September 25, 2026 — 06:00 PM",
    desc: "Final victory ceremonies, trophy distribution, and national concert.",
    icon: RiTrophyLine,
    color: "text-vibranium-purple",
  },
];

export function MarvelTimeline() {
  return (
    <section className="relative bg-[#05050A] section-padding border-t border-arc-cyan/20 overflow-hidden min-h-[600px] font-mono">
      {/* Background Marvel Artwork — /MARVEL/The Spider….jpg (100% Maximum Visibility) */}
      <div className="absolute inset-0 z-0 opacity-90 pointer-events-none overflow-hidden">
        <Image
          src="/MARVEL/The Spider….jpg"
          alt="Spider-Man Mission Timeline Background"
          fill
          priority
          className="object-cover object-center filter brightness-105 contrast-125 saturate-135 drop-shadow-[0_0_50px_rgba(237,29,36,0.4)] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]/50 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.85)_90%)] z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-marvel-red/15 blur-[140px] z-[1]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header Container */}
        <div className="text-center space-y-3 max-w-2xl mx-auto bg-black/75 backdrop-blur-md border border-white/15 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-arc-cyan/40 bg-arc-cyan/15 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            <RiFlashlightLine className="animate-pulse" />
            <span>S.H.I.E.L.D. TACTICAL CHRONOLOGY</span>
          </div>

          <h2 className="section-title text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ fontFamily: "var(--font-heading)" }}>
            Marvel <span className="marvel-bang-comic-gradient font-black">Mission Timeline</span>
          </h2>
          <p className="text-xs sm:text-sm text-white font-medium font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Chronological roadmap of all MACFIESTA festival phases from initialization to the finale.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-arc-cyan/40 ml-4 md:ml-32 space-y-8">
          {TIMELINE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Timeline Dot Marker */}
                <div className="absolute -left-[17px] top-4 w-8 h-8 rounded-full bg-black border-2 border-arc-cyan flex items-center justify-center text-arc-cyan shadow-[0_0_15px_#00D4FF] group-hover:scale-125 group-hover:bg-arc-cyan group-hover:text-black transition-all">
                  <Icon className="text-sm" />
                </div>

                <div className="marvel-card p-6 rounded-2xl border border-white/15 bg-black/80 backdrop-blur-md space-y-2 max-w-2xl group-hover:border-arc-cyan/60 group-hover:shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[10px] font-mono font-extrabold tracking-widest uppercase ${step.color}`}>
                      {step.phase}
                    </span>
                    <span className="text-[10px] font-mono font-extrabold text-arc-cyan bg-arc-cyan/15 px-2.5 py-0.5 rounded border border-arc-cyan/30">
                      {step.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase tracking-wide group-hover:text-metallic-gold transition-colors duration-300" style={{ fontFamily: "var(--font-heading)" }}>
                    {step.title}
                  </h3>

                  <p className="text-xs text-white/90 font-mono font-medium leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
