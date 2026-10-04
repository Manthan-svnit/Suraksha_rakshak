/**
 * Mock Data for AI SURAKSHA KAVACH - Smart School Attendance & Security System
 * In Phase 2 & 3, this structure will be populated dynamically from Teachable Machine predictions
 * and backend attendance tracking logic.
 */

export const mockStats = {
  totalStudents: 120,
  presentToday: 87,
  absentToday: 33,
  securityAlerts: 2,
  systemStatus: "SYSTEM READY",
  lastScanTime: "08:24 AM",
  systemDate: "27 September 2026",
};

export const currentRecognizedStudent = {
  id: "1023",
  name: "Rahul Patel",
  className: "10-A",
  rollNo: "24",
  entryTime: "08:14 AM",
  status: "Present",
  confidence: 96.4,
  modelStatus: "Ready for face detection",
  recognitionMessage: "Student verified successfully",
  actionNote: "Rahul Patel entered the school.",
  avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80",
};

export const mockAttendanceRecords = [
  {
    id: "1023",
    name: "Rahul Patel",
    className: "10-A",
    entryTime: "08:14 AM",
    status: "Present",
    confidence: 96.4,
    gender: "Male",
  },
  {
    id: "1024",
    name: "Priya Shah",
    className: "10-A",
    entryTime: "08:17 AM",
    status: "Present",
    confidence: 94.8,
    gender: "Female",
  },
  {
    id: "1025",
    name: "Meet Joshi",
    className: "10-B",
    entryTime: "08:19 AM",
    status: "Present",
    confidence: 98.1,
    gender: "Male",
  },
  {
    id: "1026",
    name: "Dhruv Patel",
    className: "10-B",
    entryTime: "08:22 AM",
    status: "Present",
    confidence: 95.3,
    gender: "Male",
  },
  {
    id: "1027",
    name: "Krisha Shah",
    className: "10-A",
    entryTime: "08:24 AM",
    status: "Present",
    confidence: 97.6,
    gender: "Female",
  },
  {
    id: "1028",
    name: "Aarav Mehta",
    className: "10-C",
    entryTime: "08:26 AM",
    status: "Present",
    confidence: 96.0,
    gender: "Male",
  },
  {
    id: "1029",
    name: "Ananya Sharma",
    className: "10-B",
    entryTime: "08:29 AM",
    status: "Present",
    confidence: 93.7,
    gender: "Female",
  },
  {
    id: "1030",
    name: "Rohan Verma",
    className: "10-C",
    entryTime: "08:31 AM",
    status: "Present",
    confidence: 97.2,
    gender: "Male",
  },
];
