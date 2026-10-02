import React, { useState, useEffect } from "react";
import { useClinic } from "../../context/ClinicContext";
import { DOCTORS, SPECIALTIES } from "../../data/clinicData";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from "lucide-react";

export default function BookingModal() {
  const {
    isBookingModalOpen,
    closeBookingModal,
    selectedDoctor: initialDoctor,
    selectedSpecialty: initialSpecialty,
    addAppointment,
  } = useClinic();

  const [step, setStep] = useState(1);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  
  // Patient details state
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Next 7 calendar days generator
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    if (!isBookingModalOpen) {
      setStep(1);
      setErrorMsg("");
      return;
    }

    if (initialDoctor) {
      setSelectedDoctorId(initialDoctor.id);
      setSelectedSpecialtyId(initialDoctor.specialtyId);
    } else if (initialSpecialty) {
      setSelectedSpecialtyId(initialSpecialty.id);
      const docsInSpec = DOCTORS.filter((d) => d.specialtyId === initialSpecialty.id);
      if (docsInSpec.length > 0) {
        setSelectedDoctorId(docsInSpec[0].id);
      }
    } else {
      setSelectedSpecialtyId(SPECIALTIES[0].id);
      setSelectedDoctorId(DOCTORS[0].id);
    }

    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const fullIso = d.toISOString().split("T")[0];
      days.push({
        id: fullIso,
        label: dayName,
        dateFormatted: dateStr,
        dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    setAvailableDays(days);
    setSelectedDate(days[0].dateFormatted + " (" + days[0].label + ")");
    setSelectedTimeSlot("10:00 AM");
  }, [isBookingModalOpen, initialDoctor, initialSpecialty]);

  if (!isBookingModalOpen) return null;

  const doctorsForSpecialty = DOCTORS.filter(
    (d) => !selectedSpecialtyId || d.specialtyId === selectedSpecialtyId
  );

  const activeDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || doctorsForSpecialty[0];
  const activeSpecialty = SPECIALTIES.find((s) => s.id === selectedSpecialtyId);

  const morningSlots = activeDoctor?.scheduleSlots?.morning || ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM"];
  const eveningSlots = activeDoctor?.scheduleSlots?.evening || ["02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "05:00 PM"];

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!selectedDoctorId) {
        setErrorMsg("Please select a doctor to continue.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTimeSlot) {
        setErrorMsg("Please choose your preferred appointment date and time slot.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!patientName.trim()) {
        setErrorMsg("Please provide patient full name.");
        return;
      }
      if (!phone.trim() || phone.trim().length < 8) {
        setErrorMsg("Please provide a valid contact phone number.");
        return;
      }

      const bookingData = {
        patientName: patientName.trim(),
        phone: phone.trim(),
        email: email.trim() || "patient@auramedclinic.com",
        complaint: complaint.trim() || "General clinical consultation",
        doctorId: activeDoctor?.id,
        doctorName: activeDoctor?.name,
        specialty: activeDoctor?.specialty || activeSpecialty?.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        consultationFee: activeDoctor?.consultationFee || 95,
        isWalkIn: false,
      };

      addAppointment(bookingData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Bottom sheet on mobile / modal card on desktop */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-slate-900">
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Modal Top Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Book Priority Consultation</h3>
              <p className="text-[11px] sm:text-xs text-teal-300/80">3-Step Direct Outpatient Scheduling</p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            aria-label="Close modal"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              1
            </div>
            <span className={`font-semibold text-[11px] sm:text-xs ${step >= 1 ? "text-slate-900" : "text-slate-400"}`}>
              Specialty
            </span>
          </div>

          <div className="h-0.5 w-6 sm:w-10 bg-slate-200" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </div>
            <span className={`font-semibold text-[11px] sm:text-xs ${step >= 2 ? "text-slate-900" : "text-slate-400"}`}>
              Date & Slot
            </span>
          </div>

          <div className="h-0.5 w-6 sm:w-10 bg-slate-200" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              3
            </div>
            <span className={`font-semibold text-[11px] sm:text-xs ${step === 3 ? "text-slate-900" : "text-slate-400"}`}>
              Patient Info
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Clinical Specialty
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIALTIES.map((spec) => {
                    const isSelected = selectedSpecialtyId === spec.id;
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => {
                          setSelectedSpecialtyId(spec.id);
                          const matching = DOCTORS.filter((d) => d.specialtyId === spec.id);
                          if (matching.length > 0) setSelectedDoctorId(matching[0].id);
                        }}
                        className={`min-h-[48px] p-2.5 sm:p-3 rounded-xl border text-left transition-all active:scale-95 ${
                          isSelected
                            ? "bg-teal-50 border-teal-500 text-teal-900 shadow-xs ring-1 ring-teal-500"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{spec.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">From ${spec.baseFee}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Choose Specialist Physician
                </label>
                <div className="space-y-2">
                  {doctorsForSpecialty.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`min-h-[64px] p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between active:scale-98 ${
                          isSelected
                            ? "bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doc.name}</h4>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-bold shrink-0">
                                {doc.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{doc.title}</p>
                            <p className="text-[10px] text-teal-700 font-medium">
                              Next: {doc.nextAvailable}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-2">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                            ${doc.consultationFee}
                          </span>
                          <span className="text-[9px] text-slate-400">Consult</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={activeDoctor?.avatar}
                    alt={activeDoctor?.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{activeDoctor?.name}</h4>
                    <p className="text-[11px] text-teal-700 truncate">{activeDoctor?.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="min-h-[44px] px-2 text-xs font-bold text-teal-600 hover:underline shrink-0"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Consultation Date
                </label>
                <div className="flex sm:grid sm:grid-cols-7 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
                  {availableDays.map((day) => {
                    const fullLabel = day.dateFormatted + " (" + day.label + ")";
                    const isSelected = selectedDate === fullLabel;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setSelectedDate(fullLabel)}
                        className={`min-w-[70px] sm:min-w-0 min-h-[52px] p-2 rounded-xl border text-center transition-all shrink-0 active:scale-95 ${
                          isSelected
                            ? "bg-teal-600 border-teal-600 text-white shadow-soft font-bold"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <span className="text-[10px] uppercase block opacity-80">{day.label}</span>
                        <span className="text-xs font-extrabold block mt-0.5">{day.dateFormatted}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Morning Sessions
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium">9:00 AM – 12:00 PM</span>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`min-h-[44px] py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center active:scale-95 ${
                          isSelected
                            ? "bg-teal-600 border-teal-600 text-white shadow-soft"
                            : "bg-white border-slate-200 hover:border-teal-500/50 text-slate-800"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Afternoon / Evening Sessions
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium">2:00 PM – 6:00 PM</span>
                </div>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                  {eveningSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`min-h-[44px] py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center active:scale-95 ${
                          isSelected
                            ? "bg-teal-600 border-teal-600 text-white shadow-soft"
                            : "bg-white border-slate-200 hover:border-teal-500/50 text-slate-800"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <div className="overflow-hidden mr-2">
                  <span className="font-bold truncate block sm:inline">{activeDoctor?.name}</span>
                  <span className="hidden sm:inline"> • </span>
                  <span className="text-slate-600">{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <span className="font-extrabold text-teal-700 shrink-0">${activeDoctor?.consultationFee}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jennifer Lawrence"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">SMS & WhatsApp token reminder will be sent</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Health Complaint / Notes
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="Briefly describe symptoms, duration, or if this is a follow-up visit..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Min 48px touch targets) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-soft transition-all active:scale-95"
          >
            {step === 3 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Generate Token</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
