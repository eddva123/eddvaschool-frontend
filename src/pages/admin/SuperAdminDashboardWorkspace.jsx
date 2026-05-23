<<<<<<< HEAD
import React from 'react';
=======
import React, { useMemo } from 'react';
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
<<<<<<< HEAD
  BarChart,
  Bar,
  LineChart,
  Line,
=======
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
<<<<<<< HEAD
  Legend,
} from 'recharts';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  CheckCircle2,
  Shield,
  Sparkles,
  Users,
  TrendingUp,
  AlertCircle,
  Activity,
  Server,
  Lock,
  HardDrive,
  Zap,
  Clock,
  DollarSign,
  Ticket,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
=======
} from 'recharts';
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, Shield, Sparkles, Users } from 'lucide-react';
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
import { useNavigate } from 'react-router-dom';

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
<<<<<<< HEAD
    <div className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-xs shadow-xl dark:border-slate-600 dark:bg-slate-800">
      <p className="mb-2 font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 font-semibold" style={{ color: entry.color }}>
=======
    <div className="glass-premium rounded-xl border border-[rgba(37,99,235,0.15)] px-3 py-2 text-xs shadow-lg dark:border-slate-600">
      <p className="mb-1 font-bold uppercase tracking-wide text-surface-500 dark:text-slate-400">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 font-bold" style={{ color: entry.color }}>
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

