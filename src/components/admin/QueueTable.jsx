import React, { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { DOCTORS } from "../../data/clinicData";
import {
  MessageCircle,
  Phone,
  Search,
  Clock,
  ChevronDown,
  Info,
  Calendar,
  User,
  ShieldCheck
} from "lucide-react";

export default function QueueTable() {
  const { appointments, updateAppointmentStatus } = useClinic();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const statusOptions = [
    { label: "Pending", value: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { label: "Confirmed", value: "Confirmed", color: "bg-teal-100 text-teal-800 border-teal-200" },
    { label: "In Consultation", value: "In Consultation", color: "bg-blue-100 text-blue-800 border-blue-200 animate-pulse" },
    { label: "Completed", value: "Completed", color: "bg-slate-100 text-slate-700 border-slate-200" },
    { label: "Cancelled", value: "Cancelled", color: "bg-rose-100 text-rose-800 border-rose-200" },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === "all" || apt.doctorId === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const sendWhatsAppAlert = (apt) => {
    let message = "";
    if (apt.status === "In Consultation") {
      message = `Hello ${apt.patientName}, Dr. ${apt.doctorName} is ready to see you in Consultation Suite 300. Please proceed to the room. Token: ${apt.token}.`;
    } else {
      message = `Hello ${apt.patientName}, this is AuraMed Clinic Reception regarding your appointment (${apt.token}) with ${apt.doctorName} scheduled for ${apt.timeSlot}. Current estimated wait time is < 8 minutes.`;
    }
    const cleanPhone = apt.phone.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
      
      {/* Table Controls Bar */}
      <div className="p-3.5 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, token (T-102), phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        {/* Filter Dropdowns (min-h-[44px] touch targets) */}
        <div className="grid grid-cols-2 md:flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs max-w-[200px] truncate cursor-pointer"
          >
            <option value="all">All Doctors</option>
            {DOCTORS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOBILE QUEUE CARDS VIEW (< md screens) */}
      <div className="block md:hidden divide-y divide-slate-100 p-2 sm:p-3 bg-slate-50/40">
        {filteredAppointments.map((apt) => {
          const isExpanded = expandedId === apt.id;
          const currentStatusObj =
            statusOptions.find((s) => s.value === apt.status) || statusOptions[0];

          return (
            <div key={apt.id} className="p-3.5 mb-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              {/* Header: Token & Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200 font-mono">
                    {apt.token}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{apt.id}</span>
                  {apt.isWalkIn && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Walk-In
                    </span>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={apt.status}
                    onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                    className={`min-h-[38px] appearance-none py-1.5 pl-2.5 pr-6 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${currentStatusObj.color}`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                </div>
              </div>

              {/* Patient and Doctor Information */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Patient</span>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">{apt.patientName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{apt.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Assigned Doctor</span>
                  <p className="font-semibold text-slate-800 truncate">{apt.doctorName}</p>
                  <p className="text-[11px] text-teal-700 truncate">{apt.specialty}</p>
                </div>
              </div>

              {/* Slot & Arrival Time */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{apt.timeSlot}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Arrival: <span className="font-mono font-medium">{apt.arrivalTime}</span>
                </div>
              </div>

              {/* Expandable Complaint */}
              {apt.complaint && (
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : apt.id)}
                    className="text-[11px] text-teal-600 hover:text-teal-800 underline flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>{isExpanded ? "Hide notes" : "View symptoms / complaint"}</span>
                  </button>
                  {isExpanded && (
                    <div className="mt-2 p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700">
                      {apt.complaint}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons (Full 44px min touch targets) */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => sendWhatsAppAlert(apt)}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[11px]">WhatsApp</span>
                </button>

                <a
                  href={`tel:${apt.phone.replace(/[^0-9]/g, "")}`}
                  className="min-h-[44px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-colors active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-[11px]">Call</span>
                </a>

                {apt.status !== "In Consultation" && apt.status !== "Completed" && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, "In Consultation")}
                    className="min-h-[44px] flex items-center justify-center px-2 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs active:scale-95"
                  >
                    <span>Call Next</span>
                  </button>
                )}

                {apt.status === "In Consultation" && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                    className="min-h-[44px] flex items-center justify-center px-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-2xs active:scale-95"
                  >
                    <span>Done</span>
                  </button>
                )}

                {apt.status === "Completed" && (
                  <div className="min-h-[44px] flex items-center justify-center text-slate-400 text-xs font-medium">
                    Finished
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP QUEUE TABLE VIEW (>= md screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <th className="py-3.5 px-4">Token & ID</th>
              <th className="py-3.5 px-4">Patient Information</th>
              <th className="py-3.5 px-4">Doctor & Specialty</th>
              <th className="py-3.5 px-4">Slot & Arrival</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.map((apt) => {
              const isExpanded = expandedId === apt.id;
              const currentStatusObj =
                statusOptions.find((s) => s.value === apt.status) || statusOptions[0];

              return (
                <React.Fragment key={apt.id}>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {apt.token}
                        </span>
                        {apt.isWalkIn && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Walk-In
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{apt.id}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-xs">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{apt.phone}</div>
                      {apt.complaint && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : apt.id)}
                          className="text-[10px] text-teal-600 hover:text-teal-800 underline mt-1 flex items-center gap-0.5"
                        >
                          <Info className="w-3 h-3" />
                          <span>{isExpanded ? "Hide Complaint" : "View Complaint"}</span>
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-teal-700">{apt.specialty}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Arr: <span className="font-mono">{apt.arrivalTime}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="relative inline-block">
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                          className={`appearance-none py-1.5 pl-2.5 pr-7 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${currentStatusObj.color}`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => sendWhatsAppAlert(apt)}
                          title="Send WhatsApp Notification"
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors shadow-2xs active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <a
                          href={`tel:${apt.phone.replace(/[^0-9]/g, "")}`}
                          title="Call Patient"
                          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shadow-2xs active:scale-95"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        {apt.status !== "In Consultation" && apt.status !== "Completed" && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "In Consultation")}
                            className="min-h-[40px] px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition-colors shadow-2xs active:scale-95"
                          >
                            Call Next
                          </button>
                        )}

                        {apt.status === "In Consultation" && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                            className="min-h-[40px] px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] transition-colors shadow-2xs active:scale-95"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-teal-50/40 border-b border-teal-100">
                      <td colSpan={6} className="p-3.5 px-6">
                        <div className="flex items-start gap-2 text-xs">
                          <span className="font-bold text-teal-900 shrink-0">Health Complaint:</span>
                          <span className="text-slate-700">{apt.complaint}</span>
                          <span className="ml-auto font-mono text-[11px] text-slate-500">
                            Fee: ${apt.consultationFee}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-xs">
          No patient appointments found matching the current filters.
        </div>
      )}

      {/* Table Footer info */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-1.5">
        <span>
          Showing <strong>{filteredAppointments.length}</strong> of{" "}
          <strong>{appointments.length}</strong> queued patients
        </span>
        <span className="text-[11px] text-center sm:text-right">
          Status transitions sync across reception and physician terminals.
        </span>
      </div>

    </div>
  );
}
