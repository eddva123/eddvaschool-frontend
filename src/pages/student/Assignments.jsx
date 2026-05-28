import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { 
  FileText, Calendar, Clock, CheckCircle2, AlertCircle, 
  UploadCloud, Sparkles, BookOpen, ChevronRight, X, Eye, ThumbsUp
} from 'lucide-react';
import { cn } from '../../components/admin/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('pending'); // pending | submitted | overdue
  const [activeSubject, setActiveSubject] = useState('All');
  
  // AI Helper States
  const [aiHelperOpen, setAiHelperOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [aiHint, setAiHint] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Homework Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get('/assignments');
        const assignmentsList = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        
        // Mock default list if API is empty
        if (assignmentsList.length === 0) {
          setAssignments([
            { id: '1', title: 'Electrostatics Practice Sheet 1', subject: 'Physics', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'pending', description: 'Solve questions 1 to 15 regarding Coulomb law and field lines.' },
            { id: '2', title: 'Aldehydes & Ketones Conversions', subject: 'Chemistry', dueDate: new Date(Date.now() + 86400000 * 4).toISOString(), status: 'pending', description: 'Write mechanisms for Cannizzaro and Aldol reactions.' },
            { id: '3', title: 'Calculus Continuity Limits H.W.', subject: 'Mathematics', dueDate: new Date(Date.now() - 86400000).toISOString(), status: 'overdue', description: 'Find limits for functions specified in textbook section 4.2.' },
            { id: '4', title: 'Photosynthesis Cycle Outline', subject: 'Biology', dueDate: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'completed', description: 'Draw the Calvin Cycle and explain light-dependent reactions.', teacherRemarks: 'Great structure, diagrams are neat.' }
          ]);
        } else {
          setAssignments(assignmentsList);
        }
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignments();
  }, []);

  const handleLaunchAiHelper = async (assignment) => {
    setSelectedAssignment(assignment);
    setAiHelperOpen(true);
    setAiLoading(true);
    setAiHint('');
    try {
      const res = await api.post('/ai/feedback/generate', {
        context: 'post_test', // Mock context for tutor guidance
        data: {
          assignmentTitle: assignment.title,
          description: assignment.description,
          subject: assignment.subject
        }
      });
      setAiHint(res.data?.feedback || 'Review the core textbook definitions. Focus on applying correct formulas and drawing diagrams.');
    } catch (err) {
      console.error(err);
      setAiHint('To solve this assignment: \n1. Re-read the chapter guidelines. \n2. Identify formula parameters. \n3. Check unit conversions carefully.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progression
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 20;
        });
      }, 200);
    }
  };

  const handleSubmitHomework = (assignmentId) => {
    setAssignments(prev => prev.map(as => {
      if (as.id === assignmentId) {
        return { ...as, status: 'completed' };
      }
      return as;
    }));
    setSelectedFile(null);
    alert('Homework submitted successfully!');
  };

  const filtered = assignments.filter(as => {
    const matchesSubject = activeSubject === 'All' || as.subject === activeSubject;
    const matchesStatus = 
      (activeStatus === 'pending' && as.status === 'pending') ||
      (activeStatus === 'submitted' && as.status === 'completed') ||
      (activeStatus === 'overdue' && as.status === 'overdue');
    return matchesSubject && matchesStatus;
  });

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-blue-600" /> Homework & Assignments
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Track and submit your course assignments.</p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        {[
          { key: 'pending', label: 'Pending Assignments' },
          { key: 'submitted', label: 'Submitted' },
          { key: 'overdue', label: 'Overdue' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={cn(
              'px-6 py-3 text-sm font-black uppercase tracking-wider transition border-b-2',
              activeStatus === tab.key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subject Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {subjects.map(sub => (
          <button
            key={sub}
            onClick={() => setActiveSubject(sub)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold border transition",
              activeSubject === sub
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
            )}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Assignments list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 border-dashed bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <FileText className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No assignments found</h3>
          <p className="mt-1 text-sm text-slate-500">Pick a different category or check back later.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(as => {
            const isLate = as.status === 'overdue';
            const isDone = as.status === 'completed';
            
            return (
              <div key={as.id} className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className={cn(
                  "h-2 w-full",
                  isDone ? "bg-emerald-500" : isLate ? "bg-rose-500" : "bg-blue-500"
                )} />
                
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-lg bg-slate-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {as.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {isLate ? 'Overdue' : isDone ? 'Done' : 'Pending'}
                    </span>
                  </div>
                  
                  <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                    {as.title}
                  </h3>
                  
                  <p className="text-xs font-semibold text-slate-500 line-clamp-3 mb-6">
                    {as.description}
                  </p>

                  <div className="mb-6 space-y-2 text-xs font-semibold text-slate-500 pt-4 border-t border-slate-50 dark:border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <span>Due: {new Date(as.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {as.teacherRemarks && (
                    <div className="mb-6 rounded-xl bg-emerald-50/50 border border-emerald-100 p-3.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400">
                      <p className="font-bold flex items-center gap-1"><ThumbsUp size={12} /> Teacher Remark:</p>
                      <p className="mt-1">{as.teacherRemarks}</p>
                    </div>
                  )}

                  {/* Submission and AI buttons */}
                  <div className="mt-auto space-y-2">
                    {!isDone && (
                      <div className="space-y-3">
                        {/* File Upload Zone */}
                        {selectedFile ? (
                          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-bold flex items-center justify-between dark:border-slate-800 dark:bg-slate-950">
                            <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                            <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-rose-500">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 cursor-pointer hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                            <UploadCloud size={20} className="text-slate-400 mb-1" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Drag file or click</span>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                          </label>
                        )}

                        {isUploading && (
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        )}

                        <button
                          disabled={!selectedFile || isUploading}
                          onClick={() => handleSubmitHomework(as.id)}
                          className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white transition",
                            isLate ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"
                          )}
                        >
                          Submit Work
                        </button>
                      </div>
                    )}

                    {!isDone && (
                      <button
                        onClick={() => handleLaunchAiHelper(as)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-150 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950 dark:text-slate-400"
                      >
                        <Sparkles size={14} className="text-indigo-500" />
                        AI Assignment Helper
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Assistant Drawer */}
      <AnimatePresence>
        {aiHelperOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiHelperOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-indigo-500" /> AI Assignment Helper
                </h3>
                <button onClick={() => setAiHelperOpen(false)} className="rounded-full p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <X size={18} />
                </button>
              </div>

              {selectedAssignment && (
                <div className="space-y-6">
                  <div>
                    <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {selectedAssignment.subject}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{selectedAssignment.title}</h4>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{selectedAssignment.description}</p>
                  </div>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/20 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                    <h5 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-3 flex items-center gap-1.5">
                      <BookOpen size={14} /> AI Solution Hints
                    </h5>
                    
                    {aiLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      </div>
                    ) : (
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed whitespace-pre-line">
                        {aiHint}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
