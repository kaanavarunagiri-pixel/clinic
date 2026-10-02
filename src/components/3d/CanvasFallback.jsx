import React from "react";
import { Activity, ShieldCheck } from "lucide-react";

export default function CanvasFallback({ text = "Initializing 3D Medical Scene..." }) {
  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[460px] flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-500/20 p-8 overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-teal-500/15 blur-3xl -top-12 -left-12 pointer-events-none animate-pulse-slow" />
      <div className="absolute w-72 h-72 rounded-full bg-medblue-500/15 blur-3xl -bottom-12 -right-12 pointer-events-none animate-pulse-slow" />

      {/* Hologram rings & Pulsing Core */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 rounded-full border border-teal-400/30 animate-spin" style={{ animationDuration: "14s" }} />
        <div className="absolute w-48 h-48 rounded-full border border-dashed border-medblue-400/25 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-medblue-500/30 backdrop-blur-md border border-teal-400/40 flex items-center justify-center shadow-glow-teal animate-float">
          <Activity className="w-10 h-10 text-teal-300 animate-pulse" />
        </div>
      </div>

      {/* Loading copy and status badge */}
      <div className="mt-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium mb-3">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          WebGL 3D Engine
        </div>
        <p className="text-sm font-medium text-slate-200 tracking-wide">{text}</p>
        <p className="text-xs text-slate-400 mt-1">Interactive Clinical Model</p>
      </div>
    </div>
  );
}
