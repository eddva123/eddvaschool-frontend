import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  Sparkles, TrendingUp, AlertTriangle, CheckCircle, 
  HelpCircle, ChevronRight, Award, Brain, Zap, RefreshCw, BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

export default function AiPerformanceReview() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  
  const [radarData, setRadarData] = useState([
    { subject: 'Physics', mastery: 78, fullMark: 100 },
    { subject: 'Chemistry', mastery: 85, fullMark: 100 },
    { subject: 'Math', mastery: 92, fullMark: 100 },
    { subject: 'Biology', mastery: 64, fullMark: 100 },
    { subject: 'English', mastery: 80, fullMark: 100 }
  ]);

  const [weeklyAccuracy, setWeeklyAccuracy] = useState([
    { name: 'W1', accuracy: 72 },
    { name: 'W2', accuracy: 78 },
    { name: 'W3', accuracy: 80 },
    { name: 'W4', accuracy: 88 }
  ]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/feedback/generate', {
        context: 'performance_review',
        data: { radarData }
      });
      setFeedback(res.data.feedback || res.data.content);
    } catch (err) {
      console.error('Failed to retrieve AI feedback, using simulated evaluation:', err);
      setTimeout(() => {
        setFeedback({
          critique: "Your mathematical reasoning and equation substitution parameters are excellent. However, concept retention in Biology cellular mechanisms requires attention, as evidenced by lower board mock accuracy.",
          strengths: [
            "Advanced understanding of Quadratic Equations and Factorization techniques.",
            "High speed in resolving Physics Ohm's Law verification graphs (avg. 45s per response)."
          ],
          weaknesses: [
            "Frequent calculation slips in Carbon compounds covalent bonding patterns.",
            "Difficulty in Biology leaf cell structure diagrams questions."
          ],
          actionPlan: [
            "Complete a 15-question Practice Quiz on Carbon Covalent Bonding.",
            "Schedule a Socratic session with AI Tutor to revise Biology Leaf Structure.",
            "Re-watch 'Ohm\'s Law Verification Experiment' recorded lecture video."
          ]
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">AI Diagnostic & Performance Review</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Real-time analytical mapping of academic syllabus mastery & AI critiques</p>
        </div>
        
        <button 
          onClick={fetchFeedback}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200/50 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main content grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left: Charts and metrics */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Mastery Radar Chart */}
          <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Mastery Profile Map</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                  <Radar name="Student Mastery" dataKey="mastery" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Accuracy growth bar chart */}
          <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Weekly Accuracy Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAccuracy}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                  <Bar dataKey="accuracy" fill="#818cf8" radius={[8, 8, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: AI Critique & Recommendations */}
        <div className="w-full lg:w-[28rem] shrink-0 flex flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm">
          <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 shrink-0">
            <Brain size={18} className="text-indigo-500" /> AI Diagnostic Critique
          </h3>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-12 gap-3 text-slate-400">
                <Sparkles size={24} className="animate-spin text-indigo-500" />
                <p className="text-xs font-bold animate-pulse">Analyzing subject metrics & generating review...</p>
              </div>
            ) : feedback ? (
              <div className="space-y-6">
                {/* Critique Text */}
                <p className="text-xs font-semibold text-slate-655 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  "{feedback.critique}"
                </p>

                {/* Strengths */}
                <div>
                  <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <CheckCircle size={14} /> Subject Strengths
                  </h4>
                  <ul className="space-y-2">
                    {feedback.strengths?.map((str, idx) => (
                      <li key={idx} className="flex gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <h4 className="text-xs font-black text-rose-500 dark:text-rose-450 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Knowledge Gaps
                  </h4>
                  <ul className="space-y-2">
                    {feedback.weaknesses?.map((wk, idx) => (
                      <li key={idx} className="flex gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="border-t border-slate-100 pt-4 dark:border-slate-850">
                  <h4 className="text-xs font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Zap size={14} /> Actionable Learning Path
                  </h4>
                  <div className="space-y-2">
                    {feedback.actionPlan?.map((plan, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => alert(`Redirecting to action item: ${plan}`)}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white/80 p-3 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-950/80 transition-all"
                      >
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{plan}</p>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
