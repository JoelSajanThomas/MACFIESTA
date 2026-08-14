"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiPlayLine, RiCalendarCheckLine, RiShieldFlashLine } from "react-icons/ri";

export function RegistrationCTA() {
  return (
    <section className="relative bg-[#05050A]/60 backdrop-blur-md section-padding overflow-hidden border-t border-white/10 min-h-[480px] flex items-center justify-center">
      {/* Full Cover Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/MARVEL/658651514296997716.png"
          alt="Legends Cup Marvel Background"
          fill
          priority
          className="object-cover object-center opacity-95 filter brightness-110 contrast-125 saturate-135 scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]/40 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.75)_90%)] z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-marvel-red/20 blur-[140px] z-[1]" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 px-4">
        {/* Zoom-in glass container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-aurora border border-white/15 p-8 sm:p-12 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-8 max-w-4xl mx-auto"
        >
          {/* Limited slots badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-metallic-gold/40 bg-metallic-gold/15 text-metallic-gold text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)] font-space"
          >
            <RiCalendarCheckLine className="animate-bounce" />
            <span>LIMITED REGISTRATION SLOTS REMAINING</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Are You Ready <br />
              To Claim Your{" "}
              <span className="marvel-bang-comic-gradient font-black">Legends Cup?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/80 font-space text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            >
              {"Don't miss the chance to represent your college in technical challenges, gaming leagues, and cultural pro shows. Get your unified festival entry pass now."}
            </motion.p>
          </div>

          {/* S.H.I.E.L.D. stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 py-4 border-y border-white/10"
          >
            {[
              { label: "26+", desc: "Missions" },
              { label: "₹20L+", desc: "Prize Pool" },
              { label: "5000+", desc: "Agents" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span
                  className="block text-2xl font-black text-arc-cyan glow-text-cyan"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {stat.label}
                </span>
                <span className="block text-xs text-white/50 uppercase tracking-widest font-space">
                  {stat.desc}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Link href="/signup" className="btn-urgency px-10 py-4 group">
              <span className="relative z-10">Register Pass Now</span>
              <RiPlayLine className="group-hover:translate-x-1 transition-transform text-lg relative z-10" />
            </Link>
            <Link href="/events" className="btn-outline px-10 py-4 border-arc-cyan text-white hover:bg-arc-cyan/20">
              <RiShieldFlashLine />
              <span>Explore Categories</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
