import React from 'react';
import { 
  FileText, Download, TrendingUp, Award, CheckCircle, 
  HelpCircle, ChevronRight, GraduationCap, Flame, Star, BookOpen 
} from 'lucide-react';

export default function ExamReports() {
  const reportCards = [
    {
      id: 1,
      title: 'First Midterm Examination Report Card',
      term: 'Fall Term 2025',
      gpa: '3.8 / 4.0',
      rank: '4th of 120 students',
      grade: 'A',
      downloadUrl: '#',
      subjects: [
        { name: 'Physics', marks: '88 / 100', grade: 'A' },
        { name: 'Chemistry', marks: '82 / 100', grade: 'A-' },
        { name: 'Mathematics', marks: '94 / 100', grade: 'A+' }
      ]
    },
    {
      id: 2,
      title: 'Second Midterm Examination Report Card',
      term: 'Winter Term 2025',
      gpa: '3.9 / 4.0',
      rank: '3rd of 120 students',
      grade: 'A+',
      downloadUrl: '#',
      subjects: [
        { name: 'Physics', marks: '90 / 100', grade: 'A+' },
        { name: 'Chemistry', marks: '88 / 100', grade: 'A' },
        { name: 'Mathematics', marks: '96 / 100', grade: 'A+' }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-xl font-black text-slate-950 dark:text-white">Exam Report Cards</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Download officially approved report cards, transcripts and track batch ranking trends</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left: Report Cards list */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {reportCards.map((rc) => (
            <div 
              key={rc.id}
              className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{rc.term}</span>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white mt-1">{rc.title}</h3>
                </div>
                
                <button 
                  onClick={() => alert('PDF transcript download initiated!')}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
                >
                  <Download size={12} /> Download PDF Report
                </button>
              </div>

              {/* Subject details grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {rc.subjects.map((sub, idx) => (
                  <div key={idx} className="rounded-2xl bg-white/80 p-4 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{sub.name}</span>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{sub.marks}</span>
                      <span className="text-xs font-black text-indigo-650 dark:text-indigo-400">{sub.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Academic Standing Rank trends */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Academic Standing Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <Award size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Semester GPA</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">3.9 / 4.0</h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-650 dark:bg-purple-500/20 dark:text-purple-400">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch Placement Rank</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">#3 out of 120</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
