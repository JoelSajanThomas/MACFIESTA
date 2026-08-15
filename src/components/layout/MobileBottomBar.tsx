"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RiHome5Line,
  RiHome5Fill,
  RiCompass3Line,
  RiCompass3Fill,
  RiTimeLine,
  RiTimeFill,
  RiTrophyLine,
  RiTrophyFill,
  RiTicketLine,
  RiTicketFill,
} from "react-icons/ri";

const MOBILE_TABS = [
  { label: "Home", href: "/", icon: RiHome5Line, activeIcon: RiHome5Fill },
  { label: "Missions", href: "/events", icon: RiCompass3Line, activeIcon: RiCompass3Fill },
  { label: "Timeline", href: "/schedule", icon: RiTimeLine, activeIcon: RiTimeFill },
  { label: "Scores", href: "/scoreboard", icon: RiTrophyLine, activeIcon: RiTrophyFill },
  { label: "Pass", href: "/signup", icon: RiTicketLine, activeIcon: RiTicketFill },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  // Hide on admin and standalone dashboards to prevent overlapping console UI
  const isStandalone =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/volunteer") ||
    pathname?.startsWith("/volunteers") ||
    pathname?.startsWith("/judge") ||
    pathname?.startsWith("/judges");

  if (isStandalone) return null;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-[90] xl:hidden pointer-events-none pb-[env(safe-area-inset-bottom)] px-2 sm:px-4">
      <nav
        aria-label="Mobile Navigation Dock"
        className="max-w-[380px] sm:max-w-md mx-auto pointer-events-auto bg-[#05050A]/92 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(0,212,255,0.15)] flex items-center justify-between font-space py-1.5 px-1 sm:px-2"
      >
        {MOBILE_TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(tab.href);
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-arc-cyan font-bold scale-105"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <motion.div
                  layoutId="mobile-dock-active"
                  className="absolute inset-0 bg-arc-cyan/20 border border-arc-cyan/40 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-0.5 w-full text-center">
                <Icon
                  className={`text-base sm:text-lg transition-transform duration-200 ${
                    isActive ? "scale-110 drop-shadow-[0_0_8px_#00D4FF]" : ""
                  }`}
                />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold truncate max-w-full">
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
