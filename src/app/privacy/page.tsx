"use client";

import Link from "next/link";
import { RiShieldCheckLine, RiCompass3Line } from "react-icons/ri";

export default function PrivacyPage() {
  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
            <RiShieldCheckLine />
            <span>DATA PROTECTION DIRECTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Privacy <span className="marvel-bang-comic-gradient font-black">Policy</span>
          </h1>
          <p className="text-xs text-white/60">How MacFiesta Pro handles delegate registrations, payments, and event credentials.</p>
        </div>

        <div className="marvel-card p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6 text-xs text-white/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">1. Information Collection</h2>
            <p>We collect delegate registration details (Name, College, Email, Phone, Food Preference) solely for festival operations, QR ticket pass generation, and hospitality allocation.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">2. Payment Security</h2>
            <p>All online transaction fees are processed securely via SSL-encrypted payment gateways. MacFiesta Pro does not store raw credit card numbers or banking PINs.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase">3. Data Sharing & Security</h2>
            <p>Delegate data is strictly confidential and shared only with event coordinators and security checkpoints inside MACFAST campus for verification.</p>
          </section>
        </div>

        <div className="text-center pt-4">
          <Link href="/" className="text-xs text-arc-cyan font-bold hover:underline inline-flex items-center gap-1">
            <RiCompass3Line />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
