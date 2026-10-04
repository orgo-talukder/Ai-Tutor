'use client';

import React, { useState } from 'react';
import { AppLanguage, GeminiModelId, ThinkingLevelId } from '@/lib/types';
import { X, ArrowLeft, Check, ChevronRight } from 'lucide-react';

interface ClaudeModelBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  selectedModel: GeminiModelId;
  onSelectModel: (model: GeminiModelId) => void;
  selectedThinkingLevel: ThinkingLevelId;
  onSelectThinkingLevel: (level: ThinkingLevelId) => void;
}

export function ClaudeModelBottomSheet({
  isOpen,
  onClose,
  language,
  selectedModel,
  onSelectModel,
  selectedThinkingLevel,
  onSelectThinkingLevel,
}: ClaudeModelBottomSheetProps) {
  const [currentView, setCurrentView] = useState<'main' | 'effort' | 'more'>('main');
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const mainModels: {
    id: GeminiModelId;
    title: string;
    badge?: string;
    badgeColor?: string;
    descEn: string;
    descBn: string;
  }[] = [
    {
      id: 'gemini-3.8-flash',
      title: 'Gemini 3.8 Flash',
      badge: isBn ? 'ডিফল্ট' : 'Default',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      descEn: 'Flagship Flash for deep pedagogical reasoning & fast replies',
      descBn: 'প্রধান ফ্ল্যাশ মডেল · গভীর শিক্ষাদান ও দ্রুত রেসপন্স',
    },
    {
      id: 'gemini-3.7-flash',
      title: 'Gemini 3.7 Flash',
      badge: 'Hybrid',
      badgeColor: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
      descEn: 'Hybrid reasoning with adjustable thinking depth',
      descBn: 'হাইব্রিড চিন্তন ক্ষমতা ও সামঞ্জস্যপূর্ণ রিজনিং',
    },
    {
      id: 'gemini-3.6-flash',
      title: 'Gemini 3.6 Flash',
      badge: 'Fast',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      descEn: 'Balanced reasoning for STEM & math calculations',
      descBn: 'বিজ্ঞান ও গণিতের দ্রুত যৌক্তিক সমাধান',
    },
    {
      id: 'gemini-3.1-pro-preview',
      title: 'Gemini 3.1 Pro',
      badge: 'Pro',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20',
      descEn: 'Advanced multi-step reasoning for university STEM & proofs',
      descBn: 'উচ্চতর গণিত ও বিজ্ঞান গবেষণার জন্য প্রো মডেল',
    },
  ];

  const moreModels: {
    id: GeminiModelId;
    title: string;
    badge?: string;
    descEn: string;
    descBn: string;
  }[] = [
    {
      id: 'gemini-3.1-flash-preview',
      title: 'Gemini 3.1 Flash',
      badge: 'Preview',
      descEn: 'Next-gen ultra low latency flash preview',
      descBn: 'পরবর্তী প্রজন্মের দ্রুত প্রিভিউ মডেল',
    },
    {
      id: 'gemini-2.5-flash',
      title: 'Gemini 2.5 Flash',
      badge: '2.5 Flash',
      descEn: 'Token-budget thinking for lightweight tutoring',
      descBn: 'টোকেন বাজেট থিংকিং সহ দ্রুত রেসপন্স',
    },
  ];

  const effortLevels: {
    id: ThinkingLevelId;
    labelEn: string;
    labelBn: string;
    badge?: string;
    descEn: string;
    descBn: string;
  }[] = [
    {
      id: 'low',
      labelEn: 'Low',
      labelBn: 'Low (কম)',
      descEn: 'Brief thinking for instant responses',
      descBn: 'সংক্ষিপ্ত চিন্তন ও দ্রুত উত্তর',
    },
    {
      id: 'medium',
      labelEn: 'Medium',
      labelBn: 'Medium (মাঝারি)',
      badge: isBn ? 'সুপারিশকৃত' : 'Recommended',
      descEn: 'Balanced reasoning & thorough explanations',
      descBn: 'ভারসাম্যপূর্ণ চিন্তন ও স্পষ্ট ব্যাখ্যা',
    },
    {
      id: 'high',
      labelEn: 'High',
      labelBn: 'High (উচ্চ)',
      descEn: 'Deep step-by-step logic for complex math & STEM',
      descBn: 'গভীর গাণিতিক প্রমাণ ও জটিল যুক্তি',
    },
    {
      id: 'off',
      labelEn: 'Off',
      labelBn: 'Off (বন্ধ)',
      descEn: 'Direct response without internal thinking step',
      descBn: 'অভ্যন্তরীণ চিন্তন ছাড়া সরাসরি উত্তর',
    },
  ];

  const effortCapitalized =
    selectedThinkingLevel.charAt(0).toUpperCase() + selectedThinkingLevel.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => {
          setCurrentView('main');
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet Card */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-[#141416] border-t sm:border border-zinc-200 dark:border-white/[0.1] rounded-t-[28px] sm:rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-slideUp text-zinc-900 dark:text-[#F5F5F5]">
        {/* VIEW 1: SELECT MODEL (MAIN VIEW - EXACT CLAUDE STYLE) */}
        {currentView === 'main' && (
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between relative pb-1">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight absolute left-1/2 -translate-x-1/2">
                {isBn ? 'মডেল নির্বাচন করুন' : 'Select model'}
              </h2>
              <div className="w-8" />
            </div>

            {/* Grouped Models Container (Claude style rounded block) */}
            <div className="bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
              {mainModels.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(m.id);
                      onClose();
                    }}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100/80 dark:bg-white/[0.06]'
                        : 'hover:bg-zinc-100/50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-white tracking-tight">
                          {m.title}
                        </span>
                        {m.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                              m.badgeColor || 'bg-zinc-200 text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300'
                            }`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                        {isBn ? m.descBn : m.descEn}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-indigo-600 dark:text-[#7C8CFF] shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Secondary Rows: Effort & More Models (Claude style) */}
            <div className="bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
              {/* Effort / Thinking Level Row */}
              <button
                type="button"
                onClick={() => setCurrentView('effort')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-100/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  {isBn ? 'চিন্তন গভীরতা (Effort)' : 'Effort'}
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {effortCapitalized}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </button>

              {/* More Models Row */}
              <button
                type="button"
                onClick={() => setCurrentView('more')}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-100/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <div className="text-sm font-medium text-zinc-900 dark:text-white">
                  {isBn ? 'আরও মডেল দেখুন' : 'More models'}
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: EFFORT / THINKING LEVEL (SUB-SHEET - SCREENSHOT 3) */}
        {currentView === 'effort' && (
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto animate-fadeIn">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between relative pb-1">
              <button
                type="button"
                onClick={() => setCurrentView('main')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight absolute left-1/2 -translate-x-1/2">
                {isBn ? 'চিন্তন গভীরতা (Effort)' : 'Effort'}
              </h2>
              <div className="w-8" />
            </div>

            {/* Effort Options Grouped Container */}
            <div className="bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
              {effortLevels.map((lvl) => {
                const isSelected = selectedThinkingLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      onSelectThinkingLevel(lvl.id);
                      setCurrentView('main');
                    }}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100/80 dark:bg-white/[0.06]'
                        : 'hover:bg-zinc-100/50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                          {isBn ? lvl.labelBn : lvl.labelEn}
                        </span>
                        {lvl.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-200 text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300">
                            {lvl.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                        {isBn ? lvl.descBn : lvl.descEn}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-indigo-600 dark:text-[#7C8CFF] shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Claude-style footer helper note */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-1">
              {isBn
                ? 'উচ্চ চিন্তন গভীরতায় মডেলটি সমস্যার প্রতিটি ধাপ পুঙ্খানুপুঙ্খভাবে চিন্তা করে উত্তর প্রদান করে।'
                : 'Higher effort means more thorough responses and deeper step-by-step logic.'}
            </p>
          </div>
        )}

        {/* VIEW 3: MORE MODELS SUB-SHEET */}
        {currentView === 'more' && (
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto animate-fadeIn">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between relative pb-1">
              <button
                type="button"
                onClick={() => setCurrentView('main')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight absolute left-1/2 -translate-x-1/2">
                {isBn ? 'অন্যান্য মডেল' : 'More models'}
              </h2>
              <div className="w-8" />
            </div>

            <div className="bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
              {moreModels.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(m.id);
                      onClose();
                    }}
                    className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100/80 dark:bg-white/[0.06]'
                        : 'hover:bg-zinc-100/50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                          {m.title}
                        </span>
                        {m.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-zinc-200 text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                        {isBn ? m.descBn : m.descEn}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-indigo-600 dark:text-[#7C8CFF] shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
