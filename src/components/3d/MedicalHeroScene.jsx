import React, { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Cylinder, Torus, Environment } from "@react-three/drei";
import * as THREE from "three";
import CanvasFallback from "./CanvasFallback";

// Floating Stylized Medical Cross
function MedicalCross({ hovered, setHovered }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Smooth idle oscillation + pointer tilt
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      state.pointer.y * 0.35,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -state.pointer.x * 0.35,
      0.05
    );
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1.0}
    >
      {/* Vertical bar */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.7, 2.2, 0.6]} />
        <meshPhysicalMaterial
          color="#0d9488"
          roughness={0.18}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          transmission={0.4}
          thickness={1.2}
          emissive="#042f2e"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Horizontal bar */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.7, 0.6]} />
        <meshPhysicalMaterial
          color="#14b8a6"
          roughness={0.18}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          transmission={0.4}
          thickness={1.2}
          emissive="#042f2e"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Inner glowing core sphere */}
      <Sphere args={[0.38, 32, 32]}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={hovered ? 2.2 : 1.4}
          roughness={0.1}
        />
      </Sphere>

      {/* Protective Halo Torus */}
      <Torus args={[1.5, 0.04, 16, 64]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial
          color="#5eead4"
          emissive="#14b8a6"
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </Torus>
    </group>
  );
}

// Procedural Stylized DNA Double Helix Structure
function StylizedDnaHelix({ count = 10, radius = 1.3, height = 3.6 }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.55;
    }
  });

  const pairs = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = (t - 0.5) * height;
    const angle = t * Math.PI * 2.5;
    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = -x1;
    const z2 = -z1;

    pairs.push({ id: i, y, x1, z1, x2, z2, angle });
  }

  return (
    <group ref={groupRef} position={[2.1, 0, -0.6]} scale={0.75}>
      {pairs.map((p) => (
        <group key={p.id} position={[0, p.y, 0]}>
          {/* Strand 1 Node */}
          <mesh position={[p.x1, 0, p.z1]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial
              color="#0d9488"
              emissive="#14b8a6"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Strand 2 Node */}
          <mesh position={[p.x2, 0, p.z2]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Connecting Base Pair Rung */}
          <mesh rotation={[0, -p.angle, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, radius * 2, 8]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.65}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Floating Translucent Medical Capsule (Pill)
function FloatingCapsule() {
  const capsuleRef = useRef();

  useFrame((state, delta) => {
    if (!capsuleRef.current) return;
    capsuleRef.current.rotation.x += delta * 0.6;
    capsuleRef.current.rotation.y += delta * 0.4;
    capsuleRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
  });

  return (
    <group ref={capsuleRef} position={[-2.0, -1.4, 0.2]} rotation={[0.4, 0.8, -0.5]} scale={0.65}>
      {/* Top half cylinder & cap (Cyan) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.9, 32]} />
        <meshPhysicalMaterial
          color="#0284c7"
          roughness={0.15}
          metalness={0.1}
          clearcoat={1}
          transmission={0.3}
          thickness={1.0}
        />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#0284c7"
          roughness={0.15}
          metalness={0.1}
          clearcoat={1}
          transmission={0.3}
          thickness={1.0}
        />
      </mesh>

      {/* Bottom half cylinder & cap (Frost White / Translucent) */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.9, 32]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.2}
          metalness={0.05}
          transmission={0.6}
          thickness={1.5}
        />
      </mesh>
      <mesh position={[0, -0.95, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.2}
          metalness={0.05}
          transmission={0.6}
          thickness={1.5}
        />
      </mesh>

      {/* Golden center ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.02, 16, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// Floating Ambient Micro-Particles
function ParticleDust({ count = 28 }) {
  const points = useRef();
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        pos: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 5,
        ],
        speed: 0.2 + Math.random() * 0.5,
        size: 0.03 + Math.random() * 0.05,
      });
    }
    return temp;
  }, [count]);

  return (
    <group ref={points}>
      {particles.map((p, idx) => (
        <Float key={idx} speed={p.speed * 2} rotationIntensity={1} floatIntensity={1.5}>
          <mesh position={p.pos}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshStandardMaterial
              color="#5eead4"
              emissive="#14b8a6"
              emissiveIntensity={1.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Scene Root with dynamic lighting & camera parallax
function SceneContent() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#f0fdfa" />
      <pointLight position={[-4, 2, -2]} intensity={2.0} color="#38bdf8" />
      <pointLight position={[3, -2, 2]} intensity={2.0} color="#14b8a6" />

      {/* Floating Center Medical Cross */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
        <MedicalCross hovered={hovered} setHovered={setHovered} />
      </Float>

      {/* Floating DNA Double Helix on the side */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <StylizedDnaHelix count={12} radius={0.9} height={3.2} />
      </Float>

      {/* Floating Pill Capsule */}
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.8}>
        <FloatingCapsule />
      </Float>

      {/* Ambient medical particles */}
      <ParticleDust count={30} />
    </>
  );
}

export default function MedicalHeroScene() {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden glass-card border border-teal-500/20 shadow-glass-hover bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-medblue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Medical Tech Badge Overlays */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-teal-500/30 text-teal-300 text-xs font-medium shadow-soft">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        Interactive 3D Biometrics
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs shadow-soft">
        <span className="text-teal-400 font-mono text-[11px]">R3F / WebGL</span>
        <span className="text-slate-500">•</span>
        <span>Drag / Hover to Interact</span>
      </div>

      {/* Interactive 3D Canvas */}
      <Suspense fallback={<CanvasFallback text="Rendering 3D Clinical Model..." />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          style={{ touchAction: "pan-y" }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  );
}
