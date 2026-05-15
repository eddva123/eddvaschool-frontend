import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, Shield, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-premium rounded-xl border border-[rgba(37,99,235,0.15)] px-3 py-2 text-xs shadow-lg dark:border-slate-600">
      <p className="mb-1 font-bold uppercase tracking-wide text-surface-500 dark:text-slate-400">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2 font-bold" style={{ color: entry.color }}>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

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
        </div>
      </div>
    </div>
  );
}

