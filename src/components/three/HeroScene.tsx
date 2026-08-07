"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { ParticleField } from "./ParticleField";
import { FloatingObjects, StageLights } from "./FloatingObjects";

/**
 * Camera rig that adds slow auto-rotation and subtle mouse-follow.
 */
function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Slow auto-orbit
    groupRef.current.rotation.y = t * 0.03;

    // Subtle mouse follow
    const { x, y } = state.pointer;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      y * 0.05,
      0.02
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      x * 0.3,
      0.02
    );
  });

  return (
    <group ref={groupRef}>
      <ParticleField count={1000} />
      <FloatingObjects />
    </group>
  );
}

/**
 * The main 3D hero scene rendered behind the hero text.
 * Features particles, floating objects, stage lights, bloom, and chromatic aberration.
 */
export function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 z-0 bg-[#030712]" />;
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Ambient light for base illumination */}
          <ambientLight intensity={0.15} color="#ffffff" />

          {/* Key point lights */}
          <pointLight position={[0, 5, 5]} color="#EAB308" intensity={8} distance={30} />
          <pointLight position={[-8, -3, -5]} color="#7C3AED" intensity={5} distance={25} />
          <pointLight position={[8, 2, -3]} color="#06B6D4" intensity={4} distance={25} />

          {/* Scene content */}
          <CameraRig />
          <StageLights />

          {/* Fog for depth */}
          <fog attach="fog" args={["#030712", 15, 50]} />

          {/* Post-processing */}
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.7}
            />
          </EffectComposer>

          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
