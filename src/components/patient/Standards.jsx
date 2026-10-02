import React from "react";
import { CLINICAL_STANDARDS } from "../../data/clinicData";
import InteractiveTourCard from "../3d/InteractiveTourCard";
import { useClinic } from "../../context/ClinicContext";
import {
  ShieldCheck,
  Clock,
  Cpu,
  Award,
  CheckCircle,
  Sparkles,
  Zap
} from "lucide-react";

const ICON_MAP = {
  ShieldCheck,
  Clock,
  Cpu,
  Award,
};

export default function Standards() {
  const { openBookingModal } = useClinic();

  return (
    <section id="standards" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-medblue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Compromise Medical Protocol
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Hospital-Grade Clinical Standards & Tech
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            Equipped with surgical-grade laminar airflow, AI-assisted ultrasound diagnostics, and automated real-time patient queue telemetry.
          </p>
        </div>

        {/* 2-Column Showcase: Standards Grid on Left + 3D Holographic Tour Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left: 4 Protocol Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CLINICAL_STANDARDS.map((std) => {
              const IconComp = ICON_MAP[std.iconName] || ShieldCheck;
              return (
                <div
                  key={std.id}
                  className="rounded-2xl p-6 bg-slate-800/60 border border-slate-700/70 hover:border-teal-500/40 hover:bg-slate-800/90 transition-all duration-300 shadow-soft"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-teal-300 text-[11px] font-mono font-bold">
                      {std.stat}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {std.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: 3D Holographic Tour Cards */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <InteractiveTourCard
              title="3D Tomography & Ultrasound"
              subtitle="Sub-millimeter diagnostic clarity with instant cloud radiologist review."
              tag="Diagnostic Imaging"
              mode="imaging"
              onActionClick={() => openBookingModal()}
            />

            <InteractiveTourCard
              title="Predictive Smart Triage"
              subtitle="Dynamically pacing outpatient load to preserve a sub-10 minute wait time."
              tag="Zero-Wait Queue"
              mode="smart"
              onActionClick={() => openBookingModal()}
            />
          </div>

        </div>

        {/* Certification strip */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-800/50 to-medblue-950/60 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Full International Accreditation</h4>
              <p className="text-xs text-slate-400">NABH Standards for Outpatient Facilities & ISO 15189 Certified Pathology</p>
            </div>
          </div>

          <button
            onClick={() => openBookingModal()}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors shrink-0 shadow-soft"
          >
            Schedule Consultation Today
          </button>
        </div>

      </div>
    </section>
  );
}
