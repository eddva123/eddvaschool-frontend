import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { 
  Bot, Send, User, Sparkles, MessageCircle, Info, ChevronRight, 
  RotateCcw, ShieldAlert, GraduationCap, Flame, Star, BookOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiTutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I am your AI Socratic Tutor. Let's learn together. What subject or concept are we exploring today? Ask me to explain, quiz you, or guide you through a derivation.",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState('socratic'); // socratic, eli5, coach, rigorous
  const [sessionToken, setSessionToken] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Start session on load or persona switch
  useEffect(() => {
    const startSession = async () => {
      try {
        const res = await api.post('/ai/tutor/session', {
          topicId: 'general-science-math', // Backend expects a topicId UUID or string
          context: `Persona: ${persona}, Subject: General Science & Math`
        });
        if (res.data?.sessionToken) {
          setSessionToken(res.data.sessionToken);
        }
      } catch (err) {
        console.error('Failed to start AI Tutor session, using mock session.', err);
      }
    };
    startSession();
  }, [persona]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Query continue endpoint if session token is available
      const res = await api.post('/ai/tutor/continue', {
        sessionToken: sessionToken || 'mock-token',
        message: input,
        persona: persona
      });

      const responseContent = res.data.response || res.data.content || res.data.message;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseContent
      }]);
    } catch (error) {
      console.error('AI Tutor request failed, falling back to mock dialogue:', error);
      // Fallback Socratic dialogue mock responses based on inputs
      setTimeout(() => {
        let reply = "That is a great observation. What do you think happens if we change the temperature or boundary parameters?";
        if (persona === 'eli5') {
          reply = "Imagine a bunch of tiny bouncy balls inside a balloon. If you heat them up, they bounce around super fast and push the balloon walls outward!";
        } else if (persona === 'coach') {
          reply = "Perfect! That is exactly what board examiners look for. Just make sure to define the standard formula variables first to secure full marks.";
        }
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply
        }]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    "Explain Photosynthesis like I am 5",
    "Help me solve a quadratic equation step-by-step",
    "Quiz me on CBSE Class 10 Light chapters",
    "Explain why the sky is blue using scattering"
  ];

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6 overflow-hidden p-1">
      {/* Left: Persona controls & Session summary */}
      <div className="hidden w-80 shrink-0 flex-col gap-6 lg:flex">
        {/* Persona Selectors */}
        <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Teaching Persona</h3>
          <div className="grid gap-3">
            {[
              { id: 'socratic', name: 'Socratic Guide', desc: 'Asks questions to lead you to the solution.', icon: <GraduationCap size={16} /> },
              { id: 'eli5', name: 'Explain Like I\'m 5', desc: 'Uses simple analogies and everyday terms.', icon: <Flame size={16} /> },
              { id: 'coach', name: 'Exam Coach', desc: 'Focuses on marking schemes and exam questions.', icon: <Star size={16} /> },
              { id: 'rigorous', name: 'Rigorous Academic', desc: 'Detailed mathematical derivations & proofs.', icon: <BookOpen size={16} /> }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPersona(p.id);
                  setMessages([
                    {
                      id: Date.now(),
                      role: 'assistant',
                      content: `I am now in ${p.name} mode. ${p.desc} Let's dive in!`
                    }
                  ]);
                }}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  persona === p.id 
                    ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-sm"
                    : "border-slate-100 bg-white/80 hover:border-slate-200 dark:border-slate-800 dark:bg-slate-950/80"
                }`}
              >
                <div className={`mt-0.5 rounded-lg p-1.5 ${
                  persona === p.id 
                    ? "bg-indigo-500 text-white" 
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}>
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="flex-1 rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">How to interact</h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Our Socratic Tutor program focuses on active recall rather than copy-pasting code or answers. Try writing down your thoughts, even if incorrect, and let the AI guide you.
            </p>
          </div>
          
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800/55">
            <button 
              onClick={() => {
                setMessages([{
                  id: Date.now(),
                  role: 'assistant',
                  content: "Let's restart our session! What are we working on?"
                }]);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200/60 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw size={14} /> Clear Chat Session
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversational Panel */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200/50 bg-white/60 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60">
        {/* Chat header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-950 dark:text-white">EDDVA AI Socratic Tutor</h2>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active session: {persona}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                msg.role === 'user' 
                  ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-955" 
                  : "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className={`flex max-w-[80%] flex-col gap-2 rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white/80 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm"
              }`}>
                <div className="font-semibold whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-white/80 p-4 border border-slate-100 dark:border-slate-800 dark:bg-slate-950/80">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips & Input */}
        <div className="shrink-0 border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="mx-auto max-w-3xl">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(chip);
                    }}
                    className="rounded-xl border border-slate-200/50 bg-white/60 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-indigo-400 dark:border-slate-800/50 dark:bg-slate-900/60 dark:text-slate-300"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your tutor anything..."
                className="w-full rounded-2xl border-0 bg-slate-50 py-3.5 px-4 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-200/50 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:opacity-50 dark:bg-slate-950 dark:text-white dark:ring-slate-800/50 dark:focus:ring-indigo-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
