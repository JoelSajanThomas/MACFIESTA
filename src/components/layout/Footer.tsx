"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  RiInstagramFill,
  RiYoutubeFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiArrowUpLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { FESTIVAL_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Gallery", href: "/gallery" },
];

const portals = [
  { label: "Student Login", href: "/signin" },
  { label: "Admin Console", href: "/admin/login" },
  { label: "Register Pass", href: "/signup" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Scoreboard", href: "/scoreboard" },
];

const resources = [
  { label: "Guidelines", href: "/events#guidelines" },
  { label: "Contact Us", href: "/contact" },
  { label: "Results", href: "/results" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "AR Wayfinder", href: "/navigator" },
  { label: "FAQs", href: "/contact#faq" },
];

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: RiInstagramFill,
  youtube: RiYoutubeFill,
  linkedin: RiLinkedinBoxFill,
  twitter: RiTwitterXFill,
};

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <footer 
      className="relative bg-gradient-to-b from-[#030712] via-[#050d26] to-[#010204] border-t border-white/5 overflow-hidden z-10" 
      role="contentinfo" 
      aria-label="Main Footer"
    >
      <div 
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-festival-gold/5 blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-festival-purple/5 blur-[100px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-festival-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/5"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <Link 
              href="/" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-festival-gold/50 rounded-xl p-1" 
              aria-label="MACFIESTA Home Link"
            >
              <div className="relative w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2 transition-all duration-500 group-hover:border-festival-gold/50 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:scale-105">
                <Image
                  src={FESTIVAL_CONFIG.logoUrl}
                  alt={`${FESTIVAL_CONFIG.name} Logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-wider uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                  <span className="gradient-text-gold neon-gold">MAC</span>
                  <span className="text-white">FIESTA</span>
                </h3>
                <p className="text-[9px] text-white/40 tracking-[0.25em] uppercase font-bold">
                  {FESTIVAL_CONFIG.motto}
                </p>
              </div>
            </Link>

            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              The premier national-level multi-fest hosted by {FESTIVAL_CONFIG.collegeFull}. Connect, compete, and rise with the legends.
            </p>

            <div className="flex gap-3 justify-center md:justify-start">
              {SOCIAL_LINKS.map((link) => {
                const Icon = socialIcons[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-festival-gold-light hover:border-festival-gold/50 hover:bg-festival-gold/5 hover:shadow-[0_0_15px_rgba(234,179,8,0.25)] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-festival-gold/50"
                    aria-label={`Follow MACFIESTA on ${link.label}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4 
              className="text-sm font-bold text-white uppercase tracking-[0.2em] mr-[-0.2em] relative pb-2" 
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Navigation
              <span className="absolute bottom-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-8 h-[2px] bg-festival-gold" />
            </h4>
            <ul className="grid grid-cols-1 gap-3 w-full" aria-label="Navigation Links">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-white/60 hover:text-festival-gold-light transition-all duration-300 relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-festival-gold after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:text-festival-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4 
              className="text-sm font-bold text-white uppercase tracking-[0.2em] mr-[-0.2em] relative pb-2" 
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Portals & Resources
              <span className="absolute bottom-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-8 h-[2px] bg-festival-gold" />
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full justify-items-center md:justify-items-start">
              <div className="space-y-3 text-left">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-wider">Portals</p>
                <ul className="space-y-2" aria-label="Portal Links">
                  {portals.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-xs text-white/60 hover:text-festival-gold-light transition-all duration-300 relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-festival-gold after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:text-festival-gold-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3 text-left">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-wider">Resources</p>
                <ul className="space-y-2" aria-label="Resource Links">
                  {resources.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block text-xs text-white/60 hover:text-festival-gold-light transition-all duration-300 relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-festival-gold after:transition-all after:duration-300 hover:after:w-full focus:outline-none focus:text-festival-gold-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h4 
              className="text-sm font-bold text-white uppercase tracking-[0.2em] mr-[-0.2em] relative pb-2" 
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Communication
              <span className="absolute bottom-0 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-8 h-[2px] bg-festival-gold" />
            </h4>
            
            <div className="glass p-5 rounded-2xl border border-white/5 space-y-4 w-full max-w-[280px] shadow-lg text-left">
              <div className="flex gap-3 items-start">
                <RiMapPinLine className="text-festival-gold text-lg mt-0.5 shrink-0" />
                <span className="text-xs text-white/70 leading-relaxed">
                  Mar Athanasios College for Advanced Studies, Tiruvalla, Kerala, India - 689101
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <RiPhoneLine className="text-festival-gold text-lg shrink-0" />
                <a 
                  href="tel:+914692600000" 
                  className="text-xs text-white/70 hover:text-festival-gold-light transition-colors focus:outline-none focus:underline"
                >
                  +91 469 260 0000
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <RiMailLine className="text-festival-gold text-lg shrink-0" />
                <a 
                  href="mailto:info@macfiesta.macfast.org" 
                  className="text-xs text-white/70 hover:text-festival-gold-light transition-colors focus:outline-none focus:underline"
                >
                  info@macfiesta.macfast.org
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-festival-gold/5 border border-festival-gold/20 rounded-full select-none shadow-[0_0_10px_rgba(234,179,8,0.05)]">
              <RiShieldCheckLine className="text-festival-gold animate-pulse text-sm" />
              <span className="text-[10px] text-festival-gold font-bold tracking-widest uppercase">
                Secure Portal Active
              </span>
            </div>
          </motion.div>
        </motion.div>

        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left justify-items-center md:justify-items-stretch">
          <div className="text-xs text-white/40 md:text-left">
            © {new Date().getFullYear()} MACFIESTA {FESTIVAL_CONFIG.year} • MACFAST. All rights reserved.
          </div>

          <div className="flex gap-6 justify-center text-xs text-white/40">
            <Link 
              href="/privacy" 
              className="hover:text-festival-gold-light transition-colors focus:outline-none focus:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-festival-gold-light transition-colors focus:outline-none focus:underline"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-end w-full max-w-[280px] md:max-w-none">
            <span className="text-[11px] text-white/30 tracking-wider font-medium select-none">
              Designed by <span className="text-festival-gold font-bold uppercase tracking-wider">Joel Sajan Thomas & Joel Zacharia</span>
            </span>

            <button
              onClick={scrollToTop}
              type="button"
              suppressHydrationWarning={true}
              className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-festival-gold hover:border-festival-gold/40 hover:bg-festival-gold/5 hover:shadow-[0_0_15px_rgba(234,179,8,0.25)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-festival-gold/50 cursor-pointer"
              aria-label="Scroll back to top of the page"
            >
              <RiArrowUpLine size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
