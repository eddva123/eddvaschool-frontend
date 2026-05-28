import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  LayoutGrid,
  MapPin,
  Sparkles,
  Video,
  BellRing,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../components/admin/Skeleton';

const categories = [
  'All',
  'ACADEMIC',
  'EXAM',
  'HOLIDAY',
  'ASSIGNMENT',
  'PARENT_MEETING',
  'TEACHER_MEETING',
  'LIVE_CLASS',
  'SPORTS_EVENT',
  'CULTURAL_PROGRAM',
];

const categoryStyles = {
  ACADEMIC: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  EXAM: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  HOLIDAY: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  ASSIGNMENT: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
  PARENT_MEETING: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800',
  TEACHER_MEETING: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
  LIVE_CLASS: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
  SPORTS_EVENT: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  CULTURAL_PROGRAM: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
};

function dateKey(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function addMonths(date, amount) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

function sameDay(a, b) {
  return a && b && dateKey(new Date(a)) === dateKey(new Date(b));
}

function isWithinRange(event, date) {
  const target = dateKey(date);
  const start = dateKey(new Date(event.startTime));
  const end = dateKey(new Date(event.endTime));
  return target >= start && target <= end;
}

export default function Calendar() {
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [category, setCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  async function loadEvents() {
    try {
      setLoading(true);
      const res = await api.get('/events', { params: category === 'All' ? undefined : { category } });
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setEvents(list);
    } catch {
      toast.error('Failed to sync calendar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
    const onChanged = () => loadEvents();
    window.addEventListener('eddva:data-changed', onChanged);
    const interval = setInterval(loadEvents, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('eddva:data-changed', onChanged);
    };
  }, [category]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (category !== 'All' && event.category !== category) return false;
      return true;
    });
  }, [events, category]);

  function goPrevious() {
    if (view === 'month') return setSelectedDate((current) => addMonths(current, -1));
    if (view === 'week') return setSelectedDate((current) => addDays(current, -7));
    if (view === 'agenda') return setSelectedDate((current) => addDays(current, -14));
    return setSelectedDate((current) => addDays(current, -1));
  }

  function goNext() {
    if (view === 'month') return setSelectedDate((current) => addMonths(current, 1));
    if (view === 'week') return setSelectedDate((current) => addDays(current, 7));
    if (view === 'agenda') return setSelectedDate((current) => addDays(current, 14));
    return setSelectedDate((current) => addDays(current, 1));
  }

  const monthDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPadding = (first.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < startPadding; i += 1) cells.push(null);
    for (let day = 1; day <= last.getDate(); day += 1) cells.push(new Date(year, month, day));
    return cells;
  }, [selectedDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [selectedDate]);

  const agendaDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 14 }, (_, index) => addDays(start, index));
  }, [selectedDate]);

  const selectedDayEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => sameDay(event.startTime, selectedDate) || isWithinRange(event, selectedDate))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [filteredEvents, selectedDate]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...filteredEvents]
      .filter((event) => new Date(event.startTime) >= now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 6);
  }, [filteredEvents]);

  const summary = useMemo(() => {
    const counts = categories.filter((item) => item !== 'All').reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    filteredEvents.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });
    return counts;
  }, [filteredEvents]);

  function renderEventChip(event) {
    return (
      <button
        key={event.id}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEvent(event);
        }}
        className={cn(
          'group flex w-full items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-left text-xs font-bold shadow-sm transition hover:shadow-md',
          categoryStyles[event.category] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
        )}
      >
        <span className="min-w-0 flex-1 truncate">{event.title}</span>
      </button>
    );
  }

  const title = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: view === 'day' ? 'numeric' : undefined });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] gap-6 px-4 pb-10 sm:px-6">
      <div className="flex-1 space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-blue-50/20 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-900 dark:border-slate-800 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" /> My Schedule
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">{title}</h1>
              <p className="mt-2 text-sm text-slate-500">Track all your classes, exam deadlines, holidays, and meetings in one unified calendar.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                {['month', 'week', 'day', 'agenda'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setView(item)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition',
                      view === item ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    )}
                  >
                    {item === 'month' && <LayoutGrid className="h-4 w-4" />}
                    {item === 'week' && <CalendarRange className="h-4 w-4" />}
                    {item === 'day' && <CalendarClock className="h-4 w-4" />}
                    {item === 'agenda' && <CalendarDays className="h-4 w-4" />}
                    {item}
                  </button>
                ))}
              </div>

              <button onClick={() => setSelectedDate(new Date())} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                Today
              </button>
            </div>
          </div>

          <div className="grid gap-4 border-b border-slate-100 dark:border-slate-800 p-5 lg:grid-cols-[2fr_1fr]">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 outline-none">
                {categories.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              <button type="button" onClick={goPrevious} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Prev</button>
              <button type="button" onClick={goNext} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">Next</button>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
            <div className="border-b border-slate-100 lg:border-b-0 lg:border-r lg:border-slate-100 dark:border-slate-800">
              {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
              ) : view === 'month' ? (
                <div className="p-5 overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-7 gap-3 text-center text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <div key={day} className="py-2">{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                      {monthDays.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`} className="min-h-32 rounded-3xl border border-dashed border-slate-100 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-950/20" />;
                        const dayEvents = filteredEvents.filter((event) => sameDay(event.startTime, day) || isWithinRange(event, day));
                        const isToday = sameDay(day, new Date());
                        return (
                          <div
                            key={dateKey(day)}
                            onClick={() => setSelectedDate(day)}
                            className={cn('min-h-32 rounded-3xl border p-3 cursor-pointer transition hover:shadow-lg', isToday ? 'border-blue-200 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950')}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className={cn('text-xs font-black', isToday ? 'text-blue-600' : 'text-slate-400')}>{day.getDate()}</span>
                              {dayEvents.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                            </div>
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map(renderEventChip)}
                              {dayEvents.length > 2 && <p className="text-center text-[9px] font-black text-slate-400">+{dayEvents.length - 2} more</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : view === 'week' ? (
                <div className="grid min-h-[500px] grid-cols-7 gap-0 border-t border-slate-100 dark:border-slate-800">
                  {weekDays.map((day) => {
                    const dayEvents = filteredEvents.filter((event) => sameDay(event.startTime, day) || isWithinRange(event, day));
                    const isToday = sameDay(day, new Date());
                    return (
                      <div key={dateKey(day)} className="border-r border-slate-100 dark:border-slate-800 p-3 last:border-r-0">
                        <div className={cn('mb-3 rounded-2xl px-3 py-2 text-center', isToday ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400')}>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em]">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                          <p className="text-2xl font-extrabold">{day.getDate()}</p>
                        </div>
                        <div className="space-y-2">
                          {dayEvents.map(renderEventChip)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : view === 'day' ? (
                <div className="p-5">
                  <div className="mb-4 rounded-3xl bg-slate-50 dark:bg-slate-800 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Selected Day</p>
                    <p className="mt-1 text-xl font-extrabold text-slate-950 dark:text-white">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="space-y-3">
                    {selectedDayEvents.map((event) => (
                      <div key={event.id} onClick={() => setSelectedEvent(event)} className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm transition hover:shadow-lg cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className={cn('inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]', categoryStyles[event.category] || 'bg-slate-50 text-slate-700 border-slate-200')}>
                              {event.category.replace('_', ' ')}
                            </div>
                            <h3 className="mt-3 text-lg font-extrabold text-slate-950 dark:text-white">{event.title}</h3>
                            <p className="mt-2 text-sm text-slate-500">{event.description || 'No description'}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {event.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>}
                          {event.meetingPlatform && <span className="inline-flex items-center gap-1"><Video className="h-3.5 w-3.5" /> {event.meetingPlatform}</span>}
                        </div>
                      </div>
                    ))}
                    {!selectedDayEvents.length && (
                      <p className="text-center py-8 text-sm text-slate-400">No events scheduled for this day.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="space-y-3">
                    {agendaDays.map((day) => {
                      const dayEvents = filteredEvents.filter((event) => sameDay(event.startTime, day) || isWithinRange(event, day));
                      if (!dayEvents.length) return null;
                      return (
                        <div key={dateKey(day)} className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">{day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{dayEvents.length} events</span>
                          </div>
                          <div className="space-y-2">
                            {dayEvents.map((event) => (
                              <button key={event.id} onClick={() => setSelectedEvent(event)} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 text-left">
                                <div>
                                  <p className="text-sm font-bold text-slate-955 dark:text-white">{event.title}</p>
                                  <p className="text-xs text-slate-500">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <span className={cn('rounded-full border px-3 py-1 text-[10px] font-black uppercase', categoryStyles[event.category] || 'bg-slate-50 text-slate-700 border-slate-200')}>{event.category.replace('_', ' ')}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4 bg-slate-50/50 dark:bg-slate-950/20 p-5">
              <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">Upcoming events</h3>
                  <BellRing className="h-4 w-4 text-slate-300" />
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4 text-left transition hover:bg-white dark:hover:bg-slate-950">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-extrabold text-slate-955 dark:text-white">{event.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{new Date(event.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {!upcomingEvents.length && <p className="py-8 text-center text-sm text-slate-400">No upcoming events.</p>}
                </div>
              </div>

              <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">Summary</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {categories.filter((item) => item !== 'All').map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.replace('_', ' ')}</p>
                      <p className="mt-2 text-2xl font-extrabold text-slate-955 dark:text-white">{summary[item] || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-lg rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div>
                  <span className={cn('rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]', categoryStyles[selectedEvent.category] || 'bg-slate-50 text-slate-700 border-slate-200')}>
                    {selectedEvent.category.replace('_', ' ')}
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-950 dark:text-white">{selectedEvent.title}</h2>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p className="text-sm">{selectedEvent.description || 'No description provided.'}</p>
                
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-sm font-semibold">
                  <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> {new Date(selectedEvent.startTime).toLocaleString()} - {new Date(selectedEvent.endTime).toLocaleString()}</div>
                  {selectedEvent.location && <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {selectedEvent.location}</div>}
                  {selectedEvent.meetingPlatform && <div className="flex items-center gap-2"><Video size={16} className="text-slate-400" /> Platform: {selectedEvent.meetingPlatform}</div>}
                </div>

                {selectedEvent.meetingUrl && (
                  <div className="pt-4">
                    <a
                      href={selectedEvent.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition"
                    >
                      <Video size={16} /> Join Live Session
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
