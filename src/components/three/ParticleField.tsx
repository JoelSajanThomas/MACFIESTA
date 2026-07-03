"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particle system: thousands of festival-colored particles that
 * float and drift, creating an immersive background atmosphere.
 */
export function ParticleField({ count = 3000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color("#EAB308"), // gold
      new THREE.Color("#7C3AED"), // purple
      new THREE.Color("#06B6D4"), // cyan
      new THREE.Color("#EC4899"), // pink
      new THREE.Color("#F97316"), // orange
      new THREE.Color("#3B82F6"), // blue
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a large sphere
      const radius = 15 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 5;
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 0.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.02;
    meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
