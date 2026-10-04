'use client';

import React, { useState } from 'react';
import {
  AppSettings,
  DEFAULT_SETTINGS,
  ExplanationDetailPreference,
  ResponseLanguagePreference,
  ThemePreference,
} from '@/lib/settings';
import { AcademicLevel, AppLanguage, SubjectArea, TeachingMode } from '@/lib/types';
import {
  X,
  ArrowLeft,
  Sliders,
  Palette,
  Globe,
  GraduationCap,
  BookOpen,
  MessageSquare,
  FileBox,
  Accessibility,
  ShieldCheck,
  Info,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';

interface SettingsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetSettings: () => void;
  onClearSession: () => void;
}

type SettingsSectionId =
  | 'general'
  | 'appearance'
  | 'language'
  | 'tutor'
  | 'learning'
  | 'chat'
  | 'files'
  | 'accessibility'
  | 'privacy'
  | 'about';

export function SettingsCenterModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
  onClearSession,
}: SettingsCenterModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [mobileDetailView, setMobileDetailView] = useState<boolean>(false);

  if (!isOpen) return null;

  const isBn = settings.interfaceLanguage === 'bn';

  const navItems: {
    id: SettingsSectionId;
    labelEn: string;
    labelBn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'general',
      labelEn: 'General',
      labelBn: 'সাধারণ (General)',
      icon: <Sliders className="w-4 h-4" />,
    },
    {
      id: 'appearance',
      labelEn: 'Appearance',
      labelBn: 'থিম ও রূপ (Appearance)',
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: 'language',
      labelEn: 'Language',
      labelBn: 'ভাষা (Language)',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      id: 'tutor',
      labelEn: 'Tutor Preferences',
      labelBn: 'টিউটর সেটিংস (Tutor)',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'learning',
      labelEn: 'Learning Preferences',
      labelBn: 'শেখার পছন্দ (Learning)',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'chat',
      labelEn: 'Chat & Composer',
      labelBn: 'চ্যাট ও কম্পোজার (Chat)',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'files',
      labelEn: 'Files & Media',
      labelBn: 'ফাইল ও মিডিয়া (Files)',
      icon: <FileBox className="w-4 h-4" />,
    },
    {
      id: 'accessibility',
      labelEn: 'Accessibility',
      labelBn: 'অ্যাক্সেসিবিলিটি (Accessibility)',
      icon: <Accessibility className="w-4 h-4" />,
    },
    {
      id: 'privacy',
      labelEn: 'Privacy & Data',
      labelBn: 'প্রাইভেসি ও সেশন (Privacy)',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'about',
      labelEn: 'About',
      labelBn: 'অ্যাপ সম্পর্কে (About)',
      icon: <Info className="w-4 h-4" />,
    },
  ];

  const currentNav = navItems.find((n) => n.id === activeSection) || navItems[0];

  const handleResetConfirm = () => {
    if (
      window.confirm(
        isBn
          ? 'আপনি কি নিশ্চিত যে সকল সেটিংস ডিফল্টে রিসেট করতে চান?'
          : 'Are you sure you want to reset all settings to defaults?'
      )
    ) {
      onResetSettings();
    }
  };

  const handleClearSessionConfirm = () => {
    if (
      window.confirm(
        isBn
          ? 'বর্তমান চ্যাট সেশন ও ফাইলসমূহ মুছে ফেলতে চান?'
          : 'Clear the current conversation and session files?'
      )
    ) {
      onClearSession();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 md:p-6 animate-fadeIn">
      {/* Container Dialog */}
      <div className="relative w-full h-full sm:max-w-4xl sm:h-[85vh] sm:max-h-[720px] bg-white dark:bg-[#121215] text-zinc-900 dark:text-[#F5F5F5] border border-zinc-200 dark:border-white/[0.08] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 px-4 sm:px-6 border-b border-zinc-200 dark:border-white/[0.08] flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-[#18181C]/50">
          <div className="flex items-center gap-2.5">
            {mobileDetailView && (
              <button
                type="button"
                onClick={() => setMobileDetailView(false)}
                className="md:hidden p-1.5 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg cursor-pointer"
                aria-label="Back to settings list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="font-semibold text-base tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-[#7C8CFF]" />
              {isBn ? 'সেটিংস সেন্টার' : 'Settings Center'}
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Main Body: Desktop 2-Column vs Mobile Drill-Down */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Sidebar (Hidden on mobile when in detail view) */}
          <nav
            className={`w-full md:w-64 border-r border-zinc-200 dark:border-white/[0.08] p-3 overflow-y-auto space-y-1 bg-zinc-50/30 dark:bg-[#141417]/30 shrink-0 ${
              mobileDetailView ? 'hidden md:block' : 'block'
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileDetailView(true);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-inherit' : 'text-zinc-400'}>{item.icon}</span>
                  <span className="truncate">{isBn ? item.labelBn : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Content Area (Hidden on mobile when in list view) */}
          <main
            className={`flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 ${
              !mobileDetailView ? 'hidden md:block' : 'block'
            }`}
          >
            {/* Section Header */}
            <div className="pb-3 border-b border-zinc-200 dark:border-white/[0.08]">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
                {isBn ? currentNav.labelBn : currentNav.labelEn}
              </h2>
            </div>

            {/* SECTION: GENERAL */}
            {activeSection === 'general' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'সেশন ক্লিয়ার করার আগে নিশ্চিতকরণ' : 'Confirm before clearing session'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'নতুন চ্যাট শুরু বা ক্লিয়ার করার সময় ওয়ার্নিং দেখাবে' : 'Show confirmation prompt before wiping conversation'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.confirmBeforeClearSession}
                    onChange={(e) => onUpdateSettings({ confirmBeforeClearSession: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'স্বাগত প্রম্পট সাজেশন প্রদর্শন' : 'Show welcome suggestions'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'নতুন চ্যাট শুরু করার সময় কুইক টপিক পিল প্রদর্শন করবে' : 'Display lightweight quick prompt chips on empty chat'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showWelcomeSuggestions}
                    onChange={(e) => onUpdateSettings({ showWelcomeSuggestions: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* SECTION: APPEARANCE */}
            {activeSection === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                    {isBn ? 'থিম নির্বাচন (Theme)' : 'Theme'}
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['dark', 'light', 'system'] as ThemePreference[]).map((themeOpt) => {
                      const isSelected = settings.theme === themeOpt;
                      const label =
                        themeOpt === 'dark'
                          ? isBn
                            ? 'ডার্ক (Dark)'
                            : 'Dark'
                          : themeOpt === 'light'
                          ? isBn
                            ? 'লাইট (Light)'
                            : 'Light'
                          : isBn
                          ? 'সিস্টেম (System)'
                          : 'System';

                      return (
                        <button
                          key={themeOpt}
                          type="button"
                          onClick={() => onUpdateSettings({ theme: themeOpt })}
                          className={`p-3.5 rounded-2xl border text-center font-medium text-xs sm:text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                              : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/[0.2]'
                          }`}
                        >
                          <span>{label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: LANGUAGE */}
            {activeSection === 'language' && (
              <div className="space-y-4">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  {isBn ? 'ইন্টারফেস ভাষা (Interface Language)' : 'Interface Language'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'bn' as AppLanguage, title: 'বাংলা (Bengali)' },
                    { id: 'en' as AppLanguage, title: 'English (US)' },
                  ].map((langOpt) => {
                    const isSelected = settings.interfaceLanguage === langOpt.id;
                    return (
                      <button
                        key={langOpt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ interfaceLanguage: langOpt.id })}
                        className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                            : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/[0.2]'
                        }`}
                      >
                        <span>{langOpt.title}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION: TUTOR PREFERENCES */}
            {activeSection === 'tutor' && (
              <div className="space-y-5">
                {/* AI Response Language */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {isBn ? 'টিউটরের উত্তরের ভাষা (Response Language)' : 'Tutor Response Language'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'auto' as ResponseLanguagePreference, labelEn: 'Automatic', labelBn: 'অটো (স্বয়ংক্রিয়)' },
                      { id: 'bn' as ResponseLanguagePreference, labelEn: 'বাংলা', labelBn: 'বাংলা' },
                      { id: 'en' as ResponseLanguagePreference, labelEn: 'English', labelBn: 'English' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ responseLanguage: opt.id })}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                          settings.responseLanguage === opt.id
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-semibold'
                            : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {isBn ? opt.labelBn : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Teaching Mode */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {isBn ? 'ডিফল্ট টিচিং পদ্ধতি (Default Teaching Mode)' : 'Default Teaching Approach'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'socratic' as TeachingMode, labelEn: 'Socratic Inquiry', labelBn: 'সক্রেটিক প্রশ্নপদ্ধতি' },
                      { id: 'worked_solution' as TeachingMode, labelEn: 'Step-by-Step Derivation', labelBn: 'ধাপে ধাপে সমাধান' },
                      { id: 'check_answer' as TeachingMode, labelEn: 'Check Answer & Fix Mistakes', labelBn: 'সমাধান ও ভুল যাচাই' },
                      { id: 'simplify' as TeachingMode, labelEn: 'Simpler Everyday Analogy', labelBn: 'সহজ বাস্তব উপমা' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ defaultTutorMode: opt.id })}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                          settings.defaultTutorMode === opt.id
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-semibold'
                            : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        <span>{isBn ? opt.labelBn : opt.labelEn}</span>
                        {settings.defaultTutorMode === opt.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Explanation Detail */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {isBn ? 'ব্যাখ্যার গভীরতা (Detail Level)' : 'Explanation Detail'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'concise' as ExplanationDetailPreference, labelEn: 'Concise', labelBn: 'সংক্ষিপ্ত' },
                      { id: 'standard' as ExplanationDetailPreference, labelEn: 'Standard', labelBn: 'স্বাভাবিক' },
                      { id: 'detailed' as ExplanationDetailPreference, labelEn: 'Detailed', labelBn: 'বিস্তারিত' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ explanationDetail: opt.id })}
                        className={`p-2 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                          settings.explanationDetail === opt.id
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-semibold'
                            : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {isBn ? opt.labelBn : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl">
                    <span className="text-xs font-medium text-zinc-900 dark:text-white">
                      {isBn ? 'বাস্তব জীবনের উদাহরণ যোগ করা' : 'Include real-world examples'}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.useRealWorldExamples}
                      onChange={(e) => onUpdateSettings({ useRealWorldExamples: e.target.checked })}
                      className="w-4 h-4 accent-[#7C8CFF] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl">
                    <span className="text-xs font-medium text-zinc-900 dark:text-white">
                      {isBn ? 'বোঝার গভীরতা যাচাইয়ের প্রশ্ন করা' : 'Ask understanding-check questions'}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.askUnderstandingChecks}
                      onChange={(e) => onUpdateSettings({ askUnderstandingChecks: e.target.checked })}
                      className="w-4 h-4 accent-[#7C8CFF] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-xl">
                    <span className="text-xs font-medium text-zinc-900 dark:text-white">
                      {isBn ? 'সাধারণ ভুলগুলো ধরিয়ে দেওয়া' : 'Highlight common mistakes'}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.showCommonMistakes}
                      onChange={(e) => onUpdateSettings({ showCommonMistakes: e.target.checked })}
                      className="w-4 h-4 accent-[#7C8CFF] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: LEARNING PREFERENCES */}
            {activeSection === 'learning' && (
              <div className="space-y-5">
                {/* Academic Level */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {isBn ? 'শিক্ষা স্তর (Academic Level)' : 'Academic Level'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'school' as AcademicLevel, labelEn: 'School', labelBn: 'স্কুল' },
                      { id: 'college' as AcademicLevel, labelEn: 'College', labelBn: 'কলেজ' },
                      { id: 'university' as AcademicLevel, labelEn: 'University', labelBn: 'বিশ্ববিদ্যালয়' },
                      { id: 'self_learner' as AcademicLevel, labelEn: 'Self Learner', labelBn: 'স্ব-শিক্ষার্থী' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ academicLevel: opt.id })}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                          settings.academicLevel === opt.id
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-semibold'
                            : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {isBn ? opt.labelBn : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Subject Area */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {isBn ? 'ডিফল্ট বিষয় (Default Subject)' : 'Default Subject Area'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'general' as SubjectArea, labelEn: 'All / General', labelBn: 'সকল বিষয়' },
                      { id: 'physics' as SubjectArea, labelEn: 'Physics', labelBn: 'পদার্থবিজ্ঞান' },
                      { id: 'math' as SubjectArea, labelEn: 'Mathematics', labelBn: 'গণিত' },
                      { id: 'chemistry' as SubjectArea, labelEn: 'Chemistry', labelBn: 'রসায়ন' },
                      { id: 'biology' as SubjectArea, labelEn: 'Biology', labelBn: 'জীববিজ্ঞান' },
                      { id: 'cs' as SubjectArea, labelEn: 'Computer Science', labelBn: 'কম্পিউটার সায়েন্স' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ defaultSubject: opt.id })}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                          settings.defaultSubject === opt.id
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-semibold'
                            : 'bg-zinc-50 dark:bg-[#18181C] text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-white/[0.08]'
                        }`}
                      >
                        {isBn ? opt.labelBn : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: CHAT & COMPOSER */}
            {activeSection === 'chat' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'এন্টার চেপে মেসেজ পাঠানো' : 'Press Enter to Send'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'Shift + Enter চাপলে নতুন লাইন তৈরি হবে' : 'Use Shift+Enter for a new line'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enterToSend}
                    onChange={(e) => onUpdateSettings({ enterToSend: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'মেসেজের সময় (Timestamps) প্রদর্শন' : 'Show Message Timestamps'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'প্রতিটি বার্তার সাথে সময় উল্লেখ থাকবে' : 'Display exact time next to messages'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTimestamps}
                    onChange={(e) => onUpdateSettings({ showTimestamps: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* SECTION: FILES & MEDIA */}
            {activeSection === 'files' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'ডকুমেন্ট ও PDF আপলোড' : 'Enable Document & PDF Uploads'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'PDF, DOCX, TXT ফাইল প্রসেসিং' : 'Support text and research documents'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableDocuments}
                    onChange={(e) => onUpdateSettings({ enableDocuments: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'ছবি ও ডায়াগ্রাম আপলোড' : 'Enable Image & Diagram Uploads'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'ভিজ্যুয়াল সমস্যা ও চিত্রের ব্যাখ্যা' : 'Analyze graphs and handwritten formulas'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableImages}
                    onChange={(e) => onUpdateSettings({ enableImages: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'অডিও ও ভিডিও লেকচার ফাইল' : 'Enable Audio & Video Uploads'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'ক্লাস রেকর্ডিং ও ভিডিও থেকে শেখা' : 'Multimodal understanding of recordings'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableAudio && settings.enableVideo}
                    onChange={(e) =>
                      onUpdateSettings({ enableAudio: e.target.checked, enableVideo: e.target.checked })
                    }
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* SECTION: ACCESSIBILITY */}
            {activeSection === 'accessibility' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'অ্যানিমেশন কমান (Reduce Motion)' : 'Reduce Motion'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'স্ক্রিন ট্রানজিশন হালকা করবে' : 'Minimize sliding animations and transitions'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.reduceMotion}
                    onChange={(e) => onUpdateSettings({ reduceMotion: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'উচ্চ কনট্রাস্ট বর্ডার (High Contrast)' : 'High Contrast Borders'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'টেক্সট ও উপাদানের স্পষ্টতা বাড়াবে' : 'Sharpen borders and outlines for readability'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => onUpdateSettings({ highContrast: e.target.checked })}
                    className="w-4.5 h-4.5 accent-[#7C8CFF] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* SECTION: PRIVACY & DATA PERSISTENCE */}
            {activeSection === 'privacy' && (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{isBn ? 'নিরাপত্তা ও ডাটাবেজ পারসিস্টেন্স' : 'Security & Database Isolation'}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {isBn
                      ? 'আপনার সমস্ত চ্যাট ও সেটিংস ক্লাউড ফায়ারস্টোর ডেটাবেজে সম্পূর্ণ সুরক্ষিত ও আইসোলেটেড থাকে। অন্য কোনো ইউজার আপনার তথ্য অ্যাক্সেস করতে পারে না। আপনি যেকোনো সময় আপনার সমস্ত ডেটা ডাউনলোড বা মুছে ফেলতে পারেন।'
                      : 'Your chats and settings are securely isolated in Cloud Firestore under strict ownership rules. No other user can access your private learning history. You can export or delete your data at any time.'}
                  </p>
                </div>

                {/* Export Data */}
                <div className="p-4 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'আমার ডাটা ডাউনলোড করুন (Export Data)' : 'Export My Data'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {isBn ? 'আপনার সমস্ত চ্যাট ও সেটিংসের JSON ব্যাকআপ ডাউনলোড করুন' : 'Download a full JSON archive of your chats and settings'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const dataStr = JSON.stringify({ settings, exportedAt: new Date().toISOString() }, null, 2);
                      const blob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ai-tutor-data-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isBn ? 'ডাউনলোড' : 'Export'}
                  </button>
                </div>

                {/* Clear Session */}
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
                      {isBn ? 'বর্তমান সেশন ক্লিয়ার করুন' : 'Clear Current Session'}
                    </div>
                    <div className="text-[11px] text-rose-500/80 dark:text-rose-400/80 mt-0.5">
                      {isBn ? 'বর্তমান চ্যাট এবং সেশন মেমোরি মুছে ফেলুন' : 'Wipe all active messages immediately'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearSessionConfirm}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isBn ? 'ক্লিয়ার করুন' : 'Clear'}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION: ABOUT & RESET (NO VERSION NUMBER PER USER INSTRUCTION) */}
            {activeSection === 'about' && (
              <div className="space-y-5">
                <div className="p-5 bg-zinc-50 dark:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C8CFF] to-indigo-600 flex items-center justify-center text-white shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                        {isBn ? 'থিঙ্কওয়াইজ এআই' : 'ThinkWise AI'}
                      </h3>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {isBn ? 'ইন্টেলিজেন্ট সায়েন্স ও ম্যাথমেটিক্স টিউটরিং প্ল্যাটফর্ম' : 'Interactive STEM Learning & Pedagogical Platform'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {isBn
                      ? 'থিঙ্কওয়াইজ এআই একটি আধুনিক পেডাগজিক্যাল লার্নিং প্ল্যাটফর্ম যা সক্রিয় চিন্তা (Active Learning), সক্রেটিক প্রশ্নপদ্ধতি এবং ধাপে ধাপে গাণিতিক ব্যাখ্যার মাধ্যমে শিক্ষার্থীদের গভীর ধারণা অর্জনে সহায়তা করে।'
                      : 'ThinkWise AI is built for genuine conceptual mastery using inquiry-driven pedagogy, active recall, Socratic dialogue, and verified multi-step derivations.'}
                  </p>
                </div>

                {/* Reset Settings Button */}
                <div className="pt-2 border-t border-zinc-200 dark:border-white/[0.08] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {isBn ? 'সকল সেটিংস ডিফল্ট করুন' : 'Reset All Settings'}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {isBn ? 'অ্যাপের সকল কনফিগারেশন ফ্যাক্টরি ডিফল্টে ফিরবে' : 'Restore all configurations to their original defaults'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetConfirm}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
