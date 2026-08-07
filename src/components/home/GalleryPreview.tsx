"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiImageLine, RiFlashlightLine } from "react-icons/ri";

import { useGalleryItems } from "@/lib/galleryStore";

export function GalleryPreview() {
  const { items } = useGalleryItems();
  const photos = items.slice(0, 4);

  return (
    <section className="relative bg-[#05050A] section-padding border-t border-vibranium-purple/20 overflow-hidden font-mono">
      {/* Ambient Color Blending */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-vibranium-purple/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-arc-cyan text-xs font-mono font-bold tracking-[0.25em] uppercase flex items-center gap-1.5"
            >
              <RiFlashlightLine className="animate-pulse" /> S.H.I.E.L.D. VISUAL ARCHIVES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title text-white uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Festival <span className="marvel-bang-comic-gradient font-black drop-shadow-[0_0_15px_rgba(255,102,0,0.4)]">Gallery</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/gallery"
              className="btn-outline text-xs px-6 py-3 flex items-center gap-2 tracking-widest uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Explore Full Gallery
              <RiArrowRightLine />
            </Link>
          </motion.div>
        </div>

        {/* Masonry-like grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-2xl border border-white/5 group shadow-lg bg-black"
            >
              <img
                src={photo.type === "image" ? photo.url : photo.thumbnailUrl || photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6" />
              <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                <span className="text-white text-xs md:text-sm font-bold truncate uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  {photo.title}
                </span>
                <span className="p-2 rounded-full bg-metallic-gold text-black text-xs font-bold">
                  {photo.type === "video" ? "🎥" : "📷"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
