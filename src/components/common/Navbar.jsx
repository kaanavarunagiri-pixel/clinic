import React, { useState, useEffect } from "react";
import { useClinic } from "../../context/ClinicContext";
import { CLINIC_INFO } from "../../data/clinicData";
import {
  PhoneCall,
  Calendar,
  Shield,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  UserCheck,
  Stethoscope,
  HeartHandshake
} from "lucide-react";

export default function Navbar() {
  const { isAdminMode, setIsAdminMode, openBookingModal } = useClinic();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Specialties", href: "#specialties" },
    { label: "Doctors", href: "#doctors" },
    { label: "Clinical Standards", href: "#standards" },
    { label: "Patient Reviews", href: "#reviews" },
    { label: "Contact & Hours", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 transition-all duration-300">
      {/* Top Emergency & Trust Alert Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <a
              href={`tel:${CLINIC_INFO.emergencyRaw}`}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold tracking-wide transition-colors shrink-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>24/7 Trauma Emergency:</span>
              <span className="font-mono text-white underline decoration-red-500/50">{CLINIC_INFO.emergencyHotline}</span>
            </a>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300 truncate">
              {CLINIC_INFO.accreditation}
            </span>
          </div>

          {/* Quick Reception Hotline & Hours */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-slate-400">Reception:</span>
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="text-slate-200 hover:text-teal-300 font-mono text-xs transition-colors"
            >
              {CLINIC_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? "glass-nav shadow-soft py-3"
            : "bg-white/95 backdrop-blur-md py-4 border-b border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-medblue-600 flex items-center justify-center text-white shadow-glow-teal group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Aura<span className="text-teal-600">Med</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                  Specialty Care
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Modern Healthcare • Zero Waiting Queue
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Interactive Admin Mode Toggle & Book Action */}
          <div className="flex items-center gap-3">
            {/* Clinic Owner Preview Toggle Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border ${
                  isAdminMode
                    ? "bg-gradient-to-r from-medblue-700 to-slate-900 text-white border-medblue-500 shadow-glow-blue"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                }`}
                title="Toggle between Patient Experience and Clinic Owner Reception Cockpit"
              >
                {isAdminMode ? (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 text-teal-300 animate-spin" style={{ animationDuration: "12s" }} />
                    <span>Clinic Console</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="hidden sm:inline">Clinic Owner Preview</span>
                    <span className="sm:hidden">Owner Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Booking Trigger */}
            <button
              onClick={() => openBookingModal()}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-soft hover:shadow-glow-teal transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 text-white text-sm font-bold shadow-soft"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Online</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminMode(!isAdminMode);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  <span>Switch to {isAdminMode ? "Patient Portal" : "Clinic Owner Preview"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
