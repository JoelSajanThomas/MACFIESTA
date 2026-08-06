"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RiPlayLine, RiLockLine } from "react-icons/ri";
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

  const [spotEmail, setSpotEmail] = useState("");
  const [spotCollege, setSpotCollege] = useState("");
  const [spotSent, setSpotSent] = useState(false);
  const [spotSending, setSpotSending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative h-[480px] flex items-center justify-center">
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Portal...</div>
          </div>
        </div>
      </div>
    );
  }


  const handleSendSpotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotEmail) return;
    setSpotSending(true);
    setTimeout(() => {
      setSpotSending(false);
      setSpotSent(true);
    }, 1200);
  };

  // If Admin closed registration, show the Marvel S.H.I.E.L.D. Lockdown Screen
  if (!settings.registrationOpen) {
    return (
      <div className="bg-[#05050A] min-h-screen pt-28 pb-16 flex items-center justify-center font-mono relative overflow-hidden text-white">
        {/* Background Alert Pulse */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(237,29,36,0.15),transparent_70%)] animate-pulse pointer-events-none" />
        
        {/* Ambient Neon HUD Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-marvel-red/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full mx-auto px-4 relative z-10 space-y-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="stark-panel p-8 md:p-10 rounded-3xl border border-marvel-red/40 bg-black/85 backdrop-blur-xl space-y-8 text-center shadow-[0_0_50px_rgba(237,29,36,0.3)] relative"
          >
            {/* Corner HUD Markers */}
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-marvel-red rounded-tl" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-marvel-red rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-arc-cyan rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-arc-cyan rounded-br" />

            {/* Glowing Lock Reactor Badge */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-marvel-red border-t-transparent animate-spin shadow-[0_0_30px_#ED1D24]" />
              <div className="w-18 h-18 bg-marvel-red/20 border border-marvel-red rounded-full flex items-center justify-center text-marvel-red text-4xl shadow-[0_0_20px_#ED1D24]">
                <RiLockLine />
              </div>
            </div>

            {/* Directive Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-marvel-red/50 bg-marvel-red/10 text-marvel-red text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(237,29,36,0.3)]">
                PROTOCOL RED • COMMAND LOCKDOWN
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Recruitment Vault Sealed
              </h1>
              <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
                S.H.I.E.L.D. Admin Command has officially concluded delegate registration for MACFIESTA 2K26. All agent recruitment queues have been locked.
              </p>
            </div>

            {/* Telemetry Terminal */}
            <div className="bg-black/80 border border-white/10 p-4 rounded-2xl text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40 uppercase text-[10px]">Lockdown Directive:</span>
                <span className="font-bold text-marvel-red">LEVEL 5 PROTOCOL ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40 uppercase text-[10px]">Authorization:</span>
                <span className="text-metallic-gold font-bold">S.H.I.E.L.D. DIRECTORS ONLY</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 uppercase text-[10px]">Spot Registration:</span>
                <span className="text-arc-cyan font-bold">DESK CLEARANCE AT VENUE</span>
              </div>
            </div>

            {/* Emergency Priority Beacon Signal Form */}
            {!spotSent ? (
              <form onSubmit={handleSendSpotRequest} className="space-y-3 pt-2 text-left">
                <label className="block text-[11px] font-bold text-arc-cyan uppercase tracking-wider">
                  Request Emergency Spot Entry Signal:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={spotEmail}
                    onChange={(e) => setSpotEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-arc-cyan/30 rounded-xl text-white text-xs focus:border-arc-cyan focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={spotSending}
                    className="px-5 py-2.5 bg-marvel-red hover:bg-white hover:text-black text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_#ED1D24] cursor-pointer shrink-0"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {spotSending ? "Dispatching..." : "Transmit Signal"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 text-xs font-bold space-y-1">
                <div>✓ Priority Signal Transmitted to J.A.R.V.I.S. Command Desk!</div>
                <div className="text-[10px] text-white/60 font-normal">Our team will contact ({spotEmail}) if spot vacancies open.</div>
              </div>
            )}

            {/* Actions & Navigation */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/events"
                className="py-3 px-4 bg-white/5 hover:bg-arc-cyan/20 border border-arc-cyan/30 text-arc-cyan rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Browse Missions
              </Link>
              <Link
                href="/signin"
                className="py-3 px-4 bg-metallic-gold hover:bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Agent Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (step === 1) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }

      // Validate phone format
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

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">

        <form onSubmit={handleNext} className="glass p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative">
          {/* Step indicator */}
          <div className="absolute top-6 right-8 text-[10px] font-bold text-festival-gold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            Step {step} of 2
          </div>

          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Create Account
            </h3>
            <p className="text-xs text-white/40">
              Register as festival attendee and competitor
            </p>
          </div>

          {!settings.registrationOpen && (
            <div className="p-3 bg-marvel-red/20 border border-marvel-red/40 text-marvel-red text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
              <RiLockLine className="text-base shrink-0" />
              <span>RECRUITMENT CLOSED: S.H.I.E.L.D. Command HQ has officially closed registration.</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-festival-pink/15 border border-festival-pink/30 text-festival-pink text-xs rounded-xl text-center">
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                  >
                    <option value="1" className="bg-festival-dark-card">First Year (1st)</option>
                    <option value="2" className="bg-festival-dark-card">Second Year (2nd)</option>
                    <option value="3" className="bg-festival-dark-card">Third Year (3rd)</option>
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
                className="text-festival-gold font-bold uppercase tracking-wider cursor-pointer"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Previous Step
              </button>
            ) : (
              <Link href="/signin" className="text-festival-gold font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Sign In
              </Link>
            )}
          </div>

          {!settings.registrationOpen ? (
            <button type="button" disabled className="btn-outline w-full justify-center flex py-3.5 gap-2 border-marvel-red/40 bg-marvel-red/10 text-marvel-red font-bold uppercase cursor-not-allowed">
              <RiLockLine />
              <span>REGISTRATION CLOSED BY COMMAND</span>
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex py-3.5 gap-2 cursor-pointer">
              <span>{submitting ? "Processing..." : step === 1 ? "Next Step" : "Complete Registration"}</span>
              <RiPlayLine />
            </button>
          )}

        </form>

      </div>
    </div>
  );
}

