import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as tmImage from '@teachablemachine/image';
import Header from './components/Header';
import DashboardCards from './components/DashboardCards';
import CameraPanel from './components/CameraPanel';
import StudentInfo from './components/StudentInfo';
import AttendanceTable from './components/AttendanceTable';
import SecurityStatus from './components/SecurityStatus';
import Footer from './components/Footer';
import { MODEL_URL, CONFIDENCE_THRESHOLD } from './config/modelConfig';
import { students, findStudentByName } from './data/students';
import { 
  getLocalDateString, 
  getFormattedDate, 
  getFormattedTime, 
  loadAttendanceFromStorage, 
  saveAttendanceToStorage, 
  isAlreadyMarkedToday, 
  getExistingAttendanceRecord 
} from './utils/attendanceUtils';
import {
  SECURITY_ALERT_COOLDOWN,
  playSecurityAlarm,
  stopSecurityAlarm,
  loadSecurityAlertsFromStorage,
  saveSecurityAlertsToStorage
} from './utils/securityUtils';

// Number of consecutive confident frames required before triggering attendance or security alerts
const REQUIRED_CONSECUTIVE_PREDICTIONS = 3;

export default function App() {
  // 1. Attendance Records State (persisted in localStorage)
  const [attendanceList, setAttendanceList] = useState(() => loadAttendanceFromStorage());
  const [justMarkedStudentId, setJustMarkedStudentId] = useState(null);

  // 2. Security Alerts State (persisted in localStorage)
  const [securityAlerts, setSecurityAlerts] = useState(() => loadSecurityAlertsFromStorage());
  const [activeSecurityAlert, setActiveSecurityAlert] = useState(null);
  const [isAlarmMuted, setIsAlarmMuted] = useState(false);

  // 3. Teachable Machine Model States
  const [model, setModel] = useState(null);
  const [modelStatus, setModelStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [modelError, setModelError] = useState(null);
  const [modelLabels, setModelLabels] = useState([]);

  // 4. Live Camera & Recognition States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isPredictingRef = useRef(false);
  const consecutiveRef = useRef({ studentId: null, count: 0 });
  const unknownConsecutiveRef = useRef(0);
  const lastAlertTimestampRef = useRef(0);
  const lastLogTimeRef = useRef(0);

  // Today's local date (e.g. "2026-10-04")
  const todayDate = useMemo(() => getLocalDateString(), []);

  // Compute live dashboard metrics derived strictly from configured students, attendance, and alerts
  const dashboardStats = useMemo(() => {
    // Total registered students (excluding faculty)
    const uniqueStudents = new Map();
    Object.values(students).forEach((s) => {
      if (s.role === 'student') {
        uniqueStudents.set(s.id, s);
      }
    });
    const totalStudents = uniqueStudents.size;

    // Unique students marked present today
    const presentStudentIds = new Set(
      attendanceList
        .filter((r) => r.role === 'student' && r.date === todayDate)
        .map((r) => r.studentId)
    );
    const presentToday = presentStudentIds.size;
    const absentToday = Math.max(0, totalStudents - presentToday);

    // Number of security alert events generated today
    const securityAlertsToday = securityAlerts.filter((a) => a.date === todayDate).length;

    return {
      totalStudents,
      presentToday,
      absentToday,
      securityAlerts: securityAlertsToday,
    };
  }, [attendanceList, securityAlerts, todayDate]);

  // Load Teachable Machine Model ONLY ONCE on mount
  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        setModelStatus('loading');
        setModelError(null);

        const modelURL = MODEL_URL.endsWith('/') ? MODEL_URL + 'model.json' : MODEL_URL + '/model.json';
        const metadataURL = MODEL_URL.endsWith('/') ? MODEL_URL + 'metadata.json' : MODEL_URL + '/metadata.json';

        console.log(`[AI Suraksha] Loading Teachable Machine model from: ${MODEL_URL}`);
        const loadedModel = await tmImage.load(modelURL, metadataURL);

        if (isMounted) {
          const labels = loadedModel.getClassLabels();
          setModel(loadedModel);
          setModelLabels(labels);
          setModelStatus('ready');
          console.log("[AI Suraksha] Model loaded successfully. Class labels from metadata.json:", labels);
        }
      } catch (err) {
        console.error("[AI Suraksha] Failed to load Teachable Machine model:", err);
        if (isMounted) {
          setModelStatus('error');
          setModelError(err.message || 'Failed to download model weights from Teachable Machine URL');
        }
      }
    }

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mark Attendance Function (Pure, Safe, No Duplicates)
  const markAttendance = useCallback((studentData, confidencePercent) => {
    if (studentData.role !== 'student') {
      return { status: 'teacher', record: null };
    }

    const currentToday = getLocalDateString();
    
    if (isAlreadyMarkedToday(attendanceList, studentData.id, currentToday)) {
      const existing = getExistingAttendanceRecord(attendanceList, studentData.id, currentToday);
      return { status: 'already_marked', record: existing };
    }

    const now = new Date();
    const newRecord = {
      studentId: studentData.id,
      name: studentData.name,
      className: studentData.className,
      role: studentData.role,
      date: currentToday,
      formattedDate: getFormattedDate(now),
      time: getFormattedTime(now),
      timestamp: now.getTime(),
      status: 'Present',
      confidence: confidencePercent,
    };

    setAttendanceList((prev) => {
      if (isAlreadyMarkedToday(prev, studentData.id, currentToday)) {
        return prev;
      }
      const updated = [newRecord, ...prev];
      saveAttendanceToStorage(updated);
      return updated;
    });

    setJustMarkedStudentId(studentData.id);
    setTimeout(() => {
      setJustMarkedStudentId((curr) => (curr === studentData.id ? null : curr));
    }, 4500);

    return { status: 'newly_marked', record: newRecord };
  }, [attendanceList]);

  // Trigger Security Alert Function (With Cooldown & Audio Siren)
  const triggerSecurityAlert = useCallback((detectedClassName, confidencePercent) => {
    const now = Date.now();
    const currentToday = getLocalDateString();

    // Check Cooldown (30 seconds)
    if (now - lastAlertTimestampRef.current < SECURITY_ALERT_COOLDOWN) {
      return; // Inside cooldown, keep current warning visible without repeating alarm
    }

    lastAlertTimestampRef.current = now;
    const alertTime = getFormattedTime(new Date());

    const newAlert = {
      id: `alert-${now}`,
      date: currentToday,
      time: alertTime,
      timestamp: now,
      confidence: confidencePercent,
      type: 'UNKNOWN_PERSON',
      detectedClass: detectedClassName,
      status: 'UNAUTHORIZED',
      message: 'Attendance not recorded',
    };

    console.warn(`[AI Suraksha] 🚨 SECURITY ALERT CREATED: Unknown person detected at ${alertTime} (${confidencePercent}%)`);

    // Play synthesized Web Audio alarm
    playSecurityAlarm(isAlarmMuted);

    setActiveSecurityAlert(newAlert);
    setSecurityAlerts((prev) => {
      const updated = [newAlert, ...prev];
      saveSecurityAlertsToStorage(updated);
      return updated;
    });
  }, [isAlarmMuted]);

  // Controlled Real-Time Prediction Loop
  const runPredictionLoop = useCallback(async () => {
    if (!isCameraActive || !model || !videoRef.current) {
      return;
    }

    const videoEl = videoRef.current;

    if (videoEl.readyState >= 2 && videoEl.videoWidth > 0 && !isPredictingRef.current) {
      isPredictingRef.current = true;
      try {
        const predictions = await model.predict(videoEl);

        if (predictions && predictions.length > 0) {
          // Find class with highest probability
          let highest = predictions[0];
          for (let i = 1; i < predictions.length; i++) {
            if (predictions[i].probability > highest.probability) {
              highest = predictions[i];
            }
          }

          const rawProb = highest.probability;
          const confidencePercent = (rawProb * 100).toFixed(1);
          const isConfident = rawProb >= CONFIDENCE_THRESHOLD;
          const studentData = findStudentByName(highest.className);
          const isMatched = Boolean(studentData);

          // Throttled debug console log (every ~1.5 seconds)
          const now = Date.now();
          if (now - lastLogTimeRef.current > 1500) {
            console.log(`[AI Suraksha] Real-time inference output (Top: ${highest.className} ${(rawProb * 100).toFixed(1)}%):`);
            console.table(
              predictions.map((p) => ({
                className: p.className,
                probability: `${(p.probability * 100).toFixed(2)}%`,
                rawScore: p.probability.toFixed(4),
              }))
            );
            lastLogTimeRef.current = now;
          }

          setPrediction({
            className: highest.className,
            probability: rawProb,
            confidence: confidencePercent,
            isConfident,
            isMatched,
            studentData,
            allPredictions: predictions,
          });

          // 1. Known Person Flow
          if (isConfident && isMatched) {
            unknownConsecutiveRef.current = 0; // Reset unknown tracker

            if (studentData.role === 'student') {
              if (consecutiveRef.current.studentId === studentData.id) {
                consecutiveRef.current.count += 1;
              } else {
                consecutiveRef.current = { studentId: studentData.id, count: 1 };
              }

              if (consecutiveRef.current.count >= REQUIRED_CONSECUTIVE_PREDICTIONS) {
                markAttendance(studentData, confidencePercent);
              }
            } else {
              // Teacher (e.g. Manish Sir) - No attendance marking, no alert
              consecutiveRef.current = { studentId: null, count: 0 };
            }
          } 
          // 2. Unknown / Unregistered Flow (Confidence >= 80% and not a registered person)
          else if (isConfident && !isMatched) {
            consecutiveRef.current = { studentId: null, count: 0 }; // Reset student tracker
            unknownConsecutiveRef.current += 1;

            if (unknownConsecutiveRef.current >= REQUIRED_CONSECUTIVE_PREDICTIONS) {
              triggerSecurityAlert(highest.className, confidencePercent);
            }
          } 
          // 3. Uncertain Recognition Flow (Confidence < 80%)
          else {
            consecutiveRef.current = { studentId: null, count: 0 };
            unknownConsecutiveRef.current = 0;
          }
        }
      } catch (err) {
        console.error("[AI Suraksha] Prediction frame error:", err);
      } finally {
        isPredictingRef.current = false;
      }
    }

    if (isCameraActive) {
      animationFrameRef.current = requestAnimationFrame(runPredictionLoop);
    }
  }, [isCameraActive, model, markAttendance, triggerSecurityAlert]);

  // Trigger / Stop prediction loop on camera active change
  useEffect(() => {
    if (isCameraActive && model) {
      animationFrameRef.current = requestAnimationFrame(runPredictionLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      stopSecurityAlarm();
      setPrediction(null);
      isPredictingRef.current = false;
      consecutiveRef.current = { studentId: null, count: 0 };
      unknownConsecutiveRef.current = 0;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      stopSecurityAlarm();
    };
  }, [isCameraActive, model, runPredictionLoop]);

  // Handle camera stream status change from CameraPanel
  const handleStreamChange = (stream) => {
    const active = Boolean(stream);
    setIsCameraActive(active);
    if (!active) {
      stopSecurityAlarm();
      setPrediction(null);
      consecutiveRef.current = { studentId: null, count: 0 };
      unknownConsecutiveRef.current = 0;
    }
  };

  // Reset Demo Action (Attendance)
  const handleClearAttendance = () => {
    setAttendanceList([]);
    saveAttendanceToStorage([]);
    setJustMarkedStudentId(null);
    consecutiveRef.current = { studentId: null, count: 0 };
  };

  // Clear Security Alert Logs Action
  const handleClearAlertLogs = () => {
    setSecurityAlerts([]);
    saveSecurityAlertsToStorage([]);
    setActiveSecurityAlert(null);
    stopSecurityAlarm();
    lastAlertTimestampRef.current = 0;
  };

  // Dismiss Active Alert
  const handleDismissActiveAlert = () => {
    setActiveSecurityAlert(null);
    stopSecurityAlarm();
  };

  // Compute header status text
  const getHeaderStatus = () => {
    if (activeSecurityAlert) return '🚨 SECURITY ALERT';
    if (modelStatus === 'loading') return 'AI MODEL: LOADING...';
    if (modelStatus === 'error') return '● AI MODEL ERROR';
    return isCameraActive ? '● CAMERA ACTIVE' : '● SYSTEM READY';
  };

  // Get active student's existing attendance record if any
  const currentAttendanceRecord = useMemo(() => {
    if (!prediction?.studentData?.id) return null;
    return getExistingAttendanceRecord(attendanceList, prediction.studentData.id, todayDate);
  }, [prediction, attendanceList, todayDate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* 1. Header with dynamic AI / Security status */}
      <Header status={getHeaderStatus()} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* 2. Dashboard Cards (Computed dynamically) */}
        <DashboardCards stats={dashboardStats} />

        {/* 3. Main Content Area: Camera (55%) + Student Information (45%) */}
        <section aria-label="Live Recognition Dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Camera Panel (55% on desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <CameraPanel 
              onStreamChange={handleStreamChange}
              videoRefExternal={videoRef}
              modelStatus={modelStatus}
              modelError={modelError}
            />
          </div>

          {/* Student Information Panel (45% on desktop) */}
          <div className="lg:col-span-5 flex flex-col">
            <StudentInfo 
              prediction={prediction}
              isCameraActive={isCameraActive}
              attendanceRecord={currentAttendanceRecord}
              justMarked={justMarkedStudentId === prediction?.studentData?.id}
              activeAlert={activeSecurityAlert}
            />
          </div>
        </section>

        {/* 4. Security Status & Alert Management Card */}
        <SecurityStatus 
          activeAlert={activeSecurityAlert}
          recentAlerts={securityAlerts.filter((a) => a.date === todayDate)}
          lastScan={new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          isAlarmMuted={isAlarmMuted}
          onToggleMute={() => setIsAlarmMuted((prev) => !prev)}
          onDismissActiveAlert={handleDismissActiveAlert}
          onClearAlertLogs={handleClearAlertLogs}
        />

        {/* 5. Today's Attendance Table with Live Records */}
        <section aria-label="Attendance Registry">
          <AttendanceTable 
            records={attendanceList}
            onClearAttendance={handleClearAttendance}
          />
        </section>

      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
