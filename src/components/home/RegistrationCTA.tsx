"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RiPlayLine, RiCalendarCheckLine } from "react-icons/ri";

export function RegistrationCTA() {
  return (
    <section className="relative bg-festival-dark section-padding overflow-hidden border-t border-white/5">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-festival-purple/10 via-festival-pink/5 to-festival-gold/10 opacity-60 z-0 pointer-events-none" />
      
      {/* Pulsing neon sphere backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-festival-purple/10 blur-[150px] z-0 pointer-events-none animate-glow-pulse" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-festival-gold/30 bg-festival-gold/5 text-festival-gold text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <RiCalendarCheckLine className="animate-bounce" />
          <span>Limited Seats Remaining</span>
        </motion.div>

        <div className="space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Are You Ready <br />
            To Claim Your <span className="gradient-text-gold neon-gold">Legends Cup?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/60 text-sm md:text-base max-w-2xl mx-auto"
          >
            Don't miss the chance to represent your college in technical challenges, gaming leagues, and cultural pro shows. Get your unified festival entry pass now.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Link href="/signup" className="btn-primary px-10 py-4 group">
            <span>Register Pass Now</span>
            <RiPlayLine className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/events" className="btn-outline px-10 py-4">
            <span>Explore Categories</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
