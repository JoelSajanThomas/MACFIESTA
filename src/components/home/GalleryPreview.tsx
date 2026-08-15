"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine, RiImageLine, RiFlashlightLine, RiZoomInLine } from "react-icons/ri";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const photos = [
  { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop", title: "DJ Show Energy" },
  { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop", title: "Acoustic Band Setup" },
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", title: "Concert Crowds" },
  { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop", title: "Awards Stage" },
];

export function GalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxYOdd = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const parallaxYEven = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section ref={sectionRef} className="relative bg-transparent section-padding border-t border-vibranium-purple/20 overflow-hidden">
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
        <Reveal y={60} duration={0.7} margin="-100px">
          <div className="flex flex-row items-end justify-between gap-3 sm:gap-6 mb-8 sm:mb-14">
            <div className="space-y-2 sm:space-y-3 min-w-0">
              <div className="text-arc-cyan text-[10px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase flex items-center gap-1.5 font-space truncate">
                <RiFlashlightLine className="animate-pulse shrink-0" /> <span className="truncate">S.H.I.E.L.D. VISUAL ARCHIVES</span>
              </div>
              <h2 className="section-title text-white uppercase font-anton">
                <span className="shimmer-text">Festival</span>{" "}
                <span className="gradient-text-plasma">Gallery</span>
              </h2>
              <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-vibranium-purple to-arc-cyan origin-left" />
            </div>

            <div className="shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/gallery"
                  className="btn-outline text-[10px] sm:text-xs px-3.5 sm:px-6 py-2 sm:py-3 flex items-center gap-1.5 sm:gap-2 tracking-wider sm:tracking-[0.16em] uppercase font-space text-white border-arc-cyan/40 shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-shadow duration-300 whitespace-nowrap"
                >
                  <span className="truncate">Full Gallery</span>
                  <RiArrowRightLine className="shrink-0" />
                </Link>
              </motion.div>
            </div>
          </div>
        </Reveal>

        {/* Photo Grid — Staggered reveal & dynamic 3D scroll parallax depth */}
        <RevealGroup stagger={0.12} margin="-100px" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, idx) => (
            <RevealItem key={idx}>
              <motion.div
                style={{ y: idx % 2 === 0 ? parallaxYEven : parallaxYOdd }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative aspect-square md:aspect-[3/4] overflow-hidden rounded-2xl border border-white/8 group shadow-lg cursor-pointer hover:border-arc-cyan/40 transition-colors duration-300"
              >
                <div className="w-full h-full overflow-hidden relative">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Hover content */}
                <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                  <span className="text-white text-xs md:text-sm font-bold truncate uppercase tracking-wider font-space">
                    {photo.title}
                  </span>
                  <span className="p-2 rounded-full bg-arc-cyan text-black text-xs shrink-0 shadow-[0_0_12px_#00D4FF]">
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
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
