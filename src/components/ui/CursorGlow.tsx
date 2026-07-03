"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle radial glow that follows the cursor.
 * Hidden on touch devices.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const glow = glowRef.current;
    if (!glow) return;

    glow.style.opacity = "1";

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div ref={glowRef} className="cursor-glow" style={{ opacity: 0 }} />;
}
