"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiImageLine, RiFlashlightLine } from "react-icons/ri";

const photos = [
  { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "DJ Show Energy" },
  { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop", title: "Acoustic Band Setup" },
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", title: "Concert Crowds" },
  { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop", title: "Awards Stage" },
];

export function GalleryPreview() {
  return (
    <section className="relative bg-festival-dark section-padding border-t border-white/5">
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
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-2xl border border-white/5 group shadow-lg"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-festival-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6" />
              <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                <span className="text-white text-xs md:text-sm font-bold truncate uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                  {photo.title}
                </span>
                <span className="p-2 rounded-full bg-festival-gold text-festival-dark text-xs">
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
