"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiPlayLine,
  RiLockLine,
  RiShieldFlashLine,
  RiFlashlightLine,
  RiNotification3Line,
  RiCheckLine,
  RiCompass3Line,
  RiCalendarLine,
  RiMailLine,
} from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";
import { useFestivalControl } from "@/lib/festivalStore";

export default function SignUpPage() {
  const router = useRouter();
  const { settings } = useFestivalControl();

  const registerUser = useAuthStore((state) => state.registerUser);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [dept, setDept] = useState("");
  const [year, setYear] = useState("1");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Spot Notification State
  const [spotEmail, setSpotEmail] = useState("");
  const [spotRegistered, setSpotRegistered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-[#05050A] min-h-screen pt-28 pb-16 flex items-center justify-center font-mono">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="glass p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative h-[480px] flex items-center justify-center">
            <div className="text-arc-cyan text-xs font-bold uppercase tracking-widest animate-pulse">Loading S.H.I.E.L.D. Portal...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
        setErrorMsg("Please enter a valid phone number.");
        return;
      }
      setStep(2);
    } else {
      setErrorMsg("");
      setSubmitting(true);
      const res = await registerUser({
        name,
        email,
        password,
        phone,
        college,
        department: dept,
        year
      });
      setSubmitting(false);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(res.message || "Registration failed");
      }
    }
  };

  const handleSpotWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotEmail) return;
    setSpotRegistered(true);
  };

  // Dedicated Marvel Protocol Lockdown UI when Registration is Closed
  if (!settings.registrationOpen) {
    return (
      <div className="bg-[#05050A] min-h-screen pt-28 pb-16 flex items-center justify-center font-mono relative overflow-hidden">
        {/* Background Marvel laser grid & red alert aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-marvel-red/10 blur-[140px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,10,0.9)_95%)] pointer-events-none z-0" />

        <div className="max-w-xl w-full mx-auto px-4 relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="marvel-card p-8 md:p-10 rounded-3xl border-2 border-marvel-red/50 bg-[#0A0D1A]/90 backdrop-blur-xl text-center space-y-6 shadow-[0_0_60px_rgba(237,29,36,0.3)] relative overflow-hidden"
          >
            {/* Holographic scanner line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-marvel-red to-transparent animate-pulse" />

            {/* Glowing S.H.I.E.L.D. Lockdown Badge */}
            <div className="w-20 h-20 bg-marvel-red/20 border-2 border-marvel-red text-marvel-red rounded-full flex items-center justify-center mx-auto text-4xl shadow-[0_0_30px_#ED1D24] animate-pulse">
              <RiLockLine />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-marvel-red/40 bg-marvel-red/10 text-marvel-red text-[10px] font-bold uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(237,29,36,0.3)]">
                <RiShieldFlashLine className="animate-spin-slow" />
                <span>PROTOCOL 77-DELTA • RECRUITMENT SEALED</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                REGISTRATION <span className="text-marvel-red drop-shadow-[0_0_20px_#ED1D24]">CLOSED</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-mono">
                S.H.I.E.L.D. Command HQ has officially filled maximum capacity quotas for new agent enrollments. All online recruitment gateways are temporarily locked.
              </p>
            </div>

            {/* Emergency Spot Registration Waitlist */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="text-left space-y-1">
                <h4 className="text-xs font-bold text-metallic-gold uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <RiNotification3Line className="text-arc-cyan" />
                  Priority Spot Registration Waitlist
                </h4>
                <p className="text-[11px] text-white/50">
                  Enter your email address to receive immediate J.A.R.V.I.S. alerts if spot clearance seats open up on festival day.
                </p>
              </div>

              {spotRegistered ? (
                <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <RiCheckLine className="text-lg" />
                  <span>AGENT PRIORITY ALERT ACTIVE: J.A.R.V.I.S. WILL NOTIFY YOU ON SPOT CLEARANCE DAY.</span>
                </div>
              ) : (
                <form onSubmit={handleSpotWaitlist} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={spotEmail}
                    onChange={(e) => setSpotEmail(e.target.value)}
                    placeholder="agent.name@college.edu"
                    className="flex-grow px-4 py-3 bg-black/60 border border-arc-cyan/30 rounded-xl text-white text-xs focus:border-arc-cyan focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-arc-cyan hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-[0_0_15px_#00D4FF] shrink-0"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Get Alerted
                  </button>
                </form>
              )}
            </div>

            {/* Quick Action Navigation Docks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                href="/events"
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:border-arc-cyan hover:bg-arc-cyan/10 text-white/80 hover:text-arc-cyan text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <RiCompass3Line />
                <span>Browse Missions</span>
              </Link>

              <Link
                href="/schedule"
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:border-metallic-gold hover:bg-metallic-gold/10 text-white/80 hover:text-metallic-gold text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <RiCalendarLine />
                <span>View Timeline</span>
              </Link>

              <Link
                href="/contact"
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:border-marvel-red hover:bg-marvel-red/10 text-white/80 hover:text-marvel-red text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <RiMailLine />
                <span>Command Desk</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 flex items-center justify-center font-mono">
      <div className="max-w-md w-full mx-auto px-4">
        <form onSubmit={handleNext} className="marvel-card p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6 shadow-2xl relative">
          <div className="absolute top-6 right-8 text-[10px] font-bold text-metallic-gold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            Step {step} of 2
          </div>

          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Create Agent Account
            </h3>
            <p className="text-xs text-white/40">
              Register as festival delegate & competitor
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-marvel-red/20 border border-marvel-red/40 text-marvel-red text-xs rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@college.edu"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    College Name
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="MACFAST Tiruvalla"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    placeholder="Computer Applications"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 bg-[#05050A] border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-sm"
                  >
                    <option value="1">First Year (1st)</option>
                    <option value="2">Second Year (2nd)</option>
                    <option value="3">Third Year (3rd)</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-xs border-t border-white/5 pt-4">
            <span className="text-white/40">{step === 2 ? "Go back to Step 1?" : "Already registered?"}</span>
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-metallic-gold font-bold uppercase tracking-wider cursor-pointer"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Previous Step
              </button>
            ) : (
              <Link href="/signin" className="text-metallic-gold font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Sign In
              </Link>
            )}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex py-3.5 gap-2 cursor-pointer shadow-[0_0_20px_#ED1D24]">
            <span>{submitting ? "Processing..." : step === 1 ? "Next Step" : "Complete Registration"}</span>
            <RiPlayLine />
          </button>
        </form>
      </div>
    </div>
  );
}

