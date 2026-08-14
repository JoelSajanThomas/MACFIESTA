"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  enable3DTilt?: boolean;
  laserColor?: "cyan" | "red" | "gold" | "purple";
}

const LASER_GRADIENTS = {
  cyan: "from-transparent via-[#00D4FF] to-transparent",
  red: "from-transparent via-[#ED1D24] to-transparent",
  gold: "from-transparent via-[#D4AF37] to-transparent",
  purple: "from-transparent via-[#7B2FBE] to-transparent",
};

export function ScrollRevealWrapper({
  children,
  id,
  className = "",
  enable3DTilt = true,
  laserColor = "cyan",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position of this section relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 140, damping: 22, restDelta: 0.001 };

  // Scroll-driven 3D transforms
  const rawRotateX = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [10, 0, 0, -10]);
  const rawScale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.92, 1, 1, 0.94]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);
  const rawY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [60, 0, 0, -60]);

  // Laser beam fill line progress (0 -> 1 when section is entering center)
  const laserProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  const rotateX = useSpring(rawRotateX, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const opacity = useSpring(rawOpacity, springConfig);
  const y = useSpring(rawY, springConfig);

  const laserGradient = LASER_GRADIENTS[laserColor] || LASER_GRADIENTS.cyan;

  return (
    <div ref={containerRef} id={id} className={`relative w-full ${className}`}>
      {/* ─── Scroll-Driven Laser Energy Tracer Line ─── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none overflow-hidden">
        <motion.div
          className={`h-full w-full bg-gradient-to-r ${laserGradient}`}
          style={{ scaleX: laserProgress, transformOrigin: "center" }}
        />
      </div>

      {/* ─── 3D Perspective Section Container ─── */}
      <div style={{ perspective: "1400px" }}>
        <motion.div
          style={
            enable3DTilt
              ? {
                  rotateX,
                  scale,
                  opacity,
                  y,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }
              : { opacity }
          }
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
