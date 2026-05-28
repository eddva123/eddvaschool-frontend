import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Video,
  PlayCircle,
  BookOpen,
  FileText,
  ClipboardList,
  FolderOpen,
  Bot,
  Sparkles,
  CalendarDays,
  PenTool,
  TrendingUp,
  HelpCircle,
  UploadCloud,
  Trophy,
  BarChart3,
  CalendarCheck,
  FileSpreadsheet,
  Clock,
  AlertCircle,
  MessageSquare,
  MessagesSquare,
  Megaphone,
  User,
  Bell,
  Shield,
  Palette,
  ChevronLeft,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '../admin/Skeleton';
import { EddvaLogo } from '../admin/Brand';
import { useAuth } from '../../context/AuthContext';

const studentGroups = [
  {
    heading: 'Core',
    items: [
      { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ]
  },
  {
    heading: 'Learning',
    items: [
      { to: '/student/classes', label: 'Classes', icon: Video, badge: 'LIVE' },
      { to: '/student/recorded-lectures', label: 'Recorded Lectures', icon: PlayCircle },
      { to: '/student/notes-library', label: 'Notes Library', icon: BookOpen },
      { to: '/student/assignments', label: 'Assignments', icon: FileText, badge: '3 Pending' },
      { to: '/student/assessments', label: 'Assessments', icon: ClipboardList },
      { to: '/student/resources', label: 'Resources', icon: FolderOpen },
    ],
  },
  {
    heading: 'AI Tools',
    items: [
      { to: '/student/ai-tutor', label: 'AI Tutor', icon: Bot },
      { to: '/student/ai-doubt-solver', label: 'AI Doubt Solver', icon: Sparkles },
      { to: '/student/planner', label: 'AI Study Planner', icon: CalendarDays },
      { to: '/student/ai-notes', label: 'AI Notes Gen', icon: PenTool },
      { to: '/student/ai-performance-review', label: 'AI Perf Review', icon: TrendingUp },
    ],
  },
  {
    heading: 'Quiz & Gaming',
    items: [
      { to: '/student/ai-quiz', label: 'AI Quiz', icon: HelpCircle },
      { to: '/student/teacher-quiz', label: 'Teacher Quiz', icon: UploadCloud },
      { to: '/student/battle-arena', label: 'Challenge Zone', icon: Trophy },
    ],
  },
  {
    heading: 'Analytics',
    items: [
      { to: '/student/performance-analytics', label: 'Performance', icon: BarChart3 },
      { to: '/student/attendance-analytics', label: 'Attendance', icon: CalendarCheck },
      { to: '/student/exam-reports', label: 'Exam Reports', icon: FileSpreadsheet },
    ],
  },
  {
    heading: 'Schedule',
    items: [
      { to: '/student/calendar', label: 'Calendar', icon: CalendarDays },
      { to: '/student/timetable', label: 'Timetable', icon: Clock },
      { to: '/student/exam-schedule', label: 'Exam Schedule', icon: AlertCircle },
    ],
  },
  {
    heading: 'Community',
    items: [
      { to: '/student/chat', label: 'Chat', icon: MessageSquare, badge: '2 Unread' },
      { to: '/student/forum', label: 'Discussion Forum', icon: MessagesSquare },
      { to: '/student/announcements', label: 'Announcements', icon: Megaphone, badge: 'New' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { to: '/student/profile', label: 'Profile', icon: User },
      { to: '/student/notifications', label: 'Notifications', icon: Bell },
      { to: '/student/security', label: 'Security', icon: Shield },
      { to: '/student/appearance', label: 'Appearance', icon: Palette },
    ],
  },
];

// Circular progress for student profile
const ProgressRing = ({ progress = 75, size = 44, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
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
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // To track active paths

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-100 bg-white/70 backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/40 dark:bg-slate-950/70 md:static shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]',
          collapsed ? 'w-20' : 'w-[280px]',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100/50 px-6 dark:border-slate-800/40">
            <div className={cn('min-w-0 transition-opacity duration-200', collapsed && 'md:opacity-0 md:w-0 md:overflow-hidden')}>
              <EddvaLogo />
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="hidden rounded-xl p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 md:inline-flex transition-colors"
                aria-label="Toggle sidebar collapse"
              >
                <ChevronLeft className={cn('h-5 w-5 transition-transform duration-300', collapsed && 'rotate-180')} />
              </button>
              <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 md:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
            <div className="space-y-8">
              {studentGroups.map((group) => (
                <div key={group.heading} className="space-y-3">
                  <div className="flex items-center gap-4">
                    <p
                      className={cn(
                        'px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/80 dark:text-slate-500/80 transition-opacity whitespace-nowrap',
                        collapsed && 'md:opacity-0 md:h-0 md:overflow-hidden'
                      )}
                    >
                      {group.heading}
                    </p>
                    {!collapsed && <div className="h-px flex-1 bg-gradient-to-r from-slate-100 to-transparent dark:from-slate-800" />}
                  </div>
                  <nav className="space-y-1.5">
                    {group.items.map((item) => {
                      const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
                      
                      return (
                        <NavLink
                          key={item.label}
                          to={item.to}
                          end={item.end}
                          title={collapsed ? item.label : undefined}
                          onClick={onClose}
                          className="relative group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-bold transition-colors outline-none"
                        >
                          {/* Active Background Glow & Layout ID */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTabSidebar"
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
                            collapsed && 'md:opacity-0 md:w-0 md:hidden'
                          )}>
                            {item.label}
                          </span>
                          
                          {item.badge && !collapsed && (
                            <span className={cn(
                              "relative z-10 ml-auto rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase transition-colors shadow-sm",
                              item.badge === 'LIVE' ? "bg-rose-500 text-white animate-bounce shadow-rose-500/30" : 
                              item.badge.includes('Unread') ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" :
                              isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            )}>
                              {item.badge}
                            </span>
                          )}

                          {/* Show a red dot if collapsed and has an important badge */}
                          {item.badge && collapsed && (item.badge === 'LIVE' || item.badge.includes('Unread')) && (
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

          {/* Footer Student Card with Progress */}
          <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800/40">
            <div
              className={cn(
                'group relative flex items-center gap-3 rounded-[20px] bg-white border border-slate-200/60 p-3 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-slate-900/40 dark:border-slate-800/60',
                collapsed && 'md:justify-center md:p-2'
              )}
            >
              <div className="relative shrink-0">
                <ProgressRing progress={68} size={42} strokeWidth={3} />
                <div className="absolute inset-0 m-auto grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white shadow-inner">
                  {(user?.name || 'S').charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className={cn('min-w-0 flex-1 transition-opacity', collapsed && 'md:hidden')}>
                <p className="truncate text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user?.name || 'Student'}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[10px] font-bold text-slate-500">68% Course Progress</span>
                </div>
              </div>
              
              <button 
                onClick={logout} 
                className={cn(
                  "rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors focus:ring-2 focus:ring-rose-500/20",
                  collapsed && 'md:hidden'
                )}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden transition-opacity" onClick={onClose} aria-label="Close menu overlay" />}
    </>
  );
}
