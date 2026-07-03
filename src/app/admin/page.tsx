"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { io } from "socket.io-client";
import { 
  RiDashboardLine, 
  RiUserAddLine, 
  RiMoneyDollarCircleLine, 
  RiFlagLine, 
  RiBaseStationLine, 
  RiSaveLine,
  RiCheckDoubleLine
} from "react-icons/ri";
import { api } from "@/lib/api";
import { SOCKET_URL } from "@/lib/constants";
import { useAuthStore } from "@/lib/authStore";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [metrics, setMetrics] = useState({
    totalRegistrations: 0,
    grossReceipts: 0,
    activeEventsCount: 0,
  });
  const [scoreboards, setScoreboards] = useState<any[]>([]);
  const [selectedScoreIdx, setSelectedScoreIdx] = useState<number>(0);
  const [editedTeams, setEditedTeams] = useState<any[]>([]);
  const [isLiveStream, setIsLiveStream] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Redirect if not admin
    if (!isLoading && (!localStorage.getItem("macfiesta_token") || (user && user.role !== "admin"))) {
      // Allow fallback if user is local storage auth admin
      const localUser = localStorage.getItem("macfiesta_user");
      if (localUser) {
        const u = JSON.parse(localUser);
        if (u.role !== "admin") {
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // 1. Fetch initial statistics and scoreboards
    async function loadAdminData() {
      try {
        const [eventsRes, scoreboardRes, regsRes] = await Promise.all([
          api.get("/events"),
          api.get("/scoreboard"),
          // Since we don't have a direct stats route, let's compute from events & registrations
          api.get("/registrations/my").catch(() => ({ data: { registrations: [] } })), // dummy fallback
        ]);

        const events = eventsRes.data?.events || [];
        const scores = scoreboardRes.data?.scores || [];

        // Sum registrations
        const totalRegs = events.reduce((acc: number, curr: any) => acc + (curr.registeredCount || 0), 0);
        
        setMetrics({
          totalRegistrations: totalRegs,
          grossReceipts: totalRegs * 150, // Rs 150 per registration
          activeEventsCount: events.length,
        });

        setScoreboards(scores);
        if (scores.length > 0) {
          setEditedTeams(scores[0].teams || []);
          setIsLiveStream(scores[0].isLive || false);
        }
      } catch (err) {
        console.error("Admin dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();

    // 2. Setup socket connection
    const sk = io(SOCKET_URL);
    setSocket(sk);

    return () => {
      sk.disconnect();
    };
  }, []);

  const handleSelectScoreboard = (idx: number) => {
    setSelectedScoreIdx(idx);
    setEditedTeams(scoreboards[idx]?.teams || []);
    setIsLiveStream(scoreboards[idx]?.isLive || false);
    setStatusMsg("");
  };

  const handleScoreChange = (teamIndex: number, newScore: number) => {
    const updated = [...editedTeams];
    updated[teamIndex] = { ...updated[teamIndex], score: newScore };
    
    // Recalculate ranks based on descending scores
    const sorted = [...updated].sort((a, b) => b.score - a.score);
    const ranked = updated.map((team) => {
      const idx = sorted.findIndex((t) => t.name === team.name);
      return { ...team, rank: idx + 1 };
    });

    setEditedTeams(ranked);
  };

  const handleBroadcast = async () => {
    if (!socket || scoreboards.length === 0) return;
    const activeScore = scoreboards[selectedScoreIdx];
    const eventId = typeof activeScore.eventId === "object" ? activeScore.eventId._id : activeScore.eventId;
    
    setStatusMsg("Broadcasting signal...");
    
    try {
      // 1. Save to DB
      await api.put(`/scoreboard/${eventId}`, {
        teams: editedTeams,
        isLive: isLiveStream
      });

      // 2. Emit WebSocket
      socket.emit("update-score", {
        eventId,
        teams: editedTeams,
        isLive: isLiveStream
      });

      setStatusMsg("Score successfully updated & broadcasted live!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setStatusMsg("Broadcast failed. Check server status.");
    }
  };

  const activeScore = scoreboards[selectedScoreIdx] || null;

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider flex items-center gap-3" style={{ fontFamily: "var(--font-heading)" }}>
              <RiDashboardLine className="text-festival-pink" />
              <span>Admin Console</span>
            </h1>
            <p className="text-white/50 text-sm">
              Control event configurations, monitor registrations, and broadcast live standings.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/admin/events" className="btn-primary text-xs px-5 py-2.5">
              Manage Events
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("macfiesta_token");
                localStorage.removeItem("macfiesta_user");
                router.push("/signin");
              }}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-1.5 cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
            <div className="space-y-2">
              <span className="block text-xs uppercase font-bold text-white/40 tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Total Registrations
              </span>
              <span className="block text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                {metrics.totalRegistrations}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-2xl md:text-3xl text-festival-gold">
              <RiUserAddLine />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
            <div className="space-y-2">
              <span className="block text-xs uppercase font-bold text-white/40 tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Gross Receipts
              </span>
              <span className="block text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                ₹{metrics.grossReceipts.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-2xl md:text-3xl text-festival-cyan">
              <RiMoneyDollarCircleLine />
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
            <div className="space-y-2">
              <span className="block text-xs uppercase font-bold text-white/40 tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Total Arenas
              </span>
              <span className="block text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                {metrics.activeEventsCount}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 text-2xl md:text-3xl text-festival-purple">
              <RiFlagLine />
            </div>
          </div>
        </div>

        {/* Live Scoreboard Controller Panel */}
        <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiBaseStationLine className="text-festival-pink animate-pulse" />
                Live Standings Broadcast Panel
              </h3>
              <p className="text-white/50 text-xs">
                Select an arena and adjust scores. Changes broadcast instantly to the user scoreboard.
              </p>
            </div>

            {statusMsg && (
              <div className="p-2 px-4 bg-festival-cyan/15 border border-festival-cyan/30 text-festival-cyan text-xs font-bold rounded-xl animate-pulse">
                {statusMsg}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center text-white/40 text-xs py-6 uppercase font-bold tracking-widest animate-pulse">Loading scoreboards...</div>
          ) : scoreboards.length === 0 ? (
            <div className="text-center text-white/40 text-xs py-6">No scoreboards initialized in database yet. Add events first.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Scoreboard List Tabs */}
              <div className="lg:col-span-4 space-y-2">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-white/40" style={{ fontFamily: "var(--font-heading)" }}>
                  Select Arena
                </span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {scoreboards.map((score, idx) => (
                    <button
                      key={score._id}
                      onClick={() => handleSelectScoreboard(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedScoreIdx === idx
                          ? "bg-festival-gold/15 border-festival-gold text-festival-gold"
                          : "bg-white/2 border-white/5 hover:border-white/10 text-white/60"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {score.eventId?.title || "Scoreboard"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjust Standings Form */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-white/40" style={{ fontFamily: "var(--font-heading)" }}>
                    Team Scores & Standing
                  </span>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-white">
                    <input
                      type="checkbox"
                      checked={isLiveStream}
                      onChange={(e) => setIsLiveStream(e.target.checked)}
                      className="rounded border-white/10 bg-white/5 text-festival-pink focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                    />
                    <span>Stream Live Status</span>
                  </label>
                </div>

                {editedTeams.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-white/30 text-xs">
                    No teams registered or configured for this scoreboard.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editedTeams.map((team, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left space-y-0.5">
                          <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Rank {team.rank}</span>
                          <span className="block text-sm font-bold text-white">{team.name}</span>
                          <span className="block text-[10px] text-white/40">{team.college}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="text-xs text-white/40 font-semibold">Points:</span>
                          <input
                            type="number"
                            value={team.score}
                            onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                            className="w-24 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white font-bold text-sm text-right focus:outline-none focus:border-festival-gold/50"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                      <button
                        onClick={handleBroadcast}
                        className="btn-primary flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        <RiSaveLine />
                        <span>Save & Broadcast Live</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
