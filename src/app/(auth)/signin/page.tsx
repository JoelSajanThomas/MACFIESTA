"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FESTIVAL_CONFIG } from "@/lib/constants";
import { RiLockPasswordLine, RiUserLocationLine, RiPlayLine } from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

export default function SignInPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      // Check role of user to decide redirect
      const userObj = useAuthStore.getState().user;
      if (userObj && userObj.role === "admin") {
        useAuthStore.getState().logout();
        setErrorMsg("Administrators must log in through the admin console portal.");
      } else {
        router.push("/dashboard");
      }
    } else {
      setErrorMsg(res.message || "Invalid credentials");
    }
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left wing - branding and logo panel */}
        <div className="md:col-span-6 text-center md:text-left space-y-6 hidden md:block">
          <div className="relative w-36 h-36 mx-auto md:mx-0">
            <Image
              src={FESTIVAL_CONFIG.logoUrl}
              alt={`${FESTIVAL_CONFIG.name} Logo`}
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="gradient-text-gold">{FESTIVAL_CONFIG.name}</span> Portal
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Log in to retrieve your entry pass QR tickets, certificates verification badge and live scoreboard feeds.
            </p>
          </div>
        </div>

        {/* Right wing - login form */}
        <div className="md:col-span-6 w-full max-w-md mx-auto">
          <form onSubmit={handleLogin} className="glass p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative">
            {/* Ember particles decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-festival-gold/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="text-center md:text-left space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Sign In
              </h3>
              <p className="text-xs text-white/40">
                Enter your credentials to manage registrations
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-festival-pink/15 border border-festival-pink/30 text-festival-pink text-xs rounded-xl text-center">
                {errorMsg}
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

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Password
                </label>
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Not registered?</span>
              <Link href="/signup" className="text-festival-gold hover:text-white transition-colors font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                Create Account
              </Link>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex py-3.5 gap-2 cursor-pointer">
              <span>{submitting ? "Checking credentials..." : "Login Portal"}</span>
              <RiPlayLine />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
