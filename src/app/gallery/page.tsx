"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  RiCloseLine,
  RiPlayLine,
  RiZoomInLine,
  RiGalleryLine,
  RiImageAddLine,
  RiVideoLine,
  RiSparklingLine,
} from "react-icons/ri";
import { useGalleryItems, GalleryItem } from "@/lib/galleryStore";

export default function GalleryPage() {
  const { items } = useGalleryItems();
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const imagesCount = items.filter((i) => i.type === "image").length;
  const videosCount = items.filter((i) => i.type === "video").length;

  const filteredMedia = items.filter((item) => {
    const matchType = filterType === "all" || item.type === filterType;
    const matchCat = filterCategory === "all" || item.category === filterCategory;
    return matchType && matchCat;
  });

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
                onClick={() => setFilterType(tab.id)}
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
                onClick={() => setFilterCategory(cat)}
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
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveItem(item)}
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

      {/* LIGHTBOX / VIDEO PLAYER MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-4xl w-full glass p-6 rounded-3xl border border-white/20 bg-[#0A0D1A] space-y-4 relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-marvel-red transition-colors cursor-pointer z-20 border border-white/10"
            >
              <RiCloseLine size={22} />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-arc-cyan/20 border border-arc-cyan/40 text-arc-cyan text-[10px] font-bold uppercase">
                {activeItem.type.toUpperCase()} · {activeItem.category}
              </span>
              <h3 className="text-lg font-black text-white uppercase">{activeItem.title}</h3>
            </div>

            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden relative border border-white/10">
              {activeItem.type === "image" ? (
                <img src={activeItem.url} alt={activeItem.title} className="w-full h-full object-contain" />
              ) : (
                <video src={activeItem.url} controls autoPlay className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
