"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS, FESTIVAL_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { useFestivalControl } from "@/lib/festivalStore";
import { cn } from "@/lib/utils";
import {
  RiInstagramFill,
  RiYoutubeFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
  RiMenuLine,
  RiCloseLine,
  RiShieldFlashLine,
  RiRobot2Line,
  RiFlashlightLine,
} from "react-icons/ri";
import { useAuthStore } from "@/lib/authStore";

const mainNavItems = [
  { label: "Mission Control", href: "/" },
  { label: "Missions", href: "/events" },
  { label: "Timeline", href: "/schedule" },
  { label: "Scoreboard", href: "/scoreboard" },
  { label: "Quarters", href: "/accommodation" },
  { label: "Comms", href: "/contact" },
];

const dropdownNavItems = [
  { label: "About Fest", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Hall of Heroes", href: "/results" },
];

export function Navbar() {
  const { initialize, user, logout } = useAuthStore();
  const { settings } = useFestivalControl();
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isStandalonePage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/volunteer") ||
    pathname?.startsWith("/volunteers") ||
    pathname?.startsWith("/judge") ||
    pathname?.startsWith("/judges");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollY, scrollYProgress } = useScroll();

  useEffect(() => {
    initialize();
  }, [initialize]);

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

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest * 100);
  });

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

  if (isStandalonePage) return null;

  return (
    <>
      {/* ─── Scroll Progress Bar ─── */}
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          scrolled
            ? "glass-strong py-2.5 border-b border-arc-cyan/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "py-4 bg-gradient-to-b from-black/80 to-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex justify-start items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group" aria-label="MacFiesta Home">
              <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt={`${settings.name} ${settings.edition} Logo`}
                  width={44}
                  height={44}
                  className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-white tracking-wide text-xl md:text-2xl uppercase flex items-center gap-1 group-hover:opacity-90 transition-opacity duration-300 font-anton"
                >
                  <span className="shimmer-text">MACFIESTA</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.28em] text-arc-cyan uppercase flex items-center gap-1 font-space">
                  <RiShieldFlashLine className="animate-pulse" /> MARVELVERSE
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop HUD Navigation */}
          <div className="hidden xl:flex justify-center items-center gap-1.5 flex-initial bg-black/60 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-md shadow-[0_0_25px_rgba(0,212,255,0.08)] font-space">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-all duration-300 rounded-full ${isActive
                      ? "bg-marvel-red text-white shadow-[0_0_18px_#ED1D24]"
                      : "text-white/75 hover:text-arc-cyan hover:bg-white/5"
                    }`}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-arc-cyan shadow-[0_0_8px_#00D4FF]"
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}

            {/* Dropdown Menu */}
            <div className="relative group py-1">
              <button
                type="button"
                suppressHydrationWarning={true}
                className="px-3.5 py-1.5 text-[11px] font-bold text-white/75 hover:text-arc-cyan transition-colors tracking-[0.16em] uppercase flex items-center gap-1 cursor-default"
              >
                <span>HQ Hub</span>
                <span className="text-[8px] transition-transform duration-300 group-hover:rotate-180">▼</span>
              </button>

              <div
                className="absolute top-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 glass-strong border border-arc-cyan/30 rounded-xl p-1.5 w-44 shadow-2xl z-50 flex flex-col gap-0.5 font-space"
              >
                {dropdownNavItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="px-4 py-2.5 text-[10px] font-bold text-white/75 hover:text-arc-cyan hover:bg-arc-cyan/10 rounded-lg transition-colors uppercase tracking-[0.14em] text-center"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="hidden xl:flex justify-end items-center gap-3 flex-1 font-space">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href={settings.socialInstagram || SOCIAL_LINKS[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-arc-cyan/30 bg-arc-cyan/10 text-arc-cyan hover:bg-arc-cyan hover:text-black text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 shadow-[0_0_12px_rgba(0,212,255,0.25)] hover:shadow-[0_0_20px_rgba(0,212,255,0.6)]"
            >
              <RiFlashlightLine />
              <span>S.H.I.E.L.D. Link</span>
            </motion.a>

            {user ? (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="px-4 py-1.5 text-[11px] font-bold bg-marvel-red text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 tracking-[0.15em] uppercase shadow-[0_0_18px_#ED1D24] block"
                  >
                    {user.role === "admin" ? "Command Console" : "Agent HUD"}
                  </Link>
                </motion.div>
                {!isAdminPage && (
                  <button
                    type="button"
                    suppressHydrationWarning={true}
                    onClick={logout}
                    className="px-3 py-1.5 text-[10px] font-bold text-white/50 hover:text-marvel-red transition-colors tracking-widest uppercase cursor-pointer"
                  >
                    Abort
                  </button>
                )}
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signin"
                  className="px-4 py-1.5 text-[11px] font-black text-black bg-metallic-gold border border-metallic-gold rounded-full hover:bg-white hover:border-white transition-all duration-300 tracking-[0.16em] uppercase shadow-[0_0_18px_rgba(212,175,55,0.5)] hover:shadow-[0_0_25px_rgba(212,175,55,0.8)] block"
                >
                  Agent Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            suppressHydrationWarning={true}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-white/80 hover:text-arc-cyan transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-festival-dark/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 xl:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Decorative glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-marvel-red/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-arc-cyan/10 blur-[80px] pointer-events-none" />

            <nav className="flex flex-col items-center gap-5 max-h-[70vh] overflow-y-auto w-full py-4 select-scrollbar relative z-10">
              {mainNavItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`text-xl font-bold tracking-widest uppercase transition-all duration-300 font-syne hover:text-arc-cyan ${pathname === item.href ? "text-marvel-red glow-text-red" : "text-white/80"
                      }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="h-px w-16 bg-arc-cyan/30 my-2" />

              {dropdownNavItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: (mainNavItems.length + i) * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className="text-lg font-bold text-metallic-gold hover:text-white transition-colors tracking-widest uppercase font-syne"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={closeMobile}
                    className="px-6 py-2.5 text-sm font-black bg-marvel-red text-white rounded-full tracking-widest uppercase shadow-[0_0_20px_#ED1D24] font-space"
                  >
                    {user.role === "admin" ? "Command Console" : "Agent HUD"}
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <Link
                    href="/signin"
                    onClick={closeMobile}
                    className="px-6 py-2.5 text-sm font-black bg-metallic-gold text-black rounded-full tracking-widest uppercase shadow-[0_0_20px_#FFD700] font-space"
                  >
                    Agent Login
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
