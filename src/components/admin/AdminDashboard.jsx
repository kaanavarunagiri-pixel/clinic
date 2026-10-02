import React, { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { DOCTORS, SPECIALTIES } from "../../data/clinicData";
import QueueMetrics from "./QueueMetrics";
import QueueTable from "./QueueTable";
import {
  LayoutDashboard,
  UserPlus,
  RefreshCw,
  ArrowLeft,
  X,
  Clock,
  ShieldAlert,
  Stethoscope,
  Activity,
  CheckCircle,
  Sparkles
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
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Top Cockpit Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminMode(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Patient Site</span>
            </button>

            <div className="h-5 w-px bg-slate-700 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-teal-400" />
                  Clinic Reception & Doctor Cockpit
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/40">
                  Live Terminal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AuraMed Medical Facility • Real-Time Triage & Outpatient Management
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={resetQueue}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              title="Reset queue to default pre-seeded state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo Queue</span>
            </button>

            <button
              onClick={() => setIsWalkInOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-soft active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Quick Add Walk-In</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Admin Cockpit Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Live Status Notice Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-medblue-950 text-white border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Reception Telemetry Active: {metrics.activeQueueCount} Patients Queued • All 6 Departments Operational
              </p>
              <p className="text-xs text-teal-200/80">
                Doctors receive instant audio chimes upon status transitions. WhatsApp alerts route through SMS gateways.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-slate-400">
              System Time: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Real-time Queue Metric Badges */}
        <QueueMetrics />

        {/* Interactive Queue Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Live Patient Roster & Consultation Status
            </h2>
            <span className="text-xs text-slate-500">
              Select status from dropdown to simulate real patient progression
            </span>
          </div>
          <QueueTable />
        </div>

      </main>

      {/* Quick Add Walk-In Patient Modal */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold">Fast Walk-In Registration</h3>
              </div>
              <button
                onClick={() => setIsWalkInOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="p-6 space-y-4">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Consulting Physician *
                </label>
                <select
                  value={walkInDoctorId}
                  onChange={(e) => setWalkInDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWalkInOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-soft transition-all"
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
