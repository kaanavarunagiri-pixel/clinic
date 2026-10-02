import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Torus, Box } from "@react-three/drei";
import { Sparkles, Eye, ArrowRight, ShieldCheck } from "lucide-react";

// Micro 3D preview model inside the tour card
function MiniHologram({ mode }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef}>
      {mode === "imaging" && (
        <>
          <Torus args={[0.9, 0.08, 16, 32]} rotation={[Math.PI / 3, 0, 0]}>
            <meshStandardMaterial color="#0d9488" emissive="#14b8a6" emissiveIntensity={1.2} />
          </Torus>
          <Sphere args={[0.45, 16, 16]}>
            <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.8} roughness={0.2} />
          </Sphere>
        </>
      )}
      {mode === "smart" && (
        <>
          <Box args={[0.8, 0.8, 0.8]}>
            <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={1.0} wireframe />
          </Box>
          <Sphere args={[0.3, 16, 16]}>
            <meshStandardMaterial color="#2dd4bf" emissive="#14b8a6" emissiveIntensity={1.5} />
          </Sphere>
        </>
      )}
      {mode === "safety" && (
        <>
          <Torus args={[0.8, 0.1, 16, 32]}>
            <meshStandardMaterial color="#14b8a6" emissive="#5eead4" emissiveIntensity={1.4} />
          </Torus>
          <Box args={[0.3, 1.0, 0.3]}>
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.7} />
          </Box>
        </>
      )}
    </group>
  );
}

export default function InteractiveTourCard({
  title = "Next-Gen 3D Diagnostic Suite",
  subtitle = "High-precision digital tomography with 75% lower radiation.",
  tag = "Facility Innovation",
  mode = "imaging",
  onActionClick,
}) {
  const cardRef = useRef();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate subtle 3D tilt
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
      className="relative rounded-2xl p-6 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-teal-950/70 border border-teal-500/30 text-white shadow-xl overflow-hidden group"
    >
      {/* Holographic light shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.18), transparent 70%)",
        }}
      />

      {/* Header Tag */}
      <div className="flex items-center justify-between mb-4 z-10 relative">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          {tag}
        </span>
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
      </div>

      {/* Mini 3D Holographic Canvas */}
      <div className="w-full h-36 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 overflow-hidden relative">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          style={{ touchAction: "none" }}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.9} />
          <pointLight position={[2, 2, 2]} intensity={2.0} color="#38bdf8" />
          <pointLight position={[-2, -2, 2]} intensity={1.5} color="#14b8a6" />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <MiniHologram mode={mode} />
          </Float>
        </Canvas>

        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-teal-300 font-mono border border-teal-500/20">
          3D Live Probe
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-base font-bold text-white mb-1 group-hover:text-teal-300 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {subtitle}
        </p>

        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors group-hover:translate-x-1 duration-200"
        >
          <span>Explore clinical details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
