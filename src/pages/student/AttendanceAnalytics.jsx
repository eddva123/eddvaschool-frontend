import React, { useState } from 'react';
import { 
  Calendar, CheckCircle, AlertTriangle, XCircle, Info, Clock, 
  HelpCircle, ChevronLeft, ChevronRight, TrendingUp 
} from 'lucide-react';

export default function AttendanceAnalytics() {
  const [currentMonth, setCurrentMonth] = useState('May 2026');

  // Attendance metrics
  const attendanceRate = 84; // 84%
  const totalDays = 22;
  const presentDays = 18;
  const absentDays = 2;
  const lateDays = 2;

  // Calendar dates mock grid representation for May 2026
  // Statuses: present, absent, late, weekend, empty
  const calendarDays = [
    { day: null, status: 'empty' }, { day: null, status: 'empty' }, { day: null, status: 'empty' }, { day: 1, status: 'weekend' }, { day: 2, status: 'weekend' },
    { day: 3, status: 'present' }, { day: 4, status: 'present' }, { day: 5, status: 'present' }, { day: 6, status: 'present' }, { day: 7, status: 'late' }, { day: 8, status: 'weekend' }, { day: 9, status: 'weekend' },
    { day: 10, status: 'present' }, { day: 11, status: 'present' }, { day: 12, status: 'absent' }, { day: 13, status: 'present' }, { day: 14, status: 'present' }, { day: 15, status: 'weekend' }, { day: 16, status: 'weekend' },
    { day: 17, status: 'present' }, { day: 18, status: 'present' }, { day: 19, status: 'late' }, { day: 20, status: 'present' }, { day: 21, status: 'present' }, { day: 22, status: 'weekend' }, { day: 23, status: 'weekend' },
    { day: 24, status: 'present' }, { day: 25, status: 'present' }, { day: 26, status: 'absent' }, { day: 27, status: 'present' }, { day: 28, status: 'present' }, { day: 29, status: 'weekend' }, { day: 30, status: 'weekend' },
    { day: 31, status: 'present' }
  ];

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-xl font-black text-slate-950 dark:text-white">Attendance Analytics</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">View detailed attendance grids, check eligibility criteria, and track late listings</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left: Monthly Calendar Heatmap Grid */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            {/* Month controller */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{currentMonth}</h3>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 text-slate-500 dark:border-slate-800 dark:hover:bg-slate-850">
                  <ChevronLeft size={14} />
                </button>
                <button className="p-1.5 rounded-lg border border-slate-200/60 hover:bg-slate-50 text-slate-500 dark:border-slate-800 dark:hover:bg-slate-850">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Calendar Heatmap Grid */}
            <div className="mt-6">
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, idx) => {
                  let statusBg = "bg-slate-50/40 text-transparent dark:bg-slate-900/20";
                  if (date.day !== null) {
                    if (date.status === 'present') {
                      statusBg = "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20";
                    } else if (date.status === 'absent') {
                      statusBg = "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-450 border border-rose-500/20";
                    } else if (date.status === 'late') {
                      statusBg = "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20";
                    } else if (date.status === 'weekend') {
                      statusBg = "bg-slate-100 text-slate-400 dark:bg-slate-850 dark:text-slate-500";
                    }
                  }
                  return (
                    <div 
                      key={idx}
                      className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all ${statusBg}`}
                    >
                      {date.day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend indicators */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Present</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Absent</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Late</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-750" /> Weekend</span>
            </div>
          </div>
        </div>

        {/* Right: Attendance eligibility criteria */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
          {/* Main KPI Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-5 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{attendanceRate}%</h3>
                <p className="text-[10px] font-bold text-emerald-600 mt-1">Eligible for Exams</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-5 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Working Days</span>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalDays} Days</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">This semester</p>
              </div>
            </div>
          </div>

          {/* Exam Eligibility check */}
          <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Exam Criteria Check</h3>
            
            <div className="space-y-4">
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs font-semibold text-amber-800 dark:text-amber-400">
                <div className="flex gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Minimum Attendance Threshold: 75%</span>
                    <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">Your currently registered average attendance is {attendanceRate}%. You are clear for registrations, but must avoid further consecutive absences.</p>
                  </div>
                </div>
              </div>

              {/* Status details list */}
              <div className="space-y-2.5">
                {[
                  { label: 'Classes Attended', count: presentDays, icon: <CheckCircle className="text-emerald-500" size={14} /> },
                  { label: 'Unexcused Absences', count: absentDays, icon: <XCircle className="text-rose-500" size={14} /> },
                  { label: 'Late Punch-ins', count: lateDays, icon: <Clock className="text-amber-500" size={14} /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-3 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{item.count} Days</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
