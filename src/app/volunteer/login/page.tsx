"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  RiUserHeartLine,
  RiShieldKeyholeLine,
  RiArrowRightLine,
  RiLock2Line,
  RiInformationLine,
  RiCheckDoubleLine,
} from "react-icons/ri";
import { getVolunteersList } from "@/lib/volunteerStore";

export default function VolunteerLoginPage() {
  const router = useRouter();
  const [volunteerCode, setVolunteerCode] = useState("VOL-101");
  const [password, setPassword] = useState("vol2026");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const list = getVolunteersList();
      const matched = list.find(
        (v) => v.volunteerCode.toLowerCase() === volunteerCode.trim().toLowerCase() || v.email.toLowerCase() === volunteerCode.trim().toLowerCase()
      );

      if (matched) {
        if (typeof window !== "undefined") {
          localStorage.setItem("macfiesta_active_volunteer_id", matched.id);
          localStorage.setItem("macfiesta_volunteer_auth", JSON.stringify({ token: "vol-jwt-token", user: matched }));
        }
        router.replace("/volunteer/dashboard");
      } else {
        setError("Invalid Volunteer ID Code or Password. Contact Command HQ Admin.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="bg-[#05050A] min-h-screen text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Marvel Energy Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-marvel-red/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-arc-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full marvel-card p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6 shadow-[0_0_50px_rgba(0,212,255,0.15)] relative z-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-marvel-red to-rose-700 mx-auto flex items-center justify-center shadow-[0_0_25px_#ED1D24]">
            <RiUserHeartLine className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            VOLUNTEER <span className="marvel-bang-comic-gradient font-black">PORTAL LOGIN</span>
          </h1>
          <p className="text-xs text-white/60">
            MacFiesta Pro Role-Based Operations Access. Enter your assigned Volunteer ID code.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/70 font-bold mb-1.5 uppercase tracking-wider">
              Volunteer ID Code or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={volunteerCode}
                onChange={(e) => setVolunteerCode(e.target.value)}
                placeholder="VOL-101"
                required
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
              <RiUserHeartLine className="absolute right-3.5 top-3.5 text-white/40 text-base" />
            </div>
          </div>

          <div>
            <label className="block text-white/70 font-bold mb-1.5 uppercase tracking-wider">
              Access Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
              <RiLock2Line className="absolute right-3.5 top-3.5 text-white/40 text-base" />
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 text-[11px] text-white/70">
            <div className="flex items-center gap-1.5 font-bold text-arc-cyan">
              <RiInformationLine />
              <span>Role-Based Permissions Notice</span>
            </div>
            <p>Volunteers can only view and manage assigned tasks & events. Admin system access is restricted.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_#ED1D24]"
          >
            <span>{loading ? "Authenticating Duty Pass..." : "Access Volunteer Duty Hub"}</span>
            <RiArrowRightLine className="text-base" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10 text-[11px] text-white/40 flex justify-between items-center">
          <Link href="/" className="hover:text-arc-cyan transition-colors">
            ← Return to Public Fest
          </Link>
          <Link href="/admin/login" className="hover:text-metallic-gold transition-colors">
            Admin HQ Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
