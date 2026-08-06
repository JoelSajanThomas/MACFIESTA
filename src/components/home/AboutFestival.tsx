"use client";

import { motion } from "framer-motion";
import { RiAwardLine, RiGroupLine, RiFlashlightLine, RiShieldFlashLine } from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";

const stats = [
  { icon: RiAwardLine, value: "26+", label: "Avenger Missions", color: "text-metallic-gold" },
  { icon: RiGroupLine, value: "5000+", label: "Recruited Agents", color: "text-arc-cyan" },
  { icon: RiFlashlightLine, value: "₹20L+", label: "Bounty Pool", color: "text-marvel-red" },
  { icon: RiShieldFlashLine, value: "100%", label: "MCU Immersion", color: "text-vibranium-purple" },
];

export function AboutFestival() {
  const { settings } = useFestivalControl();

  return (
    <section className="relative bg-[#05050A] section-padding border-t border-white/10 overflow-hidden font-mono">
      {/* Background Marvel energy glow */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-marvel-red/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[130px] pointer-events-none" />



      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Text content */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arc-cyan/30 bg-arc-cyan/10 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase"
            >
              <RiShieldFlashLine className="animate-pulse" />
              <span>STARK INDUSTRIES & WAKANDA TECH BRIEFING</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="section-title text-white uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Where Heroes <br />
              <span className="marvel-bang-comic-gradient font-black">Assemble & Dominate</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white font-medium leading-relaxed text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            >
              {settings.aboutText}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white font-medium leading-relaxed text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            >
              Over 2 action-packed days, the country's elite delegates gather inside {settings.name} Avengers Headquarters to compete for glory, honor, S.H.I.E.L.D. trophies, and massive bounty pools.
            </motion.p>
          </div>

          {/* Right Stats grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="marvel-card p-6 md:p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl"
                >
                  <div className={`p-4 rounded-full bg-white/5 ${stat.color} text-2xl md:text-3xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                    <Icon />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-3xl md:text-4xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                      {stat.value}
                    </span>
                    <span className="block text-xs text-arc-cyan font-extrabold uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

