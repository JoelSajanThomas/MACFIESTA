"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RiFlashlightLine, RiShieldFlashLine, RiSparklingLine } from "react-icons/ri";

const INFINITY_STONES = [
  {
    name: "Space Stone",
    color: "#00D4FF",
    glow: "shadow-[0_0_20px_#00D4FF]",
    domain: "Networking & Cloud Warfare",
    desc: "Control over spatial computing, cloud architecture, and serverless hackathons.",
  },
  {
    name: "Reality Stone",
    color: "#ED1D24",
    glow: "shadow-[0_0_20px_#ED1D24]",
    domain: "AR/VR & UI/UX Realm",
    desc: "Alter perception through 3D modeling, game design, and immersive digital worlds.",
  },
  {
    name: "Power Stone",
    color: "#7B2FBE",
    glow: "shadow-[0_0_20px_#7B2FBE]",
    domain: "Esports & Gaming Gauntlet",
    desc: "Raw competitive strength in BGMI, Valorant, FIFA, and console battles.",
  },
  {
    name: "Mind Stone",
    color: "#FFD700",
    glow: "shadow-[0_0_20px_#FFD700]",
    domain: "AI & Algorithmic Conquest",
    desc: "Unleash machine learning, competitive programming, and neural networking brilliance.",
  },
  {
    name: "Time Stone",
    color: "#10B981",
    glow: "shadow-[0_0_20px_#10B981]",
    domain: "Speed Coding & Live Debates",
    desc: "Master time-pressured challenges, rapid debugging, and fast-paced quizzes.",
  },
  {
    name: "Soul Stone",
    color: "#FF8C00",
    glow: "shadow-[0_0_20px_#FF8C00]",
    domain: "Cultural Arts & Pro Concert",
    desc: "Infuse your passion into dance, beatboxing, music bands, and dramatic arts.",
  },
];

export function InfinityChallenge() {
  const [activeStone, setActiveStone] = useState(INFINITY_STONES[0]);

  return (
    <section className="relative bg-[#05050A] section-padding border-t border-arc-cyan/20 overflow-hidden min-h-[600px]">
      {/* Background Infinity Gauntlet Marvel Image — Ultra High 100% Visibility with Edge Blending */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <Image
          src="/MARVEL/4081455907815375.png"
          alt="Infinity Gauntlet Background"
          fill
          priority
          className="object-cover object-top filter brightness-115 contrast-130 saturate-140 drop-shadow-[0_0_50px_rgba(237,29,36,0.6)]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A] via-transparent to-[#05050A] z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(5,5,10,0.7)_95%)] z-[1]" />
      </div>

      {/* Background ambient glow matching active stone */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-25 z-0"
        style={{ background: activeStone.color }}
      />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Section Header Card */}
        <div className="text-center space-y-3 max-w-2xl mx-auto bg-black/75 backdrop-blur-md border border-white/15 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-metallic-gold/40 bg-metallic-gold/15 text-metallic-gold text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            <RiSparklingLine className="animate-spin-slow" />
            <span>THE SIX DOMAINS OF VICTORY</span>
          </div>

          <h2 className="section-title text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ fontFamily: "var(--font-heading)" }}>
            Infinity <span className="marvel-bang-comic-gradient font-black">Gauntlet Challenge</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-mono font-medium drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
            Harness the power of all 6 Infinity Stones by competing across diverse mission categories at MACFIESTA.
          </p>
        </div>

        {/* Stone Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INFINITY_STONES.map((stone) => {
            const isSelected = activeStone.name === stone.name;
            return (
              <button
                key={stone.name}
                onClick={() => setActiveStone(stone)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer backdrop-blur-md ${isSelected
                  ? "bg-white/20 border-white text-white scale-105 shadow-2xl"
                  : "bg-black/70 border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                  }`}
                style={{
                  borderColor: isSelected ? stone.color : undefined,
                  boxShadow: isSelected ? `0 0 25px ${stone.color}60` : undefined,
                }}
              >
                <div
                  className={`w-8 h-8 rounded-full border border-white/40 flex items-center justify-center transition-all ${isSelected ? "animate-pulse" : ""
                    }`}
                  style={{ background: stone.color, boxShadow: `0 0 18px ${stone.color}` }}
                >
                  <span className="text-[10px] font-black text-black font-mono">★</span>
                </div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-center">
                  {stone.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stone Detail Card */}
        <motion.div
          key={activeStone.name}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="stark-panel p-6 sm:p-8 rounded-2xl border border-white/25 bg-black/80 backdrop-blur-md max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 shadow-[0_0_40px_rgba(0,0,0,0.9)]"
          style={{ borderColor: `${activeStone.color}80` }}
        >
          <div
            className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center border-2 border-white/60 shadow-2xl"
            style={{ background: activeStone.color, boxShadow: `0 0 40px ${activeStone.color}` }}
          >
            <RiShieldFlashLine className="text-3xl text-black" />
          </div>

          <div className="space-y-2 text-center md:text-left font-mono">
            <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: activeStone.color }}>
              {activeStone.name} • {activeStone.domain}
            </div>
            <h3 className="text-xl font-bold text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              {activeStone.domain}
            </h3>
            <p className="text-xs text-white/90 font-medium leading-relaxed drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
              {activeStone.desc}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
