"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { RiCloseLine, RiPlayLine, RiZoomInLine, RiImageLine, RiVideoLine } from "react-icons/ri";
import { useGalleryStore, GalleryMediaItem } from "@/lib/galleryStore";

export default function GalleryPage() {
  const { items } = useGalleryStore();
  const [filter, setFilter] = useState("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video">("all");
  const [activeItem, setActiveItem] = useState<GalleryMediaItem | null>(null);

  const activeMedia = items.filter((item) => item.active !== false);

  const filteredMedia = activeMedia.filter((item) => {
    const matchesCategory = filter === "all" || item.category === filter;
    const matchesType = mediaTypeFilter === "all" || item.type === mediaTypeFilter;
    return matchesCategory && matchesType;
  });

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden select-none">
      {/* Background Marvel Neon Ambient Color Blending */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-vibranium-purple/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-arc-cyan/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,5,10,0.85)_95%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-metallic-gold/15 text-metallic-gold border border-metallic-gold/30">
            OFFICIAL FESTIVAL ARCHIVES
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Media & Highlight <span className="marvel-bang-comic-gradient font-black">Gallery</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Photos & video highlights from esports finals, pro show performances, hackathons, and campus celebrations.
          </p>
        </div>

        {/* Media Type Tabs (All, Images Only, Videos Only) */}
        <div className="flex justify-center gap-2">
          {[
            { id: "all" as const, label: `All Media (${activeMedia.length})`, icon: RiZoomInLine },
            { id: "image" as const, label: `Photos (${activeMedia.filter(i => i.type === "image").length})`, icon: RiImageLine },
            { id: "video" as const, label: `Videos (${activeMedia.filter(i => i.type === "video").length})`, icon: RiVideoLine },
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = mediaTypeFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMediaTypeFilter(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? "bg-marvel-red text-white border-marvel-red shadow-[0_0_15px_#ED1D24]"
                    : "bg-white/5 text-white/60 hover:text-white border-white/10"
                }`}
              >
                <Icon />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-none">
          {["all", "gaming", "cultural", "technical", "general"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                filter === cat
                  ? "bg-metallic-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/10"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Masonry Grid */}
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
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 group shadow-lg cursor-pointer bg-black/60"
              >
                <img
                  src={item.type === "video" ? (item.thumbnailUrl || item.url) : item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Overlay */}
                <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                  item.type === "video"
                    ? "bg-marvel-red text-white border-marvel-red/50 shadow-[0_0_10px_#ED1D24]"
                    : "bg-arc-cyan/20 text-arc-cyan border-arc-cyan/40"
                }`}>
                  {item.type === "video" ? "🎥 VIDEO" : "🖼️ PHOTO"} · {item.category}
                </span>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center space-y-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-4">
                    <span className="p-3 bg-metallic-gold text-black rounded-full text-lg inline-block shadow-lg">
                      {item.type === "video" ? <RiPlayLine /> : <RiZoomInLine />}
                    </span>
                    <h3 className="text-white text-xs md:text-sm font-bold uppercase tracking-wider block" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-white/60">{item.album}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox Full Viewer */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 md:p-8 backdrop-blur-md"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full border border-white/20 hover:border-white/50 bg-black/50 cursor-pointer z-50"
              >
                <RiCloseLine size={24} />
              </button>

              <div className="relative max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center bg-black/80 border border-white/10 p-4">
                {activeItem.type === "video" ? (
                  activeItem.url.includes("youtube.com") || activeItem.url.includes("embed") ? (
                    <iframe
                      src={activeItem.url}
                      className="w-full h-[65vh] rounded-2xl border-0"
                      title={activeItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={activeItem.url} controls autoPlay className="max-h-[65vh] w-full rounded-2xl object-contain" />
                  )
                ) : (
                  <img
                    src={activeItem.url}
                    alt={activeItem.title}
                    className="max-h-[65vh] w-full object-contain rounded-2xl"
                  />
                )}

                <div className="mt-4 text-center space-y-1">
                  <h3 className="text-base font-bold text-white uppercase">{activeItem.title}</h3>
                  <p className="text-xs text-white/60">{activeItem.album} • {activeItem.date}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
