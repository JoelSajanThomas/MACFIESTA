"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Floating 3D geometric objects that represent festival energy.
 * Includes torus, icosahedron, octahedron with neon wireframe materials.
 */
export function FloatingObjects() {
  return (
    <group>
      {/* Large torus — top right */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
        <mesh position={[6, 3, -8]}>
          <torusGeometry args={[1.5, 0.4, 16, 48]} />
          <meshStandardMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Icosahedron — left middle */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[-7, 0, -6]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <MeshDistortMaterial
            color="#EAB308"
            emissive="#EAB308"
            emissiveIntensity={0.2}
            wireframe
            transparent
            opacity={0.5}
            speed={2}
            distort={0.3}
          />
        </mesh>
      </Float>

      {/* Octahedron — right bottom */}
      <Float speed={1.8} rotationIntensity={1.8} floatIntensity={1}>
        <mesh position={[5, -3, -10]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#06B6D4"
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>

      {/* Small dodecahedron cluster — scattered */}
      <Float speed={2.5} rotationIntensity={3} floatIntensity={2}>
        <mesh position={[-4, 4, -12]}>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#EC4899"
            emissive="#EC4899"
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      {/* Torus knot — center back */}
      <Float speed={1.2} rotationIntensity={1} floatIntensity={0.8}>
        <mesh position={[0, -2, -15]}>
          <torusKnotGeometry args={[2, 0.3, 64, 8, 2, 3]} />
          <meshStandardMaterial
            color="#F97316"
            emissive="#F97316"
            emissiveIntensity={0.15}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      {/* Sphere — accent */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[8, -1, -5]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <MeshWobbleMaterial
            color="#FACC15"
            emissive="#FACC15"
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
            factor={0.5}
            speed={2}
          />
        </mesh>
      </Float>

      {/* Ring — top left */}
      <Float speed={1.8} rotationIntensity={2} floatIntensity={1.2}>
        <mesh position={[-6, 5, -14]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
          <ringGeometry args={[1, 1.3, 32]} />
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#3B82F6"
            emissiveIntensity={0.4}
            side={THREE.DoubleSide}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * Animated stage lights — colored spotlights that sweep across the scene.
 */
export function StageLights() {
  const light1Ref = useRef<THREE.SpotLight>(null);
  const light2Ref = useRef<THREE.SpotLight>(null);
  const light3Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (light1Ref.current) {
      light1Ref.current.target.position.x = Math.sin(t * 0.5) * 10;
      light1Ref.current.target.position.z = Math.cos(t * 0.3) * 10;
      light1Ref.current.target.updateMatrixWorld();
    }
    if (light2Ref.current) {
      light2Ref.current.target.position.x = Math.cos(t * 0.4) * 8;
      light2Ref.current.target.position.z = Math.sin(t * 0.6) * 8;
      light2Ref.current.target.updateMatrixWorld();
    }
    if (light3Ref.current) {
      light3Ref.current.target.position.x = Math.sin(t * 0.7 + 2) * 12;
      light3Ref.current.target.position.z = Math.cos(t * 0.5 + 1) * 12;
      light3Ref.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <spotLight
        ref={light1Ref}
        position={[-10, 15, 5]}
        color="#7C3AED"
        intensity={40}
        distance={50}
        angle={0.3}
        penumbra={0.8}
        castShadow={false}
      />
      <spotLight
        ref={light2Ref}
        position={[10, 15, -5]}
        color="#06B6D4"
        intensity={30}
        distance={50}
        angle={0.3}
        penumbra={0.8}
        castShadow={false}
      />
      <spotLight
        ref={light3Ref}
        position={[0, 12, 10]}
        color="#EC4899"
        intensity={20}
        distance={40}
        angle={0.4}
        penumbra={0.9}
        castShadow={false}
      />
    </>
  );
}
