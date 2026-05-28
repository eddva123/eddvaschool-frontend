import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, Search, ExternalLink, BookOpen, 
  HelpCircle, ChevronRight, Hash, Compass, Beaker, FileText 
} from 'lucide-react';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Cheat Sheets', 'Formulas', 'Lab Manuals', 'Syllabus'];

  const resourcesList = [
    {
      id: 1,
      title: 'Physics Optics Ray Diagrams Cheat Sheet',
      category: 'Cheat Sheets',
      subject: 'Physics',
      format: 'PDF',
      size: '1.4 MB',
      description: 'Useful diagrams and formulas showing object position, image position, size, and nature for concave and convex mirrors.',
      url: '#'
    },
    {
      id: 2,
      title: 'Periodic Table & Valency Chart',
      category: 'Cheat Sheets',
      subject: 'Chemistry',
      format: 'PNG',
      size: '5.2 MB',
      description: 'High-resolution downloadable periodic table with electronegativity values and common ion valencies.',
      url: '#'
    },
    {
      id: 3,
      title: 'Class 10 Mensuration Formulas Deck',
      category: 'Formulas',
      subject: 'Mathematics',
      format: 'PDF',
      size: '2.1 MB',
      description: 'Formula cheat sheets covering surface area and volumes of sphere, cone, cylinder, hemisphere, and combination of solids.',
      url: '#'
    },
    {
      id: 4,
      title: 'NCERT Physics Lab Manual Grade 12',
      category: 'Lab Manuals',
      subject: 'Physics',
      format: 'PDF',
      size: '12.4 MB',
      description: 'Official experimental instructions, circuit diagrams, and observation structures for school physics lab trials.',
      url: '#'
    },
    {
      id: 5,
      title: 'EDDVA Curriculum Syllabus 2026',
      category: 'Syllabus',
      subject: 'General',
      format: 'PDF',
      size: '850 KB',
      description: 'Official academic session course schedules, marks distribution structure, and test chapter lists.',
      url: '#'
    }
  ];

  const filteredResources = resourcesList.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'Physics': return <Compass className="text-sky-500" size={18} />;
      case 'Chemistry': return <Beaker className="text-emerald-500" size={18} />;
      case 'Mathematics': return <Hash className="text-indigo-500" size={18} />;
      default: return <BookOpen className="text-purple-500" size={18} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Academic Resources & Formulas</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Quick-access sheets, formulas decks, and syllabus documentation</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resource titles..."
            className="w-full rounded-2xl border-0 bg-white/60 py-2.5 pl-10 pr-4 text-xs font-semibold ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-900/60 dark:ring-slate-800/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeCategory === cat 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white/60 hover:bg-white text-slate-600 border border-slate-200/50 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Cards Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((res) => (
            <div 
              key={res.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-850">
                      {getSubjectIcon(res.subject)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{res.subject}</span>
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded-md uppercase">
                        {res.category}
                      </span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {res.format} • {res.size}
                  </span>
                </div>

                <h3 className="mt-4 text-xs font-black text-slate-900 dark:text-white leading-snug">
                  {res.title}
                </h3>
                <p className="mt-2 text-[11px] font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                  {res.description}
                </p>
              </div>

              <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/50">
                <button 
                  onClick={() => alert('Download started...')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-black text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
                >
                  <Download size={14} /> Download File
                </button>
                
                <button 
                  onClick={() => alert('Previewing sheet...')}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-slate-200/50 text-slate-600 hover:bg-slate-50 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
