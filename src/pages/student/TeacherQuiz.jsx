import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  ClipboardList, Clock, Calendar, HelpCircle, ArrowRight, 
  Award, Play, CheckCircle2, ChevronRight, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherQuiz() {
  const [assignedQuizzes, setAssignedQuizzes] = useState([
    {
      id: 101,
      title: 'Class 10 Physics: Light - Reflection and Refraction',
      subject: 'Science (Physics)',
      teacher: 'Mrs. Anjali Sharma',
      durationMinutes: 15,
      questionsCount: 5,
      dueDate: 'June 5, 2026',
      status: 'pending',
      questions: [
        {
          text: "Which type of mirror is commonly used as a rear-view mirror in vehicles to provide a wider field of view?",
          options: ["Convex mirror", "Concave mirror", "Plane mirror", "Double concave mirror"],
          correctOption: 0
        },
        {
          text: "The power of a lens of focal length 1 meter is defined as:",
          options: ["1 Dioptre", "2 Dioptre", "0.5 Dioptre", "10 Dioptre"],
          correctOption: 0
        }
      ]
    },
    {
      id: 102,
      title: 'Class 10 Mathematics: Quadratic Equations',
      subject: 'Mathematics',
      teacher: 'Mr. Rajesh Anand',
      durationMinutes: 20,
      questionsCount: 10,
      dueDate: 'June 7, 2026',
      status: 'pending',
      questions: [
        {
          text: "What is the discriminant of the quadratic equation ax² + bx + c = 0?",
          options: ["b² - 4ac", "b² + 4ac", "4ac - b²", "√b² - 4ac"],
          correctOption: 0
        },
        {
          text: "If the discriminant (D) of a quadratic equation is greater than zero (D > 0), the roots of the equation are:",
          options: ["Real and distinct", "Real and equal", "No real roots", "Imaginary"],
          correctOption: 0
        }
      ]
    },
    {
      id: 103,
      title: 'Class 10 Chemistry: Acids, Bases and Salts',
      subject: 'Science (Chemistry)',
      teacher: 'Mrs. Sunita Verma',
      durationMinutes: 30,
      questionsCount: 15,
      dueDate: 'May 25, 2026',
      status: 'completed',
      score: 12,
      total: 15
    }
  ]);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    let timer;
    if (activeQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitTeacherQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setQuizFinished(false);
  };

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const submitTeacherQuiz = async () => {
    setQuizFinished(true);
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) {
        correctCount++;
      }
    });

    try {
      await api.post(`/students/quizzes/${activeQuiz.id}/submit`, {
        score: correctCount,
        total: activeQuiz.questions.length
      });
    } catch (err) {
      console.error('Failed to report score to backend, completing offline:', err);
    }

    setAssignedQuizzes(prev => prev.map(q => {
      if (q.id === activeQuiz.id) {
        return { ...q, status: 'completed', score: correctCount, total: q.questions.length };
      }
      return q;
    }));
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0">
        <h1 className="text-xl font-black text-slate-950 dark:text-white">Assigned Quizzes</h1>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Take official assessments and quizzes assigned by your subject instructors</p>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Quiz list - displayed when no quiz is active */}
        {!activeQuiz && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assignedQuizzes.map((quiz) => (
                <div 
                  key={quiz.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 hover:shadow-md transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                        {quiz.subject}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        quiz.status === 'completed' 
                          ? "bg-emerald-500/10 text-emerald-600" 
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {quiz.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xs font-black text-slate-900 dark:text-white leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">Assigned by {quiz.teacher}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{quiz.durationMinutes} Mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HelpCircle size={12} />
                        <span>{quiz.questionsCount} MCQs</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/50">
                    {quiz.status === 'completed' ? (
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                        <span>Result Score:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{quiz.score} / {quiz.total}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                          <Calendar size={12} /> Due: {quiz.dueDate}
                        </span>
                        <button 
                          onClick={() => startQuiz(quiz)}
                          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
                        >
                          <Play size={12} /> Start
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Quiz layout */}
        {activeQuiz && !quizFinished && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Main Question view */}
            <div className="flex-1 rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Question {currentIdx + 1} of {activeQuiz.questions.length}
                  </span>
                  
                  {/* Timer */}
                  <div className="flex items-center gap-1.5 bg-rose-500/10 px-3 py-1 rounded-full text-rose-600 dark:text-rose-400">
                    <Clock size={12} className="animate-pulse" />
                    <span className="text-xs font-bold">{formatTimer(timeLeft)}</span>
                  </div>
                </div>

                <h3 className="mt-6 text-sm font-black text-slate-900 dark:text-white leading-relaxed">
                  {activeQuiz.questions[currentIdx].text}
                </h3>

                <div className="mt-6 grid gap-3">
                  {activeQuiz.questions[currentIdx].options.map((opt, optIdx) => (
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
                {currentIdx < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={submitTeacherQuiz}
                    className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
                  >
                    Finish Test
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar info */}
            <div className="w-full md:w-80 shrink-0 rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 font-black">Instructors Info</h4>
                <div className="rounded-2xl bg-indigo-500/10 p-4 border border-indigo-500/20">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Subject Class</span>
                  <p className="text-xs font-black text-slate-955 dark:text-white mt-1">{activeQuiz.title}</p>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mt-4">Instructor</span>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-350 mt-1">{activeQuiz.teacher}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post-submission success message */}
        {quizFinished && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-slate-200/50">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="mt-4 text-lg font-black text-slate-950 dark:text-white">Assigned Quiz Submitted!</h2>
            <p className="text-xs font-medium text-slate-550 dark:text-slate-400 mt-2 max-w-xs">Your responses have been successfully logged. The subject instructor will review the accuracy metrics shortly.</p>
            <button 
              onClick={() => setActiveQuiz(null)}
              className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black"
            >
              Back to Quizzes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
