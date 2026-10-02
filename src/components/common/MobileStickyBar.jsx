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
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Helpline (min 44px touch height) */}
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="min-h-[46px] flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors active:scale-95 text-center"
        >
          <Phone className="w-4 h-4 text-slate-800 mb-0.5" />
          <span className="text-[11px] font-bold">Call Clinic</span>
        </a>

        {/* WhatsApp Direct (min 44px touch height) */}
        <button
          onClick={handleWhatsApp}
          className="min-h-[46px] flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors active:scale-95 text-center border border-emerald-200"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 mb-0.5" />
          <span className="text-[11px] font-bold">WhatsApp</span>
        </button>

        {/* Instant Booking (min 44px touch height) */}
        <button
          onClick={() => openBookingModal()}
          className="min-h-[46px] flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors active:scale-95 text-center shadow-soft"
        >
          <Calendar className="w-4 h-4 text-white mb-0.5" />
          <span className="text-[11px] font-bold">Book Slot</span>
        </button>
      </div>
    </div>
  );
}
