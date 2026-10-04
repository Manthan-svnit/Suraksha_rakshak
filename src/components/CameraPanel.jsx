import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CameraOff, 
  Scan, 
  AlertCircle, 
  Eye, 
  Radio, 
  RefreshCw, 
  Cpu, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function CameraPanel({ 
  onStreamChange, 
  videoRefExternal, 
  modelStatus = 'loading', 
  modelError = null 
}) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'denied' | 'unavailable' | 'unsupported' | 'generic'

  const internalVideoRef = useRef(null);
  const videoRef = videoRefExternal || internalVideoRef;
  const streamRef = useRef(null);

  // Stop camera tracks and release webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.error("Error stopping track:", e);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
    setIsStarting(false);

    if (onStreamChange) {
      onStreamChange(null, videoRef.current);
    }
  };

  // Start webcam and bind to video element
  const startCamera = async () => {
    setCameraError(null);
    setErrorType(null);
    setIsStarting(true);

    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsStarting(false);
      setErrorType('unsupported');
      setCameraError('Your browser does not support camera access. Please use a modern browser such as Chrome, Edge, or Firefox.');
      return;
    }

    try {
      // Clean up previous stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Explicitly play to avoid autoplay block issues
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay play() warning:", err);
          });
        };
      }

      setIsCameraActive(true);
      setIsStarting(false);

      if (onStreamChange) {
        onStreamChange(stream, videoRef.current);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setIsStarting(false);
      setIsCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorType('denied');
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings to continue.');
      } else if (
        err.name === 'NotFoundError' || 
        err.name === 'DevicesNotFoundError' ||
        err.name === 'NotReadableError' ||
        err.name === 'TrackStartError'
      ) {
        setErrorType('unavailable');
        setCameraError('No camera was detected or the camera is currently being used by another application.');
      } else {
        setErrorType('generic');
        setCameraError(err.message || 'Unable to access the camera. Please check your camera connection and try again.');
      }
    }
  };

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header of Camera Card */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isCameraActive ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-blue-50 border border-blue-200/60 text-blue-600'
          }`}>
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              Live Attendance Camera
            </h2>
            <p className="text-xs text-slate-500">School Main Gate • Sensor #01</p>
          </div>
        </div>

        {/* Dynamic Camera Status Badge */}
        {isCameraActive ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase">
              ● CAMERA ACTIVE
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
            <span className="text-[11px] font-bold text-slate-600 tracking-wide uppercase">
              ● CAMERA OFFLINE
            </span>
          </div>
        )}
      </div>

      {/* Main Viewfinder / Video Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center text-white shadow-inner group">
          
          {/* Real Video Element (Muted, Autoplay, PlaysInline, Mirror Mode) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isCameraActive ? 'opacity-100 scale-x-[-1]' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Fallback & Offline State Overlay (when camera is not active and no error) */}
          {!isCameraActive && !cameraError && (
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
              {/* Subtle Grid Background */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: '28px 28px'
                }}
              />

              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3 shadow-lg">
                <CameraOff className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                Camera is currently offline
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Click <span className="text-sky-400 font-semibold">Start Camera</span> below to activate the live optical sensor feed.
              </p>
            </div>
          )}

          {/* Error State Overlay */}
          {cameraError && (
            <div className="relative z-20 flex flex-col items-center justify-center p-6 text-center max-w-md bg-slate-950/90 backdrop-blur-md rounded-xl border border-red-500/30 m-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-2.5">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-red-300 uppercase tracking-wider font-mono">
                {errorType === 'denied' ? 'CAMERA ACCESS DENIED' : 'CAMERA UNAVAILABLE'}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Camera Viewfinder UI Elements (HUD) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 pointer-events-none z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 shadow-xs">
              <Radio className={`w-3 h-3 ${isCameraActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="tracking-wider text-slate-200">FEED: GATE-CAM-01</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 text-[10px] shadow-xs">
              <span className={isCameraActive ? "text-sky-400 font-semibold" : "text-slate-400"}>
                {isCameraActive ? "1080P • LIVE STREAM" : "STANDBY"}
              </span>
              <span className="text-slate-500">|</span>
              <span className={isCameraActive ? "text-emerald-400 font-semibold" : "text-slate-400"}>
                {isCameraActive ? "AI SENSOR: ACTIVE" : "AI SENSOR: IDLE"}
              </span>
            </div>
          </div>

          {/* Animated Horizontal Scan Line (Active when camera is running) */}
          {isCameraActive && (
            <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-scan pointer-events-none z-10 opacity-75" />
          )}

          {/* Face Detection Bounding Box & Target Overlay (Visual representation) */}
          {isCameraActive && (
            <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl border-2 border-dashed border-sky-400/50 flex flex-col items-center justify-center bg-sky-950/10 backdrop-blur-2xs transition-all duration-300">
                
                {/* Four Corner Reticles */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400 animate-corner" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400 animate-corner" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400 animate-corner" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400 animate-corner" />

                {/* Center Reticle Tag */}
                <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase font-mono bg-slate-950/60 px-2 py-0.5 rounded border border-cyan-400/30 shadow-xs">
                  FACE AREA
                </span>

                {/* Tag below face box */}
                <div className="absolute -bottom-3 bg-sky-600 text-white font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold shadow-xs">
                  AI SCANNING AREA
                </div>
              </div>
            </div>
          )}

          {/* Bottom Viewfinder Info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none z-10">
            <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
              <Eye className={`w-3 h-3 ${isCameraActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>Target: Single Face</span>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
              <span>FOV: Wide 90°</span>
            </div>
          </div>
        </div>

        {/* Bottom Control & Status Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              AI MODEL STATUS
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              {modelStatus === 'ready' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 font-bold">● AI MODEL READY</span>
                  <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    TM Image Model
                  </span>
                </>
              )}
              {modelStatus === 'loading' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-amber-700 font-bold">AI MODEL: Loading...</span>
                  <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    Downloading weights
                  </span>
                </>
              )}
              {modelStatus === 'error' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-700 font-bold">● AI MODEL ERROR</span>
                  <span className="text-[10px] font-normal text-red-500 bg-red-50 px-1.5 py-0.5 rounded truncate max-w-xs" title={modelError}>
                    {modelError || 'Failed to load'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Button: Start Camera / Stop Camera */}
          {isCameraActive ? (
            <button
              type="button"
              onClick={stopCamera}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-98"
            >
              <CameraOff className="w-4 h-4 text-rose-600 transition-transform group-hover:scale-110" />
              <span>Stop Camera</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              disabled={isStarting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all cursor-pointer group active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Starting Camera...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
                  <span>Start Camera</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
