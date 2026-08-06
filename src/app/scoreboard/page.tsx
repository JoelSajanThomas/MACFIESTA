"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { RiBaseStationLine, RiTrophyLine, RiShieldFlashLine, RiFlashlightLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { SOCKET_URL } from "@/lib/constants";

export default function ScoreboardPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [activeScoreIdx, setActiveScoreIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScores() {
      try {
        const res = await api.get("/scoreboard");
        if (res.data && res.data.success) {
          setScores(res.data.scores);
        }
      } catch (err) {
        console.error("Failed to load initial scores", err);
      } finally {
        setLoading(false);
      }
    }
    loadScores();

    const socket = io(SOCKET_URL);
    
    socket.on("connect", () => {
      console.log("WebSocket connected to S.H.I.E.L.D. channel:", socket.id);
    });

    socket.on("score-live", (updatedScore: any) => {
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
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const activeScoreboard = scores[activeScoreIdx] || null;

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Video Project 6.mp4 Loop (High Visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPause={(e) => e.currentTarget.play()}
          onEnded={(e) => e.currentTarget.play()}
          className="w-full h-full object-cover filter brightness-110 contrast-115 scale-[1.02]"
        >
          <source src="/MARVEL/Video Project 6.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-[#05050A]/60 to-[#05050A]/90" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 bg-arc-cyan/10 border border-arc-cyan/30 text-arc-cyan text-xs font-bold rounded-full uppercase tracking-wider"
          >
            <RiBaseStationLine className="animate-pulse text-sm text-marvel-red" />
            <span>S.H.I.E.L.D. LIVE RADAR SCOREBOARD</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            LIVE <span className="gradient-text-gold neon-gold">SCOREBOARD</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm">
            Real-time power levels, leaderboard rankings, and arena scores updated live.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-arc-cyan uppercase font-bold text-xs tracking-widest py-10 animate-pulse">
            Connecting to S.H.I.E.L.D. Satellite Feed...
          </div>
        ) : scores.length === 0 ? (
          <div className="marvel-card p-12 rounded-3xl border border-white/10 text-center text-white/40 text-sm">
            No active mission scoreboards broadcast currently.
          </div>
        ) : (
          <>
            {/* Tab toggler */}
            <div className="flex flex-wrap justify-center gap-3">
              {scores.map((score, idx) => {
                const event = score.eventId || {};
                return (
                  <button
                    key={score._id}
                    onClick={() => setActiveScoreIdx(idx)}
                    className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      activeScoreIdx === idx
                        ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_15px_#ED1D24]"
                        : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span>{event.title || "Arena Mission"}</span>
                  </button>
                );
              })}
            </div>

            {/* Score Table */}
            <AnimatePresence mode="wait">
              {activeScoreboard && (
                <motion.div
                  key={activeScoreboard._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="marvel-card rounded-2xl border border-arc-cyan/30 overflow-hidden shadow-2xl space-y-4"
                >
                  {/* Status header */}
                  <div className="p-5 bg-black/60 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <span className="block text-white/40 text-[10px] uppercase font-bold tracking-wider">
                        Current Mission Sector
                      </span>
                      <span className="block font-bold text-white text-sm">
                        {activeScoreboard.eventId?.venue || "Main Auditorium"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${activeScoreboard.isLive ? "bg-marvel-red animate-pulse" : "bg-white/20"}`} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-arc-cyan">
                        {activeScoreboard.isLive ? "S.H.I.E.L.D. Live Sync" : "Official Final Scores"}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40 border-b border-white/10" style={{ fontFamily: "var(--font-heading)" }}>
                        <tr>
                          <th className="py-4 px-6">Rank</th>
                          <th className="py-4 px-6">Agent / Squad</th>
                          <th className="py-4 px-6">Representing Institution</th>
                          <th className="py-4 px-6 text-right">Power Score Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeScoreboard.teams && activeScoreboard.teams.length > 0 ? (
                          [...activeScoreboard.teams]
                            .sort((a, b) => a.rank - b.rank)
                            .map((row, index) => (
                              <tr key={index} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 px-6 font-bold">
                                  <div className="flex items-center gap-2">
                                    {row.rank <= 3 ? (
                                      <span className={`p-1.5 rounded-full ${
                                        row.rank === 1 ? "bg-metallic-gold text-black shadow-[0_0_10px_#FFD700]" :
                                        row.rank === 2 ? "bg-white/30 text-white" : "bg-marvel-red/40 text-marvel-red"
                                      }`}>
                                        <RiTrophyLine />
                                      </span>
                                    ) : null}
                                    <span>#{row.rank}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-bold text-white group-hover:text-arc-cyan transition-colors">
                                  {row.name}
                                </td>
                                <td className="py-4 px-6 text-white/60">
                                  {row.college}
                                </td>
                                <td className="py-4 px-6 text-right font-bold text-metallic-gold text-base">
                                  {row.score} PTS
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-white/30 text-xs">
                              Standings data compiling in S.H.I.E.L.D. data center...
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </div>
  );
}
