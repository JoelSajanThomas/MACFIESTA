"use client";

import { useState, useEffect } from "react";
import { getTimeRemaining } from "@/lib/utils";
import { FESTIVAL_CONFIG } from "@/lib/constants";
import { useFestivalControl } from "@/lib/festivalStore";

/**
 * Animated flip-clock style countdown timer.
 * Each unit (days/hours/minutes/seconds) is displayed in a glassmorphism card.
 */
export function CountdownTimer() {
  const { timeline } = useFestivalControl();
  const [timeLeft, setTimeLeft] = useState({ total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  const targetDate = timeline.festStartDate ? new Date(timeline.festStartDate) : FESTIVAL_CONFIG.festivalDate;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
      setTimeLeft(getTimeRemaining(targetDate));
      timer = setInterval(() => {
        setTimeLeft(getTimeRemaining(targetDate));
      }, 1000);
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (timer) clearInterval(timer);
    };
  }, [timeline.festStartDate]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 opacity-0">
        <span className="text-xs uppercase font-bold text-white/40 tracking-widest">Loading Timer...</span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <div className="flex flex-col items-center">
            <div className="glass relative overflow-hidden rounded-xl px-1.5 py-1.5 sm:px-2 sm:py-2 md:px-2.5 md:py-2.5 min-w-[40px] sm:min-w-[48px] md:min-w-[52px]">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
              <span
                className="relative z-10 block text-center text-sm sm:text-lg md:text-xl font-black text-festival-gold tabular-nums"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span
              className="mt-1.5 text-[6.5px] sm:text-[7px] md:text-[7.5px] text-white/40 tracking-[0.2em] mr-[-0.2em] uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {unit.label}
            </span>
          </div>
          {/* Separator dots */}
          {i < units.length - 1 && (
            <div className="flex flex-col gap-1 pb-3">
              <div className="w-[2.5px] h-[2.5px] sm:w-[3px] sm:h-[3px] rounded-full bg-festival-gold/50 animate-pulse" />
              <div className="w-[2.5px] h-[2.5px] sm:w-[3px] sm:h-[3px] rounded-full bg-festival-gold/50 animate-pulse" style={{ animationDelay: "0.3s" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
