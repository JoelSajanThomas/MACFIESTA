"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS, FESTIVAL_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  RiInstagramFill,
  RiYoutubeFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Schedule", href: "/schedule" },
  { label: "Scoreboard", href: "/scoreboard" },
  { label: "Contact", href: "/contact" },
];

const dropdownNavItems = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Results", href: "/results" },
  { label: "Campus Map", href: "/navigator" },
];

export function Navbar() {
  const { initialize, user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle window resizing to auto-close mobile drawer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          scrolled ? "glass-strong py-3 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : "py-5 bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo container (No nested interactive anchors) */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="MacFiesta Home">
            <div className="relative w-10 h-10 md:w-11 md:h-11">
              <Image
                src={FESTIVAL_CONFIG.logoUrl}
                alt={`${FESTIVAL_CONFIG.name} ${FESTIVAL_CONFIG.year} Logo`}
                fill
                sizes="(max-width: 768px) 40px, 44px"
                className="object-contain drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(234,179,8,0.6)] transition-all duration-300"
                priority
              />
            </div>
            <span 
              className="text-white font-black tracking-widest text-base md:text-lg uppercase group-hover:text-festival-gold transition-colors duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              MAC<span className="gradient-text-gold neon-gold">FIESTA</span>
            </span>
          </Link>

          {/* Desktop navigation (xl Breakpoint) */}
          <div className="hidden xl:flex items-center gap-1.5">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3.5 py-2 text-xs font-semibold text-white/80 hover:text-white transition-colors duration-300 tracking-widest uppercase group"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-festival-gold group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}

            {/* Premium More Dropdown (Pure CSS Hover - Tailwind v4 compatible) */}
            <div className="relative group py-2">
              <button
                type="button"
                suppressHydrationWarning={true}
                className="px-3.5 py-2 text-xs font-semibold text-white/80 hover:text-white transition-colors duration-300 tracking-widest uppercase flex items-center gap-1 cursor-default"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span>More</span>
                <span className="text-[8px] transition-transform duration-300 group-hover:rotate-180">▼</span>
              </button>
              
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 bg-festival-dark/95 backdrop-blur-md border border-white/10 rounded-xl p-1.5 w-40 shadow-2xl z-50 flex flex-col gap-0.5"
              >
                {dropdownNavItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="px-4 py-2.5 text-[10px] font-bold text-white/70 hover:text-festival-gold hover:bg-white/5 rounded-lg transition-colors uppercase tracking-widest text-center"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="hidden xl:flex items-center gap-4">
            <a
              href={SOCIAL_LINKS[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white hover:text-festival-dark text-xs font-bold tracking-widest uppercase hover:bg-festival-gold hover:border-festival-gold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.02)]"
              style={{ fontFamily: "var(--font-heading)", fontSize: "0.65rem" }}
            >
              <span>Follow Us</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-4 py-2 text-xs font-bold bg-festival-gold text-festival-dark rounded-full hover:bg-white hover:text-festival-dark transition-all duration-300 tracking-widest uppercase shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {user.role === "admin" ? "Console" : "Dashboard"}
                </Link>
                <button
                  onClick={logout}
                  className="px-3.5 py-2 text-xs font-bold text-white/50 hover:text-festival-pink transition-colors duration-300 tracking-widest uppercase cursor-pointer"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 text-xs font-bold text-festival-dark bg-festival-gold border border-festival-gold rounded-full hover:bg-transparent hover:text-white transition-all duration-300 tracking-widest uppercase shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle (xl Breakpoint) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-festival-dark/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-5 max-h-[70vh] overflow-y-auto w-full py-4 pr-1 select-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href="/"
                  onClick={closeMobile}
                  className="text-xl font-extrabold text-white/80 hover:text-festival-gold transition-colors tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Home
                </Link>
              </motion.div>

              {NAV_ITEMS.filter(item => item.href !== "/").map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: (i + 1) * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className="text-xl font-extrabold text-white/80 hover:text-festival-gold transition-colors tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: (NAV_ITEMS.length + 1) * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      onClick={closeMobile}
                      className="text-xl font-extrabold text-festival-gold hover:text-festival-gold-light transition-colors tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {user.role === "admin" ? "Admin Console" : "Dashboard"}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: (NAV_ITEMS.length + 2) * 0.04, duration: 0.25 }}
                  >
                    <button
                      onClick={() => {
                        logout();
                        closeMobile();
                      }}
                      className="text-xl font-extrabold text-white/40 hover:text-festival-pink transition-colors tracking-widest uppercase cursor-pointer"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: NAV_ITEMS.length * 0.04, duration: 0.25 }}
                >
                  <Link
                    href="/signin"
                    onClick={closeMobile}
                    className="text-xl font-extrabold text-festival-gold hover:text-festival-gold-light transition-colors tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </nav>

            {/* Social links in mobile menu */}
            <motion.div
              className="flex items-center gap-6 mt-8 border-t border-white/5 pt-6 w-full justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {SOCIAL_LINKS.map((link) => {
                const Icon =
                  link.platform === "instagram"
                    ? RiInstagramFill
                    : link.platform === "youtube"
                    ? RiYoutubeFill
                    : link.platform === "linkedin"
                    ? RiLinkedinBoxFill
                    : RiTwitterXFill;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-festival-gold transition-colors duration-300"
                    aria-label={link.label}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
