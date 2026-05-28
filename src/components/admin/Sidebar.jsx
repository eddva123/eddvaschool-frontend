import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertCircle,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  ClipboardCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MessageSquareWarning,
  Presentation,
  Sparkles,
  Settings as SettingsIcon,
  Shield,
  Users,
  Video,
  Wallet,
  Landmark,
  X,
} from 'lucide-react';
import { cn } from './Skeleton';
import { EddvaLogo, InstituteLogo } from './Brand';
import { useAuth } from '../../context/AuthContext';

const superAdminGroups = [
  {
    heading: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/institutes', label: 'Institutes', icon: Building2 },
      { to: '/admin/users', label: 'Registered Users', icon: Users },
      { to: '/admin/complaints', label: 'Tickets', icon: AlertCircle, badge: 'New' },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/admin/finance', label: 'Subscriptions', icon: Wallet },
      { to: '/admin/reports', label: 'Report & Analytics', icon: Sparkles },
    ],
  },
  {
    heading: 'Governance',
    items: [
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
      { to: '/admin/security', label: 'Security Center', icon: Shield },
      { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
      { action: 'logout', label: 'Logout', icon: LogOut },
    ],
  },
];

const instituteGroups = [
  {
    heading: 'Academics',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/students', label: 'Students', icon: GraduationCap },
      { to: '/admin/teachers', label: 'Teachers', icon: Users },
      { to: '/admin/academics', label: 'Classes & Curriculum', icon: Building2 },
      { to: '/admin/assignments', label: 'Assignments & Homework', icon: ClipboardList },
      { to: '/admin/study-materials', label: 'Study Materials', icon: BookOpen },
      { to: '/admin/syllabus', label: 'Syllabus Tracking', icon: GraduationCap },
    ],
  },
  {
    heading: 'Examinations',
    items: [
      { to: '/admin/exams', label: 'Exams', icon: FileText },
      { to: '/admin/question-bank', label: 'Question Bank', icon: ClipboardList },
      { to: '/admin/marks-entry', label: 'Marks Entry', icon: FileText },
      { to: '/admin/results', label: 'Results', icon: Sparkles },
      { to: '/admin/report-cards', label: 'Report Cards', icon: FileText },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { to: '/admin/attendance', label: 'Attendance', icon: BarChart3 },
      { to: '/admin/timetable', label: 'Timetable & Live Classes', icon: CalendarDays },
      { to: '/admin/calendar', label: 'Academic Calendar', icon: CalendarDays },
    ],
  },
  {
    heading: 'Finance',
    items: [
      { to: '/admin/fees', label: 'Fees Management', icon: Wallet },
      { to: '/admin/payment-collection', label: 'Payment Collection', icon: Landmark },
      { to: '/admin/payment-history', label: 'Payment History', icon: FileText },
      { to: '/admin/fee-defaulters', label: 'Fee Defaulters', icon: AlertCircle },
      { to: '/admin/finance', label: 'Finance & Analytics', icon: Landmark },
    ],
  },
  {
    heading: 'Communication',
    items: [
      { to: '/admin/notices', label: 'Notices & Announcements', icon: AlertCircle },
      { to: '/admin/communications', label: 'Messages & Parent Connect', icon: MessageSquare, badge: '5 Unread' },
      { to: '/admin/notifications-center', label: 'Notifications', icon: Bell },
      { to: '/admin/sms-center', label: 'SMS Center', icon: MessageSquare },
      { to: '/admin/email-center', label: 'Email Center', icon: MessageSquare },
    ],
  },
  {
    heading: 'AI & Analytics',
    items: [
      { to: '/admin/ai-insights', label: 'AI Insights', icon: Sparkles },
      { to: '/admin/student-performance', label: 'Student Performance Analytics', icon: BarChart3 },
      { to: '/admin/attendance-analytics', label: 'Attendance Analytics', icon: BarChart3 },
      { to: '/admin/custom-reports', label: 'Custom Reports', icon: FileText },
    ],
  },
  {
    heading: 'Administration',
    items: [
      { to: '/admin/users', label: 'User Management', icon: Users },
      { to: '/admin/roles', label: 'Roles & Permissions', icon: Shield },
      { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
      { to: '/admin/complaints', label: 'Support Tickets', icon: Shield },
      { to: '/admin/settings', label: 'Settings & Security', icon: SettingsIcon },
    ],
  },
];

