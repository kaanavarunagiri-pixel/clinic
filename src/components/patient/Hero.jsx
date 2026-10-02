import React from "react";
import { useClinic } from "../../context/ClinicContext";
import { CLINIC_INFO } from "../../data/clinicData";
import MedicalHeroScene from "../3d/MedicalHeroScene";
import {
  Calendar,
  MessageCircle,
  Star,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  PhoneCall
} from "lucide-react";

export default function Hero() {
  const { openBookingModal } = useClinic();

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Hi AuraMed! I want to check doctor availability for a consultation today."
    );
    window.open(`https://wa.me/${CLINIC_INFO.whatsappUrlNumber}?text=${text}`, "_blank");
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-mesh-medical">
      {/* Decorative backdrop glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Healthcare Conversion Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                NABH & JCI Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <div className="flex text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
                4.9/5 Rating (1,400+ Verified Reviews)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-medblue-700 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-medblue-600" />
                18+ Board-Certified Specialists
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Modern Healthcare, <br />
              <span className="text-gradient-teal">Zero Waiting Queue.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8 font-normal">
              Experience outpatient clinical excellence without the waiting room chaos. Consult Harvard & Johns Hopkins-trained specialists with instant digital booking, real-time arrival estimates, and in-house advanced 3D diagnostics.
            </p>

            {/* Conversion CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={() => openBookingModal()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-base font-bold shadow-glow-teal hover:shadow-lg transition-all duration-200 active:scale-[0.98] group"
              >
                <Calendar className="w-5 h-5 text-teal-100 group-hover:scale-110 transition-transform" />
                <span>Book Consultation Now</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-base font-bold border border-slate-300 shadow-soft transition-all duration-200 active:scale-[0.98] group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Micro-Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/90 w-full">
              {CLINIC_INFO.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive 3D Medical Scene */}
          <div className="lg:col-span-5 relative">
            <MedicalHeroScene />
          </div>

        </div>
      </div>
    </section>
  );
}
