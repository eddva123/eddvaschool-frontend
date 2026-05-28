import React from 'react';
import { Bell, Calendar, User, ChevronRight, AlertCircle, FileText } from 'lucide-react';

export default function Announcements() {
  const notices = [
    {
      id: 1,
      title: 'Summer Vacation Declaration & Term Break Schedule',
      date: 'May 28, 2026',
      publisher: 'School Administration Office',
      category: 'Holiday',
      important: true,
      content: 'The school premises will remain closed for summer vacation from June 1st, 2026 to June 30th, 2026. Online remedial doubts resolution support will remain active via the EDDVA AI Tutor interface during this period.'
    },
    {
      id: 2,
      title: 'Physics Mock Examination Chapter List Update',
      date: 'May 26, 2026',
      publisher: 'Dr. HC Verma (Physics Dept)',
      category: 'Academic',
      important: false,
      content: 'The upcoming Physics Mock Assessment scheduled on June 15th will include questions from Chapter 1 (Gauss Law applications) and Chapter 2 (Dipole derivation). Ensure your formulas cheat sheets are updated.'
    },
    {
      id: 3,
      title: 'Vite React App Frontend Upgrade Notice',
      date: 'May 24, 2026',
      publisher: 'Tech Operations Head',
      category: 'System',
      important: false,
      content: 'The EDDVA Student Panel has been successfully upgraded with a premium glassmorphic UI layout. If you experience loading glitches, please clear browser storage cache or contact student support.'
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-xl font-black text-slate-950 dark:text-white">Notice Board & Announcements</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Stay updated with official school notices, events schedules, and departmental updates</p>
      </div>

      {/* Notices scroll list */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {notices.map((notice) => (
          <div 
            key={notice.id}
            className={`rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 ${
              notice.important 
                ? "border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/10 shadow-sm"
                : "border-slate-200/50 bg-white/60 dark:border-slate-800/50 dark:bg-slate-900/60"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase ${
                    notice.important 
                      ? "bg-rose-500/10 text-rose-600"
                      : "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                  }`}>
                    {notice.category}
                  </span>
                  
                  {notice.important && (
                    <span className="flex items-center gap-1 text-[9px] font-black text-rose-600 uppercase tracking-wider bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md">
                      <AlertCircle size={10} /> Critical Notice
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-xs font-black text-slate-900 dark:text-white leading-snug">
                  {notice.title}
                </h3>
                
                <p className="mt-1 text-[10px] font-bold text-slate-400">Published: {notice.date} • By {notice.publisher}</p>

                <p className="mt-3.5 text-xs font-semibold leading-relaxed text-slate-550 dark:text-slate-400">
                  {notice.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
