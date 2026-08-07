"use client";

import Link from "next/link";
import { RiShieldFlashLine, RiCompass3Line } from "react-icons/ri";

export default function RulesPage() {
  const rules = [
    "All delegates must carry valid college photo ID cards at all times.",
    "Decisions of judges and festival coordinators are final and binding across all competitions.",
    "Smoking, alcohol, and contraband are strictly prohibited on MACFAST campus premises.",
    "Delegates must report to competition venues at least 15 minutes before scheduled start time.",
    "Damage to campus or venue equipment will result in immediate disqualification and liability.",
  ];

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-marvel-red/30 bg-marvel-red/10 text-marvel-red text-xs font-mono font-bold tracking-widest uppercase">
            <RiShieldFlashLine />
            <span>S.H.I.E.L.D. PROTOCOL DIRECTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Protocol <span className="marvel-bang-comic-gradient font-black">Rulebook</span>
          </h1>
          <p className="text-xs text-white/60">Official code of conduct & general festival regulations for MacFiesta 2K26.</p>
        </div>

        <div className="marvel-card p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
          <h2 className="text-sm font-bold text-metallic-gold uppercase tracking-wider">General Festival Guidelines</h2>
          <div className="space-y-3 text-xs">
            {rules.map((rule, idx) => (
              <div key={idx} className="p-4 bg-black/40 border border-white/10 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-marvel-red/20 text-marvel-red font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-white/80 leading-relaxed pt-0.5">{rule}</p>
              </div>
            ))}
          </div>
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
