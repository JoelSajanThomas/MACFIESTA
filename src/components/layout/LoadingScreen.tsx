"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Box, Sphere, MeshDistortMaterial, Plane } from "@react-three/drei";
import * as THREE from "three";

// Rotating status messages during cinematic loading
const LOADING_STATUSES = [
  "Initializing MacFiesta Pro...",
  "Loading Festival Universe...",
  "Preparing Event Systems...",
  "Calibrating Web Matrix...",
  "Assembling Festival Squads...",
];

/**
 * 3D Nighttime City Skyline with Illuminated Skyscraper Windows
 */
function CitySkyline3D() {
  const cityRef = useRef<THREE.Group>(null!);

  const buildings = useMemo(() => {
    const list = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const height = 3 + Math.random() * 6;
      const width = 0.8 + Math.random() * 1.2;
      const depth = 0.8 + Math.random() * 1.2;
      const x = (Math.random() - 0.5) * 16;
      const z = -2 - Math.random() * 8;
      const color = i % 3 === 0 ? "#0A0D1A" : "#050710";
      const windowGlow = i % 2 === 0 ? "#00D4FF" : "#FFD700";
      list.push({ id: i, height, width, depth, x, z, color, windowGlow });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (cityRef.current) {
      cityRef.current.position.z += delta * 0.2;
      if (cityRef.current.position.z > 2) {
        cityRef.current.position.z = 0;
      }
    }
  });

  return (
    <group ref={cityRef}>
      {buildings.map((b) => (
        <group key={b.id} position={[b.x, b.height / 2 - 4, b.z]}>
          {/* Main Building Structure */}
          <Box args={[b.width, b.height, b.depth]}>
            <meshStandardMaterial color={b.color} roughness={0.8} metalness={0.5} />
          </Box>
          {/* Glowing Window Accents */}
          <mesh position={[0, b.height / 4, b.depth / 2 + 0.01]}>
            <planeGeometry args={[b.width * 0.7, b.height * 0.4]} />
            <meshBasicMaterial color={b.windowGlow} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 3D Swinging Superhero Character & Web Tension Physics
 */
function WebSwinger3D({ progress }: { progress: number }) {
  const heroGroupRef = useRef<THREE.Group>(null!);
  const texture = useLoader(THREE.TextureLoader, "/MARVEL/Spider-man.png");

  // Create THREE.Line instance safely with primitive
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const mat = new THREE.LineBasicMaterial({
      color: "#00D4FF",
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(geom, mat);
  }, []);

  // Dynamic swing pendulum physics
  useFrame((state) => {
    const time = state.clock.elapsedTime * 2.2;
    const swingX = Math.sin(time) * 2.8;
    const swingY = Math.cos(time * 2) * 0.8 + 0.5;
    const swingZ = Math.cos(time) * 0.6;
    const tiltZ = Math.cos(time) * 0.4;

    if (heroGroupRef.current) {
      heroGroupRef.current.position.set(swingX, swingY, swingZ);
      heroGroupRef.current.rotation.z = tiltZ;
      heroGroupRef.current.rotation.y = Math.sin(time) * 0.3;
    }

    // Dynamic 3D Web Strand connected to building top anchor
    if (lineObj) {
      const anchorX = swingX > 0 ? 3.5 : -3.5;
      const points = new Float32Array([
        anchorX, 4.0, -1.0,  // Anchor point high on skyscraper
        swingX, swingY + 0.8, swingZ // Hero hand attachment point
      ]);
      lineObj.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(points, 3)
      );
      lineObj.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 3D Dynamic Tension Web Line */}
      <primitive object={lineObj} />

      {/* 3D Superhero Mesh — Complete Unobstructed Spider-Man Body with Sharp Alpha Clipping */}
      <group ref={heroGroupRef}>
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Plane args={[3.0, 3.0]} position={[0, 0, 0.2]}>
            <meshBasicMaterial
              map={texture}
              transparent
              alphaTest={0.05}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </Plane>
        </Float>
      </group>
    </group>
  );
}

/**
 * 3D Atmospheric Rain & Fog Particles
 */
function RainAndFog3D() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = posAttr.getY(i);
        y -= delta * 8.0; // Falling rain speed
        if (y < -6) y = 6;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00D4FF"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Ultra-Realistic Spider-Man Web Swinging Loading Screen
 */
export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isWebSplatted, setIsWebSplatted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Rotate status messages every 500ms
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % LOADING_STATUSES.length);
    }, 550);

    // Charge progress smoothly from 0 to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsWebSplatted(true);
          return 100;
        }
        return prev + Math.random() * 18 + 8;
      });
    }, 110);

    // Complete loading after final web splat transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2700);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-between bg-[#030308] text-white overflow-hidden select-none py-10 px-4"
          exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Ambient Crimson & Arc Cyan Glow Backdrop */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-marvel-red/10 blur-[140px]" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-arc-cyan/10 blur-[130px]" />
          </div>

          {/* Top Laser Diagnostic Scanning Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-marvel-red via-arc-cyan to-transparent animate-scan-line z-30 opacity-90 shadow-[0_0_20px_#ED1D24]" />

          {/* 3D WebGL Canvas Layer (City + Swinger + Rain) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {isMounted && (
              <Canvas camera={{ position: [0, 0, 5.0], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 8, 5]} intensity={2.0} color="#00D4FF" />
                <pointLight position={[-5, -4, -3]} color="#ED1D24" intensity={3.0} />
                <pointLight position={[5, -4, 3]} color="#FFD700" intensity={2.5} />
                <CitySkyline3D />
                <WebSwinger3D progress={progress} />
                <RainAndFog3D />
              </Canvas>
            )}
          </div>

          {/* Final Web Shot Screen Transition Overlay */}
          <AnimatePresence>
            {isWebSplatted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 z-40 bg-radial from-[#00D4FF]/40 via-marvel-red/30 to-black pointer-events-none flex items-center justify-center"
              >
                <div className="w-96 h-96 rounded-full border-4 border-arc-cyan/80 shadow-[0_0_100px_#00D4FF] animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Header Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 text-center space-y-1 mt-4 pointer-events-none"
          >
            <div className="inline-block bg-marvel-red px-4 py-1 rounded text-[10px] font-extrabold tracking-[0.45em] uppercase text-white shadow-[0_0_25px_#ED1D24] font-mono">
              MACFAST TIRUVALLA • CINEMATIC 3D EXPERIENCE
            </div>
            <p className="text-[10px] tracking-[0.35em] text-arc-cyan font-bold uppercase font-mono">
              AVENGERS TOWER SPIDER-NET DIRECTIVE
            </p>
          </motion.div>

          {/* Bottom Futuristic Tech HUD Indicator */}
          <div className="relative z-20 flex flex-col items-center justify-center space-y-5 w-full max-w-sm pointer-events-none mb-6">
            {/* Circular Futuristic HUD Counter */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex items-center justify-center w-36 h-36 rounded-full border border-arc-cyan/30 bg-black/60 backdrop-blur-md shadow-[0_0_35px_rgba(0,212,255,0.25)]"
            >
              {/* Outer Spinning Ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-marvel-red/60"
                style={{ animation: "arc-reactor-spin 6s linear infinite" }}
              />

              {/* Middle Counter-Rotating Ring */}
              <div
                className="absolute inset-2 rounded-full border-2 border-arc-cyan/50"
                style={{ animation: "arc-reactor-spin 4s linear infinite reverse" }}
              />

              {/* Central Tabular Percentage */}
              <div className="text-center font-mono">
                <span className="block text-3xl font-black text-white tracking-wider drop-shadow-[0_0_10px_#00D4FF] tabular-nums">
                  {Math.min(Math.round(progress), 100)}%
                </span>
                <span className="text-[9px] text-metallic-gold font-bold tracking-widest uppercase block">
                  WEB CHARGE
                </span>
              </div>
            </motion.div>

            {/* Rotating Status Messages */}
            <div className="h-6 overflow-hidden text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={statusIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-mono font-bold text-arc-cyan tracking-[0.25em] uppercase drop-shadow-[0_0_10px_#00D4FF]"
                >
                  {LOADING_STATUSES[statusIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Linear Charging Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-[0_0_15px_rgba(237,29,36,0.3)]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ED1D24, #00D4FF, #FFD700)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
