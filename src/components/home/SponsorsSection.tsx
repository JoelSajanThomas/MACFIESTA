"use client";

import { motion } from "framer-motion";

const partners = [
  { name: "Partner One", tier: "platinum", logo: "🤝" },
  { name: "Partner Two", tier: "platinum", logo: "⭐" },
  { name: "Partner Three", tier: "gold", logo: "🏆" },
  { name: "Partner Four", tier: "gold", logo: "💎" },
  { name: "Partner Five", tier: "silver", logo: "🎨" },
  { name: "Partner Six", tier: "silver", logo: "⚡" },
];

export function SponsorsSection() {
  return (
    <section className="relative bg-festival-dark py-16 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-festival-gold text-xs font-bold tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Valued Collaboration
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Sponsors & <span className="gradient-text-gold">Partners</span>
        </motion.h2>
      </div>

      {/* Marquee ticker container */}
      <div className="w-full relative overflow-hidden py-4">
        {/* Shadow overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-festival-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-festival-dark to-transparent z-10 pointer-events-none" />

        <div className="flex animate-ticker whitespace-nowrap gap-6">
          {Array.from({ length: 4 }).map((_, repeatIdx) => (
            <div key={repeatIdx} className="flex gap-6 items-center">
              {partners.map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="glass flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-white/5 min-w-[200px]"
                >
                  <span className="text-3xl">{partner.logo}</span>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                      {partner.name}
                    </span>
                    <span className={`block text-[9px] uppercase tracking-widest ${
                      partner.tier === "platinum" ? "text-white/60" :
                      partner.tier === "gold" ? "text-festival-gold" : "text-white/30"
                    }`} style={{ fontFamily: "var(--font-heading)" }}>
                      {partner.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
