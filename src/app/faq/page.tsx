"use client";

import { getFaqsList, FaqItem } from "@/lib/festivalStore";
import Link from "next/link";
import { RiQuestionAnswerLine, RiCompass3Line } from "react-icons/ri";

export default function FaqPage() {
  const faqs = getFaqsList();

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-arc-cyan/30 bg-arc-cyan/10 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase">
            <RiQuestionAnswerLine />
            <span>JARVIS KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Frequently Asked <span className="marvel-bang-comic-gradient font-black">Questions</span>
          </h1>
          <p className="text-xs text-white/60">Find answers regarding eligibility, hospitality, registrations, and prize claims.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f: FaqItem) => (
            <div key={f.id} className="marvel-card p-6 rounded-2xl border border-white/10 space-y-2 bg-[#0A0D1A]">
              <span className="text-[10px] font-bold text-arc-cyan uppercase tracking-widest">{f.category}</span>
              <h3 className="text-base font-bold text-white uppercase">{f.question}</h3>
              <p className="text-xs text-white/70 leading-relaxed">{f.answer}</p>
            </div>
          ))}
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
