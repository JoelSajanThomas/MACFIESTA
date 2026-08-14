"use client";

import { useRef } from "react";
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
    glow: "hover:shadow-[0_0_40px_rgba(237,29,36,0.45)]",
    themeColor: "from-marvel-red/30 to-metallic-gold/10",
    badgeBg: "bg-marvel-red/80 text-white shadow-[0_0_12px_#ED1D24]",
    accentColor: "#ED1D24",
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
    glow: "hover:shadow-[0_0_40px_rgba(0,212,255,0.45)]",
    themeColor: "from-arc-cyan/30 to-blue-600/10",
    badgeBg: "bg-arc-cyan/90 text-black shadow-[0_0_12px_#00D4FF]",
    accentColor: "#00D4FF",
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
    glow: "hover:shadow-[0_0_40px_rgba(255,215,0,0.45)]",
    themeColor: "from-metallic-gold/30 to-amber-600/10",
    badgeBg: "bg-metallic-gold text-black shadow-[0_0_12px_#FFD700]",
    accentColor: "#D4AF37",
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
    glow: "hover:shadow-[0_0_40px_rgba(237,29,36,0.45)]",
    themeColor: "from-marvel-red/30 to-arc-cyan/10",
    badgeBg: "bg-marvel-red text-white shadow-[0_0_12px_#ED1D24]",
    accentColor: "#ED1D24",
  },
];

/* ─── 3D Tilt Card ─── */
function TiltCard({ item, idx }: { item: typeof featured[0]; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  };

  const handleMouseEnter = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.1s ease";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`group overflow-hidden rounded-2xl flex flex-col h-[480px] relative border bg-[#0A0D1A]/90 backdrop-blur-md ${item.border} ${item.glow} transition-[border-color,box-shadow] duration-300 cursor-pointer`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 z-20"
          style={{ background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)` }}
        />

        {/* Cover Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-black/80 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1A] via-black/30 to-transparent z-10" />
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-90 filter brightness-110 contrast-125"
          />

          {/* Hero Badge */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
            <span className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-md font-space ${item.badgeBg}`}>
              🦸 {item.hero}
            </span>
            <span className="px-2.5 py-0.5 text-[8px] font-space text-arc-cyan bg-black/80 rounded border border-arc-cyan/30">
              {item.power}
            </span>
          </div>

          {/* Spotlight sweep on hover */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </div>

        {/* Mission Details */}
        <div className="p-6 flex-grow flex flex-col justify-between bg-[#0A0D1A] relative z-20">
          {/* Floating Avatar */}
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
              <span className="text-metallic-gold uppercase font-bold font-space">{item.category}</span>
              <span className="text-arc-cyan font-bold font-space">{item.level}</span>
            </div>

            <h3
              className="text-base font-black text-white group-hover:text-metallic-gold transition-colors duration-300 tracking-wide uppercase leading-snug"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {item.title}
            </h3>

            <div className="space-y-1.5 text-xs text-white/60 font-space">
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
            <Link
              href={item.link}
              className="text-xs font-bold text-arc-cyan hover:text-white transition-colors tracking-widest uppercase flex items-center gap-1 font-space"
            >
              Mission Briefing
              <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/signup"
              className="text-xs font-bold text-white bg-marvel-red hover:bg-white hover:text-black px-4 py-2 rounded-full transition-all uppercase tracking-widest shadow-[0_0_10px_#ED1D24] font-space"
            >
              Join Mission
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedEvents() {
  return (
    <section className="relative bg-[#05050A]/60 backdrop-blur-md section-padding border-t border-arc-cyan/10 overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-transparent to-[#05050A]/60 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full bg-marvel-red/5 blur-[130px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-arc-cyan text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 font-space"
            >
              <RiFlashlightLine /> S.H.I.E.L.D. TOP MISSIONS
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title text-white uppercase"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Featured{" "}
              <span className="marvel-bang-comic-gradient font-black">Missions</span>
            </motion.h2>
            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-0.5 w-24 bg-gradient-to-r from-marvel-red to-arc-cyan origin-left"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/events"
              className="btn-outline border-arc-cyan/40 text-xs px-6 py-3 flex items-center gap-2 tracking-widest uppercase hover:bg-arc-cyan/10 text-white font-space"
            >
              View All 26 Missions
              <RiArrowRightLine />
            </Link>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item, idx) => (
            <TiltCard key={item.title} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
