import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Trophy, TrendingUp, Target, Calendar, 
  PlayCircle, Clock, BookOpen, AlertCircle, 
  ChevronRight, Award, Flame, Star, Zap,
  Activity, Users, Sparkles, CheckSquare, Bell,
  HelpCircle, Video
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [continueLearning, setContinueLearning] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Custom states for the new cards & sections
  const [attendance, setAttendance] = useState(84); // Mock/default fallbacks
  const [weeklyHours, setWeeklyHours] = useState(14.5);
  const [examCountdown, setExamCountdown] = useState({ days: 8, hours: 4 });
  const [productivityScore, setProductivityScore] = useState(92);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, contRes] = await Promise.all([
          api.get('/students/dashboard'),
          api.get('/students/continue-learning').catch(() => ({ data: null })),
        ]);
        
        setDashboardData(dashRes.data);
        setContinueLearning(contRes.data);
        
        // Mock recent activities matching standard DB
        setRecentActivities([
          { id: 1, type: 'quiz', text: 'Scored 85% in Physics Mock Test #2', time: '2 hours ago' },
          { id: 2, type: 'lecture', text: 'Completed Lecture: Organic Chemistry Basics', time: 'Yesterday' },
          { id: 3, type: 'battle', text: 'Won a quiz battle against user Rohit45 (+24 ELO)', time: '2 days ago' },
          { id: 4, type: 'doubt', text: 'Doubt solved by AI Tutor: "Le Chatelier principle"', time: '3 days ago' },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Timer for countdown card
  useEffect(() => {
    const timer = setInterval(() => {
      setExamCountdown(prev => {
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23 };
        }
        return prev;
      });
    }, 3600000); // every hour
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 p-6">
        <div className="h-64 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-slate-900" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
          ))}
        </div>
      </div>
    );
  }

  const {
    overallAccuracy = 0,
    currentStreak = 0,
    xpTotal = 0,
    globalRank = '100+',
    pendingLectures = 0,
    testsAttempted = 0,
    weakTopics = [],
    recommendations = [
      'Revise "NCERT Class 10 Science: Reflection of Light" notes.',
      'Take a quick AI Practice Quiz on Carbon and its Compounds.',
      'Watch lecture video on "ICSE Class 9 Mathematics: Quadratic Equations".'
    ],
    todayPlan = [
      { title: 'Study: Ohm\'s Law Verification', type: 'revision', durationMinutes: 20 },
      { title: 'Practice: Class 10 Board Math Practice', type: 'practice', durationMinutes: 30 },
      { title: 'AI Quiz: Reflection of Light', type: 'quiz', durationMinutes: 15 }
    ]
  } = dashboardData || {};

  // Analytics performance chart data
  const chartData = [
    { name: 'Week 1', Accuracy: 65, XP: 200 },
    { name: 'Week 2', Accuracy: 72, XP: 450 },
    { name: 'Week 3', Accuracy: 70, XP: 800 },
    { name: 'Week 4', Accuracy: overallAccuracy || 80, XP: xpTotal || 1200 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 1. Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-xl shadow-blue-900/20">
        <div className="relative z-10 grid gap-8 lg:grid-cols-3">
          <div className="col-span-2">
            <span className="rounded-lg bg-white/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
              EDDVA AI Dashboard
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {user?.name || 'Student'}! 👋</h1>
            <p className="mt-3 max-w-xl text-blue-100 font-medium leading-relaxed text-sm">
              Your learning streak is strong at {currentStreak} days. You have completed {testsAttempted} practice tests and compiled a total of {xpTotal} experience points!
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                  <Flame size={20} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Current Streak</p>
                  <p className="text-base font-bold">{currentStreak} Days</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/25">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Total XP</p>
                  <p className="text-base font-bold">{xpTotal} XP</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md border border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Global Rank</p>
                  <p className="text-base font-bold">#{globalRank}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Panel within Hero */}
          <div className="flex flex-col justify-center rounded-2xl bg-white/5 p-6 backdrop-blur-md border border-white/10 lg:col-span-1">
            <h3 className="font-black text-sm uppercase tracking-wider text-blue-200 mb-4 flex items-center gap-2">
              <Zap size={16} /> Quick Launch
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/student/classes')} className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-3 hover:bg-white/20 transition text-center">
                <PlayCircle size={22} className="text-white mb-2" />
                <span className="text-[11px] font-bold">Live Class</span>
              </button>
              <button onClick={() => navigate('/student/ai-doubt-solver')} className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-3 hover:bg-white/20 transition text-center">
                <Sparkles size={22} className="text-indigo-300 mb-2" />
                <span className="text-[11px] font-bold">Solve Doubt</span>
              </button>
              <button onClick={() => navigate('/student/ai-quiz')} className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-3 hover:bg-white/20 transition text-center">
                <HelpCircle size={22} className="text-amber-300 mb-2" />
                <span className="text-[11px] font-bold">Practice Quiz</span>
              </button>
              <button onClick={() => navigate('/student/planner')} className="flex flex-col items-center justify-center rounded-xl bg-white/10 p-3 hover:bg-white/20 transition text-center">
                <Calendar size={22} className="text-emerald-300 mb-2" />
                <span className="text-[11px] font-bold">Study Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Blur Backgrounds */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      {/* Global Dashboard Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* Attendance % Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendance %</p>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{attendance}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${attendance}%` }} />
          </div>
        </div>

        {/* Weekly Study Hours Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Study Hours</p>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{weeklyHours}h</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2">Target: 20 Hours / Week</p>
        </div>

        {/* Pending Tasks Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending Tasks</p>
            <CheckSquare className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{pendingLectures + 2}</p>
          <p className="text-[10px] font-bold text-rose-500 mt-2">{pendingLectures} lectures, 2 homeworks</p>
        </div>

        {/* Exam Countdown Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exam Countdown</p>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{examCountdown.days}d {examCountdown.hours}h</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2">CBSE/ICSE Board Exam</p>
        </div>

        {/* AI Productivity Score Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Productivity</p>
            <Zap className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{productivityScore}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${productivityScore}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3 width on Desktop) */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* 2. Live & Upcoming Classes */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Upcoming Live Classes</h2>
              <Link to="/student/classes" className="text-xs font-bold text-blue-600 hover:text-blue-700">View Timetable</Link>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-2xl border border-slate-100/60 bg-slate-50/50 p-4 dark:border-slate-800/20 dark:bg-slate-900/50 gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Video size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Class 10 Science - Reflection & Spherical Mirrors</h4>
                    <p className="text-xs font-semibold text-slate-500">Teacher: Dr. HC Verma • 1:30 PM (Today)</p>
                  </div>
                </div>
                <button onClick={() => navigate('/student/classes')} className="w-full sm:w-auto rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">
                  Join Live
                </button>
              </div>
            </div>
          </section>

          {/* 3. Recharts Performance Graph */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
            <div className="mb-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Performance Analytics</h2>
              <p className="text-xs font-semibold text-slate-500">Weekly tracking of question accuracy and study XP gained.</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
                  <Area type="monotone" dataKey="Accuracy" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 4. Challenge Zone / Gamification */}
          <section className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 dark:border-indigo-900/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-md">
                  <Trophy size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">School Challenge Zone</h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Super Scholar • 12 Achievements Unlocked</p>
                </div>
              </div>
              <button onClick={() => navigate('/student/battle-arena')} className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                Enter Zone <ChevronRight size={14} />
              </button>
            </div>
          </section>

          {/* 5. Recent Activities Timeline */}
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
            <h2 className="mb-6 text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="text-slate-400" /> Recent Activities
            </h2>
            <div className="space-y-6">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-350 dark:bg-slate-700" />
                    <div className="h-full w-px bg-slate-100 dark:bg-slate-800 mt-2" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{act.text}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (1/3 width on Desktop) */}
        <div className="space-y-6">
          {/* 6. AI Study Planner Snapshot */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare size={18} className="text-indigo-500" /> Today's Schedule
              </h2>
              <Link to="/student/planner" className="text-xs font-bold text-indigo-500">Manage</Link>
            </div>
            
            <div className="space-y-3">
              {todayPlan.map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{item.type}</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-500">{item.durationMinutes}m</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 7. AI Recommendations */}
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-blue-900/30 dark:from-blue-950/20 dark:to-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-black text-slate-900 dark:text-white">AI Content Recommendations</h2>
            </div>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-350">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 8. Notifications Feed */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="text-slate-400" size={18} /> Notice Feed
              </h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-50/50 bg-slate-50/20 p-3 dark:border-slate-800/20">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Holiday Notice: Independence Day</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1">Institue Admin • 3 days ago</p>
              </div>
              <div className="rounded-xl border border-slate-50/50 bg-slate-50/20 p-3 dark:border-slate-800/20">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Maths Chapter 3 test rescheduled to Friday</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1">Teacher Sharma • 4 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
