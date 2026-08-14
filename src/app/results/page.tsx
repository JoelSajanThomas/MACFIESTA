"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiAwardLine, RiSearchLine, RiDownloadLine, RiCheckDoubleLine, RiTrophyLine, RiSparklingLine, RiShieldFlashLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

const DEFAULT_RESULTS = [
  { event: "Thor Gaming Arena (Urumi BGMI & Valorant)", winner: "Apex Overlords (CET Trivandrum)", runner: "Silent Killers (MACFAST)", hero: "Thor", status: "verified" },
  { event: "Iron Man Byte & Code Hackathon", winner: "Byte Busters (MACFAST)", runner: "Syntax Sorcerers (AJCE)", hero: "Iron Man", status: "verified" },
  { event: "Sanctum Corporate Showdown", winner: "Aria George (MBA Dept)", runner: "Rohit Krishnan (SCMS)", hero: "Doctor Strange", status: "verified" }
];

export function HallOfHeroesPodium({ topTeams }: { topTeams?: Array<{ name: string; college: string; score: number }> }) {
  const champion = topTeams?.[0]?.name || "Byte Busters";
  const runner = topTeams?.[1]?.name || "Apex Squad";
  const third = topTeams?.[2]?.name || "Syntax Team";

  return (
    <div className="marvel-card p-8 rounded-3xl border border-metallic-gold/40 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-[#0F0D05] to-[#05050A]">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-metallic-gold/40 bg-metallic-gold/10 text-metallic-gold text-xs font-mono font-bold tracking-widest uppercase">
        <RiSparklingLine className="animate-spin-slow" />
        <span>AVENGERS HALL OF HEROES PODIUM</span>
      </div>

      <h3 className="text-2xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
        CONGRATULATIONS TO THE <span className="gradient-text-gold neon-gold">VICTORS</span>
      </h3>

      {/* Holographic 3D Podium Display */}
      <div className="flex justify-center items-end gap-4 pt-6 pb-2 font-mono">
        {/* 2nd Place */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white text-lg font-bold">
            🥈
          </div>
          <div className="w-24 sm:w-32 h-28 bg-white/5 border border-white/20 rounded-t-2xl flex flex-col justify-center p-2 text-center">
            <span className="text-[10px] text-white/50 uppercase font-bold">2ND PLACE</span>
            <span className="text-xs font-bold text-white truncate">{runner}</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center space-y-2 -translate-y-4">
          <div className="w-16 h-16 rounded-full bg-metallic-gold/20 border-2 border-metallic-gold flex items-center justify-center text-metallic-gold text-2xl font-bold shadow-[0_0_25px_#FFD700]">
            🏆
          </div>
          <div className="w-28 sm:w-36 h-36 bg-metallic-gold/10 border-2 border-metallic-gold/50 rounded-t-2xl flex flex-col justify-center p-2 text-center shadow-[0_0_30px_rgba(255,215,0,0.2)]">
            <span className="text-[10px] text-metallic-gold uppercase font-black tracking-widest">GRAND CHAMPION</span>
            <span className="text-sm font-black text-white truncate">{champion}</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-marvel-red/20 border border-marvel-red/40 flex items-center justify-center text-marvel-red text-lg font-bold">
            🥉
          </div>
          <div className="w-24 sm:w-32 h-20 bg-marvel-red/5 border border-marvel-red/20 rounded-t-2xl flex flex-col justify-center p-2 text-center">
            <span className="text-[10px] text-marvel-red uppercase font-bold">3RD PLACE</span>
            <span className="text-xs font-bold text-white truncate">{third}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [search, setSearch] = useState("");
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    async function loadScores() {
      try {
        const res = await api.get("/scoreboard");
        if (res.data && res.data.success && Array.isArray(res.data.scores)) {
          setScores(res.data.scores);
        }
      } catch {}
    }
    loadScores();

    const socket = getSocket();
    const handleScoreLive = (updatedScore: any) => {
      setScores((prev) => {
        const targetId = typeof updatedScore.eventId === "object" ? updatedScore.eventId._id : updatedScore.eventId;
        const index = prev.findIndex((s) => {
          const currentId = typeof s.eventId === "object" ? s.eventId._id : s.eventId;
          return currentId === targetId;
        });

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = updatedScore;
          return updated;
        } else {
          return [...prev, updatedScore];
        }
      });
    };

    socket.on("score-live", handleScoreLive);
    return () => {
      socket.off("score-live", handleScoreLive);
    };
  }, []);

  const dynamicResults = scores.length > 0
    ? scores.map((s) => {
        const eventTitle = typeof s.eventId === "object" ? s.eventId?.title : "Championship Tournament";
        const teams = Array.isArray(s.teams) ? [...s.teams].sort((a: any, b: any) => b.score - a.score) : [];
        const winner = teams[0] ? `${teams[0].name} (${teams[0].college || "Champion"})` : "TBD";
        const runner = teams[1] ? `${teams[1].name} (${teams[1].college || "Runner-Up"})` : "TBD";
        return {
          event: eventTitle,
          winner,
          runner,
          hero: "Marvel",
          status: "verified"
        };
      })
    : DEFAULT_RESULTS;

  const filtered = dynamicResults.filter((r) => r.event.toLowerCase().includes(search.toLowerCase()));

  const allTeams = scores.flatMap((s) => (Array.isArray(s.teams) ? s.teams : [])).sort((a: any, b: any) => b.score - a.score);


  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Neon Ambient Color Blending */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-metallic-gold/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-arc-cyan/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.85)_95%)] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-metallic-gold/40 bg-metallic-gold/10 text-metallic-gold text-xs font-mono font-bold tracking-widest uppercase">
            <RiShieldFlashLine className="animate-pulse" />
            <span>S.H.I.E.L.D. VERIFIED VICTORY RECORDS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            HALL OF <span className="gradient-text-gold neon-gold">HEROES</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            Inspect official tournament winners, hero achievements, and download verified certificates.
          </p>
        </div>

        {/* Podium */}
        <HallOfHeroesPodium topTeams={allTeams} />

        {/* Search */}
        <div className="glass p-4 rounded-xl border border-arc-cyan/20 relative">
          <RiSearchLine className="absolute left-7 top-1/2 -translate-y-1/2 text-arc-cyan text-lg" />
          <input
            type="text"
            placeholder="Search hall of heroes by mission name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-arc-cyan focus:outline-none text-white text-xs"
          />
        </div>

        {/* Results grid */}
        <div className="space-y-6">
          {filtered.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="marvel-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-metallic-gold/50 transition-all shadow-xl"
            >
              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-2 text-metallic-gold text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiAwardLine />
                  <span>{row.event}</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-arc-cyan/10 border border-arc-cyan/30 text-arc-cyan text-[9px] tracking-widest ml-2">
                    <RiCheckDoubleLine />
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 bg-black/60 rounded-xl border border-metallic-gold/30">
                    <span className="block text-[10px] uppercase font-black text-metallic-gold tracking-wider">🏆 GRAND CHAMPION</span>
                    <span className="block font-bold text-white text-sm mt-1">{row.winner}</span>
                  </div>
                  <div className="p-3.5 bg-black/60 rounded-xl border border-white/10">
                    <span className="block text-[10px] uppercase font-black text-white/40 tracking-wider">🥈 RUNNER UP AGENT</span>
                    <span className="block font-bold text-white/80 text-sm mt-1">{row.runner}</span>
                  </div>
                </div>
              </div>

              {/* Certificate Download button */}
              <button
                onClick={() => alert(`Downloading official S.H.I.E.L.D. Victory Certificate PDF for ${row.event}...`)}
                className="btn-outline border-metallic-gold text-metallic-gold hover:bg-metallic-gold hover:text-black text-xs px-5 py-3 flex items-center gap-2 uppercase tracking-widest self-stretch md:self-center justify-center font-mono"
              >
                <RiDownloadLine />
                <span>Certificate PDF</span>
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
