import React, { useState } from "react";
import { REVIEWS } from "../../data/clinicData";
import {
  Star,
  CheckCircle2,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function Reviews() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevReview = () => {
    setCurrentIdx((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIdx((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Verified Patient Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Families Say About AuraMed
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl text-base">
              Real reviews from real patients who experienced our zero-wait queue and compassionate specialist care.
            </p>
          </div>

          {/* Google Summary Badge */}
          <div className="mt-6 md:mt-0 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4 shrink-0 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xl text-slate-900 shadow-xs">
              4.9
            </div>
            <div>
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-800 mt-0.5">Google Business Rating</p>
              <p className="text-[11px] text-slate-500">1,400+ Verified Patient Reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-teal-500/30 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.content}"
                </p>
              </div>

              {/* Patient Footer & Tagged Doctor */}
              <div className="pt-4 border-t border-slate-200/60">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{rev.author}</h4>
                      {rev.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" title="Verified Patient" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{rev.role}</p>
                    <p className="text-[10px] text-teal-700 font-medium mt-0.5">
                      Attended by: {rev.doctorTagged}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Google Reviews Action */}
        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <span>Read all 1,400+ reviews on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
