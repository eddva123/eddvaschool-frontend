import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Target, Award, Brain, Clock, HelpCircle, ChevronRight, Activity } from 'lucide-react';

export default function PerformanceAnalytics() {
  const [activeSubject, setActiveSubject] = useState('All');

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics'];

  const scoreTrends = [
    { exam: 'Mock 1', physics: 72, chemistry: 68, mathematics: 85 },
    { exam: 'Mock 2', physics: 78, chemistry: 72, mathematics: 90 },
    { exam: 'Mock 3', physics: 82, chemistry: 80, mathematics: 92 },
    { exam: 'Mock 4', physics: 80, chemistry: 84, mathematics: 95 }
  ];

  const topicAccuracy = [
    { topic: 'Reflection of Light', subject: 'Physics', accuracy: 88, status: 'Strong' },
    { topic: 'Electricity & Ohm\'s Law', subject: 'Physics', accuracy: 74, status: 'Moderate' },
    { topic: 'Carbon and its Compounds', subject: 'Chemistry', accuracy: 62, status: 'Needs Focus' },
    { topic: 'Acids, Bases & Salts', subject: 'Chemistry', accuracy: 80, status: 'Strong' },
    { topic: 'Quadratic Equations', subject: 'Mathematics', accuracy: 94, status: 'Strong' },
    { topic: 'Trigonometric Identities', subject: 'Mathematics', accuracy: 89, status: 'Strong' }
  ];

  const filteredTopics = topicAccuracy.filter(topic => 
    activeSubject === 'All' || topic.subject === activeSubject
  );

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Performance Analytics</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Track and visualize chapter-wise accuracy trends and score records over time</p>
        </div>
        
        {/* Subject Filter Tab */}
        <div className="flex gap-1.5 overflow-x-auto bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl shrink-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeSubject === sub 
                  ? "bg-white text-indigo-650 shadow-sm dark:bg-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-350"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left: Charts panel */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Over-time Score Line Chart */}
          <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider">Mock Assessment Accuracy Trends</h3>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Math</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500" /> Physics</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Chemistry</span>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrends}>
                  <XAxis dataKey="exam" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Line type="monotone" dataKey="mathematics" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="physics" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="chemistry" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area charts */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
              <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider mb-4">Syllabus Completion</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Jan', syllabus: 20 },
                    { month: 'Feb', syllabus: 40 },
                    { month: 'Mar', syllabus: 55 },
                    { month: 'Apr', syllabus: 72 },
                    { month: 'May', syllabus: 88 }
                  ]}>
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="syllabus" stroke="#6366f1" fill="url(#colorSyllabus)" strokeWidth={2} />
                    <defs>
                      <linearGradient id="colorSyllabus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-5 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Overall Accuracy</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">84.2%</h3>
                  <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+2.4% this week</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-5 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">XP Accumulated</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">12,450</h3>
                  <p className="text-[10px] font-bold text-indigo-650 mt-0.5">Top 5% of batch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chapter lists breakdown */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
          <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 shrink-0">
            <Target size={18} className="text-indigo-500" /> Syllabus Chapter Accuracy
          </h3>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {filteredTopics.map((topic, idx) => (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-100 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/80"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{topic.subject}</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{topic.topic}</h4>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    topic.status === 'Strong' 
                      ? "bg-emerald-500/10 text-emerald-600" 
                      : topic.status === 'Moderate'
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-rose-500/10 text-rose-600"
                  }`}>
                    {topic.accuracy}%
                  </span>
                </div>
                
                {/* Accuracy progress bar */}
                <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      topic.status === 'Strong' 
                        ? "bg-emerald-500" 
                        : topic.status === 'Moderate'
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
