import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Appearance() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const changeTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1 h-[calc(100vh-7rem)] overflow-hidden">
      {/* Page Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-950 dark:text-white">Appearance & Theme Settings</h1>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Customize the visual theme layout of your EDDVA Student panel</p>
        </div>
        
        <Link 
          to="/student/settings"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350"
        >
          <ArrowLeft size={12} /> Back to Settings
        </Link>
      </div>

      {/* Theme Options */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-w-2xl">
        <div className="rounded-3xl border border-slate-200/50 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60 shadow-sm space-y-6">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Palette size={16} className="text-indigo-500" /> Interface Theme
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Light Mode option */}
            <button
              onClick={() => changeTheme('light')}
              className={`flex flex-col items-center justify-between rounded-2xl border p-6 text-center transition-all ${
                theme === 'light'
                  ? "border-indigo-500 bg-white shadow-md dark:border-indigo-500"
                  : "border-slate-100 bg-white/80 hover:border-slate-200 dark:border-slate-800 dark:bg-slate-950/80"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Sun size={24} />
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Clean Light Theme</h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">High-contrast light interface style</p>
              </div>
              {theme === 'light' && (
                <div className="mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check size={12} />
                </div>
              )}
            </button>

            {/* Dark Mode option */}
            <button
              onClick={() => changeTheme('dark')}
              className={`flex flex-col items-center justify-between rounded-2xl border p-6 text-center transition-all ${
                theme === 'dark'
                  ? "border-indigo-500 bg-white shadow-md dark:border-indigo-500 dark:bg-slate-905"
                  : "border-slate-100 bg-white/80 hover:border-slate-200 dark:border-slate-800 dark:bg-slate-955"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Moon size={24} />
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Modern Obsidian Dark</h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">Sleek dark interface mode for night studies</p>
              </div>
              {theme === 'dark' && (
                <div className="mt-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check size={12} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
