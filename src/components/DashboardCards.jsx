import React from 'react';
import { Users, UserCheck, UserX, ShieldAlert, TrendingUp } from 'lucide-react';

export default function DashboardCards({ stats }) {
  const totalStudents = stats?.totalStudents ?? 2;
  const presentToday = stats?.presentToday ?? 0;
  const absentToday = stats?.absentToday ?? (totalStudents - presentToday);
  const securityAlerts = stats?.securityAlerts ?? 0;

  const attendancePercent = totalStudents > 0 
    ? ((presentToday / totalStudents) * 100).toFixed(0) 
    : '0';

  const cards = [
    {
      id: 'total',
      title: 'Total Students',
      value: String(totalStudents).padStart(2, '0'),
      subtext: 'Registered students (10-A)',
      icon: Users,
      badge: 'Academic Year 2026-27',
      cardBg: 'bg-white',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      accentColor: 'text-slate-900',
      borderAccent: 'border-slate-200/80 hover:border-blue-300',
    },
    {
      id: 'present',
      title: 'Present Today',
      value: String(presentToday).padStart(2, '0'),
      subtext: `${attendancePercent}% attendance rate`,
      icon: UserCheck,
      badge: `${presentToday} of ${totalStudents} logged`,
      cardBg: 'bg-white',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      accentColor: 'text-emerald-700',
      borderAccent: 'border-slate-200/80 hover:border-emerald-300',
      trendIcon: TrendingUp,
      trendPositive: true,
    },
    {
      id: 'absent',
      title: 'Absent Today',
      value: String(Math.max(0, absentToday)).padStart(2, '0'),
      subtext: 'Pending gate verification',
      icon: UserX,
      badge: `${absentToday} unrecorded`,
      cardBg: 'bg-white',
      iconBg: 'bg-slate-100 text-slate-600 border border-slate-200',
      accentColor: 'text-slate-800',
      borderAccent: 'border-slate-200/80 hover:border-slate-300',
    },
    {
      id: 'alerts',
      title: 'Security Alerts',
      value: String(securityAlerts).padStart(2, '0'),
      subtext: 'Monitored gate perimeter',
      icon: ShieldAlert,
      badge: 'All clear now',
      cardBg: 'bg-white',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
      accentColor: 'text-amber-700',
      borderAccent: 'border-slate-200/80 hover:border-amber-300',
      alertBadge: true,
    },
  ];

  return (
    <section aria-label="Dashboard Statistics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`group relative overflow-hidden rounded-2xl p-5 ${card.cardBg} border ${card.borderAccent} shadow-xs hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${card.accentColor}`}>
                    {card.value}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl transition-transform duration-200 group-hover:scale-110 ${card.iconBg}`}>
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium truncate">{card.subtext}</span>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
