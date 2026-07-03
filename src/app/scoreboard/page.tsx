"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { RiBaseStationLine, RiTrophyLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { SOCKET_URL } from "@/lib/constants";

export default function ScoreboardPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [activeScoreIdx, setActiveScoreIdx] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial scores
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

    // Establish dynamic WebSocket connection
    const socket = io(SOCKET_URL);
    
    socket.on("connect", () => {
      console.log("WebSocket connected to scoreboard channel:", socket.id);
    });

    socket.on("score-live", (updatedScore: any) => {
      console.log("Received live score update:", updatedScore);
      setScores((prev) => {
        // Match by eventId ID
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
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-festival-purple/10 border border-festival-purple/30 text-festival-purple text-xs font-bold rounded-full uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <RiBaseStationLine className="animate-pulse text-sm text-festival-pink" />
            <span>Real-time Live Server</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Live <span className="gradient-text-gold neon-gold">Scoreboard</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Track real-time matches standings, coding score points, and gaming brackets live.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/40 uppercase font-bold text-xs tracking-widest py-10 animate-pulse">
            Establishing connections & loading data...
          </div>
        ) : scores.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-white/5 text-center text-white/40 text-sm">
            No active scoreboards found in the database.
          </div>
        ) : (
          <>
            {/* Tab toggler */}
            <div className="flex flex-wrap justify-center gap-4">
              {scores.map((score, idx) => {
                const event = score.eventId || {};
                return (
                  <button
                    key={score._id}
                    onClick={() => setActiveScoreIdx(idx)}
                    className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      activeScoreIdx === idx
                        ? "bg-festival-gold text-festival-dark border-festival-gold shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                        : "bg-white/5 text-white/60 border-white/5 hover:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span>{event.title || "Arena Standing"}</span>
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
                  className="glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl space-y-4"
                >
                  {/* Status header */}
                  <div className="p-5 bg-white/2 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block text-white/40 text-[10px] uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                        Current Match Venue
                      </span>
                      <span className="block font-bold text-white text-sm">
                        {activeScoreboard.eventId?.venue || "Main Auditorium"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${activeScoreboard.isLive ? "bg-festival-pink animate-pulse" : "bg-white/20"}`} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/80" style={{ fontFamily: "var(--font-heading)" }}>
                        {activeScoreboard.isLive ? "Live Streaming" : "Standings Final"}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-white/40 border-b border-white/5" style={{ fontFamily: "var(--font-heading)" }}>
                        <tr>
                          <th className="py-4 px-6">Rank</th>
                          <th className="py-4 px-6">Team name / Participant</th>
                          <th className="py-4 px-6">Representing</th>
                          <th className="py-4 px-6 text-right">Points / Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeScoreboard.teams && activeScoreboard.teams.length > 0 ? (
                          [...activeScoreboard.teams]
                            .sort((a, b) => a.rank - b.rank)
                            .map((row, index) => (
                              <tr key={index} className="group hover:bg-white/2px transition-colors">
                                <td className="py-4 px-6 font-bold">
                                  <div className="flex items-center gap-2">
                                    {row.rank <= 3 ? (
                                      <span className={`p-1.5 rounded-full ${
                                        row.rank === 1 ? "bg-festival-gold text-festival-dark" :
                                        row.rank === 2 ? "bg-white/20 text-white" : "bg-festival-orange/20 text-festival-orange"
                                      }`}>
                                        <RiTrophyLine />
                                      </span>
                                    ) : null}
                                    <span>{row.rank}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-bold text-white group-hover:text-festival-gold transition-colors">
                                  {row.name}
                                </td>
                                <td className="py-4 px-6 text-white/60">
                                  {row.college}
                                </td>
                                <td className="py-4 px-6 text-right font-bold text-festival-cyan text-base">
                                  {row.score}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-white/30 text-xs">
                              Standings parameters are still being configured. Wait for organizers.
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
