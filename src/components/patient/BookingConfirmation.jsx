import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useClinic } from "../../context/ClinicContext";
import { CLINIC_INFO } from "../../data/clinicData";
import {
  CheckCircle,
  X,
  Calendar,
  Clock,
  QrCode,
  MessageCircle,
  LayoutDashboard,
  Printer
} from "lucide-react";

export default function BookingConfirmation() {
  const {
    lastConfirmedBooking,
    isConfirmationOpen,
    setIsConfirmationOpen,
    setIsAdminMode,
  } = useClinic();

  useEffect(() => {
    if (isConfirmationOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#14b8a6", "#0284c7", "#38bdf8", "#f59e0b"],
        });
      } catch {
        // fallback
      }
    }
  }, [isConfirmationOpen]);

  if (!isConfirmationOpen || !lastConfirmedBooking) return null;

  const apt = lastConfirmedBooking;

  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Consultation: ${apt.doctorName} (${apt.specialty})`);
    const details = encodeURIComponent(
      `Appointment Token: ${apt.token}\nAppointment ID: ${apt.id}\nComplaint: ${apt.complaint}\nLocation: ${CLINIC_INFO.name}, ${CLINIC_INFO.address}\nHelpline: ${CLINIC_INFO.phone}`
    );
    const location = encodeURIComponent(CLINIC_INFO.address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `My AuraMed Clinic Appointment is Confirmed!\nToken: ${apt.token}\nPhysician: ${apt.doctorName}\nDate: ${apt.date} at ${apt.timeSlot}\nLocation: ${CLINIC_INFO.address}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-teal-800">
          <div className="w-12 h-1.5 rounded-full bg-teal-600" />
        </div>

        {/* Confirmed Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-medblue-700 text-white p-5 sm:p-6 text-center relative overflow-hidden shrink-0">
          <button
            onClick={() => setIsConfirmationOpen(false)}
            aria-label="Close confirmation"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white text-teal-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg shadow-teal-900/30">
            <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
          </div>

          <span className="inline-block px-3 py-0.5 rounded-full bg-teal-400/20 text-teal-100 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-1">
            Official E-Pass Receipt
          </span>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Appointment Confirmed!</h3>
          <p className="text-teal-100 text-xs mt-0.5">
            Your clinical slot is secured with priority reception triage.
          </p>
        </div>

        {/* Boarding-Pass Style Appointment Card */}
        <div className="p-4 sm:p-6 bg-slate-50/50 overflow-y-auto flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="rounded-2xl border-2 border-dashed border-teal-500/40 bg-white p-4 sm:p-6 shadow-soft relative overflow-hidden">
            {/* Top Pass Strip */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Patient Queue Token
                </span>
                <p className="text-2xl sm:text-3xl font-black text-teal-700 font-mono tracking-tight">
                  {apt.token}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Appointment ID
                </span>
                <p className="text-xs sm:text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                  {apt.id}
                </p>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="py-3 sm:py-4 grid grid-cols-2 gap-3 sm:gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Patient Name</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">{apt.patientName}</span>
                <span className="text-slate-500 block text-[10px] sm:text-[11px] truncate">{apt.phone}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Assigned Doctor</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm truncate block">{apt.doctorName}</span>
                <span className="text-teal-700 font-medium block text-[10px] sm:text-[11px] truncate">{apt.specialty}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Date & Slot</span>
                <div className="flex items-center gap-1 font-bold text-slate-900 mt-0.5 text-[11px] sm:text-xs">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{apt.date}</span>
                </div>
                <div className="flex items-center gap-1 text-teal-700 font-bold text-[11px] sm:text-xs">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{apt.timeSlot}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Clinic Location</span>
                <span className="font-bold text-slate-800 text-[11px] block mt-0.5 truncate">
                  Suite 300, Medical Blvd
                </span>
                <span className="text-slate-500 text-[10px] truncate block">Silicon Healthcare Dist.</span>
              </div>
            </div>

            {/* Recommended Arrival Notice */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-teal-50 border border-teal-200/80 text-[10px] sm:text-[11px] text-teal-900 flex items-center justify-between mb-3 sm:mb-4">
              <span>Arrival guideline:</span>
              <span className="font-bold text-right ml-1">10-15 mins early for quick vitals</span>
            </div>

            {/* Bottom QR & Fee */}
            <div className="pt-3 sm:pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center p-1 text-slate-800 shrink-0">
                  <QrCode className="w-9 h-9 sm:w-11 sm:h-11" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono block">Fast Check-In</span>
                  <span className="text-xs font-bold text-slate-800">Scan at Kiosk</span>
                  <span className="text-[10px] text-teal-600 block">Status: Confirmed</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium">Consult Fee</span>
                <span className="text-lg sm:text-xl font-black text-slate-900">${apt.consultationFee}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Min 44px touch targets) */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] py-2 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-95 text-center"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Add Calendar</span>
            </a>

            <button
              onClick={handleShareWhatsApp}
              className="min-h-[44px] py-2 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500/50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs active:scale-95 text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="min-h-[44px] py-2 px-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs col-span-2 sm:col-span-1 active:scale-95 text-center"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>Print Pass</span>
            </button>
          </div>

          {/* Clinic Owner Interactive Link */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
            <div>
              <p className="font-bold text-teal-300">See Live In Clinic Reception</p>
              <p className="text-[11px] text-slate-400">View this booking in the Receptionist Console</p>
            </div>
            <button
              onClick={() => {
                setIsConfirmationOpen(false);
                setIsAdminMode(true);
              }}
              className="w-full sm:w-auto min-h-[40px] py-1.5 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-colors shrink-0 flex items-center justify-center gap-1 active:scale-95"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Open Console</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
