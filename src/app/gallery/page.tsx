"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiPlayLine,
  RiZoomInLine,
  RiGalleryLine,
  RiImageAddLine,
  RiVideoLine,
  RiSparklingLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useGalleryItems, GalleryItem } from "@/lib/galleryStore";

export default function GalleryPage() {
  const { items } = useGalleryItems();
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const imagesCount = items.filter((i) => i.type === "image").length;
  const videosCount = items.filter((i) => i.type === "video").length;

  const filteredMedia = items.filter((item) => {
    const matchType = filterType === "all" || item.type === filterType;
    const matchCat = filterCategory === "all" || item.category === filterCategory;
    return matchType && matchCat;
  });

  const activeItem = selectedIndex !== null ? filteredMedia[selectedIndex] : null;

  const handleNext = useCallback(() => {
    if (selectedIndex === null || filteredMedia.length === 0) return;
    setSelectedIndex((prev) => (prev !== null && prev < filteredMedia.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, filteredMedia.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || filteredMedia.length === 0) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredMedia.length - 1));
  }, [selectedIndex, filteredMedia.length]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "Escape") setSelectedIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden select-none">
      {/* Background Marvel Neon Ambient Color Blending */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-vibranium-purple/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-arc-cyan/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.85)_95%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-arc-cyan/10 border border-arc-cyan/30 text-arc-cyan text-xs font-mono font-bold tracking-widest uppercase">
            <RiSparklingLine className="animate-spin-slow" />
            <span>OFFICIAL MACFIESTA MEDIA VAULT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Media <span className="marvel-bang-comic-gradient font-black">Gallery</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Glimpses of high-octane esports, cultural stage nights, tech sprint hackathons & pro show highlights.
          </p>
        </div>

        {/* MEDIA TYPE & CATEGORY FILTER BARS */}
        <div className="space-y-4">
          {/* 1. Photos vs Videos Selector */}
          <div className="flex justify-center gap-2">
            {[
              { id: "all" as const, label: `All Assets (${items.length})`, icon: RiGalleryLine },
              { id: "image" as const, label: `📷 Photos (${imagesCount})`, icon: RiImageAddLine },
              { id: "video" as const, label: `🎥 Videos (${videosCount})`, icon: RiVideoLine },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterType(tab.id);
                  setSelectedIndex(null);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  filterType === tab.id
                    ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_20px_#ED1D24]"
                    : "bg-black/60 text-white/60 hover:text-white border-white/10 hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 2. Category Filters */}
          <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-none">
            {["all", "cultural", "gaming", "technical", "pro-show", "general"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilterCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-metallic-gold text-black font-extrabold shadow-[0_0_15px_#FFD700]"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMedia.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedIndex(idx)}
                className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 group shadow-2xl cursor-pointer bg-black/80"
              >
                <img
                  src={item.type === "image" ? item.url : item.thumbnailUrl || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Media Badges */}
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      item.type === "image"
                        ? "bg-arc-cyan/20 border-arc-cyan/40 text-arc-cyan"
                        : "bg-marvel-red/20 border-marvel-red/40 text-marvel-red"
                    }`}
                  >
                    {item.type === "image" ? "📷 PHOTO" : "🎥 VIDEO"}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="space-y-1 transform group-hover:-translate-y-1 transition-transform">
                    <span className="text-[10px] text-metallic-gold font-bold uppercase tracking-widest block">
                      {item.category}
                    </span>
                    <h3
                      className="text-white text-sm font-extrabold uppercase tracking-wider block"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Hover Play / Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-4 bg-marvel-red text-white rounded-full text-xl shadow-[0_0_20px_#ED1D24] transform scale-75 group-hover:scale-100 transition-transform">
                    {item.type === "video" ? <RiPlayLine /> : <RiZoomInLine />}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12 text-white/40 font-mono text-xs">
            No media assets found in this category.
          </div>
        )}
      </div>

      {/* INTERACTIVE LIGHTBOX & CAROUSEL MODAL (WITH NEXT / PREV / CLOSE) */}
      <AnimatePresence>
        {activeItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-marvel-red hover:border-marvel-red transition-all cursor-pointer z-50 shadow-[0_0_20px_rgba(237,29,36,0.5)]"
              title="Close (Esc)"
            >
              <RiCloseLine size={24} />
            </button>

            {/* PREVIOUS BUTTON */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-arc-cyan hover:text-black transition-all cursor-pointer z-50 shadow-[0_0_20px_#00D4FF]"
              title="Previous Asset (◄)"
            >
              <RiArrowLeftSLine size={28} />
            </button>

            {/* NEXT BUTTON */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-black/70 border border-white/20 text-white hover:bg-arc-cyan hover:text-black transition-all cursor-pointer z-50 shadow-[0_0_20px_#00D4FF]"
              title="Next Asset (►)"
            >
              <RiArrowRightSLine size={28} />
            </button>

            {/* Central Media Content Box */}
            <div className="max-w-5xl w-full glass p-6 rounded-3xl border border-white/20 bg-[#0A0D1A] space-y-4 relative flex flex-col justify-between max-h-[90vh]">
              {/* Media Title Header & Item Counter */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 truncate pr-12">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      activeItem.type === "image"
                        ? "bg-arc-cyan/20 border border-arc-cyan/40 text-arc-cyan"
                        : "bg-marvel-red/20 border border-marvel-red/40 text-marvel-red"
                    }`}
                  >
                    {activeItem.type.toUpperCase()} · {activeItem.category}
                  </span>
                  <h3 className="text-sm md:text-base font-black text-white uppercase truncate">
                    {activeItem.title}
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-metallic-gold font-bold shrink-0">
                  {selectedIndex + 1} / {filteredMedia.length}
                </div>
              </div>

              {/* Media Display Container */}
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative border border-white/10 flex items-center justify-center">
                {activeItem.type === "image" ? (
                  <img
                    src={activeItem.url}
                    alt={activeItem.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={activeItem.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Navigation Hint Footer */}
              <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10">
                <span>Use keyboard <kbd className="px-2 py-0.5 bg-black/60 border border-white/20 rounded text-metallic-gold font-mono">◄ Left</kbd> and <kbd className="px-2 py-0.5 bg-black/60 border border-white/20 rounded text-metallic-gold font-mono">Right ►</kbd> keys to navigate</span>
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Press <kbd className="px-2 py-0.5 bg-black/60 border border-white/20 rounded text-white font-mono">Esc</kbd> to exit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
