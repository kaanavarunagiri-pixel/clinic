import React from "react";
import { useClinic } from "../../context/ClinicContext";
import {
  Users,
  Activity,
  Clock,
  Stethoscope
} from "lucide-react";

export default function QueueMetrics() {
  const { metrics } = useClinic();

  const cards = [
    {
      title: "Today's Patient Load",
      value: metrics.todayCount,
      subtitle: "Appointments registered today",
      icon: Users,
      color: "text-slate-900",
      bgIcon: "bg-slate-100 text-slate-700",
      accent: "border-slate-200",
    },
    {
      title: "Active In Queue",
      value: metrics.activeQueueCount,
      subtitle: "Waiting or in triage",
      icon: Activity,
      color: "text-teal-700",
      bgIcon: "bg-teal-50 text-teal-600",
      accent: "border-teal-200",
      badge: "Live Triage",
    },
    {
      title: "In Consultation",
      value: metrics.inConsultationCount,
      subtitle: "Physicians actively consulting",
      icon: Stethoscope,
      color: "text-medblue-700",
      bgIcon: "bg-blue-50 text-medblue-600",
      accent: "border-blue-200",
      badge: "With Doctor",
    },
    {
      title: "Average Wait Time",
      value: `${metrics.avgWaitMinutes} mins`,
      subtitle: "Sub-10 min target met",
      icon: Clock,
      color: "text-emerald-700",
      bgIcon: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-200",
      badge: "Guaranteed",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 sm:p-5 rounded-2xl bg-white border ${card.accent} shadow-2xs sm:shadow-soft hover:shadow-card transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate mr-1">
                  {card.title}
                </span>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${card.bgIcon}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 mb-1 flex-wrap">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.color}`}>
                  {card.value}
                </span>
                {card.badge && (
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 shrink-0">
                    {card.badge}
                  </span>
                )}
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-500 truncate">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
