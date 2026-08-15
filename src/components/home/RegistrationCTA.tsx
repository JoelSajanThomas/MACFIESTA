"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiPlayLine, RiCalendarCheckLine, RiShieldFlashLine } from "react-icons/ri";
import { Reveal } from "@/components/ui/Reveal";

export function RegistrationCTA() {
  return (
    <section className="relative bg-transparent section-padding overflow-hidden border-t border-white/10 min-h-[480px] flex items-center justify-center">
      {/* Background Marvel Artwork Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-90">
        <Image
          src="/MARVEL/658651514296997716.png"
          alt="Legends Cup Marvel Background"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-125 saturate-135"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A]/70 via-transparent to-[#05050A]/60 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.65)_90%)] z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-marvel-red/20 blur-[140px] z-[1]" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 px-4">
        {/* Zoom-in glass container */}
        <Reveal y={60} duration={0.7} margin="-100px">
          <div className="glass-aurora border border-white/15 p-6 sm:p-12 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-8 max-w-4xl mx-auto">
            {/* Limited slots badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-metallic-gold/40 bg-metallic-gold/15 text-metallic-gold text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)] font-space"
            >
              <RiCalendarCheckLine className="animate-bounce" />
              <span>LIMITED REGISTRATION SLOTS REMAINING</span>
            </div>

            <div className="space-y-4">
              <h2
                className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight font-anton"
              >
                Are You Ready <br />
                To Claim Your{" "}
                <span className="shimmer-text">Legends</span>{" "}
                <span className="gradient-text-plasma">Cup?</span>
              </h2>

              <p
                className="text-white/85 font-space text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal"
              >
                {"Don't miss the chance to represent your college in technical challenges, gaming leagues, and cultural pro shows. Get your unified festival entry pass now."}
              </p>
            </div>

            {/* S.H.I.E.L.D. stats bar */}
            <div
              className="flex flex-wrap justify-center gap-6 sm:gap-8 py-4 border-y border-white/10"
            >
              {[
                { label: "26+", desc: "Missions" },
                { label: "₹20L+", desc: "Prize Pool" },
                { label: "5000+", desc: "Agents" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span
                    className="block text-2xl sm:text-3xl font-black text-arc-cyan glow-text-cyan font-anton"
                  >
                    {stat.label}
                  </span>
                  <span className="block text-xs text-white/60 uppercase tracking-[0.16em] font-space">
                    {stat.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2 w-full"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Link href="/signup" className="btn-urgency w-full sm:w-auto px-8 sm:px-10 py-4 group font-space flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(237,29,36,0.5)] hover:shadow-[0_0_40px_rgba(237,29,36,0.8)] transition-shadow duration-300">
                  <span className="relative z-10 font-bold tracking-[0.16em] uppercase">Register Pass Now</span>
                  <RiPlayLine className="group-hover:translate-x-1 transition-transform text-lg relative z-10" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Link href="/events" className="btn-outline w-full sm:w-auto px-8 sm:px-10 py-4 border-arc-cyan text-white hover:bg-arc-cyan/20 font-space flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-shadow duration-300">
                  <RiShieldFlashLine />
                  <span className="font-bold tracking-[0.16em] uppercase">Explore Categories</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
