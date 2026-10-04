import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Activity } from 'lucide-react';

export default function Header({ status = "SYSTEM READY" }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left branding */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/20 ring-1 ring-white/50">
            <Shield className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                AI SURAKSHA KAVACH
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <Sparkles className="w-2.5 h-2.5" /> Science Fair Edition
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 tracking-normal">
              Smart School Attendance & Security System
            </p>
          </div>
        </div>

        {/* Right Status & Date/Time */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
              {status}
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-slate-700">
              {formattedDate}
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-end gap-1">
              <Activity className="w-3 h-3 text-slate-400 animate-pulse" />
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
