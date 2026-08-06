"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RiDoubleQuotesR, RiStarFill, RiChatQuoteLine } from "react-icons/ri";

const testimonials = [
  {
    quote: "MacFiesta 2K24 was absolute fire! The gaming arena structure and stage lighting rivaled major esports setups.",
    name: "Adarsh Sen",
    college: "CET Trivandrum",
    rating: 5,
  },
  {
    quote: "Outstanding organizational structure. From registration QR passes to schedule timelines, everything was extremely seamless.",
    name: "Sneha Nair",
    college: "TKM Kollam",
    rating: 5,
  },
  {
    quote: "The concert show was legendary. I have never seen a college fest crowd so packed and energized!",
    name: "Rohan Mathew",
    college: "Sacred Heart Thevara",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative bg-[#080B14] section-padding border-t border-white/10 overflow-hidden min-h-[580px] font-mono">
      {/* Background Marvel Artwork — /MARVEL/300685712645038155.png (100% Maximum Visibility) */}
      <div className="absolute inset-0 z-0 opacity-90 pointer-events-none overflow-hidden">
        <Image
          src="/MARVEL/300685712645038155.png"
          alt="What They Say Marvel Background"
          fill
          priority
          className="object-cover object-top filter brightness-105 contrast-125 saturate-135 drop-shadow-[0_0_50px_rgba(237,29,36,0.4)] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-[#080B14]/50 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(8,11,20,0.85)_90%)] z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-marvel-red/15 blur-[140px] z-[1]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header Container */}
        <div className="text-center space-y-4 max-w-2xl mx-auto bg-black/75 backdrop-blur-md border border-white/15 p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-metallic-gold/40 bg-metallic-gold/15 text-metallic-gold text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <RiChatQuoteLine className="animate-pulse" />
            <span>S.H.I.E.L.D. AGENT BUZZ & REVIEWS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What They <span className="marvel-bang-comic-gradient font-black">Say</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="marvel-card p-8 rounded-2xl border border-white/15 bg-black/80 backdrop-blur-md flex flex-col justify-between relative shadow-2xl min-h-[260px] group hover:border-metallic-gold/50 transition-all duration-300"
            >
              <div className="absolute top-6 right-8 text-white/10 text-5xl pointer-events-none group-hover:text-metallic-gold/20 transition-colors">
                <RiDoubleQuotesR />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex gap-1 text-metallic-gold text-sm drop-shadow-[0_0_8px_#FFD700]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <RiStarFill key={i} />
                  ))}
                </div>
                <p className="text-white/90 leading-relaxed text-sm font-medium italic drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-white/15 mt-6 relative z-10">
                <span className="block font-bold text-white text-base tracking-wide uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                  {t.name}
                </span>
                <span className="block text-xs font-bold text-arc-cyan uppercase tracking-wider mt-0.5">
                  {t.college}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
