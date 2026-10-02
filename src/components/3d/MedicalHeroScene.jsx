import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";
import CanvasFallback from "./CanvasFallback";

// Floating Stylized Medical Cross
function MedicalCross({ hovered, setHovered, isMobile }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Ambient rotation
    meshRef.current.rotation.y += delta * (isMobile ? 0.3 : 0.4);
    
    // Only apply pointer tilt on desktop
    if (!isMobile) {
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
    }
  });

  const scaleMultiplier = isMobile ? 0.85 : 1.0;

  return (
    <group
      ref={meshRef}
      onPointerOver={() => !isMobile && setHovered(true)}
      onPointerOut={() => !isMobile && setHovered(false)}
      scale={scaleMultiplier * (hovered ? 1.08 : 1.0)}
    >
      {/* Vertical bar */}
      <mesh>
        <boxGeometry args={[0.65, 2.1, 0.55]} />
        <meshPhysicalMaterial
          color="#0d9488"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.6}
          transmission={isMobile ? 0.2 : 0.35}
          thickness={1.0}
          emissive="#042f2e"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Horizontal bar */}
      <mesh>
        <boxGeometry args={[2.1, 0.65, 0.55]} />
        <meshPhysicalMaterial
          color="#14b8a6"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.6}
          transmission={isMobile ? 0.2 : 0.35}
          thickness={1.0}
          emissive="#042f2e"
          emissiveIntensity={hovered ? 0.8 : 0.3}
        />
      </mesh>

      {/* Inner glowing core sphere */}
      <Sphere args={[0.34, isMobile ? 16 : 28, isMobile ? 16 : 28]}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={hovered ? 2.0 : 1.3}
          roughness={0.1}
        />
      </Sphere>

      {/* Protective Halo Torus */}
      <Torus args={[1.35, 0.035, 12, isMobile ? 32 : 48]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial
          color="#5eead4"
          emissive="#14b8a6"
          emissiveIntensity={1.1}
          transparent
          opacity={0.65}
        />
      </Torus>
    </group>
  );
}

// Procedural Stylized DNA Double Helix Structure
function StylizedDnaHelix({ count = 8, radius = 1.1, height = 3.0, isMobile }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const pairs = React.useMemo(() => {
    const list = [];
    const effectiveCount = isMobile ? 7 : count;
    for (let i = 0; i < effectiveCount; i++) {
      const t = i / (effectiveCount - 1);
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2.5;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = -x1;
      const z2 = -z1;
      list.push({ id: i, y, x1, z1, x2, z2, angle });
    }
    return list;
  }, [count, height, radius, isMobile]);

  return (
    <group ref={groupRef} position={[isMobile ? 1.7 : 2.0, 0, -0.6]} scale={isMobile ? 0.65 : 0.75}>
      {pairs.map((p) => (
        <group key={p.id} position={[0, p.y, 0]}>
          <mesh position={[p.x1, 0, p.z1]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial
              color="#0d9488"
              emissive="#14b8a6"
              emissiveIntensity={0.8}
            />
          </mesh>

          <mesh position={[p.x2, 0, p.z2]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.8}
            />
          </mesh>

          <mesh rotation={[0, -p.angle, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, radius * 2, 6]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Floating Translucent Medical Capsule
function FloatingCapsule({ isMobile }) {
  const capsuleRef = useRef();

  useFrame((state, delta) => {
    if (!capsuleRef.current) return;
    capsuleRef.current.rotation.x += delta * 0.5;
    capsuleRef.current.rotation.y += delta * 0.35;
    capsuleRef.current.position.y = (isMobile ? -1.3 : -1.4) + Math.sin(state.clock.elapsedTime * 1.5) * 0.12;
  });

  return (
    <group
      ref={capsuleRef}
      position={[isMobile ? -1.6 : -1.9, -1.3, 0.2]}
      rotation={[0.4, 0.8, -0.5]}
      scale={isMobile ? 0.55 : 0.65}
    >
      {/* Top half cylinder & cap */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.8, 20]} />
        <meshPhysicalMaterial
          color="#0284c7"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
        />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#0284c7"
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.8}
        />
      </mesh>

      {/* Bottom half cylinder & cap */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.8, 20]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.2}
          transmission={0.5}
          thickness={1.2}
        />
      </mesh>
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          roughness={0.2}
          transmission={0.5}
          thickness={1.2}
        />
      </mesh>

      {/* Center ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.02, 12, 24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// Scene Root
function SceneContent({ isMobile }) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} color="#f0fdfa" />
      <pointLight position={[-3, 2, -2]} intensity={1.8} color="#38bdf8" />
      <pointLight position={[3, -2, 2]} intensity={1.6} color="#14b8a6" />

      {/* Floating Center Medical Cross */}
      <Float speed={1.6} rotationIntensity={isMobile ? 0.15 : 0.25} floatIntensity={isMobile ? 0.4 : 0.6}>
        <MedicalCross hovered={hovered} setHovered={setHovered} isMobile={isMobile} />
      </Float>

      {/* Stylized DNA Double Helix */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
        <StylizedDnaHelix count={10} radius={0.85} height={2.8} isMobile={isMobile} />
      </Float>

      {/* Floating Pill Capsule */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
        <FloatingCapsule isMobile={isMobile} />
      </Float>
    </>
  );
}

export default function MedicalHeroScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative w-full h-[270px] xs:h-[310px] sm:h-[400px] lg:h-[520px] rounded-2.5xl sm:rounded-3xl overflow-hidden glass-card border border-teal-500/20 shadow-glass-hover bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950 touch-pan-y-safe">
      {/* Subtle background ambient mesh */}
      <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-medblue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Tech Status Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md border border-teal-500/30 text-teal-300 text-[11px] sm:text-xs font-medium shadow-soft">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        Interactive 3D Biometrics
      </div>

      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[10px] sm:text-xs shadow-soft pointer-events-none">
        <span className="text-teal-400 font-mono text-[10px]">R3F / WebGL</span>
        <span className="text-slate-500">•</span>
        <span>{isMobile ? "Scroll Safe" : "Hover / Tilt"}</span>
      </div>

      {/* Interactive 3D Canvas with clamped DPR and touch-action pan-y */}
      <Suspense fallback={<CanvasFallback text="Loading 3D Scene..." />}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 5.6 : 5.0], fov: 45 }}
          style={{
            touchAction: "pan-y",
            // On mobile, keep pointer-events non-blocking so swipe gestures scroll the page immediately
            pointerEvents: isMobile ? "none" : "auto",
          }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1.5, 1.5)]}
        >
          <SceneContent isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  );
}
