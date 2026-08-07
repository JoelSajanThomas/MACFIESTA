"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CountdownTimer } from "./CountdownTimer";
import { MusicVisualizer } from "./MusicVisualizer";
import { RiPlayLine, RiShieldFlashLine, RiFlashlightLine, RiCompass3Line } from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";

export function HeroSection() {
  const { settings } = useFestivalControl();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlayingRef = useRef(false);
  const scrollPausedRef = useRef(false);

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

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#05050A] pt-24 md:pt-32">
      {/* Background Marvel 3025924746959430.jpg Wallpaper & Dynamic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/MARVEL/3025924746959430.jpg"
          alt="Welcome to MacFiesta Marvel Wallpaper Background"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-125 opacity-90 scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/30 to-[#05050A]/40 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(5,5,10,0.8)_95%)] z-[1]" />



        {/* Floating Iron Man Overlay Graphic */}
        <div className="absolute top-10 right-8 opacity-35 hidden xl:block pointer-events-none z-[2]">
          <Image
            src="/MARVEL/ironman.png"
            alt="Iron Man"
            width={360}
            height={360}
            className="object-contain animate-float drop-shadow-[0_0_30px_rgba(237,29,36,0.7)]"
          />
        </div>
      </div>


      {/* Main Content Area */}
      <div className="relative z-10 flex-grow flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Hero Text Content */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-marvel-red/40 bg-marvel-red/10 text-marvel-red text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(237,29,36,0.3)]"
            >
              <RiShieldFlashLine className="animate-pulse text-sm" />
              <span>AVENGERS HEADQUARTERS DIRECTIVE • {settings.edition}</span>
            </motion.div>

            <div className="space-y-3 w-full">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-hero tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="block text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase font-mono tracking-widest text-arc-cyan">
                  WELCOME TO
                </span>
                <span className="block marvel-bang-comic-gradient uppercase pr-4 text-5xl sm:text-7xl lg:text-8xl tracking-tight">
                  {settings.name.toUpperCase()}
                </span>
                <span className="block text-marvel-red text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.2em] font-mono mt-1 drop-shadow-[0_0_20px_#ED1D24]">
                  MARVELVERSE
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-subtitle font-medium text-white/80 max-w-xl mx-auto lg:mx-0 font-mono"
              >
                "Every Hero Has A Mission." — Earth's premier college festival at MACFAST. Prepare your suit, verify your squad, and assemble for victory across 26 high-level missions.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4 w-full"
            >
              <Link href="/signup" className="btn-primary group shadow-[0_0_25px_#ED1D24]">
                <span>{settings.registrationOpen ? "Register Now" : "Registration Closed"}</span>
                <RiPlayLine className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/events" className="btn-outline border-arc-cyan text-white hover:bg-arc-cyan/20">
                <RiCompass3Line className="text-arc-cyan" />
                <span>View Events</span>
              </Link>
            </motion.div>
          </div>

          {/* Countdown & Music Visualizer Panel (Stark Industries HUD) */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="stark-panel p-5 md:p-6 rounded-2xl w-[92%] sm:w-full max-w-[340px] space-y-5 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_15px_rgba(0,212,255,0.2)] relative"
            >
              {/* Corner HUD Markers */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-arc-cyan/70 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-arc-cyan/70 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-marvel-red/70 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-marvel-red/70 rounded-br" />

              <div className="w-full text-center space-y-1">
                <h3
                  className="text-xs font-mono font-bold text-arc-cyan tracking-[0.25em] uppercase flex items-center justify-center gap-1.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <RiFlashlightLine /> S.H.I.E.L.D. MISSION COUNTDOWN
                </h3>
                <p className="text-xs font-semibold text-metallic-gold font-mono">
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
                  <div className="text-left font-mono">
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
      </div>

      {/* MCU Ticker Tape */}
      <div className="w-full glass py-2.5 border-y border-arc-cyan/20 overflow-hidden z-10 pointer-events-none bg-black/60">
        <div className="flex animate-ticker whitespace-nowrap gap-10 text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-white/60">
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
    </section>
  );
}
