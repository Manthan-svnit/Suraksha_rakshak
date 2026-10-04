import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  AlertTriangle, 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  XCircle,
  Siren
} from 'lucide-react';

export default function SecurityStatus({ 
  activeAlert = null, 
  recentAlerts = [], 
  lastScan = "10:42 PM",
  isAlarmMuted = false,
  onToggleMute = () => {},
  onDismissActiveAlert = () => {},
  onClearAlertLogs = () => {}
}) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden ${
      activeAlert 
        ? 'bg-rose-50/70 border-red-300 shadow-red-500/10 shadow-md ring-2 ring-red-500/30' 
        : 'bg-white border-slate-200/80 hover:shadow-md'
    }`}>
      {/* Main Status Header Card */}
      <div className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left Side: Status & Icon */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeAlert 
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 animate-pulse' 
              : 'bg-emerald-50 border border-emerald-200/80 text-emerald-600 shadow-2xs'
          }`}>
            {activeAlert ? (
              <Siren className="w-7 h-7 stroke-[2.2] animate-bounce" />
            ) : (
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider ${
                activeAlert ? 'text-red-700' : 'text-slate-500'
              }`}>
                SECURITY STATUS
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeAlert 
                  ? 'bg-red-600 text-white shadow-xs animate-pulse' 
                  : 'bg-emerald-100/80 text-emerald-800'
              }`}>
                {activeAlert ? (
                  <>
                    <AlertTriangle className="w-3 h-3" /> 🚨 SECURITY ALERT
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5" /> SECURE
                  </>
                )}
              </span>
            </div>

            <div className={`text-sm sm:text-base font-extrabold flex items-center gap-1.5 mt-0.5 ${
              activeAlert ? 'text-red-900' : 'text-slate-800'
            }`}>
              {activeAlert ? (
                <>
                  <span className="text-red-600 font-black">⚠</span> UNKNOWN PERSON DETECTED
                </>
              ) : (
                <>
                  <span className="text-emerald-600 font-extrabold">✓</span> No active threats detected
                </>
              )}
            </div>

            {activeAlert && (
              <p className="text-xs font-semibold text-red-700 mt-0.5 flex items-center gap-2">
                <span>Status: <strong className="underline uppercase">UNAUTHORIZED / UNREGISTERED</strong></span>
                <span>•</span>
                <span className="text-red-600">Attendance not recorded</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Metadata, Alarm Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-stretch lg:self-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 text-xs">
          
          {/* Last Scan / Detection Timestamp */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {activeAlert ? 'Alert Triggered' : 'Last Scan'}
            </div>
            <div className={`font-mono font-bold px-2 py-0.5 rounded-md border text-xs ${
              activeAlert 
                ? 'bg-red-100/80 text-red-800 border-red-300' 
                : 'bg-slate-100 text-slate-700 border-slate-200/60'
            }`}>
              {activeAlert ? activeAlert.time : lastScan}
            </div>
          </div>

          {/* Alarm Audio Mute / Unmute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isAlarmMuted ? "Alarm sound is muted. Click to enable." : "Alarm sound is active. Click to mute."}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isAlarmMuted
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}
          >
            {isAlarmMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Alarm Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Alarm Sound ON</span>
              </>
            )}
          </button>

          {/* Dismiss Alert Button (when alert is active) */}
          {activeAlert && (
            <button
              type="button"
              onClick={onDismissActiveAlert}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Dismiss Alert</span>
            </button>
          )}

          {/* Toggle Alert Log History Button */}
          {recentAlerts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              <span>Alert History ({recentAlerts.length})</span>
              {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

      </div>

      {/* Security Alert History Log Section */}
      {showHistory && recentAlerts.length > 0 && (
        <div className="border-t border-slate-200/80 bg-slate-50/60 p-4 sm:p-5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Security Alert Log (Today)
            </h4>
            <button
              type="button"
              onClick={onClearAlertLogs}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear Alert Logs
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Event Type</th>
                  <th className="py-2.5 px-4">Time</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Confidence</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="font-bold text-red-900">
                        {alert.type || 'UNKNOWN_PERSON'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">
                      {alert.time}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {alert.date}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold text-[11px]">
                        {alert.confidence}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                        {alert.status || 'UNAUTHORIZED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
