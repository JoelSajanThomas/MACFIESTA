"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RiAwardLine, RiSearchLine, RiDownloadLine, RiCheckDoubleLine } from "react-icons/ri";

const resultsData = [
  { event: "Urumi Gaming Arena", winner: "Apex Overlords (CET)", runner: "Silent Killers (MACFAST)", status: "verified" },
  { event: "Byte & Code Hackathon", winner: "Byte Busters (MACFAST)", runner: "Syntax Sorcerers (AJCE)", status: "verified" },
  { event: "Corporate Showdown", winner: "Aria George (MBA Dept)", runner: "Rohit Krishnan (SCMS)", status: "verified" }
];

export default function ResultsPage() {
  const [search, setSearch] = useState("");

  const filtered = resultsData.filter((r) => r.event.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Live <span className="gradient-text-gold neon-gold">Results</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Search verified results, view winners podiums, and print certificates using digital badges.
          </p>
        </div>

        {/* Search */}
        <div className="glass p-4 rounded-xl border border-white/5 relative">
          <RiSearchLine className="absolute left-7 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
          <input
            type="text"
            placeholder="Search results by event name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-festival-gold/50 focus:outline-none text-white text-sm"
          />
        </div>

        {/* Results grid */}
        <div className="space-y-6">
          {filtered.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/10 transition-all"
            >
              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-2 text-festival-gold text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiAwardLine />
                  <span>{row.event}</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-festival-cyan/10 border border-festival-cyan/20 text-festival-cyan text-[8px] tracking-widest ml-2">
                    <RiCheckDoubleLine />
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-white/2 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase font-bold text-white/30 tracking-wider">🏆 Winner First</span>
                    <span className="block font-bold text-white text-base mt-1">{row.winner}</span>
                  </div>
                  <div className="p-3.5 bg-white/2 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase font-bold text-white/30 tracking-wider">🥈 Runner Up</span>
                    <span className="block font-bold text-white/80 text-base mt-1">{row.runner}</span>
                  </div>
                </div>
              </div>

              {/* Certificate Download button */}
              <button
                onClick={() => alert(`Initiating PDF download for ${row.event} Certificates...`)}
                className="btn-outline text-xs px-5 py-3 flex items-center gap-2 uppercase tracking-widest self-stretch md:self-center justify-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <RiDownloadLine />
                <span>PDF</span>
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
