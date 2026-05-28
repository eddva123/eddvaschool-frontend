import React, { useState } from 'react';
import api from '../../services/api';
import { 
  FileText, Search, Sparkles, AlertCircle, Download, ExternalLink, 
  HelpCircle, BookOpen, ChevronRight, CheckCircle2, MessageSquare, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotesLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // Selected notes for analysis
  const [selectedNote, setSelectedNote] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

  const notesList = [
    {
      id: 1,
      title: 'Light - Reflection & Refraction Board Slides',
      subject: 'Physics',
      format: 'PDF',
      size: '4.2 MB',
      pages: 15,
      author: 'Dr. HC Verma',
      downloadUrl: '#',
      summary: 'Rules for ray diagram formation, spherical mirrors focal length, lens formula, power of lens, and refractive index verification.'
    },
    {
      id: 2,
      title: 'Acids, Bases and Salts Chapter Notes',
      subject: 'Chemistry',
      format: 'PPTX',
      size: '8.7 MB',
      pages: 20,
      author: 'Prof. KK Kapoor',
      downloadUrl: '#',
      summary: 'Chemical indicators, chemical properties of acids and bases, pH scale significance in daily life, preparation and uses of sodium hydroxide, bleaching powder, and baking soda.'
    },
    {
      id: 3,
      title: 'Quadratic Equations Class 10 Notes',
      subject: 'Mathematics',
      format: 'PDF',
      size: '3.1 MB',
      pages: 12,
      author: 'Er. SK Munjal',
      downloadUrl: '#',
      summary: 'Standard form of quadratic equations, roots definition, solution by factorization method and quadratic formula, nature of roots.'
    },
    {
      id: 4,
      title: 'Life Processes: Nutrition & Respiration Slides',
      subject: 'Biology',
      format: 'PDF',
      size: '5.6 MB',
      pages: 30,
      author: 'Dr. Ritu Rathee',
      downloadUrl: '#',
      summary: 'Autotrophic and heterotrophic nutrition, photosynthesis steps, human digestive system structure, aerobic and anaerobic cellular respiration.'
    }
  ];

  const handleAnalyzeNotes = async (note) => {
    setSelectedNote(note);
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await api.post('/ai/notes/analyze', {
        noteId: note.id,
        title: note.title,
        subject: note.subject
      });
      setAnalysisResult(res.data.analysis || res.data.content);
    } catch (err) {
      console.error('Failed to analyze note, generating mock analysis:', err);
      setTimeout(() => {
        setAnalysisResult({
          examRelevance: "High (approx. 2-3 questions in board examinations)",
          summary: `This school lecture deck explains the core concepts of ${note.title}. It outlines critical board exam definitions and formulas.`,
          keyDefinitions: [
            { term: "Focal Length (f)", meaning: "Distance between the pole and the principal focus of a spherical mirror." },
            { term: "Law of Reflection", meaning: "The angle of incidence is equal to the angle of reflection; incident, normal, and reflected rays lie in the same plane." }
          ],
          frequentQuestions: [
            "State the laws of refraction of light. Define refractive index and state its formula.",
            "An object is placed 10 cm in front of a concave mirror of focal length 15 cm. Calculate the image position."
          ]
        });
      }, 1200);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredNotes = notesList.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Top filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Smart Notes Library</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Access slide decks, study guides, and analyze them with AI</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or concepts..."
            className="w-full rounded-2xl border-0 bg-white/60 py-2.5 pl-10 pr-4 text-xs font-semibold ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-900/60 dark:ring-slate-800/50"
          />
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              selectedSubject === sub 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-white/60 hover:bg-white text-slate-600 border border-slate-200/50 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-800/50"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Layout grid */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Notes Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredNotes.map((note) => (
              <div 
                key={note.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                      {note.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {note.format} • {note.pages} pages
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">By {note.author}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {note.summary}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800/50">
                  <button 
                    onClick={() => handleAnalyzeNotes(note)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                  >
                    <Sparkles size={14} />
                    Analyze with AI
                  </button>
                  <button 
                    onClick={() => alert('Download started...')}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-slate-200/50 text-slate-600 hover:bg-slate-50 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <AnimatePresence>
          {selectedNote && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-96 shrink-0 flex flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white/60 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-500" />
                  <h3 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">AI Material Analysis</h3>
                </div>
                <button 
                  onClick={() => setSelectedNote(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Analysis contents */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document</h4>
                  <p className="text-sm font-black text-slate-950 dark:text-white mt-0.5">{selectedNote.title}</p>
                </div>

                {analyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <Sparkles size={24} className="animate-spin text-indigo-500" />
                    <p className="text-xs font-bold animate-pulse">Running semantic scanning...</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-6">
                    {/* Exam Relevance */}
                    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs">
                      <span className="font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle size={14} /> Exam Relevance
                      </span>
                      <p className="mt-1 font-semibold text-amber-700 dark:text-amber-300">{analysisResult.examRelevance}</p>
                    </div>

                    {/* Quick Summary */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Concept Summary</h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        {analysisResult.summary}
                      </p>
                    </div>

                    {/* Key definitions */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Key Terms & Formulas</h4>
                      <div className="space-y-3">
                        {analysisResult.keyDefinitions?.map((def, idx) => (
                          <div key={idx} className="rounded-xl bg-white/80 dark:bg-slate-950/80 p-3 border border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{def.term}</span>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{def.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* High Yield Questions */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Potential Test Questions</h4>
                      <ul className="space-y-2">
                        {analysisResult.frequentQuestions?.map((q, idx) => (
                          <li key={idx} className="flex gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
