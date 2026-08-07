"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiPlayLine, RiCalendarCheckLine } from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";


export function RegistrationCTA() {
  const { settings } = useFestivalControl();

  return (
    <section className="relative bg-[#05050A] section-padding overflow-hidden border-t border-white/10 min-h-[480px] flex items-center justify-center">
      {/* Full Cover Background Image — /MARVEL/658651514296997716.png (Maximum Visibility) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/MARVEL/658651514296997716.png"
          alt="Legends Cup Marvel Background"
          fill
          priority
          className="object-cover object-center opacity-95 filter brightness-110 contrast-125 saturate-135 drop-shadow-[0_0_50px_rgba(237,29,36,0.4)] scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]/40 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.75)_90%)] z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-marvel-red/20 blur-[140px] z-[1]" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8 px-4">
        {/* Glass Container Card */}
        <div className="bg-black/75 backdrop-blur-md border border-white/15 p-8 sm:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-metallic-gold/40 bg-metallic-gold/15 text-metallic-gold text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <RiCalendarCheckLine className="animate-bounce" />
            <span>{settings.registrationOpen ? "REGISTRATION SLOTS OPEN" : "REGISTRATION CLOSED"}</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Are You Ready <br />
              To Claim Your <span className="marvel-bang-comic-gradient font-black">{settings.motto || "Legends Cup"}?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white font-medium text-sm md:text-base max-w-2xl mx-auto font-mono drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
            >
              {settings.tagline || "Don't miss the chance to represent your college in technical challenges, gaming leagues, and cultural pro shows. Get your unified festival entry pass now."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <Link href="/signup" className="btn-primary px-10 py-4 group shadow-[0_0_30px_#ED1D24]">
              <span>{settings.registrationOpen ? "Register Pass Now" : "View Schedule"}</span>
              <RiPlayLine className="group-hover:translate-x-1 transition-transform text-lg" />
            </Link>

            <Link href="/events" className="btn-outline px-10 py-4 border-arc-cyan text-white hover:bg-arc-cyan/20">
              <span>Explore Categories</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
