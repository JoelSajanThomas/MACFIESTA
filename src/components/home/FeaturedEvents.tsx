"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiTrophyLine, RiMapPinLine, RiTimeLine, RiFlashlightLine } from "react-icons/ri";

const featured = [
  {
    title: "Iron Man Code Warfare 24H Hackathon",
    category: "Technical Mission",
    hero: "Iron Man",
    power: "Power Rating: 98/100",
    level: "Level: Alpha",
    prize: "₹35,000",
    venue: "Stark Labs / Main Hall",
    time: "Day 1, 10:00 AM",
    image: "/MARVEL/4081455907815375.png",
    heroAvatar: "/MARVEL/4081455907815375.png",
    link: "/events/byte-and-code",
    border: "border-marvel-red/40 hover:border-marvel-red",
    glow: "hover:shadow-[0_0_35px_rgba(237,29,36,0.4)]",
    themeColor: "from-marvel-red/30 to-metallic-gold/10",
    badgeBg: "bg-marvel-red/80 text-white shadow-[0_0_12px_#ED1D24]",
  },
  {
    title: "Thor Gaming Arena (BGMI & Valorant)",
    category: "Gaming Mission",
    hero: "Thor Mjolnir",
    power: "Power Rating: 99/100",
    level: "Level: Grand Finale",
    prize: "₹40,000",
    venue: "Asgard Esports Hall",
    time: "Day 1, 11:30 AM",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    heroAvatar: "/MARVEL/3025924746959430.jpg",
    link: "/events/urumi-gaming",
    border: "border-arc-cyan/40 hover:border-arc-cyan",
    glow: "hover:shadow-[0_0_35px_rgba(0,212,255,0.4)]",
    themeColor: "from-arc-cyan/30 to-blue-600/10",
    badgeBg: "bg-arc-cyan/90 text-black shadow-[0_0_12px_#00D4FF]",
  },
  {
    title: "Sanctum Cultural Pro-Show",
    category: "Cultural Mission",
    hero: "Doctor Strange",
    power: "Power Rating: 100/100",
    level: "Level: Supreme",
    prize: "Trophy & Pro-Show",
    venue: "Main Stage Arena",
    time: "Day 2, 6:00 PM",
    image: "/MARVEL/Doctor Strange.png",
    heroAvatar: "/MARVEL/Doctor Strange.png",
    link: "/events/dusk-n-dawn",
    border: "border-metallic-gold/40 hover:border-metallic-gold",
    glow: "hover:shadow-[0_0_35px_rgba(255,215,0,0.4)]",
    themeColor: "from-metallic-gold/30 to-amber-600/10",
    badgeBg: "bg-metallic-gold text-black shadow-[0_0_12px_#FFD700]",
  },
  {
    title: "Spider-Man Quantum Coding Combat",
    category: "General Mission",
    hero: "Spider-Man",
    power: "Power Rating: 97/100",
    level: "Level: Web-Tech",
    prize: "₹25,000",
    venue: "S.H.I.E.L.D. Lab 2",
    time: "Day 1, 02:00 PM",
    image: "/MARVEL/Spider-man.png",
    heroAvatar: "/MARVEL/Spider-man.png",
    link: "/events",
    border: "border-marvel-red/40 hover:border-marvel-red",
    glow: "hover:shadow-[0_0_35px_rgba(237,29,36,0.4)]",
    themeColor: "from-marvel-red/30 to-arc-cyan/10",
    badgeBg: "bg-marvel-red text-white shadow-[0_0_12px_#ED1D24]",
  },
];

export function FeaturedEvents() {
  return (
    <section className="relative bg-[#05050A] section-padding border-t border-arc-cyan/10 overflow-hidden">
      {/* Background Marvel 3025924746959430.jpg Wallpaper & Dynamic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/MARVEL/3025924746959430.jpg"
          alt="Featured Missions Marvel Background"
          fill
          className="object-cover object-center opacity-85 filter brightness-105 contrast-120 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/70 via-[#05050A]/50 to-[#05050A]/90" />
      </div>



      {/* Ambient Marvel background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full bg-marvel-red/5 blur-[130px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-arc-cyan text-xs font-mono font-bold tracking-[0.25em] uppercase flex items-center gap-1.5"
            >
              <RiFlashlightLine /> S.H.I.E.L.D. TOP MISSIONS
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title text-white uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Featured <span className="marvel-bang-comic-gradient font-black">Missions</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/events"
              className="btn-outline border-arc-cyan/40 text-xs px-6 py-3 flex items-center gap-2 tracking-widest uppercase hover:bg-arc-cyan/10 text-white font-mono"
            >
              View All 26 Missions
              <RiArrowRightLine />
            </Link>
          </motion.div>
        </div>

        {/* Featured cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`marvel-card group overflow-hidden rounded-2xl flex flex-col justify-between h-[520px] relative border ${item.border} ${item.glow}`}
            >
              {/* Cover Image Header with Character Art */}
              <div className="relative h-48 w-full overflow-hidden bg-black/80">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1A] via-black/30 to-transparent z-10" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-90 filter brightness-110 contrast-125"
                />

                {/* Hero Badge */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                  <span className={`px-3 py-1 text-[9px] font-mono font-extrabold tracking-widest uppercase rounded-md ${item.badgeBg}`}>
                    🦸 {item.hero}
                  </span>
                  <span className="px-2.5 py-0.5 text-[8px] font-mono text-arc-cyan bg-black/80 rounded border border-arc-cyan/30">
                    {item.power}
                  </span>
                </div>
              </div>

              {/* Mission Details & Character Image Overlay */}
              <div className="p-6 flex-grow flex flex-col justify-between bg-[#0A0D1A] relative z-20 font-mono">
                {/* Floating Superhero Character Image Inside Card */}
                <div className="absolute -top-10 right-4 z-30 w-20 h-20 rounded-2xl border-2 border-white/20 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] bg-black/80 group-hover:scale-110 group-hover:border-arc-cyan transition-all duration-300">
                  <Image
                    src={item.heroAvatar}
                    alt={`${item.hero} Character`}
                    fill
                    className="object-contain p-1 filter brightness-115 contrast-125"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[10px] text-white/50 pr-20">
                    <span className="text-metallic-gold uppercase font-bold">{item.category}</span>
                    <span className="text-arc-cyan font-bold">{item.level}</span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-metallic-gold transition-colors duration-300 tracking-wide uppercase leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <RiTrophyLine className="text-metallic-gold text-base" />
                      <span>Reward Pool: <strong className="text-white">{item.prize}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiMapPinLine className="text-arc-cyan text-base" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RiTimeLine className="text-marvel-red text-base" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link href={item.link} className="text-xs font-bold text-arc-cyan hover:text-white transition-colors tracking-widest uppercase flex items-center gap-1">
                    Mission Briefing
                    <RiArrowRightLine />
                  </Link>
                  <Link href="/signup" className="text-xs font-bold text-white bg-marvel-red hover:bg-white hover:text-black px-4 py-2 rounded-full transition-all uppercase tracking-widest shadow-[0_0_10px_#ED1D24]">
                    Join Mission
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

