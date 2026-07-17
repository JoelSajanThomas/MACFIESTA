"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RiPlayLine } from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

export default function SignUpPage() {
  const router = useRouter();
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

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex py-3.5 gap-2 cursor-pointer">
            <span>{submitting ? "Processing..." : step === 1 ? "Next Step" : "Complete Registration"}</span>
            <RiPlayLine />
          </button>
        </form>

      </div>
    </div>
  );
}
