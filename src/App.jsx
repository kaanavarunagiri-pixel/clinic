import React from "react";
import { ClinicProvider, useClinic } from "./context/ClinicContext";
import Navbar from "./components/common/Navbar";
import MobileStickyBar from "./components/common/MobileStickyBar";
import Footer from "./components/common/Footer";
import Hero from "./components/patient/Hero";
import Specialties from "./components/patient/Specialties";
import Doctors from "./components/patient/Doctors";
import Standards from "./components/patient/Standards";
import Reviews from "./components/patient/Reviews";
import BookingModal from "./components/patient/BookingModal";
import BookingConfirmation from "./components/patient/BookingConfirmation";
import AdminDashboard from "./components/admin/AdminDashboard";
import { CheckCircle2, Info, X } from "lucide-react";

// Toast notification component with mobile clearance
function ToastNotification() {
  const { toast, closeToast } = useClinic();
  if (!toast) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
      <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
        {toast.type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-teal-400" />
        ) : (
          <Info className="w-5 h-5 text-blue-400" />
        )}
      </div>
      <div className="flex-1 text-xs">
        <p className="font-bold text-white">{toast.type === "success" ? "Success" : "Update"}</p>
        <p className="text-slate-300 mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={closeToast}
        aria-label="Dismiss notification"
        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors active:scale-95"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Inner view switcher
function MainLayout() {
  const { isAdminMode } = useClinic();

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between overflow-x-hidden w-full max-w-full">
        <AdminDashboard />
        <ToastNotification />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white overflow-x-hidden w-full max-w-full pb-16 md:pb-0">
      <Navbar />
      <main className="flex-grow overflow-x-hidden w-full">
        <Hero />
        <Specialties />
        <Doctors />
        <Standards />
        <Reviews />
      </main>
      <Footer />
      <MobileStickyBar />
      <BookingModal />
      <BookingConfirmation />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <MainLayout />
    </ClinicProvider>
  );
}
