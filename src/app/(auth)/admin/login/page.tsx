"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiPlayLine, RiLockPasswordLine, RiUserSettingsLine } from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const adminLogin = useAuthStore((state) => state.adminLogin);
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [otp, setOtp] = useState("");
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
          <div className="glass p-8 rounded-3xl border border-festival-pink/30 space-y-6 shadow-2xl relative h-[480px] flex items-center justify-center">
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Console...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    // Simple numeric 2FA checks (6 digits validation)
    if (otp.length !== 6 || isNaN(Number(otp))) {
      setErrorMsg("Invalid 2FA token. Please enter a 6-digit numeric token.");
      setSubmitting(false);
      return;
    }

    const res = await adminLogin(user, pwd, otp);
    setSubmitting(false);

    if (res.success) {
      const userObj = useAuthStore.getState().user;
      if (userObj && userObj.role === "admin") {
router.push("/admin/console");
    return;
      } else {
        useAuthStore.getState().logout();
        setErrorMsg("Access denied: You do not have administrator privileges.");
      }
    } else {
      setErrorMsg(res.message || "Invalid administrator credentials.");
    }
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">

        <form onSubmit={handleAdminLogin} autoComplete="off" className="glass p-8 rounded-3xl border border-festival-pink/30 space-y-6 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-festival-purple to-festival-pink" />

          <div className="text-center space-y-2">
            <div className="text-festival-pink text-4xl mx-auto p-3 bg-white/5 rounded-full w-fit">
              <RiUserSettingsLine />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Admin Console
            </h3>
            <p className="text-xs text-white/40">
              Authorized personnel secure authentication access
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
                Admin Email
              </label>
              <input
                type="email"
                required
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="admin@macfast.org"
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-pink/50 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Key Password
              </label>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-pink/50 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-white/50 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Two-Factor Token (2FA)
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-pink/50 focus:outline-none text-white text-sm text-center font-bold tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center flex py-3.5 gap-2 bg-gradient-to-r from-festival-purple to-festival-pink hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>{submitting ? "Verifying Credentials..." : "Login Console"}</span>
            <RiPlayLine />
          </button>
        </form>

      </div>
    </div>
  );
}
