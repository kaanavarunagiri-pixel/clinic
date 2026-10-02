import React from "react";
import { useClinic } from "../../context/ClinicContext";
import { CLINIC_INFO } from "../../data/clinicData";
import { Phone, MessageCircle, Calendar } from "lucide-react";

export default function MobileStickyBar() {
  const { openBookingModal } = useClinic();

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello AuraMed Clinic, I would like to inquire about doctor availability and book a consultation."
    );
    window.open(`https://wa.me/${CLINIC_INFO.whatsappUrlNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Helpline */}
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95 text-center"
        >
          <Phone className="w-4 h-4 text-slate-800 mb-0.5" />
          <span className="text-[11px] font-bold">Call Clinic</span>
        </a>

        {/* WhatsApp Direct */}
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors active:scale-95 text-center border border-emerald-200"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold">WhatsApp</span>
        </button>

        {/* Instant Booking */}
        <button
          onClick={() => openBookingModal()}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors active:scale-95 text-center shadow-soft"
        >
          <Calendar className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[11px] font-bold">Book Slot</span>
        </button>
      </div>
    </div>
  );
}
