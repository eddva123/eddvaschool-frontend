import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, FileText, ClipboardList, Clock, MapPin, 
  TrendingUp, AlertCircle, Calendar, Sparkles, 
  BookOpen, CalendarDays, Clipboard, 
  Layers, Zap, Video, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../../services/api';
import useLiveRefresh from '../../hooks/useLiveRefresh';
import './Dashboard.css';

// Animated Number hook
function useAnimatedNumber(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const end = Number(target) || 0;
    const start = 0;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

// Math formatter helper
function formatNumber(value: number) {
  return Number(value || 0).toLocaleString();
}

// Skeleton helper component
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-100 animate-pulse ${className}`} />
);

// Sleek Empty State Illustration
const EmptyIllustration: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
    <svg className="w-12 h-12 text-slate-400 mb-2 opacity-60 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeDasharray="3 3" />
      <path d="M8 12H16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8V16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <p className="text-xs font-semibold text-slate-400 italic max-w-xs">{message}</p>
  </div>
);

// Chart Tooltip
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-100 dark:border-slate-800 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-bold uppercase tracking-wide text-slate-400">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="flex items-center gap-2 font-bold" style={{ color: entry.color }}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
}

// KPI Card Subcomponent
function KpiCard({ title, value, sub, icon: Icon, color, delay, sparklineData, onClick }: any) {
  const strokeColor = '#2563EB';
  
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className="group relative flex flex-col w-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${color || "bg-blue-600"}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <p className="font-display text-lg font-extrabold text-slate-950 dark:text-white">
              {value}
            </p>
          </div>
        </div>
      </div>
      
      {sub && (
        <p className="mb-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <span className="text-emerald-600">↑ {sub.split(' ')[0]}</span> {sub.split(' ').slice(1).join(' ')}
        </p>
      )}

      {sparklineData?.length ? (
        <div className="mt-auto -mx-4 -mb-4 h-12 w-[calc(100%+2rem)] opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke={strokeColor} 
                strokeWidth={2} 
                fill={`url(#color-${title.replace(/\s+/g, '')})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </motion.button>
  );
}

