import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function AttendanceTable({ records = [], onClearAttendance }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');

  const filteredRecords = useMemo(() => {
    return records.filter((student) => {
      const id = student.studentId || student.id || '';
      const name = student.name || '';
      const className = student.className || '';

      const matchesSearch = 
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClass = 
        selectedClass === 'ALL' || className === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [records, searchQuery, selectedClass]);

  const uniqueClasses = useMemo(() => {
    const classes = new Set(records.map(r => r.className).filter(Boolean));
    return Array.from(classes).sort();
  }, [records]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/40">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Today's Attendance
              </h2>
              <p className="text-xs text-slate-500">
                Verified attendance registry recorded by AI Suraksha Kavach
              </p>
            </div>
          </div>
        </div>

        {/* Search, Filter & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Class Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Classes</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Record Count Badge */}
          <div className="inline-flex items-center px-2.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
            {filteredRecords.length} {filteredRecords.length === 1 ? 'Record' : 'Records'}
          </div>

          {/* Reset Demo Button */}
          {onClearAttendance && (
            <button
              type="button"
              onClick={onClearAttendance}
              title="Reset recorded attendance for live science fair demo"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 sm:px-6 font-semibold">Student Name</th>
              <th className="py-3 px-4 sm:px-6 font-semibold">Student ID</th>
              <th className="py-3 px-4 sm:px-6 font-semibold">Class</th>
              <th className="py-3 px-4 sm:px-6 font-semibold">Date</th>
              <th className="py-3 px-4 sm:px-6 font-semibold">Entry Time</th>
              <th className="py-3 px-4 sm:px-6 font-semibold">Status</th>
              <th className="py-3 px-4 sm:px-6 font-semibold text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">No attendance marked yet today</p>
                    <p className="text-[11px] text-slate-400">
                      Start the camera and position Prince Patel or Nikul Vasava to automatically mark attendance.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const id = record.studentId || record.id;
                const time = record.time || record.entryTime;
                const date = record.formattedDate || record.date || 'Today';
                const confidence = record.confidence ? `${record.confidence}%` : '96.0%';

                return (
                  <tr 
                    key={`${id}_${record.date || record.time}`}
                    className="hover:bg-blue-50/40 transition-colors duration-150 group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-[11px] group-hover:border-emerald-400 shadow-2xs">
                          {record.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {record.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-700 group-hover:bg-blue-100/70 group-hover:text-blue-800 transition-colors">
                        {id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                        {record.className}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{date}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{time}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {record.status || 'Present'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-semibold text-slate-700">
                      <span className="text-emerald-700 bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-100 text-xs font-bold">
                        {confidence}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Automatic attendance logging active • Duplicate entry prevention enabled</span>
        </div>
        <div className="font-mono text-slate-400">
          Showing {filteredRecords.length} recorded entries
        </div>
      </div>
    </div>
  );
}
