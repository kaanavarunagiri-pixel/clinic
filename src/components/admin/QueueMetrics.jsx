import React from "react";
import { useClinic } from "../../context/ClinicContext";
import {
  Users,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Stethoscope
} from "lucide-react";

export default function QueueMetrics() {
  const { metrics, appointments } = useClinic();

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
      title: "Currently In Consultation",
      value: metrics.inConsultationCount,
      subtitle: "Physicians actively consulting",
      icon: Stethoscope,
      color: "text-medblue-700",
      bgIcon: "bg-blue-50 text-medblue-600",
      accent: "border-blue-200",
      badge: "With Doctor",
    },
    {
      title: "Average Waiting Time",
      value: `${metrics.avgWaitMinutes} mins`,
      subtitle: "Guaranteed sub-10 min target",
      icon: Clock,
      color: "text-emerald-700",
      bgIcon: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-200",
      badge: "Target Met",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-white border ${card.accent} shadow-soft hover:shadow-card transition-all`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bgIcon}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-3xl font-extrabold tracking-tight ${card.color}`}>
                {card.value}
              </span>
              {card.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {card.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
