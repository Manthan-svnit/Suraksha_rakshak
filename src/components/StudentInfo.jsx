import React from 'react';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  AlertTriangle, 
  HelpCircle, 
  Scan, 
  ShieldAlert, 
  CalendarCheck,
  BarChart3,
  Siren
} from 'lucide-react';
import { CONFIDENCE_THRESHOLD } from '../config/modelConfig';

export default function StudentInfo({ 
  prediction, 
  isCameraActive, 
  attendanceRecord, 
  justMarked,
  activeAlert = null 
}) {
  const thresholdPercent = (CONFIDENCE_THRESHOLD * 100).toFixed(0);

  // If camera is offline or no prediction yet
  if (!isCameraActive || !prediction) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
        {/* Panel Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                Student Information
              </h2>
              <p className="text-xs text-slate-500">Live AI Recognition Details</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            {isCameraActive ? 'Scanning Feed...' : 'Sensor Offline'}
          </span>
        </div>

        {/* Standby Body */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-500 animate-pulse-subtle">
            <Scan className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              {isCameraActive ? 'Waiting for recognition...' : 'Camera is Offline'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              {isCameraActive 
                ? 'Position Prince Patel, Nikul Vasava, or Manish Sir in the camera frame for automated recognition.'
                : 'Click Start Camera on the left panel to initialize live optical sensor stream.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { className, confidence, isConfident, isMatched, studentData, allPredictions } = prediction;
  const isTeacher = studentData?.role === 'teacher' || studentData?.className === 'Teacher';
  const isUnknown = isConfident && !isMatched;
  const hasAttendance = Boolean(attendanceRecord);
  const attendanceTime = attendanceRecord?.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col h-full transition-all duration-300 ${
      isUnknown 
        ? 'bg-rose-50/40 border-red-300 ring-2 ring-red-500/20' 
        : 'bg-white border-slate-200/80'
    }`}>
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isConfident && isMatched 
              ? 'bg-emerald-50 border border-emerald-200/60 text-emerald-600' 
              : isUnknown
              ? 'bg-red-600 text-white shadow-xs animate-pulse'
              : 'bg-indigo-50 border border-indigo-200/60 text-indigo-600'
          }`}>
            {isUnknown ? <Siren className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {isUnknown ? 'Security Identification' : 'Student Information'}
            </h2>
            <p className="text-xs text-slate-500">Live AI Recognition Details</p>
          </div>
        </div>

        {isConfident && isMatched ? (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Verified Match
          </span>
        ) : isUnknown ? (
          <span className="text-[11px] font-bold text-white bg-red-600 border border-red-700 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
            <AlertTriangle className="w-3 h-3 text-white" /> 🚨 UNAUTHORIZED
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" /> Below Threshold
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Profile Card & Avatar */}
        {isConfident && isMatched ? (
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="relative">
              <div className="w-16 h-16 rounded-full ring-3 ring-emerald-500/30 overflow-hidden bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-extrabold text-xl shadow-inner">
                {studentData.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-full ring-2 ring-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {studentData.name}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  isTeacher 
                    ? 'bg-purple-100 text-purple-800 border border-purple-200/60' 
                    : 'bg-blue-100/70 text-blue-800 border border-blue-200/60'
                }`}>
                  {isTeacher ? 'Staff / Teacher' : `Class ${studentData.className}`}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                <span>ID: <strong className="text-slate-800 font-semibold">{studentData.id}</strong></span>
                <span>•</span>
                <span>Role: <strong className="text-slate-800 font-semibold">{isTeacher ? 'Faculty' : 'Student'}</strong></span>
              </div>
            </div>
          </div>
        ) : !isConfident ? (
          /* Uncertain / Below Threshold State */
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-7 h-7 stroke-[1.75]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-amber-900">
                Recognition Uncertain
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Candidate: <span className="font-semibold font-mono">{className}</span> ({confidence}%)
              </p>
              <p className="text-[11px] text-amber-600 mt-0.5">
                Confidence is below {thresholdPercent}% threshold. Attendance not marked.
              </p>
            </div>
          </div>
        ) : (
          /* Unknown / Unregistered Class State */
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-red-100/70 border border-red-300 shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
              <ShieldAlert className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-red-900">
                  UNKNOWN PERSON
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                  UNREGISTERED
                </span>
              </div>
              <p className="text-xs text-red-800 mt-0.5">
                Model detected: <span className="font-bold font-mono text-red-950">{className}</span> ({confidence}%)
              </p>
              <p className="text-[11px] text-red-700 font-semibold mt-0.5">
                ⚠ Security alert triggered. Attendance cannot be recorded.
              </p>
            </div>
          </div>
        )}

        {/* Live Debug Panel: All Class Probabilities Breakdown */}
        {allPredictions && allPredictions.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                AI Model Class Probabilities (Real-Time)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Threshold: {thresholdPercent}%
              </span>
            </div>

            <div className="space-y-1.5">
              {allPredictions.map((pred) => {
                const probPercent = (pred.probability * 100).toFixed(1);
                const isWinner = pred.className === className;
                const isAboveThreshold = pred.probability >= CONFIDENCE_THRESHOLD;

                return (
                  <div key={pred.className} className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-mono truncate flex items-center gap-1 ${
                        isWinner ? 'font-bold text-slate-900' : 'text-slate-500'
                      }`}>
                        {isWinner && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        {pred.className}
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${
                        isAboveThreshold 
                          ? isUnknown ? 'text-red-700' : 'text-emerald-700' 
                          : isWinner 
                          ? 'text-amber-700' 
                          : 'text-slate-400'
                      }`}>
                        {probPercent}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-200 ${
                          isAboveThreshold 
                            ? isUnknown ? 'bg-red-500' : 'bg-emerald-500' 
                            : isWinner 
                            ? 'bg-amber-400' 
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${Math.min(parseFloat(probPercent) || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Attendance Status Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className={`p-3 rounded-xl border ${
            isConfident && isMatched 
              ? hasAttendance 
                ? 'bg-emerald-50/70 border-emerald-200/80' 
                : 'bg-blue-50/70 border-blue-200/80'
              : isUnknown
              ? 'bg-red-100/80 border-red-300'
              : 'bg-amber-50/60 border-amber-200/60'
          }`}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Attendance Status
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-800">
              {isConfident && isMatched ? (
                isTeacher ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-purple-800 truncate">✓ FACULTY</span>
                  </>
                ) : hasAttendance ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-800 truncate">✓ PRESENT</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-blue-800 truncate">PROCESSING</span>
                  </>
                )
              ) : isUnknown ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
                  <span className="text-red-900 truncate uppercase">UNAUTHORIZED</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-amber-800 truncate">UNCERTAIN</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {hasAttendance ? 'Logged Time' : 'Scan Time'}
            </div>
            <div className="text-xs sm:text-sm font-extrabold font-mono text-slate-800">
              {hasAttendance ? attendanceRecord.time : attendanceTime}
            </div>
          </div>
        </div>

        {/* Section 6: Prominent Action / Security / Attendance Banner */}
        {isConfident && isMatched ? (
          isTeacher ? (
            /* Teacher Banner */
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-4 shadow-md border border-purple-500/40">
              <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-widest text-purple-200 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>✓ PERSON RECOGNIZED</span>
                  </div>
                  <p className="text-xs font-medium text-purple-100">
                    Manish Sir (Teacher) verified. Faculty scan does not affect student counts.
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-400/30 text-xs font-mono font-bold text-purple-200 shrink-0">
                  {confidence}%
                </div>
              </div>
            </div>
          ) : justMarked ? (
            /* First Time Just Marked Banner */
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-4 shadow-md shadow-emerald-700/20 border border-emerald-500/40 animate-pulse-subtle">
              <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-widest text-emerald-200 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>✓ ATTENDANCE MARKED</span>
                  </div>
                  <p className="text-xs font-medium text-emerald-50">
                    {studentData.name} marked Present at {attendanceRecord?.time || attendanceTime}
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-400/30 text-xs font-mono font-bold text-emerald-100 shrink-0">
                  {attendanceRecord?.time || attendanceTime}
                </div>
              </div>
            </div>
          ) : hasAttendance ? (
            /* Already Marked Earlier Banner */
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white p-4 shadow-md border border-slate-700">
              <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    <CalendarCheck className="w-4 h-4 text-emerald-400" />
                    <span>✓ ATTENDANCE ALREADY MARKED</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {studentData.name} already recorded today at {attendanceRecord.time} (No duplicate added)
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-emerald-300 shrink-0">
                  {attendanceRecord.time}
                </div>
              </div>
            </div>
          ) : (
            /* Verifying Match Banner */
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 shadow-md border border-blue-500/40">
              <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-widest text-blue-200 uppercase">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>✓ STUDENT RECOGNIZED</span>
                  </div>
                  <p className="text-xs font-medium text-blue-100">
                    Confirming stability before logging attendance...
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-blue-950/40 border border-blue-400/30 text-xs font-mono font-bold text-blue-100 shrink-0">
                  {confidence}%
                </div>
              </div>
            </div>
          )
        ) : !isConfident ? (
          <div className="relative overflow-hidden rounded-xl bg-slate-800 text-white p-3.5 border border-slate-700">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-200">
                <span className="font-semibold text-amber-300">Recognition Uncertain:</span> Hold position in front of camera.
              </p>
            </div>
          </div>
        ) : (
          /* Prominent Security Alert Banner */
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white p-4 shadow-lg shadow-red-700/30 border border-red-400/50 animate-pulse">
            <div className="relative flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black tracking-widest text-red-100 uppercase">
                  <Siren className="w-4 h-4 text-white animate-bounce" />
                  <span>🚨 SECURITY ALERT — UNKNOWN PERSON DETECTED</span>
                </div>
                <p className="text-xs font-medium text-red-50">
                  Unauthorized person detected. Attendance not recorded • Security log created.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-200 pt-1">
                  <span>Detection Time: <strong>{activeAlert?.time || attendanceTime}</strong></span>
                  <span>•</span>
                  <span>Status: <strong>UNAUTHORIZED</strong></span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-red-950/60 border border-red-300/40 text-xs font-mono font-bold text-red-100 shrink-0">
                {confidence}%
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
