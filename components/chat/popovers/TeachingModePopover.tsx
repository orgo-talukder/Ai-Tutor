'use client';

import React from 'react';
import { AppLanguage, TeachingMode } from '@/lib/types';
import { ComposerPopover } from '@/components/ui/ComposerPopover';
import {
  Compass,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Check,
} from 'lucide-react';

interface TeachingModePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  currentMode: TeachingMode;
  onSelectMode: (mode: TeachingMode) => void;
}

export function TeachingModePopover({
  isOpen,
  onClose,
  language,
  currentMode,
  onSelectMode,
}: TeachingModePopoverProps) {
  const isBn = language === 'bn';

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
      descEn: 'Guide me with questions and hints',
      descBn: 'প্রশ্ন ও ইঙ্গিতের মাধ্যমে নিজেই বুঝতে সাহায্য করবে',
      icon: <Compass className="w-4 h-4 text-[#7C8CFF]" />,
    },
    {
      id: 'worked_solution',
      labelEn: 'Step-by-Step Derivation',
      labelBn: 'ধাপে ধাপে সমাধান',
      descEn: 'Show full verified reasoning path',
      descBn: 'প্রতিটি গাণিতিক ধাপ ও সূত্রের পূর্ণ বিশ্লেষণ',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'check_answer',
      labelEn: 'Check My Work & Errors',
      labelBn: 'সমাধান ও ভুল নির্ণয়',
      descEn: 'Diagnose misconceptions & verify answer',
      descBn: 'আপনার সমাধান যাচাই ও ভুল শুধরে দেবে',
      icon: <GraduationCap className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'simplify',
      labelEn: 'Simpler Everyday Analogy',
      labelBn: 'সহজ বাস্তব উপমা',
      descEn: 'Explain with relatable real-world examples',
      descBn: 'জটিল ধারণাগুলোকে সহজ বাস্তব উদাহরণে বোঝাবে',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'quiz',
      labelEn: 'Diagnostic Concept Quiz',
      labelBn: 'ডায়াগনস্টিক কুইজ',
      descEn: 'Test and reinforce understanding',
      descBn: 'ধারণার গভীরতা যাচাইয়ে ছোট কুইজ',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'teach_back',
      labelEn: 'Teach-Back Mode',
      labelBn: 'টিচ-ব্যাক ল্যাব',
      descEn: 'Explain it back to master the topic',
      descBn: 'নিজের ভাষায় শিক্ষককে বুঝিয়ে মাস্টার হোন',
      icon: <Sparkles className="w-4 h-4 text-pink-500" />,
    },
  ];

  return (
    <ComposerPopover
      isOpen={isOpen}
      onClose={onClose}
      widthClass="w-72 sm:w-80"
      ariaLabel={isBn ? 'টিচিং মোড নির্বাচন' : 'Teaching mode selection'}
    >
      <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-white/[0.06] mb-1">
        {isBn ? 'টিচিং পদ্ধতি' : 'Teaching Mode'}
      </div>

      <div className="space-y-0.5">
        {modes.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="menuitemradio"
              aria-checked={isSelected}
              onClick={() => {
                onSelectMode(mode.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[8px] text-left transition-colors cursor-pointer focus:outline-none ${
                isSelected
                  ? 'bg-black/[0.06] dark:bg-white/[0.08] text-zinc-900 dark:text-white font-medium'
                  : 'text-zinc-700 dark:text-[#F5F5F5] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] focus:bg-black/[0.04] dark:focus:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-[#222225] flex items-center justify-center shrink-0">
                  {mode.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold leading-tight truncate">
                    {isBn ? mode.labelBn : mode.labelEn}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-[#A1A1AA] truncate mt-0.5">
                    {isBn ? mode.descBn : mode.descEn}
                  </div>
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-[#7C8CFF] shrink-0" />}
            </button>
          );
        })}
      </div>
    </ComposerPopover>
  );
}
