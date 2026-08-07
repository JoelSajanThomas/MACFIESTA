"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiUserHeartLine,
  RiShieldKeyholeLine,
  RiArrowRightLine,
  RiLock2Line,
  RiInformationLine,
  RiCheckDoubleLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldFlashLine,
  RiCompass3Line,
  RiTimeLine,
  RiQuestionAnswerLine,
  RiPhoneLine,
  RiMailLine,
  RiCloseLine,
  RiSparklingLine,
  RiBuilding2Line,
} from "react-icons/ri";
import { getVolunteersList, VolunteerUser } from "@/lib/volunteerStore";

export default function VolunteerLoginPage() {
  const router = useRouter();

  // Login Form States
  const [volunteerCode, setVolunteerCode] = useState("VOL-101");
  const [password, setPassword] = useState("vol2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authenticatedSuccess, setAuthenticatedSuccess] = useState(false);

  // Modals
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 48, hours: 14, mins: 32, secs: 10 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const list = getVolunteersList();
      const matched = list.find(
        (v: VolunteerUser) =>
          v.volunteerCode.toLowerCase() === volunteerCode.trim().toLowerCase() ||
          v.email.toLowerCase() === volunteerCode.trim().toLowerCase()
      );


      if (matched) {
        setAuthenticatedSuccess(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("macfiesta_active_volunteer_id", matched.id);
          localStorage.setItem(
            "macfiesta_volunteer_auth",
            JSON.stringify({ token: "vol-jwt-token", user: matched })
          );
        }
        setTimeout(() => {
          router.replace("/volunteer/dashboard");
        }, 800);
      } else {
        setError("Invalid Volunteer ID Code or Passcode. Contact your Department Lead.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="bg-[#05050A] min-h-screen text-white font-mono flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Marvel Wallpaper Overlay & Energy Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <Image
          src="/MARVEL/3025924746959430.jpg"
          alt="MacFiesta Marvel Background Wallpaper"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/90 to-[#05050A]/70 z-10" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-marvel-red/10 rounded-full blur-[160px] pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-arc-cyan/10 rounded-full blur-[140px] pointer-events-none z-10" />
      </div>

      {/* TOP BRANDING BAR */}
      <header className="relative z-20 px-6 lg:px-12 py-6 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-marvel-red to-rose-700 flex items-center justify-center font-black text-white text-base shadow-[0_0_20px_#ED1D24] group-hover:scale-105 transition-transform">
            MF
          </div>
          <div>
            <span className="block text-sm font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              MACFIESTA <span className="marvel-bang-comic-gradient font-black">PRO</span>
            </span>
            <span className="block text-[10px] text-arc-cyan font-bold tracking-widest uppercase">
              VOLUNTEER COMMAND HUB
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-arc-cyan/20 border border-white/10 hover:border-arc-cyan text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
        >
          <RiCompass3Line className="text-arc-cyan" />
          <span>Back to Main Fest</span>
        </Link>
      </header>

      {/* SPLIT-SCREEN MAIN CONTENT AREA */}
      <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

          {/* LEFT SIDE: BRANDING, COUNTDOWN & ARTWORK (DESKTOP) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-8 hidden lg:flex flex-col justify-center"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-marvel-red/40 bg-marvel-red/10 text-marvel-red text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(237,29,36,0.3)]">
                <RiShieldFlashLine className="animate-pulse" />
                <span>GROUND OPERATIONS DIRECTIVE • 2K26</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                Where Heroes <br />
                <span className="marvel-bang-comic-gradient font-black">Assemble to Serve</span>
              </h1>

              <p className="text-sm text-white/80 leading-relaxed font-mono max-w-lg">
                "Every hero needs tactical ground support." Access your personalized volunteer roster, verify delegate QR passes, and maintain operational readiness across 26 national competitions.
              </p>
            </div>

            {/* Event Countdown Box */}
            <div className="p-6 rounded-3xl bg-black/60 border border-arc-cyan/30 backdrop-blur-xl space-y-3 max-w-md shadow-[0_0_30px_rgba(0,212,255,0.1)]">
              <div className="flex items-center justify-between text-xs font-bold text-arc-cyan uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <RiTimeLine className="animate-pulse" />
                  <span>Countdown to Duty Launch</span>
                </span>
                <span className="text-metallic-gold">Day 1 • Sep 24</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { label: "DAYS", val: timeLeft.days },
                  { label: "HOURS", val: timeLeft.hours },
                  { label: "MINS", val: timeLeft.mins },
                  { label: "SECS", val: timeLeft.secs },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="block text-2xl font-black text-white font-mono">{String(item.val).padStart(2, "0")}</span>
                    <span className="block text-[9px] text-white/40 font-bold tracking-widest">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="flex items-center gap-4 p-4 bg-marvel-red/10 border border-marvel-red/30 rounded-2xl max-w-md">
              <Image
                src="/MARVEL/ironman.png"
                alt="Iron Man HUD Graphic"
                width={50}
                height={50}
                className="object-contain drop-shadow-[0_0_10px_rgba(237,29,36,0.8)]"
              />
              <p className="text-xs text-white/90 italic">
                "Part of the journey is the end—and part of the victory is the team behind the scenes."
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE: GLASSMORPHISM LOGIN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full max-w-md marvel-card p-8 sm:p-10 rounded-3xl border-2 border-arc-cyan/40 bg-[#0A0D1A]/90 backdrop-blur-2xl space-y-6 shadow-[0_0_60px_rgba(0,212,255,0.2)] relative">

              {/* Login Card Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-marvel-red to-rose-700 mx-auto flex items-center justify-center shadow-[0_0_25px_#ED1D24]">
                  <RiUserHeartLine className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  VOLUNTEER <span className="marvel-bang-comic-gradient font-black">AUTH PORTAL</span>
                </h2>
                <p className="text-xs text-white/60">
                  Enter your assigned Volunteer ID code & passcode.
                </p>
              </div>

              {/* Status & Error Alerts */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold rounded-xl text-center animate-pulse">
                  {error}
                </div>
              )}

              {authenticatedSuccess && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 animate-bounce">
                  <RiCheckDoubleLine className="text-lg" />
                  <span>Authenticated! Loading Volunteer Dashboard...</span>
                </div>
              )}

              {/* LOGIN FORM */}
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
                      placeholder="VOL-101 or email@macfast.org"
                      required
                      className="w-full px-4 py-3.5 bg-black/60 border border-white/15 rounded-xl text-white placeholder-white/30 focus:border-arc-cyan focus:ring-1 focus:ring-arc-cyan focus:outline-none transition-all"
                    />
                    <RiUserHeartLine className="absolute right-4 top-4 text-white/40 text-base" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 font-bold mb-1.5 uppercase tracking-wider">
                    Access Passcode
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3.5 bg-black/60 border border-white/15 rounded-xl text-white placeholder-white/30 focus:border-arc-cyan focus:ring-1 focus:ring-arc-cyan focus:outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <RiEyeOffLine className="text-base" /> : <RiEyeLine className="text-base" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-marvel-red w-4 h-4 rounded cursor-pointer"
                    />
                    <span>Remember My Duty Session</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-arc-cyan font-bold hover:underline cursor-pointer"
                  >
                    Forgot Code?
                  </button>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading || authenticatedSuccess}
                  className="w-full btn-primary py-3.5 text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_#ED1D24] transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <span>Access Volunteer Duty Hub</span>
                      <RiArrowRightLine className="text-base" />
                    </>
                  )}
                </button>
              </form>

              {/* QUICK ASSISTANCE ACTIONS */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="hover:text-metallic-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RiQuestionAnswerLine />
                  <span>Contact Coordinator</span>
                </button>

                <Link href="/admin/login" className="hover:text-arc-cyan transition-colors font-bold">
                  Admin HQ Login →
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 px-6 py-4 text-[11px] text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 <span className="text-white font-bold">MacFiesta Pro</span>. All Rights Reserved. MACFAST Campus Command.
        </div>

        <div className="flex items-center gap-4">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Use</span>
          <span>•</span>
          <span className="text-arc-cyan font-bold font-mono">v4.8.2-PRO</span>
        </div>
      </footer>

      {/* FORGOT CODE MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full marvel-card p-6 rounded-3xl border border-arc-cyan/40 bg-[#0A0D1A] space-y-4 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1"
            >
              <RiCloseLine className="text-lg" />
            </button>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Reset Volunteer Access Passcode</h3>
            <p className="text-xs text-white/60">
              For security, volunteer passcode resets must be approved by your Department Faculty Lead or Super Admin Command HQ.
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 text-xs">
              <div className="text-metallic-gold font-bold flex items-center gap-1">
                <RiPhoneLine />
                <span>Command HQ Helpline: +91 94470 00000</span>
              </div>
              <div className="text-arc-cyan font-bold flex items-center gap-1">
                <RiMailLine />
                <span>Email: macfiesta@macfast.org</span>
              </div>
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-arc-cyan text-black font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

      {/* CONTACT COORDINATOR MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full marvel-card p-6 rounded-3xl border border-arc-cyan/40 bg-[#0A0D1A] space-y-4 relative">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1"
            >
              <RiCloseLine className="text-lg" />
            </button>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Department Coordinators Contact</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
                <span className="font-bold text-white block">Prof. Rajesh Kumar (MCA Lead)</span>
                <span className="text-metallic-gold text-[11px]">+91 94471 11111</span>
              </div>
              <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
                <span className="font-bold text-white block">Prof. Priya Nair (MBA Lead)</span>
                <span className="text-metallic-gold text-[11px]">+91 94472 22222</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-marvel-red text-white font-bold text-xs rounded-xl hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Close Assistance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
