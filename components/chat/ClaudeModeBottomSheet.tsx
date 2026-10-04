'use client';

import React from 'react';
import { AppLanguage, TeachingMode } from '@/lib/types';
import { X, Check, Compass, CheckCircle2, GraduationCap, Lightbulb } from 'lucide-react';

interface ClaudeModeBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  currentMode: TeachingMode;
  onSelectMode: (mode: TeachingMode) => void;
}

export function ClaudeModeBottomSheet({
  isOpen,
  onClose,
  language,
  currentMode,
  onSelectMode,
}: ClaudeModeBottomSheetProps) {
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const modes: {
    id: TeachingMode;
    labelEn: string;
    labelBn: string;
    descEn: string;
    descBn: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'socratic',
      labelEn: 'Socratic Tutor',
      labelBn: 'সক্রেটিক টিউটর',
      descEn: 'Guides through inquiry & questions to build understanding',
      descBn: 'প্রশ্ন ও ধারণার মাধ্যমে নিজে ভাবতে শেখা',
      icon: <Compass className="w-4.5 h-4.5 text-[#7C8CFF]" />,
    },
    {
      id: 'worked_solution',
      labelEn: 'Step-by-Step Derivation',
      labelBn: 'ধাপে ধাপে সমাধান',
      descEn: 'Formal mathematical derivation with formula checks',
      descBn: 'স্পষ্ট গাণিতিক ধাপ এবং সূত্রের সঠিক সমাধান',
      icon: <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />,
    },
    {
      id: 'check_answer',
      labelEn: 'Check My Answer',
      labelBn: 'সমাধান যাচাই',
      descEn: 'Diagnoses calculation mistakes & misconceptions',
      descBn: 'ভুল ও বিভ্রান্তি শনাক্ত করে সঠিক সমাধান শেখা',
      icon: <GraduationCap className="w-4.5 h-4.5 text-indigo-500" />,
    },
    {
      id: 'simplify',
      labelEn: 'Simpler Analogy',
      labelBn: 'সহজ উপমা',
      descEn: 'Everyday analogies with zero intimidating jargon',
      descBn: 'দৈনন্দিন উপমায় সহজ ব্যাখ্যা',
      icon: <Lightbulb className="w-4.5 h-4.5 text-amber-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet Card */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-[#141416] border-t sm:border border-zinc-200 dark:border-white/[0.1] rounded-t-[28px] sm:rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-slideUp text-zinc-900 dark:text-[#F5F5F5]">
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
              {isBn ? 'টিচিং মোড নির্বাচন' : 'Select teaching mode'}
            </h2>
            <div className="w-8" />
          </div>

          {/* Grouped Modes Container (Claude style rounded block) */}
          <div className="bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
            {modes.map((m) => {
              const isSelected = currentMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectMode(m.id);
                    onClose();
                  }}
                  className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100/80 dark:bg-white/[0.06]'
                      : 'hover:bg-zinc-100/50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="mt-0.5 shrink-0">{m.icon}</div>
                    <div className="min-w-0">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-white tracking-tight">
                        {isBn ? m.labelBn : m.labelEn}
                      </span>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                        {isBn ? m.descBn : m.descEn}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-5 h-5 text-indigo-600 dark:text-[#7C8CFF] shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
