import React, { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { DOCTORS } from "../../data/clinicData";
import QueueMetrics from "./QueueMetrics";
import QueueTable from "./QueueTable";
import {
  LayoutDashboard,
  UserPlus,
  RefreshCw,
  ArrowLeft,
  X
} from "lucide-react";

export default function AdminDashboard() {
  const {
    setIsAdminMode,
    addAppointment,
    resetQueue,
    metrics,
  } = useClinic();

  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInDoctorId, setWalkInDoctorId] = useState(DOCTORS[0].id);
  const [walkInComplaint, setWalkInComplaint] = useState("");
  const [walkInError, setWalkInError] = useState("");

  const handleWalkInSubmit = (e) => {
    e.preventDefault();
    if (!walkInName.trim()) {
      setWalkInError("Please enter patient name");
      return;
    }

    const doc = DOCTORS.find((d) => d.id === walkInDoctorId) || DOCTORS[0];
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addAppointment({
      patientName: walkInName.trim(),
      phone: walkInPhone.trim() || "+1 (555) 000-0000",
      email: "walkin@auramedclinic.com",
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      date: "Today",
      timeSlot: `${currentTimeStr} (Immediate)`,
      complaint: walkInComplaint.trim() || "Walk-In Urgent Triage",
      consultationFee: doc.consultationFee,
      isWalkIn: true,
    });

    setWalkInName("");
    setWalkInPhone("");
    setWalkInComplaint("");
    setWalkInError("");
    setIsWalkInOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20 overflow-x-hidden">
      
      {/* Top Cockpit Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setIsAdminMode(false)}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 truncate">
                  <LayoutDashboard className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Reception Cockpit</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] sm:text-[10px] font-bold border border-teal-500/40 shrink-0">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xs:block truncate">
                Real-Time Triage & Outpatient Management
              </p>
            </div>
          </div>

          {/* Quick Actions (min 44px touch targets) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={resetQueue}
              className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors active:scale-95"
              title="Reset queue to default pre-seeded state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            <button
              onClick={() => setIsWalkInOpen(true)}
              className="min-h-[44px] flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-soft active:scale-95 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Walk-In</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Admin Cockpit Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Live Status Notice Bar */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-medblue-950 text-white border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-soft">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping shrink-0 mt-1 sm:mt-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Queue Active: {metrics.activeQueueCount} Patients Queued • 6 Departments Operational
              </p>
              <p className="text-[11px] sm:text-xs text-teal-200/80">
                Doctors receive immediate alerts upon status transitions. WhatsApp alerts route to patient devices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs font-mono text-slate-400">
            <span>Clock: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Real-time Queue Metric Badges */}
        <QueueMetrics />

        {/* Interactive Queue Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Live Patient Roster & Triage Status
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-500">
              Update status from dropdown to test live patient flow
            </span>
          </div>
          <QueueTable />
        </div>

      </main>

      {/* Quick Add Walk-In Patient Modal (Mobile Drawer Friendly) */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 duration-200">
            
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm sm:text-base font-bold">Fast Walk-In Registration</h3>
              </div>
              <button
                onClick={() => setIsWalkInOpen(false)}
                aria-label="Close modal"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {walkInError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {walkInError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Downey"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (415) 555-0192"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Consulting Physician *
                </label>
                <select
                  value={walkInDoctorId}
                  onChange={(e) => setWalkInDoctorId(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  {DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialty} (${doc.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Immediate Health Complaint / Symptoms
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sudden severe ankle sprain during commute..."
                  value={walkInComplaint}
                  onChange={(e) => setWalkInComplaint(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWalkInOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-soft transition-all active:scale-95"
                >
                  Assign Token & Insert in Queue
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
