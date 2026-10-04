export const SECURITY_ALERTS_STORAGE_KEY = 'ai-suraksha-security-alerts';
export const SECURITY_ALERT_COOLDOWN = 30 * 1000; // 30 seconds cooldown

let audioCtx = null;
let activeOscillators = [];

/**
 * Play a synthesized security alert chime/siren using the Web Audio API.
 * This runs completely locally in the browser with no external assets.
 */
export const playSecurityAlarm = (isMuted = false) => {
  if (isMuted) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopSecurityAlarm(); // Stop any overlapping previous sound

    const now = audioCtx.currentTime;

    // Beep 1 (High tone 880 Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(440, now + 0.35);

    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Beep 2 (High tone 980 Hz)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(980, now + 0.4);
    osc2.frequency.exponentialRampToValueAtTime(490, now + 0.85);

    gain2.gain.setValueAtTime(0.18, now + 0.4);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.4);
    osc2.stop(now + 0.85);

    activeOscillators = [osc1, osc2];
  } catch (err) {
    console.warn('[AI Suraksha] Web Audio alarm playback restricted or error:', err);
  }
};

/**
 * Stop any currently playing synthesized alarm sounds
 */
export const stopSecurityAlarm = () => {
  try {
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore if already stopped
      }
    });
    activeOscillators = [];
  } catch (err) {
    console.warn('[AI Suraksha] Error stopping alarm audio:', err);
  }
};

/**
 * Load security alerts history from localStorage
 */
export const loadSecurityAlertsFromStorage = () => {
  try {
    const raw = localStorage.getItem(SECURITY_ALERTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load security alerts from localStorage:', e);
    return [];
  }
};

/**
 * Save security alerts history to localStorage
 */
export const saveSecurityAlertsToStorage = (alerts) => {
  try {
    localStorage.setItem(SECURITY_ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save security alerts to localStorage:', e);
  }
};
