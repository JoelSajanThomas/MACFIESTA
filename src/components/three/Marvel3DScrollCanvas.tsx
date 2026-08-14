"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMovie2Line, RiCompass3Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const TOTAL_FRAMES = 169;

interface Marvel3DScrollCanvasProps {
  initialSequence?: "frames" | "frames2";
  showHud?: boolean;
}

export function Marvel3DScrollCanvas({
  initialSequence = "frames",
  showHud = false,
}: Marvel3DScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sequence, setSequence] = useState<"frames" | "frames2">(initialSequence);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hudVisible, setHudVisible] = useState(true);

  // Mouse tilt state
  const mouseTiltRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Frame cache for active sequence
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  // Generate frame path
  const getFramePath = useCallback((seq: string, index: number) => {
    const padded = String(index).padStart(4, "0");
    return `/MARVEL/${seq}/frame_${padded}.jpg`;
  }, []);

  // Preload frames
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(TOTAL_FRAMES + 1);
    setLoadedCount(0);
    setIsReady(false);

    let count = 0;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(sequence, 1);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[1] = firstImg;
      count++;
      setLoadedCount(count);
      setIsReady(true);
      drawFrame(1);
    };

    // Load remaining frames in batches
    const loadRemaining = () => {
      for (let i = 2; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFramePath(sequence, i);
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[i] = img;
          count++;
          setLoadedCount(count);
        };
        img.onerror = () => {
          if (isCancelled) return;
          count++;
          setLoadedCount(count);
        };
      }
    };

    // Trigger after a tiny tick to prioritize first frame
    const timer = setTimeout(loadRemaining, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [sequence, getFramePath]);

  // Draw frame to canvas with object-fit: cover
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Fallback search if current frame isn't loaded yet: search nearest loaded frame
    let imgToDraw = imagesRef.current[frameIdx];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      // Find nearest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[frameIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          imgToDraw = prev;
          break;
        }
        const next = imagesRef.current[frameIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          imgToDraw = next;
          break;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate aspect ratio cover
    const imgWidth = imgToDraw.naturalWidth;
    const imgHeight = imgToDraw.naturalHeight;
    const imgAspect = imgWidth / imgHeight;
    const canvasAspect = width / height;

    let renderWidth = width;
    let renderHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasAspect > imgAspect) {
      // Canvas is wider than image
      renderHeight = width / imgAspect;
      offsetY = (height - renderHeight) / 2;
    } else {
      // Canvas is taller than image
      renderWidth = height * imgAspect;
      offsetX = (width - renderWidth) / 2;
    }

    ctx.drawImage(imgToDraw, offsetX, offsetY, renderWidth, renderHeight);
  }, []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Mouse move tilt handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseTiltRef.current.targetX = nx * 5; // max 5deg tilt
      mouseTiltRef.current.targetY = ny * -5;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking & continuous smooth animation loop
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      setScrollProgress(progress);

      // Map progress [0, 1] to frame index [1, TOTAL_FRAMES]
      const targetIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.floor(progress * (TOTAL_FRAMES - 1)) + 1));
      targetFrameRef.current = targetIdx;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Smooth RAF render loop (Lerp interpolation)
    let isRunning = true;
    const renderLoop = () => {
      if (!isRunning) return;

      // Smooth frame scrubbing
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.12; // Physics lerp
        const frameToDraw = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrameRef.current)));
        setCurrentFrameIndex(frameToDraw);
        drawFrame(frameToDraw);
      }

      // Smooth mouse tilt
      const tilt = mouseTiltRef.current;
      tilt.x += (tilt.targetX - tilt.x) * 0.05;
      tilt.y += (tilt.targetY - tilt.y) * 0.05;

      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.02)`;
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  const toggleSequence = () => {
    setSequence((prev) => (prev === "frames" ? "frames2" : "frames"));
  };

  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* ─── 3D Fixed Viewport Canvas Container ─── */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#05050A]">
        {/* Animated Perspective Wrapper */}
        <div
          ref={containerRef}
          className="relative w-full h-full transition-transform duration-75 ease-out will-change-transform"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover filter brightness-[1.03] contrast-[1.08]"
          />

          {/* Cinematic Vignette & Ambient Hologram Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,10,0.85)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-marvel-red/5 mix-blend-color-dodge pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#05050A]/90 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#05050A] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ─── Stark S.H.I.E.L.D. Holographic Frame HUD ─── */}
      {showHud && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
          <AnimatePresence>
            {hudVisible && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="stark-panel px-4 py-2.5 rounded-xl border border-arc-cyan/30 bg-[#05050A]/85 backdrop-blur-xl shadow-[0_0_25px_rgba(0,212,255,0.2)] flex items-center gap-3 font-space text-xs text-white"
              >
                {/* Rotating Arc Reactor Icon */}
                <div className="w-2.5 h-2.5 rounded-full bg-arc-cyan animate-pulse shadow-[0_0_8px_#00D4FF]" />

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-bold text-arc-cyan tracking-wider text-[10px]">
                      3D TIMELINE
                    </span>
                    <span className="text-[10px] text-white/50">
                      FRAME {String(currentFrameIndex).padStart(3, "0")} / {TOTAL_FRAMES}
                    </span>
                  </div>
                  <div className="w-28 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-arc-cyan to-marvel-red transition-all duration-75"
                      style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Sequence Switch Button */}
                <button
                  onClick={toggleSequence}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-arc-cyan/20 border border-white/10 hover:border-arc-cyan/50 text-[10px] font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
                  title="Switch Marvel 3D Sequence"
                >
                  <RiMovie2Line className="text-arc-cyan" />
                  <span>SEQ {sequence === "frames" ? "1" : "2"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle HUD visibility button */}
          <button
            onClick={() => setHudVisible((v) => !v)}
            className="p-2 rounded-full bg-[#05050A]/70 hover:bg-[#05050A] border border-white/10 hover:border-arc-cyan/40 text-white/60 hover:text-arc-cyan transition-all text-xs shadow-lg backdrop-blur-md cursor-pointer"
            aria-label="Toggle 3D HUD"
          >
            {hudVisible ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>
      )}

      {/* ─── Initial Stream Preloader Indicator (fades out once ready) ─── */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05050A]"
          >
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-marvel-red/20 border-t-marvel-red border-r-arc-cyan animate-spin" />
              <div className="font-orbitron text-xs tracking-widest text-arc-cyan animate-pulse">
                INITIALIZING 3D MARVEL TIMELINE...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
