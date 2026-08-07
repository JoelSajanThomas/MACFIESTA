"use client";

import Link from "next/link";
import { RiFileDownloadLine, RiShieldFlashLine, RiCompass3Line } from "react-icons/ri";

export default function BrochurePage() {
  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-arc-cyan/30 bg-arc-cyan/10 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase">
          <RiShieldFlashLine className="animate-pulse" />
          <span>OFFICIAL FESTIVAL DIRECTIVE • 2K26</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          MacFiesta Pro <span className="marvel-bang-comic-gradient font-black">Official Brochure</span>
        </h1>

        <p className="text-sm text-white/70 max-w-xl mx-auto">
          Download the comprehensive national festival brochure featuring event details, cash prize breakdowns, rules, schedules, and MACFAST campus map.
        </p>

        <div className="p-8 marvel-card rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-marvel-red to-rose-700 mx-auto flex items-center justify-center text-white text-3xl shadow-[0_0_20px_#ED1D24]">
            📄
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white uppercase">MacFiesta 2K26 Brochure PDF</h2>
            <p className="text-xs text-white/50">Size: 4.8 MB | High Resolution Print Edition</p>
          </div>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Downloading MacFiesta 2K26 Official Brochure PDF...");
            }}
            className="btn-primary py-3.5 px-8 text-xs font-bold uppercase inline-flex items-center justify-center gap-2 shadow-[0_0_25px_#ED1D24] w-full"
          >
            <RiFileDownloadLine className="text-lg" />
            <span>Download Official Brochure PDF</span>
          </a>
        </div>

        <div className="pt-4">
          <Link href="/" className="text-xs text-arc-cyan font-bold hover:underline inline-flex items-center gap-1">
            <RiCompass3Line />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
