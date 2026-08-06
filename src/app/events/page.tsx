"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/lib/constants";
import { RiSearchLine, RiTrophyLine, RiMapPinLine, RiArrowRightLine, RiTimeLine, RiShieldFlashLine, RiFlashlightLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { Event } from "@/types";

const HERO_MAPPING: Record<string, { hero: string; level: string; power: string; image: string; avatar: string }> = {
  "urumi-gaming": { hero: "Thor Mjolnir", level: "Level: Mjolnir", power: "Power: 99/100", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop", avatar: "/MARVEL/3025924746959430.jpg" },
  "dusk-n-dawn": { hero: "Doctor Strange", level: "Level: Supreme", power: "Power: 100/100", image: "/MARVEL/Doctor Strange.png", avatar: "/MARVEL/Doctor Strange.png" },
  "byte-and-code": { hero: "Iron Man", level: "Level: Alpha", power: "Power: 98/100", image: "/MARVEL/4081455907815375.png", avatar: "/MARVEL/4081455907815375.png" },
  "spider-coding": { hero: "Spider-Man", level: "Level: Quantum", power: "Power: 96/100", image: "/MARVEL/Spider-man.png", avatar: "/MARVEL/Spider-man.png" },
  "black-widow-stealth": { hero: "Black Widow", level: "Level: Covert", power: "Power: 95/100", image: "/MARVEL/61080138757668761.png", avatar: "/MARVEL/61080138757668761.png" },
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/events");
        if (res.data && res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error("Failed to load events from DB", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "all" || event.category === selectedCat;
      const matchType = selectedType === "all" || event.type === selectedType;
      return matchSearch && matchCat && matchType;
    });
  }, [events, search, selectedCat, selectedType]);

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background Marvel Video Loop (High Visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-80 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center filter brightness-110 contrast-115"

        >
          <source src="/MARVEL/Video Project 5.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-[#05050A]/60 to-[#05050A]/90" />
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">


        {/* Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-arc-cyan/40 bg-arc-cyan/10 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase">
            <RiShieldFlashLine className="animate-pulse" />
            <span>S.H.I.E.L.D. MISSION DIRECTORY</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            AVENGER <span className="gradient-text-gold neon-gold">MISSIONS</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
            Select your operational domain — solo, duo, squad or group challenges across 26 superhero technical & cultural contests.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="glass p-6 rounded-2xl border border-arc-cyan/20 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-arc-cyan text-lg" />
              <input
                type="text"
                suppressHydrationWarning={true}
                placeholder="Search missions by hero or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-arc-cyan focus:outline-none text-white text-xs transition-all placeholder:text-white/30"
              />
            </div>

            {/* Type selector */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ${selectedType === "all" ? "bg-arc-cyan text-black" : "text-white/60 hover:text-white"
                  }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                All Squads
              </button>
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ${selectedType === t.id ? "bg-marvel-red text-white" : "text-white/60 hover:text-white"
                    }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-t border-white/10 pt-4">
            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setSelectedCat("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCat === "all"
                  ? "bg-metallic-gold text-black shadow-[0_0_15px_#FFD700]"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              All Domains
            </button>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedCat === cat.id
                    ? "bg-metallic-gold text-black shadow-[0_0_15px_#FFD700]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                  }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-xs text-white/50 font-bold uppercase tracking-wider flex items-center gap-2">
          <RiFlashlightLine className="text-arc-cyan" />
          {loading ? "Scanning S.H.I.E.L.D. mission database..." : `Verified ${filteredEvents.length} Active Missions`}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-2xl h-[460px] animate-pulse bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : (
          /* Mission Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredEvents.map((item, idx) => {
              const heroData = HERO_MAPPING[item.slug] || {
                hero: "Avenger Hero",
                level: "Level: Alpha",
                power: "Power: 95/100",
                image: item.coverImage || "/MARVEL/4081455907815375.png",
                avatar: item.coverImage || "/MARVEL/4081455907815375.png",
              };

              return (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="marvel-card group overflow-hidden rounded-2xl flex flex-col justify-between h-[510px] relative border border-arc-cyan/20 hover:border-arc-cyan shadow-xl"
                >
                  {/* Event Cover Image & MCU Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-black/60">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D1A] via-black/40 to-transparent z-10" />
                    <Image
                      src={heroData.image || item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                    />

                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                      <span className="px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded bg-marvel-red text-white shadow-[0_0_10px_#ED1D24]">
                        🦸 {heroData.hero}
                      </span>
                      <span className="px-2 py-0.5 text-[8px] font-bold text-arc-cyan bg-black/80 rounded border border-arc-cyan/30">
                        {heroData.power}
                      </span>
                    </div>
                  </div>

                  {/* Mission Details & Floating Character Image */}
                  <div className="p-6 flex-grow flex flex-col justify-between bg-[#0A0D1A] relative z-20 font-mono">
                    <div className="absolute -top-10 right-4 z-30 w-20 h-20 rounded-2xl border-2 border-white/20 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] bg-black/80 group-hover:scale-110 group-hover:border-arc-cyan transition-all duration-300">
                      <Image
                        src={heroData.avatar}
                        alt={`${heroData.hero} Character Avatar`}
                        fill
                        className="object-contain p-1 filter brightness-115 contrast-125"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-[10px] text-white/50 pr-20">
                        <span className="text-metallic-gold uppercase font-bold">{item.category}</span>
                        <span className="text-arc-cyan font-bold">{heroData.level}</span>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-metallic-gold transition-colors duration-300 truncate tracking-wide uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                        {item.title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-white/60">
                        <div className="flex items-center gap-2">
                          <RiTrophyLine className="text-metallic-gold text-base" />
                          <span>Prize Pool: <strong className="text-white">₹{item.prizePool.toLocaleString("en-IN")}</strong></span>
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
                      <Link href={`/events/${item.slug}`} className="text-xs font-bold text-arc-cyan hover:text-white transition-colors tracking-widest uppercase flex items-center gap-1">
                        Rules & Briefing
                        <RiArrowRightLine />
                      </Link>
                      <Link href={`/events/${item.slug}`} className="text-xs font-bold text-black bg-arc-cyan px-4 py-2 rounded-full hover:bg-white transition-all uppercase tracking-widest shadow-[0_0_10px_#00D4FF]">
                        Join Mission
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
