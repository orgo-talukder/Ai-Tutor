'use client';

import React from 'react';
import { AppLanguage, TeachingMode } from '@/lib/types';
import { BookOpen, Moon, Sun, RotateCcw, Bookmark, Sparkles } from 'lucide-react';

interface TopNavbarProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  activeTab: 'chat' | 'quiz' | 'teach_back' | 'scratchpad';
  onTabChange: (tab: 'chat' | 'quiz' | 'teach_back' | 'scratchpad') => void;
  currentMode: TeachingMode;
  onModeChange: (mode: TeachingMode) => void;
  onNewSession: () => void;
  savedNotesCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function TopNavbar({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  currentMode,
  onModeChange,
  onNewSession,
  savedNotesCount,
  isDark,
  onToggleTheme,
}: TopNavbarProps) {
  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('chat')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                {isBn ? 'এআই টিউটর' : 'AI Tutor'}
                <span className="text-[10px] uppercase font-mono font-medium px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  3.8
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single line, text with hover underlines) */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              onTabChange('chat');
              onModeChange('socratic');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'chat' && currentMode === 'socratic'
                ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {isBn ? 'সক্রেটিক টিউটর' : 'Socratic Tutor'}
          </button>

          <button
            onClick={() => {
              onTabChange('chat');
              onModeChange('worked_solution');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'chat' && currentMode === 'worked_solution'
                ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {isBn ? 'সমাধান পদ্ধতি' : 'Worked Solutions'}
          </button>

          <button
            onClick={() => onTabChange('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'quiz'
                ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {isBn ? 'অনুশীলন কুইজ' : 'Diagnostic Quiz'}
          </button>

          <button
            onClick={() => onTabChange('teach_back')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'teach_back'
                ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {isBn ? 'নিজে বোঝাও (Teach-Back)' : 'Teach-Back Lab'}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Language, Scratchpad, New Session, Theme) */}
        <div className="flex items-center gap-2">
          {/* Scratchpad note button */}
          <button
            onClick={() => onTabChange('scratchpad')}
            title={isBn ? 'স্টাডি নোটস ও সূত্র' : 'Study Notes & Formulas'}
            className={`relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              activeTab === 'scratchpad' ? 'bg-slate-100 dark:bg-slate-800 text-sky-600' : ''
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {savedNotesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedNotesCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(isBn ? 'en' : 'bn')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 transition-colors"
            title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            {isBn ? 'English' : 'বাংলা'}
          </button>

          {/* New Session button */}
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title={isBn ? 'নতুন সেশন শুরু করুন' : 'Start Fresh Learning Session'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBn ? 'নতুন সেশন' : 'New Session'}</span>
          </button>

          {/* Dark/Light mode toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 overflow-x-auto gap-2 text-xs">
        <button
          onClick={() => {
            onTabChange('chat');
            onModeChange('socratic');
          }}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'chat' && currentMode === 'socratic'
              ? 'bg-sky-600 text-white font-medium'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isBn ? 'সক্রেটিক' : 'Socratic'}
        </button>
        <button
          onClick={() => {
            onTabChange('chat');
            onModeChange('worked_solution');
          }}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'chat' && currentMode === 'worked_solution'
              ? 'bg-sky-600 text-white font-medium'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isBn ? 'সমাধান' : 'Worked Steps'}
        </button>
        <button
          onClick={() => onTabChange('quiz')}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-sky-600 text-white font-medium'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isBn ? 'কুইজ' : 'Quiz'}
        </button>
        <button
          onClick={() => onTabChange('teach_back')}
          className={`px-3 py-1 rounded-full whitespace-nowrap ${
            activeTab === 'teach_back'
              ? 'bg-sky-600 text-white font-medium'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          {isBn ? 'বোঝাও' : 'Teach-Back'}
        </button>
      </div>
    </header>
  );
}
