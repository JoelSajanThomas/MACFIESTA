"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FESTIVAL_CONFIG } from "@/lib/constants";
import { RiUserLocationLine, RiPlayLine, RiArrowLeftLine } from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

export default function ForgotPasswordPage() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ text: "", isError: false });
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative h-[380px] flex items-center justify-center">
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Portal...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: "", isError: false });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg({ text: "Please enter a valid email address.", isError: true });
      return;
    }

    setSubmitting(true);
    const res = await forgotPassword(email);
    setSubmitting(false);

    if (res.success) {
      setMsg({ text: res.message || "A recovery link has been generated and sent.", isError: false });
    } else {
      setMsg({ text: res.message || "An error occurred. Try again.", isError: true });
    }
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-festival-gold to-festival-orange" />

          {/* Back button */}
          <Link href="/signin" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            <RiArrowLeftLine />
            <span>Back to Login</span>
          </Link>

          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Recover Password
            </h3>
            <p className="text-xs text-white/40">
              Enter your email address to receive a verification reset link
            </p>
          </div>

          {msg.text && (
            <div className={`p-3 border text-xs rounded-xl text-center ${
              msg.isError ? "bg-festival-pink/15 border-festival-pink/30 text-festival-pink" : "bg-festival-cyan/15 border-festival-cyan/30 text-festival-cyan"
            }`}>
              {msg.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Email Address
              </label>
              <div className="relative">
                <RiUserLocationLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex py-3.5 gap-2 cursor-pointer">
            <span>{submitting ? "Sending Link..." : "Request Reset Link"}</span>
            <RiPlayLine />
          </button>
        </form>

      </div>
    </div>
  );
}
