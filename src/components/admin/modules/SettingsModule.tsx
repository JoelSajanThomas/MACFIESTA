"use client";

import { useState } from "react";
import { RiSettings4Line, RiLockPasswordLine, RiSaveLine } from "react-icons/ri";

export function SettingsModule() {
  const [jwtSecret, setJwtSecret] = useState("mf_production_jwt_secret_key_2026");

  return (
    <div className="space-y-6 select-none">
      <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            System & Operations Global Settings
          </h2>
          <p className="text-xs text-white/40">Configure JWT security, Razorpay gateway, SMTP mail, SMS API keys, and system backups</p>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-white/10 space-y-4 max-w-2xl text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
          Security & Authentication Control
        </h3>
        <div>
          <label className="block text-white/60 font-bold mb-1">JWT Secret Signing Key</label>
          <input
            type="password"
            value={jwtSecret}
            onChange={(e) => setJwtSecret(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
          />
        </div>
        <button onClick={() => alert("Settings saved!")} className="btn-primary text-xs flex items-center gap-2 px-4 py-2 rounded-xl mt-4 cursor-pointer">
          <RiSaveLine size={16} /> Save Security Keys
        </button>
      </div>
    </div>
  );
}