// Loading Skeleton Component
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="dashboard-skeleton animate-pulse space-y-6 px-6">
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[400px] rounded-3xl lg:col-span-2" />
        <Skeleton className="h-[400px] rounded-3xl" />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [statsRes, noticesRes, eventsRes] = await Promise.allSettled([
        api.get('/dashboard/stats'),
        api.get('/notices'),
        api.get('/events'),
      ]);

      if (statsRes.status === 'fulfilled') {
        const data = statsRes.value.data?.data || statsRes.value.data || {};
        setStats(data);
        setUpcomingClasses((data.upcomingClasses || data.batches || []).map((item: any) => ({
          id: item.id,
          time: `${item.start_time || item.startTime || item.schedule || '--'}`,
          subject: item.subject_name || item.subjectName || item.subject?.name || item.title || 'Scheduled class',
          room: item.zoom_link || item.google_meet_link || item.room || 'Online',
          class: item.class_name || item.className || item.class?.name || item.examTarget || '-',
        })));
        setStudents(data.students || []);
      }

      if (noticesRes.status === 'fulfilled') {
        const list = noticesRes.value.data?.data?.announcements ?? noticesRes.value.data?.announcements ?? noticesRes.value.data?.data ?? noticesRes.value.data ?? [];
        setNotices(Array.isArray(list) ? list : []);
      }

      if (eventsRes.status === 'fulfilled') {
        const list = eventsRes.value.data?.data ?? eventsRes.value.data ?? [];
        setEvents(Array.isArray(list) ? list : []);
      }

      try {
        const res = await api.get('/notifications');
        const list = res.data?.data ?? res.data;
        setNotifications(Array.isArray(list) ? list : []);
      } catch {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useLiveRefresh(loadDashboard, [], 20000);

  const totalStudentsVal = stats?.totalStudents ?? 0;
  const classesScheduledVal = upcomingClasses.length;
  const assignmentsVal = stats?.assignments ?? 0;
  const assessmentsVal = stats?.assessments ?? 0;
  const presentVal = stats?.totalPresent ?? 0;
  const attendancePctVal = Math.round(stats?.attendancePct || 0);

  const animStudents = useAnimatedNumber(totalStudentsVal);
  const animClasses = useAnimatedNumber(classesScheduledVal);
  const animAssignments = useAnimatedNumber(assignmentsVal);
  const animAssessments = useAnimatedNumber(assessmentsVal);
  const animPresent = useAnimatedNumber(presentVal);

  const attendanceSeries = useMemo(() => {
    const base = attendancePctVal || 92;
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, i) => ({
      name,
      att: Math.min(100, Math.max(60, Math.round(base + Math.sin(i * 0.9) * 4 + (i - 3) * 0.8))),
    }));
  }, [attendancePctVal]);

  const studentActivityFeed = useMemo(
    () =>
      students.slice(0, 4).map((student: any, index: number) => ({
        id: student.id || `student-${index}`,
        student: student.name || student.fullName || 'New student',
        action: 'was added to the institute roster',
        target: student.studentProfile?.section?.class?.name || student.class_name || 'a class',
        time: student.createdAt || student.created_at || 'Just now',
      })),
    [students]
  );

  const liveUpdates = useMemo(() => {
    const eventItems = events.slice(0, 3).map((event: any) => ({
      id: `event-${event.id}`,
      title: event.title || 'Event',
      detail: event.location || event.category || 'Scheduled by institute admin',
      time: event.startTime || event.start_time || event.created_at || '',
      tone: 'info',
    }));
    const noticeItems = notices.slice(0, 3).map((notice: any) => ({
      id: `notice-${notice.id}`,
      title: notice.title || 'Notice',
      detail: notice.category || notice.priority || 'Published by institute admin',
      time: notice.postedDate || notice.created_at || '',
      tone: notice.priority === 'URGENT' ? 'error' : 'success',
    }));
    return [...eventItems, ...noticeItems].slice(0, 6);
  }, [events, notices]);

  const performanceBars = useMemo(
    () => [
      { label: 'Excellent', pct: 35, color: '#22c55e' },
      { label: 'Good', pct: 45, color: '#2563eb' },
      { label: 'Average', pct: 15, color: '#f59e0b' },
      { label: 'Needs focus', pct: 5, color: '#ef4444' },
    ],
    []
  );

  const calendarWeek = useMemo(() => {
    const monday = new Date();
    const day = monday.getDay();
    const diff = (day + 6) % 7;
    monday.setDate(monday.getDate() - diff);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const eventsForDay = events
        .filter(ev => ev.startTime && ev.startTime.split('T')[0] === key)
        .map(ev => ({ t: ev.title || 'Event', tone: ev.priority === 'HIGH' ? 'bg-rose-500' : 'bg-blue-500' }));
      return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], events: eventsForDay };
    });
  }, [events]);

  const aiSummaryText = useMemo(() => {
    return attendancePctVal >= 85
      ? `Your classes showed ${attendancePctVal}% attendance this week. Dynamic student involvement recorded!`
      : `Weekly attendance is at ${attendancePctVal}%. Recommend marking absences in the attendance ledger.`;
  }, [attendancePctVal]);

  const teacherName = stats?.currentTeacher?.name || 'Instructor';

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="grid gap-6 lg:grid-cols-4 pb-12 px-6"
    >
      <div className="lg:col-span-3 space-y-6 min-w-0">
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white shadow-xl lg:col-span-2">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
                  Welcome back, {teacherName} 👋
                </h1>
                <p className="mt-2 text-blue-100 opacity-90 font-semibold italic text-xs leading-relaxed max-w-sm">
                  "Teaching is the supreme art of the educator to awaken joy in creative expression and knowledge."
                </p>
                <div className="mt-6 inline-block rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 max-w-md">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-4 w-4 text-blue-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">AI Teaching Summary</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-blue-50">
                    {aiSummaryText}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 font-display text-base font-extrabold text-slate-950 dark:text-white tracking-tight">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Create Assignment', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', to: '/teacher/assignments' },
                { label: 'Schedule Class', icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-50', to: '/teacher/classes' },
                { label: 'Mark Attendance', icon: Clipboard, color: 'text-amber-600', bg: 'bg-amber-50', to: '/teacher/attendance' },
                { label: 'Upload Material', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/teacher/creator' },
                { label: 'Generate Report', icon: Layers, color: 'text-violet-600', bg: 'bg-violet-50', to: '/teacher/reports' },
                { label: 'Start Session', icon: Video, color: 'text-rose-600', bg: 'bg-rose-50', to: '/teacher/classes' },
              ].map((action) => (
                <button 
                  key={action.label} 
                  onClick={() => navigate(action.to)}
                  className="group flex flex-col items-center gap-1.5 transition hover:scale-105"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm transition group-hover:shadow-md ${action.bg}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <span className="text-center text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard title="Total Students" value={formatNumber(animStudents)} sub="Roster count" icon={Users} color="bg-violet-100 text-violet-600" delay={0.02} sparklineData={[...Array(7)].map((_, i) => ({ v: Math.max(10, totalStudentsVal - (6 - i) * 3) }))} onClick={() => navigate('/teacher/students')} />
          <KpiCard title="Scheduled Classes" value={animClasses} sub="Active batches" icon={UserCheck} color="bg-purple-100 text-purple-600" delay={0.06} sparklineData={[{v:2},{v:3},{v:1},{v:4},{v:2},{v:3},{v:upcomingClasses.length}]} onClick={() => navigate('/teacher/classes')} />
          <KpiCard title="Published Assignments" value={animAssignments} sub="Weekly tasks" icon={FileText} color="bg-blue-100 text-blue-600" delay={0.1} sparklineData={[{v:3},{v:5},{v:6},{v:4},{v:5},{v:7},{v:assignmentsVal}]} onClick={() => navigate('/teacher/assignments')} />
          <KpiCard title="Conducted Assessments" value={animAssessments} sub="Evaluations list" icon={ClipboardList} color="bg-emerald-100 text-emerald-650" delay={0.14} sparklineData={[{v:1},{v:2},{v:1},{v:3},{v:2},{v:4},{v:assessmentsVal}]} onClick={() => navigate('/teacher/assessments')} />
          <KpiCard title="Present Today" value={animPresent} sub="Roster head" icon={Award} color="bg-orange-100 text-orange-600" delay={0.18} sparklineData={[{v:55},{v:60},{v:65},{v:72},{v:68},{v:75},{v:presentVal}]} onClick={() => navigate('/teacher/attendance')} />
          <KpiCard title="Attendance Rate" value={`${attendancePctVal}%`} sub="Weekly streak" icon={Zap} color="bg-rose-100 text-rose-600" delay={0.22} sparklineData={attendanceSeries.map(s => ({ v: s.att }))} onClick={() => navigate('/teacher/attendance')} />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Attendance momentum</h3>
                <p className="text-xs font-semibold text-slate-400">Class weekly smoothed tracker feed</p>
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100/50 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                <TrendingUp size={10} /> Live sync
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceSeries} margin={{ top: 8, right: 12, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} domain={[60, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="att" name="Attendance Rate" stroke="#2563eb" strokeWidth={3} fill="url(#attFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div>
              <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Student performance</h3>
              <p className="text-xs font-semibold text-slate-400">Class scorecard distribution model</p>
            </div>
            <div className="mt-4 space-y-4">
              {performanceBars.map((row) => (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-350">
                    <span>{row.label}</span>
                    <span>{row.pct}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-50 border border-slate-100 dark:bg-slate-800">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${row.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: row.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institute Announcements Notice Feed */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Institute Updates</h3>
              <p className="text-xs font-semibold text-slate-400">Notice board updates and announcements</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50/50 border border-blue-100/30 px-2.5 py-1 rounded-full">Live Sync</span>
          </div>

          <div className="space-y-3">
            {liveUpdates.length > 0 ? (
              liveUpdates.map((item) => (
                <div key={item.id} className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50/50 border border-transparent hover:border-slate-100/50 transition-all duration-200">
                  <div className={`p-2 rounded-xl shrink-0 ${item.tone === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'bg-blue-50 text-blue-600 border border-blue-100/50'}`}>
                    <AlertCircle size={15} />
                  </div>
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{item.title}</p>
                    <p className="text-[11px] text-slate-500 truncate leading-relaxed">{item.detail}</p>
                    <span className="block text-[9px] font-semibold text-slate-400 mt-1">
                      {item.time ? new Date(item.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyIllustration message="No notices or announcements published yet." />
            )}
          </div>
        </div>

      </div>

      {/* Right Sidebar panel containing calendar, upcoming schedule, roster timelines */}
      <div className="space-y-6 w-full shrink-0">
        
        {/* Smart Calendar Widget */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Smart calendar</h3>
            <CalendarDays className="h-5 w-5 text-blue-600" />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase text-slate-400">
            {calendarWeek.map((d) => (<div key={d.day}>{d.day}</div>))}
          </div>
          <div className="mt-2 grid min-h-[140px] grid-cols-7 gap-2">
            {calendarWeek.map((d) => (
              <div key={d.day} className="rounded-lg border border-[rgba(37,99,235,0.08)] bg-slate-50/50 p-1.5 dark:border-slate-800 dark:bg-slate-800/40 min-h-[50px] flex flex-col items-center">
                <span className="text-[8px] font-bold text-slate-400 mb-1">{d.day}</span>
                {d.events.map((ev) => (<div key={ev.t} className={`h-2.5 w-2.5 rounded-full mb-0.5 animate-pulse ${ev.tone}`} title={ev.t} />))}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Agenda - Upcoming Classes Schedule */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Today's Agenda</h3>
              <p className="text-xs font-semibold text-slate-400">Class agenda times</p>
            </div>
            <Calendar size={16} className="text-slate-400" />
          </div>
          <div className="space-y-3">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((cls) => (
                <div key={cls.id} className="group p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-blue-200/50 hover:bg-white hover:shadow-lg hover:shadow-slate-100/30 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Clock size={12} />
                      <span className="text-[10px] font-black tracking-tight">{cls.time}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{cls.class}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors leading-tight mb-1">{cls.subject}</h4>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/50">
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin size={10} />
                      <span className="text-[10px] font-semibold truncate max-w-[120px]">{cls.room}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (<EmptyIllustration message="You have no classes scheduled for the rest of today." />)}
          </div>
        </div>

        {/* Student Roster Timeline */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Roster Activity</h3>
            <p className="text-xs font-semibold text-slate-400">Recent student roster entries added</p>
          </div>

          <div className="relative border-l border-slate-100 ml-3.5 pl-5 space-y-5">
            {studentActivityFeed.length > 0 ? (
              studentActivityFeed.map((activity) => (
                <div key={activity.id} className="relative text-xs text-slate-600">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="leading-normal">
                      <strong className="text-slate-800 font-extrabold">{activity.student}</strong> {activity.action} to{' '}
                      <span className="font-extrabold bg-blue-50/50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100/30 text-[10px]">
                        {activity.target}
                      </span>
                    </p>
                    <span className="block text-[9px] font-semibold text-slate-400">
                      {activity.time ? new Date(activity.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="-ml-3.5 pl-0">
                <EmptyIllustration message="No recent student roster additions." />
              </div>
            )}
          </div>
        </div>

        {/* Teacher Alerts Feed */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-display text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Recent Alerts</h3>
              <p className="text-xs font-semibold text-slate-400">Tasks and notifications list</p>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100/30 px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div 
                key={n.id} 
                className={`flex gap-3 p-2.5 rounded-xl border ${!n.read ? 'bg-blue-50/30 border-blue-100/30' : 'bg-transparent border-transparent'} hover:bg-slate-50/50 transition-colors`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${n.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                  <AlertCircle size={13} />
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-normal truncate">{n.title}</p>
                  <span className="block text-[9px] font-semibold text-slate-400">{n.time}</span>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <EmptyIllustration message="All caught up! No recent alerts or tasks." />
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
