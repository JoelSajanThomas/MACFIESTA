"use client";

import { motion } from "framer-motion";

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
  laserColor = "cyan",
}: ScrollRevealProps) {
  const laserGradient = LASER_GRADIENTS[laserColor] || LASER_GRADIENTS.cyan;

  return (
    <div id={id} className={`relative w-full ${className}`}>
      {/* ─── Scroll Energy Tracer Line ─── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-30 pointer-events-none overflow-hidden opacity-60">
        <div className={`h-full w-full bg-gradient-to-r ${laserGradient}`} />
      </div>

      {/* ─── Lightweight GPU-Accelerated Viewport Reveal ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
