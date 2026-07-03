"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen loading/splash screen shown on initial page load.
 * Features animated MacFiesta logo text and a progress bar.
 */
export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 25 + 5;
      });
    }, 150);

    // Hide loading screen after animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ background: "#030712" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(234,179,8,0.08) 40%, transparent 70%)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Logo text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h1
              className="text-5xl md:text-7xl font-black tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="gradient-text-gold">MAC</span>
              <span className="text-white">FIESTA</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center text-sm tracking-[0.3em] mt-2 text-festival-gold/70 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              United to Excel
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 mt-12 w-48"
          >
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-gold rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-center text-xs text-white/30 mt-3 tracking-widest uppercase"
               style={{ fontFamily: "var(--font-heading)" }}>
              Loading Experience
            </p>
          </motion.div>

          {/* Decorative particles (deterministic styling to prevent hydration mismatch) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => {
              const leftVal = (i * 37 + 13) % 100;
              const topVal = (i * 41 + 7) % 100;
              const duration = 2 + ((i * 13) % 7) * 0.3;
              const delay = ((i * 17) % 9) * 0.15;

              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: `${leftVal}%`,
                    top: `${topVal}%`,
                    background: i % 3 === 0 ? "#EAB308" : i % 3 === 1 ? "#7C3AED" : "#06B6D4",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    y: [0, -30, -60],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
