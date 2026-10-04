import React from 'react';
import { Shield, Sparkles, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-white/70 py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm sm:text-base tracking-tight">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>AI Suraksha Kavach</span>
        </div>
        
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Smarter Schools • Safer Students • Better Future
        </p>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>Science Fair Prototype — Phase 1 (UI Architecture)</span>
        </div>

        <p className="text-[11px] text-slate-400 mt-1">
          Designed for Teachable Machine Image Model & Webcam Integration
        </p>
      </div>
    </footer>
  );
}
