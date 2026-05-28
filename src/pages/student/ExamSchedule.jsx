import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, AlertCircle, FileText, ChevronRight } from 'lucide-react';

export default function ExamSchedule() {
  const [activeFilter, setActiveFilter] = useState('All');

  const examSchedules = [
    {
      id: 1,
      title: 'Physics Mid-Term Examination',
      type: 'Theory',
      subject: 'Physics',
      date: 'June 15, 2026',
      time: '10:00 AM - 01:00 PM',
      duration: '3 Hours',
      syllabus: 'Coulomb\'s Law, Gauss Theorem, Electrostatic Potential, Electric Capacitance.',
      instructions: 'Calculators are allowed. Bring official ID and registration card.'
    },
    {
      id: 2,
      title: 'Chemistry Laboratory Assessment',
      type: 'Practical',
      subject: 'Chemistry',
      date: 'June 18, 2026',
      time: '09:00 AM - 12:00 PM',
      duration: '3 Hours',
      syllabus: 'Qualitative inorganic analysis, Salt identification, Volumetric analysis.',
      instructions: 'Lab coat and manual logs are compulsory. No electronic items.'
    },
    {
      id: 3,
      title: 'Mathematics Final Term Examination',
      type: 'Theory',
      subject: 'Mathematics',
      date: 'June 22, 2026',
      time: '10:00 AM - 01:00 PM',
      duration: '3 Hours',
      syllabus: 'Integrals (Definite & Indefinite), Differential Equations, Vectors, 3D Geometry.',
      instructions: 'Graph sheets will be provided. No formulas calculators allowed.'
    }
  ];

  const filteredExams = examSchedules.filter(ex => 
    activeFilter === 'All' || ex.type === activeFilter
  );

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Examination Schedules</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Track exam dates, test types, and check topic syllabus details</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl shrink-0">
          {['All', 'Theory', 'Practical'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeFilter === filter 
                  ? "bg-white text-indigo-650 shadow-sm dark:bg-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-350"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredExams.map((ex) => (
            <div 
              key={ex.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="inline-block rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {ex.subject}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {ex.type} Exam
                  </span>
                </div>

                <h3 className="mt-4 text-xs font-black text-slate-900 dark:text-white leading-snug">
                  {ex.title}
                </h3>
                
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-655 dark:text-slate-400">
                    <Calendar size={14} className="text-indigo-500" />
                    <span>{ex.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-655 dark:text-slate-400">
                    <Clock size={14} className="text-indigo-500" />
                    <span>{ex.time} ({ex.duration})</span>
                  </div>
                </div>

                {/* Syllabus block */}
                <div className="mt-5 rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60">
                  <span className="text-[9px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-wider block">Syllabus Chapters</span>
                  <p className="mt-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ex.syllabus}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/50 text-[10px] font-bold text-slate-400">
                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                <span className="leading-snug">{ex.instructions}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
