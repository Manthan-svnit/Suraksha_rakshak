export const STORAGE_KEY = 'ai-suraksha-attendance';

/**
 * Returns local YYYY-MM-DD string avoiding UTC shift bugs
 */
export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns formatted date string, e.g. "04 Oct 2026"
 */
export const getFormattedDate = (d = new Date()) => {
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Returns formatted 12-hour time string, e.g. "09:15 AM"
 */
export const getFormattedTime = (d = new Date()) => {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Load attendance list from localStorage safely
 */
export const loadAttendanceFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load attendance from localStorage:', e);
    return [];
  }
};

/**
 * Save attendance list to localStorage safely
 */
export const saveAttendanceToStorage = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save attendance to localStorage:', e);
  }
};

/**
 * Check whether attendance for studentId is already marked for a given date
 */
export const isAlreadyMarkedToday = (records, studentId, todayDate = getLocalDateString()) => {
  if (!Array.isArray(records)) return false;
  return records.some((r) => r.studentId === studentId && r.date === todayDate);
};

/**
 * Get existing attendance record for a student today
 */
export const getExistingAttendanceRecord = (records, studentId, todayDate = getLocalDateString()) => {
  if (!Array.isArray(records)) return null;
  return records.find((r) => r.studentId === studentId && r.date === todayDate) || null;
};
