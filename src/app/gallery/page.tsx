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
  RiFullscreenLine,
  RiFullscreenExitLine,
} from "react-icons/ri";
import { useGalleryItems, GalleryItem } from "@/lib/galleryStore";

export default function GalleryPage() {
  const { items } = useGalleryItems();
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

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

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsNativeFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsNativeFullscreen(false);
      }
    }
  };

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
            Glimpses of high-octane esports, cultural stage nights, tech sprint hackathons & pro show highlights. Click any photo or video for 100% full-screen playback.
          </p>
        </div>

        {/* MEDIA TYPE & CATEGORY FILTER BARS */}
        <div className="space-y-4 w-full">
          {/* 1. Photos vs Videos Selector */}
          <div className="flex flex-wrap justify-center gap-2 px-2">
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
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
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
          <div className="flex gap-2 justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none select-scrollbar px-4 sm:px-0 w-full">
            {["all", "cultural", "gaming", "technical", "pro-show", "general"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilterCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shrink-0 ${
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
                  src={encodeURI(item.type === "image" ? item.url : item.thumbnailUrl || item.url)}
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

      {/* ⚡ 100% IMMERSIVE FULL-SCREEN MEDIA THEATER */}
      <AnimatePresence>
        {activeItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl w-screen h-screen flex items-center justify-center overflow-hidden"
          >
            {/* FLOATING CLOSE BUTTON */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="fixed top-6 right-6 z-[10000] px-4 py-2.5 rounded-2xl bg-black/80 border border-white/20 text-white hover:bg-marvel-red hover:border-marvel-red transition-all cursor-pointer font-bold text-xs uppercase backdrop-blur-md shadow-[0_0_20px_rgba(237,29,36,0.6)] flex items-center gap-2"
              title="Close Full Screen (Esc)"
            >
              <RiCloseLine size={20} />
              <span className="hidden sm:inline">Close</span>
            </button>

            {/* FLOATING PREVIOUS BUTTON */}
            <button
              onClick={handlePrev}
              className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[10000] p-4 rounded-full bg-black/80 border border-white/20 text-white hover:bg-arc-cyan hover:text-black transition-all cursor-pointer shadow-[0_0_25px_#00D4FF] hover:scale-110"
              title="Previous (◄)"
            >
              <RiArrowLeftSLine size={32} />
            </button>

            {/* FLOATING NEXT BUTTON */}
            <button
              onClick={handleNext}
              className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[10000] p-4 rounded-full bg-black/80 border border-white/20 text-white hover:bg-arc-cyan hover:text-black transition-all cursor-pointer shadow-[0_0_25px_#00D4FF] hover:scale-110"
              title="Next (►)"
            >
              <RiArrowRightSLine size={32} />
            </button>

            {/* FULL SCREEN MEDIA VIEWPORT CONTAINER */}
            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center relative">
              {activeItem.type === "image" ? (
                <motion.img
                  key={activeItem.url}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={encodeURI(activeItem.url)}
                  alt={activeItem.title}
                  className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)]"
                />
              ) : activeItem.url.includes("youtube.com/embed/") ? (
                <iframe
                  key={activeItem.url}
                  src={`${activeItem.url}?autoplay=1`}
                  className="w-full h-full max-w-6xl max-h-[85vh] rounded-2xl border-0 shadow-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full max-w-6xl max-h-[85vh] object-contain rounded-2xl bg-black shadow-[0_0_60px_rgba(0,0,0,0.9)]"
                >
                  <source src={encodeURI(activeItem.url)} />
                  <source src={activeItem.url} />
                  Your browser does not support playing this video format directly.
                </video>
              )}
            </div>

            {/* FLOATING MARVEL HUD BOTTOM CONTROL BAR */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] max-w-3xl w-[92vw] px-6 py-3 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-xl flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)] font-mono text-xs">
              <div className="flex items-center gap-3 truncate pr-4">
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                    activeItem.type === "image"
                      ? "bg-arc-cyan/20 border border-arc-cyan/40 text-arc-cyan"
                      : "bg-marvel-red/20 border border-marvel-red/40 text-marvel-red"
                  }`}
                >
                  {activeItem.type.toUpperCase()} · {activeItem.category}
                </span>
                <h3 className="text-white font-extrabold uppercase truncate text-sm">
                  {activeItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-metallic-gold font-bold">
                  {selectedIndex + 1} / {filteredMedia.length}
                </span>

                <button
                  onClick={toggleNativeFullscreen}
                  className="p-2 rounded-xl bg-white/10 hover:bg-arc-cyan hover:text-black text-white transition-colors cursor-pointer border border-white/10"
                  title="Toggle Display Fullscreen Mode"
                >
                  {isNativeFullscreen ? <RiFullscreenExitLine size={18} /> : <RiFullscreenLine size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