<<<<<<< HEAD
function StatBadge({ label, value, trend, trendValue, color = 'blue', formatter }) {
  const trendClass = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const colorClass = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    violet: 'bg-violet-50 text-violet-700 border-violet-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }[color] || 'bg-blue-50 text-blue-700 border-blue-200';
  
  return (
    <div className={`rounded-2xl border ${colorClass} p-4`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-75">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="font-display text-2xl font-extrabold">{formatter ? formatter(value) : typeof value === 'number' ? formatNumber(value) : value}</p>
        <div className={`inline-flex items-center gap-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-100' : 'bg-red-100'} px-2 py-1`}>
          <TrendIcon className={`h-3.5 w-3.5 ${trendClass}`} />
          <span className={`text-xs font-bold ${trendClass}`}>{trendValue}%</span>
=======
function relativeTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleDateString();
}

function Kpi({ title, value, icon: Icon, tone, delay, note }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="glass-premium-hover rounded-2xl p-5 text-left"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/10 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 ring-1 ring-blue-600/15 dark:text-sky-300">
          <ArrowUpRight className="h-3.5 w-3.5" />
          Live
        </span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-slate-950 dark:text-white">{formatNumber(value)}</p>
      {note ? <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{note}</p> : null}
    </motion.div>
  );
}

export default function SuperAdminDashboardWorkspace({ stats }) {
  const navigate = useNavigate();

  const trend = stats?.instituteTrend || [];
  const activity = stats?.recentActivity || [];

  const quickActions = useMemo(
    () => [
      { title: 'Add institute', onClick: () => navigate('/admin/institutes') },
      { title: 'Approve institute', onClick: () => navigate('/admin/institutes') },
      { title: 'Manage users', onClick: () => navigate('/admin/settings') },
      { title: 'View analytics', onClick: () => navigate('/admin/analytics') },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-eddva-hero p-6 text-white shadow-2xl shadow-blue-900/25 sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(900px 500px at 15% -10%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(800px 450px at 95% 10%, rgba(139,92,246,0.20), transparent 55%)' }} />
        <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest backdrop-blur">
              <Shield className="h-4 w-4" />
              Super Admin Control
            </div>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
              Welcome back, Super Admin! <span className="inline-block">👋</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-sky-100 sm:text-base">
              Monitor institute onboarding, approvals, active users, analytics, and operational activity in real time.
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-sky-100/90">Pending approvals</p>
              <p className="mt-2 font-display text-3xl font-extrabold">{formatNumber(stats?.pendingApprovals)}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-sky-100/90">Approved institutes</p>
              <p className="mt-2 font-display text-3xl font-extrabold">{formatNumber(stats?.approvedInstitutes)}</p>
            </div>
          </div>
        </div>

        {/* Hero right illustration-ish */}
        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative h-40 w-40">
            <div className="absolute inset-0 rounded-3xl bg-white/10 blur-xl" />
            <div className="relative grid h-40 w-40 place-items-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur">
              <Shield className="h-16 w-16 text-white/90" />
            </div>
            <div className="absolute -right-3 -top-3 h-14 w-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20" />
            <div className="absolute -left-4 bottom-1 h-10 w-10 rounded-2xl bg-white/10 backdrop-blur border border-white/20" />
          </div>
        </div>
      </motion.section>

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Total Institutes" value={stats?.totalInstitutes} icon={Building2} tone="from-blue-600 to-sky-500" delay={0.05} note="+100% vs last month (demo)" />
        <Kpi title="Approved Institutes" value={stats?.approvedInstitutes} icon={CheckCircle2} tone="from-emerald-600 to-teal-500" delay={0.09} note="+100% vs last month (demo)" />
        <Kpi title="Pending Approvals" value={stats?.pendingApprovals} icon={Sparkles} tone="from-violet-600 to-indigo-500" delay={0.13} note="Review new registrations" />
        <Kpi title="Active Users" value={stats?.activeUsers} icon={Users} tone="from-amber-500 to-orange-500" delay={0.17} note="+66.7% vs last month (demo)" />
      </div>

      {/* Overview + activity + quick actions */}
      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="glass-premium rounded-2xl p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Platform Overview</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overview of platform activity and growth</p>
            </div>
            <div className="rounded-2xl border border-[rgba(37,99,235,0.14)] bg-white/80 px-3 py-2 text-xs font-extrabold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              This Month
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { t: 'New institutes', v: stats?.pendingApprovals || 0, c: 'text-blue-700 dark:text-sky-300' },
              { t: 'New users', v: stats?.activeUsers || 0, c: 'text-violet-700 dark:text-violet-300' },
              { t: 'Total tickets', v: stats?.totalComplaints || 0, c: 'text-amber-700 dark:text-amber-300' },
              { t: 'Revenue', v: '₹12,450', c: 'text-emerald-700 dark:text-emerald-300' },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-[rgba(37,99,235,0.10)] bg-white/60 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{x.t}</p>
                <p className={`mt-2 font-display text-2xl font-extrabold ${x.c}`}>{typeof x.v === 'string' ? x.v : formatNumber(x.v)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(37,99,235,0.08)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="institutes" name="Institutes" stroke="#2563EB" strokeWidth={3} fill="url(#trendFill)" />
                <Area type="monotone" dataKey="approved" name="Approved" stroke="#10B981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-premium rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Recent Activity</h3>
              <button type="button" className="text-xs font-extrabold text-blue-700 hover:text-blue-800 dark:text-sky-300">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {(activity || []).slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[rgba(37,99,235,0.10)] bg-white/60 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.action}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{relativeTime(item.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-extrabold text-emerald-700 ring-1 ring-emerald-500/15 dark:text-emerald-300">
                    Live
                  </span>
                </div>
              ))}
              {(!activity || activity.length === 0) && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No activity yet.
                </div>
              )}
            </div>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Quick Actions</h3>
              <span className="rounded-full bg-blue-600/10 px-2 py-1 text-[10px] font-extrabold text-blue-700 ring-1 ring-blue-600/15 dark:text-sky-300">
                Admin
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <button
                  key={a.title}
                  type="button"
                  onClick={a.onClick}
                  className="rounded-2xl border border-[rgba(37,99,235,0.12)] bg-white/70 p-4 text-left text-sm font-extrabold text-slate-800 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {a.title}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-extrabold text-slate-950 dark:text-white">EDDVA AI Assistant</p>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Your smart admin assistant</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110"
            >
              Ask EDDVA AI
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function KpiCard({ title, value, icon: Icon, subtext, trend, gradient, delay, formatter }) {
  const trendValue = typeof trend === 'number' ? trend : 0;
  const TrendIcon = trendValue >= 0 ? ArrowUpRight : ArrowDownRight;
  const trendText = `${trendValue >= 0 ? '+' : ''}${trendValue}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${gradient[0]}20, ${gradient[1]}20)` }} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl ${gradient[2]} text-white shadow-md`}>
            <Icon className="h-6 w-6" />
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ${trendValue >= 0 ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800' : 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800'}`}>
            <TrendIcon className="h-3 w-3" />
            {trendText}
          </span>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-slate-950 dark:text-white">{formatter ? formatter(value) : typeof value === 'number' ? formatNumber(value) : value}</p>
        {subtext && <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">{subtext}</p>}
      </div>
    </motion.div>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function percentChange(current, previous) {
  const prev = Number(previous || 0);
  if (!prev) return 0;
  return Math.round(((Number(current || 0) - prev) / prev) * 100);
}

const statusColors = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  Open: 'bg-red-50 text-red-700 border-red-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  High: 'bg-red-50 text-red-700 border-red-200',
  Critical: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function SuperAdminDashboardWorkspace({ stats }) {
  const navigate = useNavigate();
  const userGrowthData = stats?.userGrowth || [];
  const instituteGrowthData = stats?.instituteGrowth || [];
  const revenueTrendData = stats?.revenueTrend || [];
  const aiUsageData = stats?.aiUsageTrend || [];
  const recentInstitutes = stats?.recentInstitutes || [];
  const recentTickets = stats?.recentTickets || [];
  const topInstitutes = stats?.topInstitutes || [];
  const recentActivity = stats?.recentActivity || [];
  const totalRevenue = stats?.monthlyRevenue ?? stats?.financeSummary?.totalRevenue ?? 0;
  const storageUsageGb = Number(stats?.storageUsageBytes || 0) / (1024 * 1024 * 1024);
  const userTrend = userGrowthData.length > 1 ? percentChange(userGrowthData[userGrowthData.length - 1]?.users, userGrowthData[userGrowthData.length - 2]?.users) : 0;
  const instituteTrend = instituteGrowthData.length > 1 ? percentChange(instituteGrowthData[instituteGrowthData.length - 1]?.institutes, instituteGrowthData[instituteGrowthData.length - 2]?.institutes) : 0;
  const revenueTrend = revenueTrendData.length > 1 ? percentChange(revenueTrendData[revenueTrendData.length - 1]?.revenue, revenueTrendData[revenueTrendData.length - 2]?.revenue) : 0;
  const aiTrend = aiUsageData.length > 1 ? percentChange(aiUsageData[aiUsageData.length - 1]?.usage, aiUsageData[aiUsageData.length - 2]?.usage) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 pb-12"
    >
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-lg"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white, transparent 50%)' }} />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Super Admin Dashboard</span>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h1 className="font-display text-4xl font-extrabold leading-tight">
                Welcome back, Super Admin 👋
              </h1>
              <p className="mt-4 text-lg font-medium text-white/90">
                Monitor platform performance, institute onboarding, and operational metrics in real-time.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">Pending</p>
                <p className="mt-2 font-display text-2xl font-extrabold">{stats?.pendingApprovals || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">Active</p>
                <p className="mt-2 font-display text-2xl font-extrabold">{stats?.activeUsers || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">Revenue</p>
                <p className="mt-2 font-display text-2xl font-extrabold">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* KPI Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-6"
      >
        <KpiCard
          title="Total Institutes"
          value={stats?.totalInstitutes || 0}
          icon={Building2}
          subtext="Live institute count"
          trend={instituteTrend}
          gradient={['#2563EB', '#60A5FA', 'bg-gradient-to-br from-blue-600 to-blue-500']}
          delay={0.12}
        />
        <KpiCard
          title="Total Users"
          value={stats?.totalUsers || stats?.activeUsers || 0}
          icon={Users}
          subtext="All platform users"
          trend={userTrend}
          gradient={['#7C3AED', '#A78BFA', 'bg-gradient-to-br from-violet-600 to-violet-500']}
          delay={0.14}
        />
        <KpiCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={GraduationCap}
          subtext="Registered students"
          trend={userTrend}
          gradient={['#06B6D4', '#22D3EE', 'bg-gradient-to-br from-cyan-600 to-cyan-500']}
          delay={0.16}
        />
        <KpiCard
          title="Total Faculty"
          value={stats?.totalTeachers || 0}
          icon={BookOpen}
          subtext="Registered teachers"
          trend={userTrend}
          gradient={['#10B981', '#34D399', 'bg-gradient-to-br from-emerald-600 to-emerald-500']}
          delay={0.18}
        />
        <KpiCard
          title="Support Tickets"
          value={stats?.openComplaints || 0}
          icon={Ticket}
          subtext="Open support tickets"
          trend={stats?.openComplaints ? -8 : 0}
          gradient={['#F59E0B', '#FBBF24', 'bg-gradient-to-br from-amber-600 to-amber-500']}
          delay={0.2}
        />
        <KpiCard
          title="Monthly Revenue"
          value={totalRevenue}
          icon={DollarSign}
          subtext="Current month revenue"
          formatter={formatCurrency}
          trend={revenueTrend}
          gradient={['#EC4899', '#F472B6', 'bg-gradient-to-br from-rose-600 to-pink-500']}
          delay={0.22}
        />
      </motion.div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        {/* User Growth Chart */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">User Growth Trend</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Active users over the last 6 months</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800">
              6M
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 5 }} />
                <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institute Registration Chart */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Institute Registrations</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">New institutes registered per week</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800">
              This Month
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instituteGrowthData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="institutes" fill="#2563EB" radius={[8, 8, 0, 0]} />
                <Bar dataKey="approved" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* More Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4 lg:grid-cols-2"
      >
        {/* Revenue Chart */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Revenue Trend</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Monthly revenue and projections</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:ring-rose-800">
              YTD
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueTrendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#EC4899" radius={[8, 8, 0, 0]} />
                <Bar dataKey="billed" fill="#F472B6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage Chart */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">AI Usage Trend</h3>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">API requests by hour</p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:ring-violet-800">
              Today
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiUsageData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="usage" stroke="#7C3AED" strokeWidth={3} fill="url(#aiGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Management Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        {/* Recent Institute Registrations */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Recent Registrations</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</button>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentInstitutes.map((inst) => (
              <div key={inst.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{inst.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{inst.principalName || 'No principal assigned'}</p>
                    <p className="mt-1 text-xs text-slate-400">{inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : ''}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold whitespace-nowrap ${statusColors[inst.status] || statusColors.Active}`}>
                    {inst.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Support Tickets */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Support Tickets</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</button>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{ticket.id}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">{ticket.title}</p>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{ticket.instituteName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColors[ticket.status] || statusColors.Open}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Institutes */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-100 p-6 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">Top Institutes</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">View All</button>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topInstitutes.map((inst, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900">
                <p className="text-sm font-bold text-slate-950 dark:text-white">{inst.name}</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{inst.users}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Users</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{inst.faculty}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Faculty</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{formatCurrency(inst.revenue)}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* System Status Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
      >
        <StatBadge label="System Health" value={stats?.systemHealth || 0} trend="up" trendValue={2.1} color="emerald" formatter={(value) => `${Number(value || 0).toFixed(1)}%`} />
        <StatBadge label="AI Requests Today" value={stats?.aiRequestsToday || 0} trend="up" trendValue={aiTrend} color="violet" />
        <StatBadge label="Storage Usage" value={storageUsageGb} trend="up" trendValue={8.2} color="amber" formatter={(value) => `${Number(value || 0).toFixed(1)} GB`} />
        <StatBadge label="Active Users Online" value={stats?.activeUsersOnline || 0} trend="up" trendValue={34.8} color="blue" />
        <StatBadge label="Security Alerts" value={stats?.securityAlerts || 0} trend="down" trendValue={42.5} color="blue" />
      </motion.div>

      {/* Quick Actions & AI Assistant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 font-display text-lg font-extrabold text-slate-950 dark:text-white">Quick Actions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Add Institute', icon: Building2, action: () => navigate('/admin/institutes') },
                { label: 'Approve Institutes', icon: CheckCircle2, action: () => navigate('/admin/institutes') },
                { label: 'View Analytics', icon: TrendingUp, action: () => navigate('/admin/analytics') },
                { label: 'Manage Users', icon: Users, action: () => navigate('/admin/settings') },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="rounded-2xl border border-slate-100 bg-white p-4 text-center transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 mx-auto text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-950 dark:text-white">{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-6 shadow-sm dark:border-slate-800 dark:from-violet-950 dark:to-indigo-950">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-500/20 text-violet-600 dark:text-violet-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-extrabold text-slate-950 dark:text-white">EDDVA AI Assistant</h3>
              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">Your intelligent admin companion</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-110">
                Ask EDDVA AI
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

=======
>>>>>>> d0524919e2fcd28a55b1beb4f369317937eec4de
