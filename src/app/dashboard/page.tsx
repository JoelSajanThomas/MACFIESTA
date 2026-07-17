"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiQrCodeLine, RiTimeLine, RiAwardLine, RiHistoryLine, RiUserSettingsLine } from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, registrations, fetchProfile, fetchRegistrations, logout, isInitialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchRegistrations();
    }
  }, [token, fetchProfile, fetchRegistrations]);

  useEffect(() => {
    if (mounted && isInitialized && !token) {
      router.replace("/signin");
    }
  }, [mounted, isInitialized, token, router]);

  if (!mounted || !isInitialized || !user) {
    return (
      <div className="bg-festival-dark min-h-screen pt-28 flex items-center justify-center">
        <div className="text-white text-sm font-bold uppercase tracking-widest animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Header greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Welcome back, <span className="gradient-text-gold">{user.name}!</span>
            </h1>
            <p className="text-white/50 text-sm">
              Manage your registered events, print entry passes, and retrieve verified certificates.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-right hidden sm:block">
              <span className="block text-xs text-white/40">XP Balance</span>
              <span className="text-festival-gold font-bold">{user.xpPoints} XP</span>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/signin");
              }}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white flex items-center gap-1.5 cursor-pointer"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left - main content widgets */}
          <div className="lg:col-span-8 space-y-8">
            {/* Registered events list */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiAwardLine className="text-festival-gold" />
                Registered Arenas ({registrations.length})
              </h2>

              {registrations.length === 0 ? (
                <div className="glass p-8 rounded-2xl border border-white/5 text-center text-white/40 text-sm">
                  You are not registered for any events yet.
                  <div className="mt-4">
                    <Link href="/events" className="btn-primary text-xs px-5 py-2.5">
                      Explore Arenas
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations.map((reg) => {
                    const event = typeof reg.eventId === "object" ? (reg.eventId as any) : null;
                    if (!event) return null;
                    return (
                      <div key={reg._id} className="glass p-6 rounded-2xl border border-white/5 space-y-4 hover:border-white/10 transition-all">
                        <div>
                          <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest text-festival-gold" style={{ fontFamily: "var(--font-heading)" }}>
                            {event.type}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-2 truncate">
                            {event.title}
                          </h3>
                        </div>

                        <div className="space-y-2 text-xs text-white/50 border-t border-white/5 pt-3">
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span className="font-semibold text-white">{event.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reporting:</span>
                            <span className="font-semibold text-white">{event.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Venue:</span>
                            <span className="font-semibold text-white truncate max-w-[150px]">{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Badges logs */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiHistoryLine className="text-festival-purple" />
                Earned Badges ({user.badges?.length || 0})
              </h2>

              <div className="glass p-6 rounded-2xl border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.map((badge: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-center space-y-2">
                      <div className="text-3xl text-festival-gold">🏅</div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-white/40 text-sm">No badges earned yet. Complete challenges to earn badges.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right - QR entry pass sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {registrations.length > 0 ? (
              <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 text-center space-y-6 shadow-xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-festival-gold to-festival-orange" />

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                    <RiQrCodeLine />
                    QR Entry Ticket
                  </h3>
                  <p className="text-xs text-white/40">
                    Scan this pass at registration desks
                  </p>
                </div>

                {/* Real base64 QR Code Graphic */}
                <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center border border-white/10 shadow-lg relative">
                  <div className="relative w-full h-full">
                    <Image
                      src={registrations[0].qrCode}
                      alt="Pass QR Verification Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="text-xs text-white/50 space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between">
                    <span>Participant ID:</span>
                    <span className="font-semibold text-white uppercase tracking-wider">{registrations[0].entryPass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Type:</span>
                    <span className="font-semibold text-festival-gold uppercase tracking-wider">Unified Arena Pass</span>
                  </div>
                  <div className="flex justify-between">
                    <span>College:</span>
                    <span className="font-semibold text-white truncate max-w-[150px]">{user.college}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 text-center space-y-4">
                <div className="text-4xl text-white/20">🎫</div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">No active entry pass</h3>
                <p className="text-xs text-white/40">Register for at least one event to generate your unified entry pass QR code ticket.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
