"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiLockPasswordLine, RiPlayLine, RiArrowLeftLine } from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", isError: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
    } else {
      setMsg({ text: "Missing reset password token. Please use a valid link.", isError: true });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: "", isError: false });

    if (!token) {
      setMsg({ text: "No token provided. Cannot reset password.", isError: true });
      return;
    }

    if (password.length < 6) {
      setMsg({ text: "Password must be at least 6 characters long.", isError: true });
      return;
    }

    if (password !== confirmPassword) {
      setMsg({ text: "Passwords do not match.", isError: true });
      return;
    }

    setSubmitting(true);
    const res = await resetPassword(token, password);
    setSubmitting(false);

    if (res.success) {
      setMsg({ text: res.message || "Password successfully reset. Redirecting...", isError: false });
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } else {
      setMsg({ text: res.message || "Reset failed. The token may be expired or invalid.", isError: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative w-full max-w-md">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-festival-gold to-festival-orange" />

      {/* Back button */}
      <Link href="/signin" className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
        <RiArrowLeftLine />
        <span>Back to Login</span>
      </Link>

      <div className="text-center md:text-left space-y-1">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
          Set New Password
        </h3>
        <p className="text-xs text-white/40">
          Enter and confirm your new account password
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
            New Password
          </label>
          <div className="relative">
            <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="password"
              required
              disabled={!token}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Confirm Password
          </label>
          <div className="relative">
            <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="password"
              required
              disabled={!token}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={submitting || !token} className="btn-primary w-full justify-center flex py-3.5 gap-2 cursor-pointer disabled:opacity-50">
        <span>{submitting ? "Resetting Password..." : "Update Password"}</span>
        <RiPlayLine />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 flex justify-center">
        <Suspense fallback={
          <div className="glass p-8 rounded-3xl border border-white/5 text-center text-white/40 text-xs uppercase tracking-wider h-[380px] flex items-center justify-center w-full">
            Extracting Reset Token...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
