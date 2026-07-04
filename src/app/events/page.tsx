"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { EVENT_CATEGORIES, EVENT_TYPES } from "@/lib/constants";
import { RiSearchLine, RiTrophyLine, RiMapPinLine, RiArrowRightLine, RiTimeLine } from "react-icons/ri";
import { api } from "@/lib/api";
import { Event } from "@/types";

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
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Explore <span className="gradient-text-gold neon-gold">Events</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Choose your arena — solo, duo, squad or group challenges across 26 technical and cultural contests.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
              <input
                type="text"
                suppressHydrationWarning={true}
                placeholder="Search events by title or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm transition-all placeholder:text-white/30"
              />
            </div>

            {/* Type selector */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  selectedType === "all" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                All Teams
              </button>
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  suppressHydrationWarning={true}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                    selectedType === t.id ? "bg-festival-gold text-festival-dark" : "text-white/40 hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-t border-white/5 pt-4">
            <button
              type="button"
              suppressHydrationWarning={true}
              onClick={() => setSelectedCat("all")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCat === "all"
                  ? "bg-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/5"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              All Categories
            </button>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCat === cat.id
                    ? "bg-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-sm text-white/40 font-medium">
          {loading ? "Loading arenas..." : `Showing ${filteredEvents.length} events`}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass rounded-2xl h-[450px] animate-pulse bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredEvents.map((item, idx) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card group overflow-hidden rounded-2xl flex flex-col justify-between h-[450px] relative border border-white/10 shadow-lg"
              >
                {/* Event Cover Image */}
                <div className="relative h-1/2 w-full overflow-hidden bg-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-festival-dark-card to-transparent z-10" />
                  {item.coverImage && (
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  
                  {/* Category & Difficulty Badge */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full bg-black/60 text-festival-gold border border-festival-gold/20" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.category}
                    </span>
                    <span className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full bg-black/60 text-festival-cyan border border-festival-cyan/20" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 flex-grow flex flex-col justify-between bg-festival-dark-card relative z-20">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-festival-gold transition-colors duration-300 truncate" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-white/50">
                      <div className="flex items-center gap-2">
                        <RiTrophyLine className="text-festival-gold text-base" />
                        <span>Prize: <strong className="text-white">₹{item.prizePool.toLocaleString("en-IN")}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiMapPinLine className="text-festival-cyan text-base" />
                        <span className="truncate">{item.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiTimeLine className="text-festival-pink text-base" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link href={`/events/${item.slug}`} className="text-xs font-bold text-festival-gold hover:text-white transition-colors tracking-widest uppercase flex items-center gap-1" style={{ fontFamily: "var(--font-heading)" }}>
                      View Rules
                      <RiArrowRightLine />
                    </Link>
                    <Link href={`/events/${item.slug}`} className="text-xs font-bold text-white bg-festival-purple px-4 py-2 rounded-full hover:bg-festival-purple-light transition-all uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                      Register
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
