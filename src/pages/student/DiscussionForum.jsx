import React, { useState } from 'react';
import { 
  MessageSquare, ThumbsUp, Sparkles, Plus, Search, 
  ChevronRight, ArrowRight, User, CheckCircle2, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiscussionForum() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New thread states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Physics');
  const [newContent, setNewContent] = useState('');

  const [threads, setThreads] = useState([
    {
      id: 1,
      title: 'Can someone clarify the vector direction of dipole moment?',
      content: 'In electrostatics, we define the electric dipole moment pointing from negative to positive charge, but in chemistry we often see the opposite. Why is there a difference?',
      category: 'Physics',
      author: 'Rohit Sharma',
      upvotes: 14,
      replies: 4,
      date: '2 hours ago'
    },
    {
      id: 2,
      title: 'Shortcuts for solving Integration by Parts containing e^x cos(x)?',
      content: 'Is there a tabular method or a quick formulation trick to solve cyclic integrations without going through double Integration by parts?',
      category: 'Mathematics',
      author: 'Sneha Patil',
      upvotes: 22,
      replies: 7,
      date: 'Yesterday'
    },
    {
      id: 3,
      title: 'Syllabus chapters list for midterm test #2 chemistry?',
      content: 'Does the next midterm exam contain SN1/SN2 kinetics or only basic substitution nomenclature chapters?',
      category: 'General',
      author: 'Amit Mishra',
      upvotes: 6,
      replies: 2,
      date: '3 days ago'
    }
  ]);

  const handleCreateThread = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newObj = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: 'You (Student)',
      upvotes: 1,
      replies: 0,
      date: 'Just now'
    };

    setThreads([newObj, ...threads]);
    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
  };

  const handleUpvote = (id) => {
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, upvotes: t.upvotes + 1 };
      }
      return t;
    }));
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || thread.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">EDDVA Discussion Forum</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Ask doubts, share reference sheets, and discuss answers with peers</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forum threads..."
              className="w-full rounded-2xl border-0 bg-white/60 py-2.5 pl-10 pr-4 text-xs font-semibold ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-900/60 dark:ring-slate-800/50"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
          >
            <Plus size={14} /> Start Thread
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {['All', 'Physics', 'Chemistry', 'Mathematics', 'General'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white/60 hover:bg-white text-slate-600 border border-slate-200/50 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {filteredThreads.map((thread) => (
          <div 
            key={thread.id}
            className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[9px] font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    {thread.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Posted by {thread.author} • {thread.date}</span>
                </div>
                
                <h3 className="mt-3 text-xs font-black text-slate-900 dark:text-white leading-snug">
                  {thread.title}
                </h3>
                
                <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-550 dark:text-slate-400">
                  {thread.content}
                </p>
              </div>
            </div>

            {/* Upvote & replies buttons */}
            <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/50">
              <button 
                onClick={() => handleUpvote(thread.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-650 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <ThumbsUp size={14} />
                <span>{thread.upvotes}</span>
              </button>

              <button 
                onClick={() => alert('Feature coming soon: Thread reply panel.')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-650 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <MessageSquare size={14} />
                <span>{thread.replies} Replies</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Start Thread Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-950 dark:text-white">Start New Discussion</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-805">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Thread Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Question regarding electric flux formula..."
                  className="w-full rounded-xl border-0 bg-slate-50 py-2 px-3 text-xs font-semibold ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border-0 bg-slate-50 py-2 px-3 text-xs font-bold ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Content Details</label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Elaborate your doubt or concept clearly..."
                  rows={4}
                  className="w-full rounded-xl border-0 bg-slate-50 py-2 px-3 text-xs font-semibold ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 shadow-md"
              >
                Post Discussion
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
