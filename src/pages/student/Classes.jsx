import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  BookOpen, Calendar, Clock, Video, ChevronRight, 
  CheckCircle2, Star, User, AlertCircle, ArrowRight,
  Hand, MessageSquare, Download, Check, BellRing
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../components/admin/Skeleton';

export default function Classes() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live'); // live | upcoming | previous | timetable
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // Live Simulator States
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Teacher (HC Verma)', text: 'Welcome everyone! Today we discuss Electromagnetic Induction.' },
    { sender: 'You', text: 'Good morning sir! Can you repeat the Lenz law definition?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/students/my-courses');
        const coursesList = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        setCourses(coursesList);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'You', text: chatInput }]);
    setChatInput('');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // Get subjects list for filter
  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="text-blue-600" /> Lectures & Live Classes
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Attend live lessons, track schedules, and access recordings.</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        {['live', 'upcoming', 'previous', 'timetable'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-6 py-3 text-sm font-black uppercase tracking-wider transition border-b-2',
              activeTab === tab
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {tab === 'live' ? '🔴 Live Session' : tab}
          </button>
        ))}
      </div>

      {/* Active Tab Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Tab 1: Live Classes */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              {isLiveActive ? (
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Live Stream Panel */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-slate-950 border border-slate-800 shadow-lg flex items-center justify-center">
                      {/* Simulating active Agora video stream */}
                      <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white">
                        <Video size={48} className="text-blue-500 animate-pulse mb-4" />
                        <h3 className="text-lg font-bold">Physics Lecture: Electromagnetic Induction</h3>
                        <p className="text-xs text-slate-400 mt-1">Instructor: Dr. HC Verma • Active for 24 minutes</p>
                      </div>
                      
                      {/* Top Overlay controls */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="rounded-lg bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
                          Live
                        </span>
                        <span className="rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                          240 Attendees
                        </span>
                      </div>

                      {/* Video Controls Bar */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-slate-950/70 p-3 rounded-2xl backdrop-blur-md border border-white/5">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setHandRaised(!handRaised)} 
                            className={cn(
                              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition",
                              handRaised ? "bg-amber-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                            )}
                          >
                            <Hand size={14} /> {handRaised ? 'Hand Raised' : 'Raise Hand'}
                          </button>
                          
                          <button 
                            onClick={() => setAttendanceMarked(true)} 
                            disabled={attendanceMarked}
                            className={cn(
                              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition",
                              attendanceMarked ? "bg-emerald-600 text-white cursor-default" : "bg-white/10 hover:bg-white/20 text-white"
                            )}
                          >
                            {attendanceMarked ? <Check size={14} /> : null}
                            {attendanceMarked ? 'Present' : 'Mark Attendance'}
                          </button>
                        </div>
                        
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); alert('Downloading notes...'); }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                        >
                          <Download size={14} /> Notes
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Live Chat Panel */}
                  <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col h-[400px] lg:h-auto">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <MessageSquare size={16} /> Live Class Chat
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar text-xs font-medium">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                          <p className="font-bold text-blue-600 dark:text-blue-400">{msg.sender}</p>
                          <p className="text-slate-700 dark:text-slate-350 mt-1">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendChat} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Type message to teacher..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 rounded-xl border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700">
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 border-dashed bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <Video className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-700" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active live sessions</h3>
                  <p className="mt-1 text-sm text-slate-500">There are no live meetings currently. Check upcoming tab for schedules.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Upcoming Classes */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {/* Subject Filters */}
              <div className="flex flex-wrap gap-2">
                {subjects.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition",
                      selectedSubject === sub
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900 flex justify-between items-center">
                  <div>
                    <span className="rounded-lg bg-purple-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      Chemistry
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white mt-2">Organic Carbonyl Compounds Mechanism</h4>
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock size={12} /> Today, 4:00 PM • 60 mins
                    </p>
                  </div>
                  <button className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" title="Set Reminder">
                    <BellRing size={16} className="text-slate-400" />
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800/40 dark:bg-slate-900 flex justify-between items-center">
                  <div>
                    <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      Mathematics
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white mt-2">Matrices & Determinants Advanced Rules</h4>
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                      <Clock size={12} /> Tomorrow, 11:30 AM • 90 mins
                    </p>
                  </div>
                  <button className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" title="Set Reminder">
                    <BellRing size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Previous Classes */}
          {activeTab === 'previous' && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.enrollmentId} className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {course.batch?.thumbnailUrl ? (
                      <img src={course.batch.thumbnailUrl} alt={course.batch.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                        <BookOpen className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900 backdrop-blur-md">
                      {course.batch?.examTarget || course.batch?.class || 'Course'}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white line-clamp-2">
                      {course.batch?.name}
                    </h3>
                    
                    <div className="mb-6 flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1">
                        <Video size={14} />
                        <span>{course.progress?.watchedLectures || 0}/{course.progress?.totalLectures || 0} Lectures</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/student/classes/${course.batch?.id}`} 
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50 dark:bg-slate-800/50 dark:hover:bg-blue-900/20"
                    >
                      View Lectures
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Timetable View */}
          {activeTab === 'timetable' && (
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <Calendar size={16} /> Weekly Routine
              </h3>
              <table className="w-full min-w-[600px] border-collapse text-left text-xs font-bold text-slate-500">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="py-3">Day</th>
                    <th className="py-3">10:00 - 11:30</th>
                    <th className="py-3">12:00 - 13:30</th>
                    <th className="py-3">14:00 - 15:30</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-350">
                  <tr>
                    <td className="py-4 font-black">Monday</td>
                    <td className="py-4">Physics (EM Induction)</td>
                    <td className="py-4">-</td>
                    <td className="py-4">Chemistry (Carbonyls)</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-black">Tuesday</td>
                    <td className="py-4">-</td>
                    <td className="py-4">Mathematics (Matrices)</td>
                    <td className="py-4">Biology (Genetics)</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-black">Wednesday</td>
                    <td className="py-4">Physics (Optics)</td>
                    <td className="py-4">Chemistry (Phenols)</td>
                    <td className="py-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Teacher Cards Section */}
      <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/40 dark:bg-slate-900">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Course Instructors</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-800/50">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-sm font-black text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              HV
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">HC Verma</h4>
              <p className="text-[10px] font-semibold text-slate-500">Physics Faculty • 25 yrs exp</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-800/50">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-100 text-sm font-black text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              MS
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">MS Chouhan</h4>
              <p className="text-[10px] font-semibold text-slate-500">Chemistry Faculty • 12 yrs exp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
