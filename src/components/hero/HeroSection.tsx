"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CountdownTimer } from "./CountdownTimer";
import { MusicVisualizer } from "./MusicVisualizer";
import {
  RiPlayLine,
  RiShieldFlashLine,
  RiFlashlightLine,
  RiCompass3Line,
  RiArrowDownLine,
} from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";

/* ─── Reference Design Framer Motion Animation Variants ─── */
const customEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const heroTitleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: customEase,
    },
  },
};

const heroSubtextVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.15,
      ease: customEase,
    },
  },
};

const heroCtaVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: customEase,
    },
  },
};

const heroYearSlideVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: customEase,
    },
  },
};

export function HeroSection() {
  const { settings } = useFestivalControl();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const isPlayingRef = useRef(false);
  const userMutedRef = useRef(false);
  const maxVolume = 0.4;

  /* ─── Parallax ─── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background layer moves at 30% scroll speed (y: 0% -> 30%)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Title/text layer moves at 60% scroll speed (y: 0% -> 60%) and fades out (opacity 1 -> 0) by 80% scroll progress
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const setPlayState = (val: boolean) => {
    setIsPlaying(val);
    isPlayingRef.current = val;
  };

  useEffect(() => {
    const audio = new Audio(encodeURI("/ULTRA NATÉ - Movin To The Sun.mp3"));
    audio.loop = true;
    audio.volume = maxVolume;
    audioRef.current = audio;

    let fadeRaf: number;

    const updateVolumeOnScroll = () => {
      if (!audioRef.current || userMutedRef.current) return;

      const fadeDistance = Math.max(320, window.innerHeight * 0.65);
      const scrollY = window.scrollY;
      const factor = Math.max(0, Math.min(1, 1 - scrollY / fadeDistance));
      const targetVol = maxVolume * factor;

      audio.volume = Math.max(0, Math.min(maxVolume, targetVol));

      if (factor <= 0.02) {
        if (!audio.paused) {
          audio.pause();
          setPlayState(false);
        }
      } else {
        if (audio.paused && !userMutedRef.current) {
          audio.play().then(() => {
            setPlayState(true);
          }).catch(() => {});
        } else if (!audio.paused && !isPlayingRef.current) {
          setPlayState(true);
        }
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(fadeRaf);
      fadeRaf = requestAnimationFrame(updateVolumeOnScroll);
    };

    const startPlayback = () => {
      if (userMutedRef.current) return;

      audio.play().then(() => {
        setPlayState(true);
        updateVolumeOnScroll();
      }).catch(() => {
        const handleInteraction = () => {
          if (userMutedRef.current) return;
          audio.play().then(() => {
            setPlayState(true);
            updateVolumeOnScroll();
          }).catch(e => console.log("Playback still blocked:", e));

          window.removeEventListener("click", handleInteraction);
          window.removeEventListener("keydown", handleInteraction);
          window.removeEventListener("touchstart", handleInteraction);
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        window.addEventListener("touchstart", handleInteraction);
      });
    };

    const mountDelay = setTimeout(() => {
      startPlayback();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(mountDelay);
      cancelAnimationFrame(fadeRaf);
      window.removeEventListener("scroll", handleScroll);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setPlayState(false);
      userMutedRef.current = true;
    } else {
      userMutedRef.current = false;
      const fadeDistance = Math.max(320, window.innerHeight * 0.65);
      const factor = Math.max(0, Math.min(1, 1 - window.scrollY / fadeDistance));
      audio.volume = maxVolume * Math.max(0.1, factor);
      audio.play().then(() => {
        setPlayState(true);
      }).catch(err => {
        console.error("Audio playback blocked:", err);
      });
    }
  };

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-transparent pt-16 sm:pt-24 md:pt-32 pb-2 sm:pb-6"
    >
      {/* ─── Parallax Ambient Energy Glows ─── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-marvel-red/15 blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-arc-cyan/15 blur-[140px]" />
      </motion.div>

      {/* ─── Main Content / Text Layer (moves at 60% scroll speed: 0% -> 60% and fades out by 80%) ─── */}
      <motion.div
        className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-6 md:py-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-8 lg:gap-12 items-center">

          {/* Hero Text */}
          <div className="lg:col-span-8 space-y-2.5 sm:space-y-5 md:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start relative">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: customEase }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-marvel-red/40 bg-marvel-red/10 text-marvel-red text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-[0.2em] uppercase shadow-[0_0_18px_rgba(237,29,36,0.35)] font-space"
            >
              <RiShieldFlashLine className="animate-pulse text-xs sm:text-sm" />
              <span>AVENGERS HEADQUARTERS • {settings.edition}</span>
            </motion.div>

            {/* Main Title Block */}
            <div className="space-y-1 sm:space-y-2 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: customEase }}
              >
                <span className="block text-arc-cyan text-xs sm:text-lg lg:text-xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] font-space">
                  WELCOME TO
                </span>
              </motion.div>

              {/* Title and Edition */}
              <div className="flex flex-row flex-wrap items-baseline justify-center lg:justify-start gap-1.5 sm:gap-6">
                <motion.h1
                  variants={heroTitleVariants}
                  initial="hidden"
                  animate="visible"
                  className="headline-hero shimmer-text break-words max-w-full font-normal m-0"
                  style={{
                    fontFamily: "var(--font-anton), 'Anton', sans-serif",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.85,
                    fontSize: "clamp(2.3rem, 9.5vw, 9rem)",
                    textTransform: "uppercase",
                  }}
                >
                  {settings.name.toUpperCase()}
                </motion.h1>

                {/* Large "2K26" text */}
                <motion.div
                  variants={heroYearSlideVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center self-center sm:self-auto"
                >
                  <span
                    className="gradient-text-plasma font-normal select-none"
                    style={{
                      fontFamily: "var(--font-anton), 'Anton', sans-serif",
                      letterSpacing: "-0.02em",
                      lineHeight: 0.85,
                      fontSize: "clamp(1.8rem, 6.8vw, 6.5rem)",
                      textTransform: "uppercase",
                    }}
                  >
                    {settings.edition ? settings.edition.toUpperCase() : "2K26"}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: customEase }}
              >
                <span className="block text-marvel-red text-base sm:text-2xl lg:text-4xl font-normal uppercase tracking-[0.16em] sm:tracking-[0.18em] mt-0.5" style={{ fontFamily: "var(--font-anton), 'Anton', sans-serif" }}>
                  MARVELVERSE
                </span>
              </motion.div>
            </div>

            {/* Subtext */}
            <motion.p
              variants={heroSubtextVariants}
              initial="hidden"
              animate="visible"
              className="text-white/85 max-w-xl mx-auto lg:mx-0 font-space text-xs sm:text-base md:text-lg leading-relaxed font-normal"
            >
              &ldquo;Every Hero Has A Mission.&rdquo; — Earth&apos;s premier national collegiate festival at MACFAST. Assemble across{" "}
              <span className="text-arc-cyan font-bold">26 high-level missions</span>.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={heroCtaVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-row justify-center lg:justify-start items-center gap-2 sm:gap-4 pt-1 sm:pt-2 w-full max-w-[340px] sm:max-w-none mx-auto lg:mx-0 px-1"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex-1 min-w-0"
              >
                <Link
                  href="/signup"
                  className="btn-urgency group font-space flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-8 py-2.5 sm:py-3.5 rounded-full shadow-[0_0_25px_rgba(237,29,36,0.5)] hover:shadow-[0_0_40px_rgba(237,29,36,0.8)] transition-shadow duration-300 w-full text-center"
                >
                  <span className="relative z-10 font-bold tracking-[0.08em] sm:tracking-[0.16em] uppercase text-[10.5px] sm:text-sm truncate">
                    {settings.registrationOpen ? "Register Now" : "Closed"}
                  </span>
                  <RiPlayLine className="group-hover:translate-x-1 transition-transform relative z-10 shrink-0 text-xs sm:text-base" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex-1 min-w-0"
              >
                <Link
                  href="/events"
                  className="btn-outline border-arc-cyan text-white hover:bg-arc-cyan/20 font-space flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-shadow duration-300 w-full text-center"
                >
                  <RiCompass3Line className="text-arc-cyan text-xs sm:text-lg shrink-0" />
                  <span className="font-bold tracking-[0.08em] sm:tracking-[0.16em] uppercase text-[10.5px] sm:text-sm truncate">View Events</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Countdown & Music Visualizer — Stark HUD */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="stark-panel p-3 sm:p-5 md:p-6 rounded-2xl w-full max-w-[340px] sm:max-w-[360px] space-y-2.5 sm:space-y-4 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,212,255,0.15)] relative border-glow-flow mx-auto lg:mx-0"
            >
              {/* Corner HUD Markers */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-arc-cyan/70 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-arc-cyan/70 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-marvel-red/70 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-marvel-red/70 rounded-br" />

              <div className="w-full text-center space-y-0.5">
                <h3
                  className="text-[10px] sm:text-xs font-bold text-arc-cyan tracking-[0.2em] sm:tracking-[0.25em] uppercase flex items-center justify-center gap-1.5 font-orbitron"
                >
                  <RiFlashlightLine className="shrink-0" /> S.H.I.E.L.D. COUNTDOWN
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-metallic-gold font-space">
                  {settings.motto}
                </p>
              </div>

              <div className="flex justify-center w-full">
                <CountdownTimer />
              </div>

              <div className="w-full pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={togglePlay}
                    className={`p-2 sm:p-2.5 rounded-full border transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center ${isPlaying
                      ? "bg-marvel-red border-marvel-red text-white shadow-[0_0_15px_#ED1D24] hover:scale-105"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-arc-cyan hover:scale-105"
                      }`}
                    aria-label={isPlaying ? "Pause music" : "Play music"}
                  >
                    {isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <div className="text-left font-space">
                    <p className="text-[8.5px] sm:text-[9px] text-white/40 tracking-widest uppercase">
                      AVENGERS AUDIO HUD
                    </p>
                    <p className={`text-[11px] sm:text-xs font-bold transition-colors duration-300 ${isPlaying ? "text-arc-cyan animate-pulse" : "text-white/40"}`}>
                      {isPlaying ? "BEATS ONLINE..." : "AUDIO MUTED"}
                    </p>
                  </div>
                </div>
                <MusicVisualizer isPlaying={isPlaying} />
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* ─── MCU Ticker Tape ─── */}
      <div className="w-full glass py-2 border-y border-arc-cyan/20 overflow-hidden z-10 pointer-events-none bg-black/60">
        <div className="flex animate-ticker whitespace-nowrap gap-10 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-white/60 font-space">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-10 items-center">
              <span className="text-marvel-red">★ 26 AVENGER MISSIONS</span>
              <span className="text-metallic-gold">★ PRIZE POOL WORTH 20 LAKHS</span>
              <span className="text-arc-cyan">★ STARK CODING WARFARE</span>
              <span className="text-vibranium-purple">★ WAKANDA GAMING ARENA</span>
              <span className="text-white">★ SANCTUM CULTURAL PRO-SHOW</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Scroll Indicator (hidden on small mobile screens to prevent overlap) ─── */}
      <motion.button
        onClick={scrollToNext}
        className="scroll-indicator hidden lg:flex absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
        aria-label="Scroll to next section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-arc-cyan/60 font-space">SCROLL</span>
        <div className="scroll-indicator-line" />
        <RiArrowDownLine className="text-arc-cyan/60 text-lg animate-bounce" />
      </motion.button>
    </section>
  );
}
