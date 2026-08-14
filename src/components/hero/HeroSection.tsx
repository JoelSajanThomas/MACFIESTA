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

/* ─── Stagger container ─── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 60, rotateX: 30 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  const { settings } = useFestivalControl();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const isPlayingRef = useRef(false);
  const scrollPausedRef = useRef(false);

  /* ─── Parallax ─── */
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "25%"]);
  const bgScale = useTransform(scrollY, [0, 600], [1.02, 1.08]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -40]);

  const setPlayState = (val: boolean) => {
    setIsPlaying(val);
    isPlayingRef.current = val;
  };

  useEffect(() => {
    const audio = new Audio(encodeURI("/ULTRA NATÉ - Movin To The Sun.mp3"));
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const startPlayback = () => {
      audio.play().then(() => {
        setPlayState(true);
      }).catch(() => {
        const handleInteraction = () => {
          audio.play().then(() => {
            setPlayState(true);
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

    const handleScroll = () => {
      const scrollThreshold = 100;
      if (window.scrollY > scrollThreshold) {
        if (isPlayingRef.current) {
          audio.pause();
          setPlayState(false);
          scrollPausedRef.current = true;
        }
      } else {
        if (scrollPausedRef.current && !isPlayingRef.current) {
          audio.play().then(() => {
            setPlayState(true);
            scrollPausedRef.current = false;
          }).catch(err => console.log("Scroll resume blocked:", err));
        }
      }
    };

    const mountDelay = setTimeout(() => {
      startPlayback();
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(mountDelay);
      window.removeEventListener("scroll", handleScroll);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = 0.4;

    if (isPlaying) {
      audio.pause();
      setPlayState(false);
      scrollPausedRef.current = false;
    } else {
      audio.play().then(() => {
        setPlayState(true);
        scrollPausedRef.current = false;
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
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-transparent pt-24 md:pt-32"
    >
      {/* ─── Ambient Glow Accents (Translucent for 3D Canvas) ─── */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-marvel-red/10 blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-arc-cyan/10 blur-[140px]" />
      </div>

      {/* Floating Iron Man */}
      <div className="absolute top-10 right-8 opacity-35 hidden xl:block pointer-events-none z-[3]">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/MARVEL/ironman.png"
            alt="Iron Man"
            width={360}
            height={360}
            className="object-contain drop-shadow-[0_0_30px_rgba(237,29,36,0.7)]"
          />
        </motion.div>
      </div>

      {/* ─── Main Content ─── */}
      <motion.div
        className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Hero Text */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-marvel-red/40 bg-marvel-red/10 text-marvel-red text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(237,29,36,0.3)] font-space"
            >
              <RiShieldFlashLine className="animate-pulse text-sm" />
              <span>AVENGERS HEADQUARTERS DIRECTIVE • {settings.edition}</span>
            </motion.div>

            {/* Main Title — Staggered words */}
            <motion.div
              className="space-y-1.5 w-full perspective-[1000px] overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={wordVariants}>
                <span
                  className="block text-white text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-widest text-arc-cyan glow-text-cyan"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  WELCOME TO
                </span>
              </motion.div>

              <motion.div variants={wordVariants}>
                <span
                  className="block marvel-bang-comic-gradient uppercase tracking-normal break-words max-w-full font-black drop-shadow-[0_4px_25px_rgba(237,29,36,0.7)]"
                  style={{
                    fontFamily: "var(--font-syne)",
                    fontSize: "clamp(1.8rem, 5.2vw, 4.2rem)",
                    fontWeight: 900,
                    lineHeight: 1.0,
                  }}
                >
                  {settings.name.toUpperCase()}
                </span>
              </motion.div>

              <motion.div variants={wordVariants}>
                <span
                  className="block text-marvel-red text-lg sm:text-2xl lg:text-3xl font-black uppercase tracking-[0.2em] mt-1 glow-text-red"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  MARVELVERSE
                </span>
              </motion.div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="text-white/80 max-w-xl mx-auto lg:mx-0 font-space text-base leading-relaxed"
            >
              &ldquo;Every Hero Has A Mission.&rdquo; — Earth&apos;s premier college festival at MACFAST.
              Prepare your suit, verify your squad, and assemble for victory across{" "}
              <span className="text-arc-cyan font-semibold">26 high-level missions</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.65 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 w-full"
            >
              <Link href="/signup" className="btn-urgency group">
                <span className="relative z-10">
                  {settings.registrationOpen ? "Register Now" : "Registration Closed"}
                </span>
                <RiPlayLine className="group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link href="/events" className="btn-outline border-arc-cyan text-white hover:bg-arc-cyan/20">
                <RiCompass3Line className="text-arc-cyan" />
                <span>View Events</span>
              </Link>
            </motion.div>
          </div>

          {/* Countdown & Music Visualizer — Stark HUD */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="stark-panel p-5 md:p-6 rounded-2xl w-[92%] sm:w-full max-w-[340px] space-y-5 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,212,255,0.15)] relative border-glow-flow"
            >
              {/* Corner HUD Markers */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-arc-cyan/70 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-arc-cyan/70 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-marvel-red/70 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-marvel-red/70 rounded-br" />

              <div className="w-full text-center space-y-1">
                <h3
                  className="text-xs font-bold text-arc-cyan tracking-[0.25em] uppercase flex items-center justify-center gap-1.5 font-orbitron"
                >
                  <RiFlashlightLine /> S.H.I.E.L.D. MISSION COUNTDOWN
                </h3>
                <p className="text-xs font-semibold text-metallic-gold font-space">
                  {settings.motto}
                </p>
              </div>

              <div className="flex justify-center w-full">
                <CountdownTimer />
              </div>

              <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center ${isPlaying
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
                    <p className="text-[9px] text-white/40 tracking-widest uppercase">
                      AVENGERS AUDIO HUD
                    </p>
                    <p className={`text-xs font-bold transition-colors duration-300 ${isPlaying ? "text-arc-cyan animate-pulse" : "text-white/40"}`}>
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
      <div className="w-full glass py-2.5 border-y border-arc-cyan/20 overflow-hidden z-10 pointer-events-none bg-black/60">
        <div className="flex animate-ticker whitespace-nowrap gap-10 text-[11px] font-bold tracking-[0.25em] uppercase text-white/60 font-space">
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

      {/* ─── Scroll Indicator ─── */}
      <motion.button
        onClick={scrollToNext}
        className="scroll-indicator absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
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
