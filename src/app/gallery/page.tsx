"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { RiCloseLine, RiPlayLine, RiZoomInLine } from "react-icons/ri";

const media = [
  { type: "image", category: "gaming", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop", title: "Gaming Arena Finals" },
  { type: "image", category: "cultural", url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop", title: "Dusk 'N Dawn Live" },
  { type: "image", category: "technical", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop", title: "Hackathon Dev Labs" },
  { type: "image", category: "general", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop", title: "Corporate Presentation" },
  { type: "image", category: "cultural", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", title: "Cultural Stage Crowd" },
  { type: "image", category: "general", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "DJ Night Vibes" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const filteredMedia = media.filter((item) => {
    return filter === "all" || item.category === filter;
  });

  return (
    <div className="bg-[#05050A] min-h-screen pt-28 pb-16 text-white font-mono relative overflow-hidden">
      {/* Background ambient Marvel color blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-marvel-red/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Media <span className="marvel-bang-comic-gradient font-black">Gallery</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Glimpses of premium performances, tech sprint presentations, and general awards ceremonies.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {["all", "gaming", "cultural", "technical", "general"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${filter === cat
                ? "bg-marvel-red text-white border border-marvel-red shadow-[0_0_15px_#ED1D24]"
                : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {cat}
            </button>
          ))}
        </div>


        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMedia.map((item, idx) => (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveItem(item)}
                className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl border border-white/5 group shadow-lg cursor-pointer"
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center space-y-2 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="p-3 bg-festival-gold text-festival-dark rounded-full text-lg inline-block">
                      {item.type === "video" ? <RiPlayLine /> : <RiZoomInLine />}
                    </span>
                    <h3 className="text-white text-xs md:text-sm font-bold uppercase tracking-wider block px-4" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Lightbox full viewer */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 md:p-12"
            >
              {/* Close trigger */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full border border-white/10 hover:border-white/30"
              >
                <RiCloseLine size={24} />
              </button>

              <div className="relative max-w-5xl w-full h-[70vh] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={activeItem.url}
                  alt={activeItem.title}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
