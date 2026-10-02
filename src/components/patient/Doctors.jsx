import React, { useState } from "react";
import { useClinic } from "../../context/ClinicContext";
import { DOCTORS, SPECIALTIES } from "../../data/clinicData";
import {
  Star,
  Calendar,
  Clock,
  Award,
  Globe2,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Doctors() {
  const { openBookingModal } = useClinic();
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialtyFilter === "all" || doc.specialtyId === selectedSpecialtyFilter;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <section id="doctors" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-3 border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Distinguished Faculty
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consult Board-Certified Specialists
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Every AuraMed physician brings at least 10+ years of clinical tenure from world-leading academic medical institutions.
          </p>

          {/* Search & Specialty Filter Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search physician or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
              />
            </div>

            {/* Specialty Dropdown */}
            <select
              value={selectedSpecialtyFilter}
              onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
              className="w-full sm:w-56 py-2.5 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            >
              <option value="all">All Departments ({DOCTORS.length})</option>
              {SPECIALTIES.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image and Header Banner */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Specialty Badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-900 border border-slate-200 shadow-xs">
                    {doc.specialty}
                  </span>

                  {/* Top Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold border border-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-slate-400">({doc.reviewsCount})</span>
                  </div>

                  {/* Next Slot pill overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-600/90 backdrop-blur-md font-semibold">
                      <Clock className="w-3 h-3 text-teal-200" />
                      <span>Next: {doc.nextAvailable}</span>
                    </div>
                    <span className="font-extrabold text-sm drop-shadow-sm">
                      ${doc.consultationFee} <span className="text-[10px] font-normal text-slate-200">/ consult</span>
                    </span>
                  </div>
                </div>

                {/* Doctor Bio & Credential Body */}
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">
                    {doc.title}
                  </p>

                  {/* Qualifications chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {doc.qualifications.map((q, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                      >
                        {q}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 mt-4 leading-relaxed line-clamp-3">
                    {doc.bio}
                  </p>

                  {/* Tenure and Languages */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.experienceYears} Years Practice</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{doc.languages.join(", ")}</span>
                    </div>
                  </div>

                  {/* Weekly Available Days */}
                  <div className="mt-3 flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400 font-medium">Days:</span>
                    <div className="flex gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                        const isAvail = doc.daysAvailable.includes(day);
                        return (
                          <span
                            key={day}
                            className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                              isAvail
                                ? "bg-teal-50 text-teal-700 font-bold border border-teal-200"
                                : "text-slate-300 line-through"
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => openBookingModal(doc, null)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-soft group-hover:shadow-glow-teal active:scale-98"
                >
                  <Calendar className="w-4 h-4 text-teal-300" />
                  <span>Check Available Slots</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No doctors match your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialtyFilter("all");
              }}
              className="mt-3 text-xs font-bold text-teal-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
