import React, { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { SPECIALTIES } from "../../data/clinicData";
import {
  Stethoscope,
  Baby,
  Bone,
  Sparkles,
  HeartPulse,
  Activity,
  ArrowRight,
  CheckCircle,
  Users,
  CalendarCheck
} from "lucide-react";

const ICON_MAP = {
  Stethoscope,
  Baby,
  Bone,
  Sparkles,
  HeartPulse,
  Activity,
};

export default function Specialties() {
  const { openBookingModal } = useClinic();
  const [activeFilter, setActiveFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Specialties" },
    { id: "primary", label: "Primary & Family" },
    { id: "specialized", label: "Specialized Care" },
  ];

  const filteredSpecialties = SPECIALTIES.filter((spec) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "primary") return spec.id === "gen-med" || spec.id === "pediatrics";
    if (activeFilter === "specialized") return spec.id !== "gen-med" && spec.id !== "pediatrics";
    return true;
  });

  return (
    <section id="specialties" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Comprehensive Clinical Care
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Multi-Specialty Departments
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl text-base">
              From preventative wellness and child health to precision cardiology and minimally invasive orthopedics.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 mt-6 md:mt-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Core Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialties.map((spec) => {
            const IconComponent = ICON_MAP[spec.iconName] || Stethoscope;
            const isTeal = spec.colorTheme === "teal";

            return (
              <div
                key={spec.id}
                className="group relative rounded-2xl p-6 bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-teal-500/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon & Fee */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-soft ${
                        isTeal
                          ? "bg-teal-500/10 text-teal-700 border border-teal-500/20"
                          : "bg-medblue-500/10 text-medblue-700 border border-medblue-500/20"
                      }`}
                    >
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-medium block">Consultation</span>
                      <span className="text-base font-extrabold text-slate-900">
                        From ${spec.baseFee}
                      </span>
                    </div>
                  </div>

                  {/* Specialty Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-2">
                    {spec.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {spec.shortDesc}
                  </p>

                  {/* Conditions List */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Common Conditions:
                    </span>
                    {spec.conditions.map((condition, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Footer: Doctor count & Direct Booking Button */}
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{spec.doctorCount} Doctors On Duty</span>
                  </div>

                  <button
                    onClick={() => openBookingModal(null, spec)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-sm group-hover:shadow-soft active:scale-95"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Book Specialty</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
