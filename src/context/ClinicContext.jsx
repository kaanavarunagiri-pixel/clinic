import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_QUEUE } from "../data/mockQueue";
import { DOCTORS, SPECIALTIES } from "../data/clinicData";

const ClinicContext = createContext(null);

export const ClinicProvider = ({ children }) => {
  // Admin Mode Toggle: Patient Experience vs Clinic Owner Console
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Queue and Appointments State
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem("auramed_appointments");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_QUEUE;
  });

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  
  // Last booked appointment for confirmation card / receipt modal
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Active Toast Notification
  const [toast, setToast] = useState(null);

  // Save to localStorage when appointments change
  useEffect(() => {
    try {
      localStorage.setItem("auramed_appointments", JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  // Show auto-dismissing toast
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4500);
  };

  const closeToast = () => setToast(null);

  // Open booking modal with pre-selected doctor and/or specialty
  const openBookingModal = (doctor = null, specialty = null) => {
    setSelectedDoctor(doctor);
    if (doctor && !specialty) {
      const matchedSpec = SPECIALTIES.find((s) => s.id === doctor.specialtyId || s.name === doctor.specialty);
      setSelectedSpecialty(matchedSpec || null);
    } else {
      setSelectedSpecialty(specialty);
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  // Add a newly booked appointment
  const addAppointment = (bookingData) => {
    const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
    const newId = `APT-${randomIdNumber}`;
    const nextTokenNum = 100 + appointments.length + 1;
    const token = `T-${nextTokenNum}`;

    const newAppointment = {
      id: newId,
      token,
      patientName: bookingData.patientName,
      phone: bookingData.phone,
      email: bookingData.email || "patient@example.com",
      doctorId: bookingData.doctorId,
      doctorName: bookingData.doctorName,
      specialty: bookingData.specialty,
      date: bookingData.date || "Today",
      timeSlot: bookingData.timeSlot,
      complaint: bookingData.complaint || "Routine consultation & checkup",
      status: "Confirmed",
      isWalkIn: Boolean(bookingData.isWalkIn),
      arrivalTime: bookingData.isWalkIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
      waitMinutes: bookingData.isWalkIn ? 8 : 10,
      consultationFee: bookingData.consultationFee || 95,
      bookedAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setLastConfirmedBooking(newAppointment);
    setIsBookingModalOpen(false);
    setIsConfirmationOpen(true);

    showToast(`Appointment confirmed for ${newAppointment.patientName} (${newAppointment.id})!`, "success");

    // Optional haptic vibration if supported
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }

    return newAppointment;
  };

  // Update appointment status in real-time
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = { ...apt, status: newStatus };
          if (newStatus === "In Consultation" && apt.arrivalTime === "--") {
            updated.arrivalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          return updated;
        }
        return apt;
      })
    );
    showToast(`Updated status to "${newStatus}" for appointment ${id}`, "info");
  };

  // Reset queue to initial mock data
  const resetQueue = () => {
    setAppointments(INITIAL_QUEUE);
    showToast("Queue reset to default demo appointments", "info");
  };

  // Derived metrics for reception
  const todayCount = appointments.length;
  const inConsultationCount = appointments.filter((a) => a.status === "In Consultation").length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "Pending").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const activeQueueCount = appointments.filter(
    (a) => a.status === "In Consultation" || a.status === "Confirmed" || a.status === "Pending"
  ).length;

  return (
    <ClinicContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        resetQueue,
        isBookingModalOpen,
        setIsBookingModalOpen,
        openBookingModal,
        closeBookingModal,
        selectedDoctor,
        setSelectedDoctor,
        selectedSpecialty,
        setSelectedSpecialty,
        lastConfirmedBooking,
        setLastConfirmedBooking,
        isConfirmationOpen,
        setIsConfirmationOpen,
        toast,
        showToast,
        closeToast,
        metrics: {
          todayCount,
          inConsultationCount,
          confirmedCount,
          pendingCount,
          completedCount,
          activeQueueCount,
          avgWaitMinutes: 8,
        },
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
};
