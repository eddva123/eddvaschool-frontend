import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AlertCircle,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  Users,
  Wallet,
  Landmark,
  X,
} from 'lucide-react';
import { cn } from './Skeleton';
import { EddvaLogo, InstituteLogo } from './Brand';
import { useAuth } from '../../context/AuthContext';

const superAdminItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/institutes', label: 'Institutes', icon: Building2 },
  { to: '/admin/complaints', label: 'Tickets', icon: AlertCircle },
  { to: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

const instituteGroups = [
  {
    heading: 'Academics',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/students', label: 'Students', icon: GraduationCap },
      { to: '/admin/teachers', label: 'Teachers', icon: Users },
      { to: '/admin/academics', label: 'Classes & curriculum', icon: Building2 },
    ],
  },
  {
    heading: 'Management',
    items: [
      { to: '/admin/attendance', label: 'Attendance', icon: BarChart3 },
      { to: '/admin/timetable', label: 'Timetable & live classes', icon: CalendarDays },
      { to: '/admin/fees', label: 'Fees Management', icon: Wallet },
      { to: '/admin/finance', label: 'Finance & Analytics', icon: Landmark },
    ],
  },
  {
    heading: 'Communication',
    items: [
      { to: '/admin/notices', label: 'Notices & announcements', icon: AlertCircle },
      { to: '/admin/communications', label: 'Messages & parent connect', icon: MessageSquare },
    ],
  },
  {
    heading: 'AI & Analytics',
    items: [{ to: '/admin/reports', label: 'AI insights & analytics', icon: Sparkles }],
  },
  {
    heading: 'System',
    items: [
      { to: '/admin/complaints', label: 'Support tickets', icon: Shield },
      { to: '/admin/settings', label: 'Settings & security', icon: SettingsIcon },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const { user, institute } = useAuth();
  const isInstitute = user?.role === 'INSTITUTE_ADMIN';
  const items = isInstitute ? null : superAdminItems;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] flex-shrink-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 md:static',
          collapsed && isInstitute ? 'md:w-[80px]' : 'md:w-[280px]',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800">
            <div className={cn('min-w-0 transition-opacity', collapsed && isInstitute && 'md:opacity-0 md:pointer-events-none md:w-0 md:overflow-hidden')}>
              <EddvaLogo />
            </div>
            <div className="flex items-center gap-1">
              <button onClick={onClose} className="rounded-xl p-2 text-surface-500 hover:bg-surface-100 md:hidden" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
            {!isInstitute && (
              <>
                <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  Super Admin
                </p>
                <nav className="space-y-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.to + item.label}
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition-all',
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 before:absolute before:left-1 before:top-1/2 before:h-7 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-white/90'
                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                        )
                      }
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-6 rounded-3xl border border-[rgba(37,99,235,0.10)] bg-gradient-to-br from-white/95 to-blue-50/40 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900/90 dark:to-slate-900/40">
                  <div className="flex items-center gap-3">
                    <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                      <Sparkles className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-base font-extrabold text-slate-950 dark:text-white">EDDVA AI Assistant</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Your smart admin assistant
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110"
                  >
                    Ask EDDVA AI
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}

            {isInstitute &&
              instituteGroups.map((group) => (
                <div key={group.heading} className="mb-6">
                  <p
                    className={cn(
                      'mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500',
                      collapsed && 'md:hidden'
                    )}
                  >
                    {group.heading}
                  </p>
                  <nav className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={`${group.heading}-${item.label}`}
                        to={item.to}
                        end={item.end}
                        title={collapsed ? item.label : undefined}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all',
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                          )
                        }
                      >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        <span className={cn('truncate', collapsed && 'md:hidden')}>{item.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              ))}
          </div>

          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            {isInstitute ? (
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900',
                  collapsed && 'md:justify-center md:p-2'
                )}
              >
                <InstituteLogo institute={institute} size="sm" />
                <div className={cn('min-w-0 flex-1', collapsed && 'md:hidden')}>
                  <p className="truncate text-xs font-bold text-slate-950 dark:text-white">{institute?.name || 'Institute'}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600">Online</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-900">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden" onClick={onClose} aria-label="Close menu overlay" />}
    </>
  );
}
