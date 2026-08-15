"use client";

import { motion } from "framer-motion";
import { FESTIVAL_CONFIG } from "@/lib/constants";
import { RiRocketLine, RiEyeLine, RiHistoryLine, RiTeamLine } from "react-icons/ri";

const milestones = [
  { year: "2015", event: "MacFiesta is born as a tech fest for department of Computer Applications." },
  { year: "2018", event: "Expands into cultural events, drawing over 1000 participants regional level." },
  { year: "2022", event: "Relaunched as a premium national multi-fest across all departments." },
  { year: "2025", event: "Introducing esports arena, premium Web3 tech challenges, and grand pro-show concert." },
];

const team = [
  { name: "Dr. Cherian P. George", role: "Principal / Chief Patron", dept: "College Admin" },
  { name: "Prof. Varghese Abraham", role: "General Coordinator", dept: "Computer Applications" },
  { name: "Prof. Ligo Koshy", role: "Cultural Event Head", dept: "Management Studies" },
  { name: "Ashwin Kumar", role: "Student Coordinator", dept: "MCA Dept" },
  { name: "Aria Sebastian", role: "Student Coordinator", dept: "MBA Dept" },
];

export default function AboutPage() {
  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-festival-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-festival-purple/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            About <span className="gradient-text-gold neon-gold">{FESTIVAL_CONFIG.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-sm md:text-base leading-relaxed"
          >
            The national multi-fest representing the academic and cultural excellence of {FESTIVAL_CONFIG.collegeFull} (MACFAST).
          </motion.p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl border border-white/5 space-y-4 relative shadow-xl"
          >
            <div className="text-festival-gold text-3xl p-3 bg-white/5 rounded-full w-fit">
              <RiRocketLine />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Our Vision
            </h3>
            <p className="text-white/60 leading-relaxed text-sm">
              To build a national-level benchmark platform that empowers higher education students to exhibit, test, and master creative, logical, managerial, and technological skills.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl border border-white/5 space-y-4 relative shadow-xl"
          >
            <div className="text-festival-purple text-3xl p-3 bg-white/5 rounded-full w-fit">
              <RiEyeLine />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Our Objectives
            </h3>
            <p className="text-white/60 leading-relaxed text-sm">
              Foster intercollegiate teamwork, drive innovation in engineering and design, and create unforgettable cultural experiences that inspire unity and dedication.
            </p>
          </motion.div>
        </div>

        {/* Timeline history */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              The Journey
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Our <span className="gradient-text-gold">History</span>
            </h2>
          </div>

          <div className="relative border-l border-white/10 max-w-3xl mx-auto pl-6 md:pl-8 space-y-6">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative group"
              >
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-festival-gold bg-festival-dark group-hover:bg-festival-gold transition-colors shadow-[0_0_10px_rgba(255,215,0,0.3)]" />
                <div className="glass p-5 rounded-xl border border-white/10 hover:border-festival-gold/40 transition-colors">
                  <span className="block text-sm font-bold text-festival-gold" style={{ fontFamily: "var(--font-heading)" }}>
                    {m.year}
                  </span>
                  <p className="text-white/75 text-sm mt-1">
                    {m.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Organizers & Core Team */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-festival-purple text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Leadership
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Organizing <span className="gradient-text-gold">Committee</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-white/5 text-center flex flex-col justify-between"
              >
                <div className="text-festival-gold text-4xl mx-auto mb-4 p-3 bg-white/5 rounded-full w-fit">
                  <RiTeamLine />
                </div>
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                    {member.name}
                  </span>
                  <span className="block text-xs text-festival-gold font-medium">
                    {member.role}
                  </span>
                  <span className="block text-[10px] text-white/30">
                    {member.dept}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
