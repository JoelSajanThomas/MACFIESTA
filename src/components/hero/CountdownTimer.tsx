"use client";

import { useState, useEffect, useCallback } from "react";
import { getTimeRemaining } from "@/lib/utils";
import { FESTIVAL_CONFIG } from "@/lib/constants";

/**
 * Animated flip-clock style countdown timer.
 * Each unit (days/hours/minutes/seconds) is displayed in a glassmorphism card.
 */
export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeRemaining(FESTIVAL_CONFIG.festivalDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(FESTIVAL_CONFIG.festivalDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-center">
            <div className="glass relative overflow-hidden rounded-xl px-3 py-3 md:px-5 md:py-4 min-w-[60px] md:min-w-[80px]">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
              <span
                className="relative z-10 block text-center text-2xl md:text-4xl font-black text-festival-gold tabular-nums"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span
              className="mt-2 text-[9px] md:text-[10px] text-white/40 tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {unit.label}
            </span>
          </div>
          {/* Separator dots */}
          {i < units.length - 1 && (
            <div className="flex flex-col gap-1 pb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-festival-gold/50 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-festival-gold/50 animate-pulse" style={{ animationDelay: "0.3s" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
