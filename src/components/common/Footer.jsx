import React from "react";
import { CLINIC_INFO, SPECIALTIES } from "../../data/clinicData";
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Stethoscope
} from "lucide-react";

export default function Footer() {
  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        CLINIC_INFO.address
      )}`,
      "_blank"
    );
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-14 pb-28 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-medblue-500 flex items-center justify-center text-white shadow-glow-teal">
                <Stethoscope className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Aura<span className="text-teal-400">Med</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
              Premier multi-specialty healthcare and outpatient center designed around patient respect, zero-queue efficiency, and top board-certified physicians.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>NABH & JCI Certified Infection Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>100% HIPAA Compliant Electronic Records</span>
              </div>
            </div>
          </div>

          {/* Clinical Specialties */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-4">
              Core Specialties
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SPECIALTIES.map((spec) => (
                <li key={spec.id}>
                  <a
                    href="#specialties"
                    className="hover:text-teal-400 transition-colors inline-flex items-center gap-2 py-1 min-h-[36px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{spec.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Hours & Emergency */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-4">
              Operating Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-medium">Outpatient Clinic</p>
                  <p className="text-slate-400 text-xs">{CLINIC_INFO.hours.weekdays}</p>
                  <p className="text-slate-400 text-xs">{CLINIC_INFO.hours.weekends}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Emergency & Triage
                </div>
                <p className="text-slate-300">Open 24 Hours, 365 Days a Year</p>
                <p className="text-red-300 font-mono font-bold mt-1">{CLINIC_INFO.emergencyHotline}</p>
              </div>
            </div>
          </div>

          {/* Location & Google Map Card */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-4">
              Find Our Clinic
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800/80 p-3">
              <div className="relative h-24 sm:h-28 w-full rounded-lg bg-slate-900 overflow-hidden mb-3 border border-slate-700/60 flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:12px_12px]" />
                <div className="relative z-10 flex flex-col items-center text-center px-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow-glow-teal animate-bounce">
                    <MapPin className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-bold text-white mt-1">AuraMed Center</span>
                  <span className="text-[10px] text-teal-300 font-mono">Silicon Healthcare Dist.</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>{CLINIC_INFO.address}</span>
              </p>

              <button
                onClick={openDirections}
                className="w-full min-h-[44px] py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-soft active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} AuraMed Specialty Healthcare. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 sm:gap-6">
            <span className="hover:text-slate-400 cursor-pointer min-h-[32px] flex items-center">Patient Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer min-h-[32px] flex items-center">Clinical Ethics</span>
            <span className="hover:text-slate-400 cursor-pointer min-h-[32px] flex items-center">HIPAA Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
