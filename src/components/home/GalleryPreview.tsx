"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiImageLine, RiFlashlightLine, RiZoomInLine } from "react-icons/ri";

const photos = [
  { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "DJ Show Energy" },
  { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop", title: "Acoustic Band Setup" },
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", title: "Concert Crowds" },
  { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop", title: "Awards Stage" },
];

export function GalleryPreview() {
  return (
    <section className="relative bg-[#05050A]/60 backdrop-blur-md section-padding border-t border-vibranium-purple/20 overflow-hidden">
      {/* Ambient Color Blending */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-vibranium-purple/10 blur-[130px] pointer-events-none"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[130px] pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-arc-cyan text-xs font-bold tracking-[0.25em] uppercase flex items-center gap-1.5 font-space"
            >
              <RiFlashlightLine className="animate-pulse" /> S.H.I.E.L.D. VISUAL ARCHIVES
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title text-white uppercase"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Festival <span className="marvel-bang-comic-gradient font-black">Gallery</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-0.5 w-20 bg-gradient-to-r from-vibranium-purple to-arc-cyan origin-left"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/gallery"
              className="btn-outline text-xs px-6 py-3 flex items-center gap-2 tracking-widest uppercase font-space"
            >
              Explore Full Gallery
              <RiArrowRightLine />
            </Link>
          </motion.div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -4 }}
              className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-2xl border border-white/8 group shadow-lg cursor-pointer hover:border-arc-cyan/30 transition-colors duration-300"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Hover content */}
              <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                <span
                  className="text-white text-xs md:text-sm font-bold truncate uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {photo.title}
                </span>
                <span className="p-2 rounded-full bg-arc-cyan text-black text-xs shrink-0">
                  <RiZoomInLine />
                </span>
              </div>

              {/* Top right overlay badge */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="p-1.5 rounded-full bg-black/70 text-white/70 text-xs block">
                  <RiImageLine />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
