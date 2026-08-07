"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useFestivalControl } from "@/lib/festivalStore";

export function SponsorsSection() {
  const { sponsors } = useFestivalControl();
  const activeSponsors = sponsors.filter((s) => s.active);

  return (
    <section className="relative bg-[#05050A] section-padding border-t border-metallic-gold/20 overflow-hidden font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-metallic-gold text-xs font-bold tracking-[0.2em] uppercase"
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
          Sponsors & <span className="marvel-bang-comic-gradient font-black">Partners</span>
        </motion.h2>
      </div>

      {/* Marquee ticker container */}
      <div className="w-full relative overflow-hidden py-4">
        {/* Shadow overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#05050A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#05050A] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-ticker whitespace-nowrap gap-6">
          {Array.from({ length: 3 }).map((_, repeatIdx) => (
            <div key={repeatIdx} className="flex gap-6 items-center">
              {activeSponsors.map((partner, idx) => (
                <a
                  key={`${partner.id}-${idx}`}
                  href={partner.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="marvel-card flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-white/10 min-w-[200px] hover:border-metallic-gold/50 transition-all cursor-pointer"
                >
                  <span className="text-xl">⭐</span>
                  <div>
                    <span className="text-white text-xs font-bold uppercase block tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                      {partner.name}
                    </span>
                    <span className="text-[9px] text-metallic-gold uppercase tracking-widest font-extrabold block">
                      {partner.tier}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
