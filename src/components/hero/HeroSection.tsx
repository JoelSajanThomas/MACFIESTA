"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HeroScene } from "../three/HeroScene";
import { CountdownTimer } from "./CountdownTimer";
import { MusicVisualizer } from "./MusicVisualizer";
import { FESTIVAL_CONFIG } from "@/lib/constants";
import { RiPlayLine, RiCalendarEventLine } from "react-icons/ri";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlayingRef = useRef(false);
  const scrollPausedRef = useRef(false);

  const setPlayState = (val: boolean) => {
    setIsPlaying(val);
    isPlayingRef.current = val;
  };

  useEffect(() => {
    // Instantiate audio object on mount
    const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const startPlayback = () => {
      audio.play().then(() => {
        setPlayState(true);
      }).catch(() => {
        console.log("Autoplay blocked by browser. Awaiting user interaction to play.");
        
        const handleInteraction = () => {
          audio.play().then(() => {
            setPlayState(true);
          }).catch(e => console.log("Playback still blocked:", e));

          window.removeEventListener("click", handleInteraction);
          window.removeEventListener("keydown", handleInteraction);
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
      });
    };

    const handleScroll = () => {
      const scrollThreshold = 400;
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

    window.addEventListener("scroll", handleScroll);

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
    audio.volume = 0.4; // Restore standard background volume level

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

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-festival-dark pt-24 md:pt-32">
      {/* 3D background */}
      <HeroScene />

      {/* Background vignette & gradient overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#030712_90%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-festival-dark to-transparent z-[1] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-festival-gold/30 bg-festival-gold/10 text-festival-gold text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <RiCalendarEventLine className="animate-pulse" />
              <span>MACFAST College Festival</span>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-hero tracking-tighter"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="block gradient-text-gold neon-gold uppercase">
                  {FESTIVAL_CONFIG.name}
                </span>
                <span className="block text-white text-5xl md:text-8xl font-black mt-2">
                  {FESTIVAL_CONFIG.year}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-subtitle font-medium text-white/80 max-w-xl"
              >
                {FESTIVAL_CONFIG.subtitle} — {FESTIVAL_CONFIG.tagline}. Prepare to compete, excel, and witness the ultimate celebration of talent.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/signup" className="btn-primary group">
                <span>Register Now</span>
                <RiPlayLine className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/events" className="btn-outline">
                <span>Explore Events</span>
              </Link>
            </motion.div>
          </div>

          {/* Countdown & Music Visualizer Panel */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/10 w-full max-w-md space-y-6 md:space-y-8 flex flex-col items-center lg:items-end shadow-2xl relative"
            >
              {/* Corner neon decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-festival-gold/50 rounded-tl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-festival-gold/50 rounded-br" />

              <div className="w-full text-center lg:text-right space-y-1">
                <h3
                  className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  FESTIVAL COUNTDOWN
                </h3>
                <p className="text-sm font-semibold text-festival-gold">
                  United to Excel
                </p>
              </div>

              <div className="flex justify-center w-full">
                <CountdownTimer />
              </div>

              <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Play/Pause music button */}
                  <button
                    onClick={togglePlay}
                    className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer shadow-lg flex items-center justify-center ${
                      isPlaying 
                        ? "bg-festival-gold border-festival-gold text-festival-dark shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-105" 
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-105"
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
                  <div className="text-left">
                    <p className="text-[10px] text-white/30 tracking-widest uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                      FESTIVAL BEATS
                    </p>
                    <p className={`text-xs font-bold transition-colors duration-300 ${isPlaying ? "text-festival-gold animate-pulse" : "text-white/40"}`}>
                      {isPlaying ? "PLAYING AUDIO..." : "AUDIO MUTED"}
                    </p>
                  </div>
                </div>
                <MusicVisualizer isPlaying={isPlaying} />
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Decorative Ticker */}
      <div className="w-full glass py-3 border-y border-white/5 overflow-hidden z-10 pointer-events-none">
        <div className="flex animate-ticker whitespace-nowrap gap-8 text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/50" style={{ fontFamily: "var(--font-heading)" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-8 items-center">
              <span>★ 26+ EVENTS</span>
              <span className="text-festival-gold">★ PRIZE POOL WORTH 2 LAKHS</span>
              <span>★ CULTURAL FEST</span>
              <span className="text-festival-purple">★ CODING TOURNAMENTS</span>
              <span>★ GAMING ARENA</span>
              <span className="text-festival-pink">★ PRO SHOW & CONCERT</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