const teacherGroups = [
  {
    heading: 'Teaching',
    items: [
      { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/teacher/topics', label: 'Course Content', icon: BookOpen },
      { to: '/teacher/classes', label: 'My Schedule', icon: Video, badge: 'LIVE' },
      { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    ],
  },
  {
    heading: 'Evaluation',
    items: [
      { to: '/teacher/assignments', label: 'Assignments', icon: FileText, badge: 'Needs Grading' },
      { to: '/teacher/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/teacher/reports', label: 'Reports', icon: BarChart3 },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { to: '/teacher/creator', label: 'PPT & Mind Maps', icon: Presentation },
      { to: '/teacher/grievances', label: 'Grievances', icon: MessageSquareWarning },
      { to: '/teacher/chat', label: 'Chat', icon: MessageSquare, badge: '2 Unread' },
      { to: '/teacher/profile', label: 'Profile', icon: SettingsIcon },
    ],
  },
];

// Circular progress wrapper
const ProgressRing = ({ progress = 100, size = 42, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center pointer-events-none" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 rotate-[-90deg] transform" width={size} height={size}>
        {/* Background ring */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="text-slate-200 dark:text-slate-800"
        />
        {/* Progress ring */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="text-indigo-500 transition-all duration-1000 ease-out"
        />
      </svg>
    </div>
  );
};

export default function Sidebar({ open, onClose }) {
  const { user, institute, logout } = useAuth();
  const location = useLocation();
  const isInstitute = user?.role === 'INSTITUTE_ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const groups = isTeacher ? teacherGroups : isInstitute ? instituteGroups : superAdminGroups;
  const [collapsed, setCollapsed] = useState(false);
  const canCollapse = true;
  const roleLabel = isTeacher ? 'Teacher Workspace' : isInstitute ? 'Institute Admin' : 'Super Admin';
  const workspaceName = isTeacher ? user?.name || 'Teacher' : isInstitute ? institute?.name || 'Institute' : 'EDDVA HQ';

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-100 bg-white/70 backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/40 dark:bg-slate-950/70 md:static shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]',
          collapsed && canCollapse ? 'w-20' : 'w-[280px]',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100/50 px-6 dark:border-slate-800/40">
            <div className={cn('min-w-0 transition-opacity duration-200', collapsed && canCollapse && 'md:opacity-0 md:pointer-events-none md:w-0 md:overflow-hidden')}>
              <EddvaLogo />
            </div>
            <div className="flex items-center gap-1">
              {canCollapse && (
                <button
                  type="button"
                  onClick={() => setCollapsed((value) => !value)}
                  className="hidden rounded-xl p-2 text-surface-500 hover:bg-surface-100 md:inline-flex"
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <ChevronLeft className={cn('h-5 w-5 transition-transform duration-300', collapsed && 'rotate-180')} />
                </button>
              )}
              <button onClick={onClose} className="rounded-xl p-2 text-surface-500 hover:bg-surface-100 md:hidden" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group.heading} className="space-y-3">
                  <div className="flex items-center gap-4">
                    <p
                      className={cn(
                        'px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80 dark:text-slate-500/80 transition-opacity whitespace-nowrap',
                        collapsed && canCollapse && 'md:opacity-0 md:h-0 md:overflow-hidden'
                      )}
                    >
                      {group.heading}
                    </p>
                    {(!collapsed || !canCollapse) && (
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-100 to-transparent dark:from-slate-800" />
                    )}
                  </div>
                  <nav className="space-y-1.5">
                    {group.items.map((item) => {
                      const isActive = item.action !== 'logout' && (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to));

                      return item.action === 'logout' ? (
                        <button
                          key={`${group.heading}-${item.label}`}
                          type="button"
                          onClick={() => {
                            onClose?.();
                            logout();
                          }}
                          title={collapsed && canCollapse ? item.label : undefined}
                          className="group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-bold outline-none text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-slate-50 dark:bg-slate-900/50 opacity-0 transition-opacity group-hover:opacity-100" />
                          <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-110 text-rose-500">
                            <item.icon className="h-[18px] w-[18px]" />
                          </div>
                          <span className={cn('relative z-10 truncate font-semibold transition-all duration-200 text-rose-600', collapsed && canCollapse && 'md:hidden')}>
                            {item.label}
                          </span>
                        </button>
                      ) : (
                        <NavLink
                          key={`${group.heading}-${item.label}`}
                          to={item.to}
                          end={item.end}
                          title={collapsed && canCollapse ? item.label : undefined}
                          onClick={onClose}
                          className="relative group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-bold transition-colors outline-none"
                        >
                          {/* Active Background Glow & Layout ID */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTabAdminSidebar"
                              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] dark:shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          
                          {/* Hover Background (for inactive) */}
                          {!isActive && (
                            <div className="absolute inset-0 rounded-2xl bg-slate-50 dark:bg-slate-900/50 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}

                          <div className={cn(
                            "relative z-10 flex items-center justify-center transition-transform group-hover:scale-110",
                            isActive ? "text-white drop-shadow-md" : "text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white"
                          )}>
                            <item.icon className={cn("h-[18px] w-[18px]", isActive && item.label === 'Dashboard' && "animate-pulse")} />
                          </div>
                          
                          <span className={cn(
                            'relative z-10 truncate font-semibold transition-all duration-200', 
                            isActive ? "text-white" : "text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white",
                            collapsed && canCollapse && 'md:opacity-0 md:w-0 md:hidden'
                          )}>
                            {item.label}
                          </span>
                          
                          {item.badge && (!collapsed || !canCollapse) && (
                            <span className={cn(
                              "relative z-10 ml-auto rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase transition-colors shadow-sm",
                              item.badge === 'LIVE' ? "bg-rose-500 text-white animate-bounce shadow-rose-500/30" : 
                              item.badge.includes('Unread') || item.badge.includes('New') ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" :
                              isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            )}>
                              {item.badge}
                            </span>
                          )}

                          {/* Show a red dot if collapsed and has an important badge */}
                          {item.badge && collapsed && canCollapse && (item.badge === 'LIVE' || item.badge.includes('Unread') || item.badge.includes('New')) && (
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse z-20" />
                          )}
                        </NavLink>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Footer User Card with Progress */}
          <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800/40">
            {isInstitute || isTeacher ? (
              <div
                className={cn(
                  'group relative flex items-center gap-3 rounded-[20px] bg-white border border-slate-200/60 p-3 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-slate-900/40 dark:border-slate-800/60',
                  collapsed && canCollapse && 'md:justify-center md:p-2'
                )}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <ProgressRing progress={100} size={42} strokeWidth={3} />
                  {isInstitute ? (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-inner overflow-hidden">
                      <InstituteLogo institute={institute} size="sm" />
                    </div>
                  ) : (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white shadow-inner">
                      {(user?.name || 'T').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className={cn('min-w-0 flex-1 transition-opacity', collapsed && canCollapse && 'md:hidden')}>
                  <p className="truncate text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{workspaceName}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-[10px] font-bold text-slate-500">{roleLabel}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[20px] bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-md shadow-blue-500/20">
                <p className="text-xs font-black text-white">Super Admin Console</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-[10px] font-bold text-blue-100">System Online</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden" onClick={onClose} aria-label="Close menu overlay" />}
    </>
  );
}
