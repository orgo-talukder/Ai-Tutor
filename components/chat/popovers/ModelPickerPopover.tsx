'use client';

import React from 'react';
import { AppLanguage, GeminiModelId, ThinkingLevelId } from '@/lib/types';
import { ComposerPopover } from '@/components/ui/ComposerPopover';
import { Check, Zap, Cpu } from 'lucide-react';

interface ModelPickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  selectedModel: GeminiModelId;
  onSelectModel: (model: GeminiModelId) => void;
  selectedThinkingLevel: ThinkingLevelId;
  onSelectThinkingLevel: (level: ThinkingLevelId) => void;
}

export function ModelPickerPopover({
  isOpen,
  onClose,
  language,
  selectedModel,
  onSelectModel,
  selectedThinkingLevel,
  onSelectThinkingLevel,
}: ModelPickerPopoverProps) {
  const isBn = language === 'bn';

  const models: {
    id: GeminiModelId;
    name: string;
    descEn: string;
    descBn: string;
    badge?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'gemini-2.5-flash',
      name: 'ThinkWase Fast',
      descEn: 'Fast, capable responses for everyday learning.',
      descBn: 'প্রতিদিনের পড়াশোনার জন্য দ্রুত এবং কার্যকর রেসপন্স।',
      icon: <Zap className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'gemini-3.7-flash',
      name: 'ThinkWase Pro',
      descEn: 'Deeper reasoning for complex learning and problem solving.',
      descBn: 'জটিল পড়াশোনা ও সমস্যা সমাধানের জন্য গভীর চিন্তন ও লজিক।',
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
    },
  ];

  const thinkingLevels: { id: ThinkingLevelId; labelEn: string; labelBn: string; descEn: string; descBn: string }[] = [
    {
      id: 'low',
      labelEn: 'Low',
      labelBn: 'কম',
      descEn: 'Faster responses with lighter reasoning',
      descBn: 'হালকা চিন্তন ও দ্রুত রেসপন্স',
    },
    {
      id: 'medium',
      labelEn: 'Medium',
      labelBn: 'মাঝারি',
      descEn: 'Balanced speed and reasoning',
      descBn: 'ভারসাম্যপূর্ণ গতি ও চিন্তন ক্ষমতা',
    },
    {
      id: 'high',
      labelEn: 'High',
      labelBn: 'বেশি',
      descEn: 'Deeper reasoning for complex tasks',
      descBn: 'জটিল সমস্যার জন্য গভীর চিন্তন',
    },
  ];

  return (
    <ComposerPopover
      isOpen={isOpen}
      onClose={onClose}
      widthClass="w-72 sm:w-84"
      ariaLabel={isBn ? 'মডেল ও চিন্তন নির্বাচন' : 'Model and thinking selection'}
    >
      {/* Model Selection Header */}
      <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-white/[0.06] mb-1">
        {isBn ? 'এআই মডেল' : 'AI Model'}
      </div>

      {/* Models List */}
      <div className="space-y-0.5">
        {models.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="menuitemradio"
              aria-checked={isSelected}
              onClick={() => {
                onSelectModel(m.id);
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
                  {m.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold leading-tight truncate">{m.name}</span>
                    {m.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#7C8CFF]/15 text-[#7C8CFF] shrink-0">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-[#A1A1AA] truncate mt-0.5">
                    {isBn ? m.descBn : m.descEn}
                  </div>
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-[#7C8CFF] shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Thinking Level Section */}
      <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-white/[0.06] px-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-[#A1A1AA]">
            {isBn ? 'চিন্তন গভীরতা' : 'Thinking Effort'}
          </span>
          <span className="text-[10px] font-medium text-[#7C8CFF]">
            {thinkingLevels.find((l) => l.id === selectedThinkingLevel)?.[isBn ? 'labelBn' : 'labelEn']}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 p-0.5 bg-zinc-100 dark:bg-[#121215] rounded-lg">
          {thinkingLevels.map((lvl) => {
            const isLvlSelected = selectedThinkingLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectThinkingLevel(lvl.id)}
                title={isBn ? lvl.descBn : lvl.descEn}
                className={`py-1 rounded-md text-[11px] font-medium text-center transition-all cursor-pointer ${
                  isLvlSelected
                    ? 'bg-white dark:bg-[#222225] text-zinc-900 dark:text-white shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {isBn ? lvl.labelBn : lvl.labelEn}
              </button>
            );
          })}
        </div>
      </div>
    </ComposerPopover>
  );
}
