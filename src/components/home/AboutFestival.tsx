"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { RiAwardLine, RiGroupLine, RiFlashlightLine, RiShieldFlashLine } from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";

/* ─── Counter hook ─── */
function useCounter(target: number, duration = 1800, startCounting: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, startCounting]);

  return count;
}

/* ─── Individual stat card ─── */
function StatCard({
  icon: Icon,
  rawValue,
  suffix,
  label,
  color,
  index,
  inView,
}: {
  icon: React.ComponentType<{ className?: string }>;
  rawValue: number;
  suffix: string;
  label: string;
  color: string;
  index: number;
  inView: boolean;
}) {
  const count = useCounter(rawValue, 1600 + index * 100, inView);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.06, y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-aurora p-6 md:p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl cursor-default hover:border-arc-cyan/40 transition-colors duration-300"
    >
      <div
        className={`p-4 rounded-full bg-white/5 ${color} text-2xl md:text-3xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]`}
      >
        <Icon className="" />
      </div>
      <div className="space-y-1">
        <span
          className="block text-3xl md:text-4xl font-black text-white uppercase"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          {count}
          {suffix}
        </span>
        <span className="block text-xs text-arc-cyan font-extrabold uppercase tracking-wider font-space">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

const stats = [
  { icon: RiAwardLine, rawValue: 26, suffix: "+", label: "Avenger Missions", color: "text-metallic-gold" },
  { icon: RiGroupLine, rawValue: 5000, suffix: "+", label: "Recruited Agents", color: "text-arc-cyan" },
  { icon: RiFlashlightLine, rawValue: 20, suffix: "L+", label: "Bounty Pool", color: "text-marvel-red" },
  { icon: RiShieldFlashLine, rawValue: 100, suffix: "%", label: "MCU Immersion", color: "text-vibranium-purple" },
];

export function AboutFestival() {
  const { settings } = useFestivalControl();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative bg-[#05050A]/65 backdrop-blur-md section-padding border-t border-white/10 overflow-hidden">
      {/* Background Marvel energy glows — animate on scroll */}
      <motion.div
        className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-marvel-red/10 blur-[130px] pointer-events-none"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[130px] pointer-events-none"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Text content — slides in from left */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arc-cyan/30 bg-arc-cyan/10 text-arc-cyan text-xs font-bold tracking-widest uppercase font-space">
              <RiShieldFlashLine className="animate-pulse" />
              <span>STARK INDUSTRIES &amp; WAKANDA TECH BRIEFING</span>
            </div>

            <h2
              className="section-title text-white uppercase"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Where Heroes <br />
              <span className="marvel-bang-comic-gradient font-black">Assemble &amp; Dominate</span>
            </h2>

            <p className="text-white/80 leading-relaxed font-space text-base">
              {settings.aboutText}
            </p>

            <p className="text-white/70 leading-relaxed font-space text-sm">
              Over 2 action-packed days, the country&apos;s elite delegates gather inside{" "}
              <span className="text-arc-cyan font-semibold">{settings.name}</span> Avengers
              Headquarters to compete for glory, honor, S.H.I.E.L.D. trophies, and massive bounty
              pools.
            </p>

            {/* Decorative horizontal bar */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-marvel-red/60 to-transparent" />
              <RiShieldFlashLine className="text-marvel-red/60 text-lg" />
            </div>
          </motion.div>

          {/* Right Stats grid — slides in from right */}
          <motion.div
            ref={ref}
            className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {stats.map((stat, idx) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                rawValue={stat.rawValue}
                suffix={stat.suffix}
                label={stat.label}
                color={stat.color}
                index={idx}
                inView={inView}
              />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
