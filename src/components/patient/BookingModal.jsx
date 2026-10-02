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
  Stethoscope,
  Sparkles,
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

    // Set initial doctor/specialty if passed in
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

    // Generate upcoming 7 days
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

  // Filter doctors based on currently chosen specialty
  const doctorsForSpecialty = DOCTORS.filter(
    (d) => !selectedSpecialtyId || d.specialtyId === selectedSpecialtyId
  );

  const activeDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || doctorsForSpecialty[0];
  const activeSpecialty = SPECIALTIES.find((s) => s.id === selectedSpecialtyId);

  // Time slot options
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

      // Complete booking!
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Book Priority Consultation</h3>
              <p className="text-xs text-teal-300/80">3-Step Direct Outpatient Scheduling</p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              1
            </div>
            <span className={`font-semibold ${step >= 1 ? "text-slate-900" : "text-slate-400"}`}>
              Specialty & Doctor
            </span>
          </div>

          <div className="h-0.5 w-8 bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              2
            </div>
            <span className={`font-semibold ${step >= 2 ? "text-slate-900" : "text-slate-400"}`}>
              Date & Slot
            </span>
          </div>

          <div className="h-0.5 w-8 bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3 ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              3
            </div>
            <span className={`font-semibold ${step === 3 ? "text-slate-900" : "text-slate-400"}`}>
              Patient Info
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-6 max-h-[68vh] overflow-y-auto">
          
          {/* STEP 1: Specialty & Doctor */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Select Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Clinical Specialty
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-teal-50 border-teal-500 text-teal-900 shadow-xs ring-1 ring-teal-500"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <p className="text-xs font-bold truncate">{spec.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">From ${spec.baseFee}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Select Doctor in that department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Choose Specialist Physician
                </label>
                <div className="space-y-2.5">
                  {doctorsForSpecialty.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatar}
                            alt={doc.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                                {doc.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{doc.title}</p>
                            <p className="text-[11px] text-teal-700 font-medium mt-0.5">
                              Next: {doc.nextAvailable}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-900 block">
                            ${doc.consultationFee}
                          </span>
                          <span className="text-[10px] text-slate-400">Consult Fee</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slot */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Doctor Summary banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeDoctor?.avatar}
                    alt={activeDoctor?.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{activeDoctor?.name}</h4>
                    <p className="text-[11px] text-teal-700">{activeDoctor?.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* 7-Day Calendar Strip */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Consultation Date
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDays.map((day) => {
                    const fullLabel = day.dateFormatted + " (" + day.label + ")";
                    const isSelected = selectedDate === fullLabel;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => setSelectedDate(fullLabel)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
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

              {/* Morning Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Morning Sessions
                  </span>
                  <span className="text-[11px] text-teal-700 font-medium">9:00 AM – 12:00 PM</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
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

              {/* Evening Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Afternoon / Evening Sessions
                  </span>
                  <span className="text-[11px] text-teal-700 font-medium">2:00 PM – 6:00 PM</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {eveningSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
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

          {/* STEP 3: Patient Information Form */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Summary Pill */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">{activeDoctor?.name}</span> • <span>{selectedDate} at {selectedTimeSlot}</span>
                </div>
                <span className="font-extrabold text-teal-700">${activeDoctor?.consultationFee}</span>
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    rows={3}
                    placeholder="Briefly describe symptoms, duration, or if this is a follow-up visit..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
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
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-soft transition-all active:scale-95"
          >
            {step === 3 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Generate Digital Token</span>
              </>
            ) : (
              <>
                <span>Continue to {step === 1 ? "Slot Selection" : "Patient Details"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
