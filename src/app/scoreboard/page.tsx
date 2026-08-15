"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { RiBaseStationLine, RiTrophyLine, RiShieldFlashLine, RiFlashlightLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { SOCKET_URL } from "@/lib/constants";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

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
    
    socket.on("score-updated", () => {
      loadScores();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const activeScoreboard = scores[activeScoreIdx] || null;

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Video Loop (Hardware Accelerated, Smooth Zero-Lag) */}
      <BackgroundVideo
        src="/MARVEL/Video Project 6.mp4"
        fallbackSrc="/MARVEL/Video Project 4.mp4"
        opacity="opacity-80"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-marvel-red/40 bg-marvel-red/10 text-marvel-red text-xs font-excon-bold font-bold tracking-[0.2em] uppercase shadow-[0_0_18px_rgba(237,29,36,0.3)]"
          >
            <RiBaseStationLine className="animate-pulse text-sm text-marvel-red" />
            <span>S.H.I.E.L.D. LIVE RADAR SCOREBOARD</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-excon-black">
            <span className="shimmer-text">LIVE</span>{" "}
            <span className="gradient-text-plasma">SCOREBOARD</span>
          </h1>
          <p className="text-white/80 text-xs sm:text-sm font-excon font-normal">
            Real-time power levels, leaderboard rankings, and arena scores updated live.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-arc-cyan uppercase font-bold text-xs tracking-[0.2em] py-10 animate-pulse font-excon-bold">
            Connecting to S.H.I.E.L.D. Satellite Feed...
          </div>
        ) : scores.length === 0 ? (
          <div className="marvel-card p-12 rounded-3xl border border-white/10 text-center text-white/50 text-sm font-excon">
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
                    className={`px-5 py-2.5 rounded-full border text-xs font-black uppercase tracking-[0.16em] transition-all cursor-pointer font-excon-bold ${
                      activeScoreIdx === idx
                        ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_18px_#ED1D24]"
                        : "bg-white/5 text-white/70 border-white/10 hover:text-white"
                    }`}
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
