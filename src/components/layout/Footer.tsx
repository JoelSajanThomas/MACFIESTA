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
} from "react-icons/ri";
import { FESTIVAL_CONFIG, NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Schedule", href: "/schedule" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Portal",
    links: [
      { label: "Student Login", href: "/signin" },
      { label: "Admin Login", href: "/admin/login" },
      { label: "Register", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Scoreboard", href: "/scoreboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "General Guidelines", href: "/events#guidelines" },
      { label: "Contact Us", href: "/contact" },
      { label: "Results", href: "/results" },
      { label: "Sponsors", href: "/sponsors" },
      { label: "AR Navigator", href: "/navigator" },
      { label: "FAQs", href: "/contact#faq" },
    ],
  },
];

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: RiInstagramFill,
  youtube: RiYoutubeFill,
  linkedin: RiLinkedinBoxFill,
  twitter: RiTwitterXFill,
};

/**
 * Multi-column footer with navigation, contact info, social links,
 * newsletter signup, and a back-to-top button.
 */
export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-festival-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src={FESTIVAL_CONFIG.logoUrl}
                  alt={`${FESTIVAL_CONFIG.name} Logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3
                  className="text-xl font-black tracking-wider"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span className="gradient-text-gold">MAC</span>
                  <span className="text-white">FIESTA</span>
                </h3>
                <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">
                  {FESTIVAL_CONFIG.motto}
                </p>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-6">
              The most awaited cultural and technical festival of{" "}
              {FESTIVAL_CONFIG.collegeFull}. Join us for {FESTIVAL_CONFIG.totalEvents}+ exciting
              events!
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm text-white/40">
              <div className="flex items-center gap-2">
                <RiMapPinLine className="text-festival-gold" />
                <span>MACFAST, Tiruvalla, Kerala, India</span>
              </div>
              <div className="flex items-center gap-2">
                <RiPhoneLine className="text-festival-gold" />
                <span>+91 469 260 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <RiMailLine className="text-festival-gold" />
                <span>info@macfiesta.macfast.org</span>
              </div>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4
                className="text-sm font-bold text-white/90 tracking-wider uppercase mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-festival-gold transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {FESTIVAL_CONFIG.name} {FESTIVAL_CONFIG.year} •{" "}
            {FESTIVAL_CONFIG.collegeFull}. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((link) => {
              const Icon = socialIcons[link.platform];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-festival-gold transition-colors duration-300"
                  aria-label={link.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}

            {/* Back to top (suppressing browser autofill decoration mismatch) */}
            <button
              onClick={scrollToTop}
              suppressHydrationWarning={true}
              className="ml-4 p-2 rounded-full border border-white/10 text-white/40 hover:text-festival-gold hover:border-festival-gold/30 transition-all duration-300"
              aria-label="Back to top"
            >
              <RiArrowUpLine size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
