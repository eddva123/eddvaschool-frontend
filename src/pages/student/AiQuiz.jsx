import React, { useState } from 'react';
import api from '../../services/api';
import { 
  Sparkles, CheckCircle2, AlertCircle, Play, ArrowRight, 
  HelpCircle, ChevronRight, RefreshCw, Award, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiQuiz() {
  const [topic, setTopic] = useState('Electricity');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  
  // Test states
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIdx: selectedOptionIdx }
  const [score, setScore] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions(null);
    setCurrentIdx(0);
    setAnswers({});
    setScore(null);
    setShowExplanation(false);

    try {
      const res = await api.post('/ai/questions/generate', {
        topic: topic,
        difficulty: difficulty,
        count: count
      });
      setQuestions(res.data.questions || res.data.content);
    } catch (err) {
      console.error('Failed to generate AI quiz, using mock quiz:', err);
      // Fallback simulation
      setTimeout(() => {
        setQuestions([
          {
            id: 1,
            text: "What is the SI unit of electric resistance?",
            options: [
              "Ohm",
              "Volt",
              "Ampere",
              "Coulomb"
            ],
            correctOption: 0,
            explanation: "According to Ohm's Law (V = IR), resistance R = V/I. The SI unit of resistance is Ohm (Ω)."
          },
          {
            id: 2,
            text: "What is the formula to calculate electric power in terms of voltage (V) and resistance (R)?",
            options: [
              "P = V² / R",
              "P = I²R",
              "P = VI",
              "All of the above"
            ],
            correctOption: 3,
            explanation: "Electric power can be expressed as P = VI, P = I²R, or P = V²/R. Therefore, all given options are correct formulations."
          },
          {
            id: 3,
            text: "Which of the following materials is a good conductor of electricity?",
            options: [
              "Copper",
              "Glass",
              "Wood",
              "Rubber"
            ],
            correctOption: 0,
            explanation: "Copper has low resistivity and free mobile electrons, making it an excellent electrical conductor. Glass, wood, and rubber are insulators."
          }
        ]);
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const submitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-xl font-black text-slate-950 dark:text-white">AI Adaptive Quiz Generator</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Generate tailor-made practice tests on specific chapters with granular difficulty metrics</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Left config form */}
        {!questions && (
          <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm self-center">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Quiz Specifications</h3>
            
            <form onSubmit={startQuiz} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Subject / Chapter Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quadratic Equations, Electricity, Laws of Motion"
                  className="w-full rounded-2xl border-0 bg-slate-50 py-2.5 px-3.5 text-xs font-semibold ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Difficulty</label>
                  <select 
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-2xl border-0 bg-slate-50 py-2.5 px-3 text-xs font-bold ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800/50"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Questions Count</label>
                  <select 
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full rounded-2xl border-0 bg-slate-50 py-2.5 px-3 text-xs font-bold ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:ring-slate-800/50"
                  >
                    <option value="3">3 Questions</option>
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-black text-white hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/10"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Generating MCQs...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Begin Quiz Session
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Quiz execution layout */}
        {questions && score === null && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Question viewer */}
            <div className="flex-1 rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md">
                    {difficulty}
                  </span>
                </div>

                <h3 className="mt-6 text-sm font-black text-slate-900 dark:text-white leading-relaxed">
                  {questions[currentIdx].text}
                </h3>

                <div className="mt-6 grid gap-3">
                  {questions[currentIdx].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full rounded-2xl border p-4 text-left text-xs font-semibold transition-all ${
                        answers[currentIdx] === optIdx
                          ? "border-indigo-500 bg-indigo-500/5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                          : "border-slate-100 bg-white hover:border-slate-200 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-655 disabled:opacity-50 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400"
                >
                  Previous
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(answers).length < questions.length}
                    className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md"
                  >
                    Submit Answers
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar quick notes */}
            <div className="w-full md:w-80 shrink-0 rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Topic Covered</h4>
                <div className="rounded-2xl bg-indigo-500/10 p-4 border border-indigo-500/20">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Focus Areas</span>
                  <p className="text-xs font-black text-slate-950 dark:text-white mt-1">{topic}</p>
                </div>
              </div>
              
              <button 
                onClick={() => { if(confirm('Exit quiz? Progress will not be saved.')) setQuestions(null); }}
                className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-950/20"
              >
                Quit Quiz
              </button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {score !== null && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Score review */}
            <div className="flex-1 rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div>
                <div className="text-center py-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
                    <Award size={36} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-slate-950 dark:text-white">Quiz Evaluation Completed</h2>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">You scored {score} out of {questions.length} questions</p>
                </div>

                {/* Score list evaluation */}
                <div className="mt-6 space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="rounded-2xl bg-white/80 dark:bg-slate-950/80 p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{q.text}</h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          answers[idx] === q.correctOption 
                            ? "bg-emerald-500/10 text-emerald-600" 
                            : "bg-rose-500/10 text-rose-600"
                        }`}>
                          {answers[idx] === q.correctOption ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">AI Explanation: </span>
                        {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setQuestions(null)}
                className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
              >
                Create Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
