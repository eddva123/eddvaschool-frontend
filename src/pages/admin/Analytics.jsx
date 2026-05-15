import React, { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Building2, CheckCircle2, Clock3, Users } from 'lucide-react';
import api from '../../services/api';
import { Skeleton } from '../../components/admin/Skeleton';

function number(value) {
  return Number(value || 0).toLocaleString();
}

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-80" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-28 rounded-lg" />)}
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  const summary = [
    { label: 'Total Institutes', value: stats?.totalInstitutes, icon: Building2, color: 'text-brand-700', bg: 'bg-brand-50' },
    { label: 'Approved', value: stats?.approvedInstitutes, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: stats?.pendingApprovals, icon: Clock3, color: 'text-sky-700', bg: 'bg-sky-50' },
    { label: 'Active Users', value: stats?.activeUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-surface-950">Platform Analytics</h1>
        <p className="mt-2 text-sm font-medium text-surface-500">Live approval, tenant growth, user, and support metrics from PostgreSQL.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="glass-panel rounded-lg p-5 shadow-soft">
            <div className={`mb-4 grid h-12 w-12 place-items-center rounded-lg ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <p className="text-sm font-bold text-surface-500">{item.label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-surface-950">{number(item.value)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel rounded-lg p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-surface-950">Six-Month Institute Trend</h2>
            <p className="text-sm font-medium text-surface-500">Registrations and approvals by month</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.instituteTrend || []} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="institutesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0057C2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#D8E7FA" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6887A8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6887A8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #D8E7FA' }} />
                <Area type="monotone" dataKey="institutes" name="Registrations" stroke="#0057C2" strokeWidth={3} fill="url(#institutesFill)" />
                <Area type="monotone" dataKey="approved" name="Approved" stroke="#16A34A" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-surface-950">Approval Status</h2>
            <p className="text-sm font-medium text-surface-500">Current institute state</p>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.statusBreakdown || []} margin={{ top: 10, right: 10, left: -22, bottom: 0 }} barSize={40}>
                <CartesianGrid stroke="#D8E7FA" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6887A8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6887A8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#EFF8FF' }} contentStyle={{ borderRadius: 8, border: '1px solid #D8E7FA' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {(stats?.statusBreakdown || []).map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-lg p-6 shadow-soft">
        <h2 className="font-display text-xl font-bold text-surface-950">Operational Snapshot</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ['Open Support', stats?.openComplaints],
            ['In Progress', stats?.inProgressComplaints],
            ['Resolved', stats?.resolvedComplaints],
            ['Closed', stats?.closedComplaints],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-surface-200 bg-surface-50 p-4">
              <p className="text-sm font-bold text-surface-500">{label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-surface-950">{number(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
