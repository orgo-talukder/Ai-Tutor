'use client';

import React from 'react';
import { AttachmentFile } from '@/lib/types';
import {
  Sparkles,
  FileText,
  HelpCircle,
  Lightbulb,
  ListChecks,
  GitCompare,
  BookOpen,
} from 'lucide-react';

interface FileQuickActionsProps {
  attachments: AttachmentFile[];
  onSelectAction: (promptText: string) => void;
  isBn?: boolean;
}

export function FileQuickActions({
  attachments,
  onSelectAction,
  isBn = false,
}: FileQuickActionsProps) {
  if (attachments.length === 0) return null;

  const hasMultiple = attachments.length > 1;
  const hasAudioOrVideo = attachments.some((a) => a.type === 'audio' || a.type === 'video');

  const actions: Array<{
    id: string;
    icon: React.ReactNode;
    labelEn: string;
    labelBn: string;
    promptEn: string;
    promptBn: string;
  }> = [
    {
      id: 'summarize',
      icon: <FileText className="w-3 h-3 text-[#7C8CFF]" />,
      labelEn: 'Summarize',
      labelBn: 'সারসংক্ষেপ',
      promptEn: 'Please provide a clear, high-yield summary of this attached material, highlighting key themes and findings.',
      promptBn: 'অনুগ্রহ করে সংযুক্ত ফাইলের গুরুত্বপূর্ণ বিষয়গুলোর একটি সুস্পষ্ট সারসংক্ষেপ (Summary) প্রদান করুন।',
    },
    {
      id: 'quiz',
      icon: <HelpCircle className="w-3 h-3 text-emerald-400" />,
      labelEn: 'Generate Quiz',
      labelBn: 'কুইজ তৈরি করো',
      promptEn: 'Create 5 interactive practice questions with explanations based on this uploaded material to test my understanding.',
      promptBn: 'এই সংযুক্ত মেটেরিয়াল থেকে আমার জ্ঞান যাচাই করতে ব্যাখ্যা সহ ৫টি অনুশীলনমূলক কুইজ প্রশ্ন তৈরি করুন।',
    },
    {
      id: 'notes',
      icon: <ListChecks className="w-3 h-3 text-amber-400" />,
      labelEn: 'Study Notes',
      labelBn: 'রিভিশন নোট',
      promptEn: 'Extract concise study revision notes, important definitions, formulas, and key concepts from this file.',
      promptBn: 'এই ফাইল থেকে মূল সংজ্ঞা, প্রয়োজনীয় সূত্র এবং রিভিশন স্টাডি নোট তৈরি করে দিন।',
    },
    {
      id: 'simplify',
      icon: <Lightbulb className="w-3 h-3 text-indigo-400" />,
      labelEn: 'Explain Simply',
      labelBn: 'সহজ ভাষায় বোঝাও',
      promptEn: 'Explain the core concepts in this file in simple terms with everyday analogies, as if teaching a beginner.',
      promptBn: 'এই ফাইলের মূল ধারণাগুলো সহজ দৈনন্দিন উপমায় সহজ ভাষায় বুঝিয়ে দিন।',
    },
  ];

  if (hasAudioOrVideo) {
    actions.unshift({
      id: 'lecture_breakdown',
      icon: <BookOpen className="w-3 h-3 text-pink-400" />,
      labelEn: 'Lecture Breakdown',
      labelBn: 'লেকচার বিশ্লেষণ',
      promptEn: 'Break down the key topics, timestamps, and main teaching points discussed in this recording.',
      promptBn: 'এই রেকর্ডিংয়ে আলোচিত প্রধান বিষয় ও শিক্ষণীয় পয়েন্টগুলো পয়েন্ট আকারে বিশ্লেষণ করুন।',
    });
  }

  if (hasMultiple) {
    actions.push({
      id: 'compare',
      icon: <GitCompare className="w-3 h-3 text-sky-400" />,
      labelEn: 'Compare Files',
      labelBn: 'তুলনা করো',
      promptEn: 'Compare these attached materials, highlight common concepts, and point out differences or complementary points.',
      promptBn: 'সংযুক্ত ফাইলগুলোর মধ্যে মিল ও অমিলগুলো তুলনা করে বিস্তারিত বুঝিয়ে দিন।',
    });
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 px-1">
      <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pl-1 shrink-0">
        <Sparkles className="w-2.5 h-2.5 text-[#7C8CFF]" />
        <span>{isBn ? 'কুইক অ্যাকশন:' : 'Quick Actions:'}</span>
      </span>
      {actions.map((act) => (
        <button
          key={act.id}
          type="button"
          onClick={() => onSelectAction(isBn ? act.promptBn : act.promptEn)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.16] text-[11px] font-medium text-zinc-300 hover:text-white transition-all shrink-0 select-none cursor-pointer"
        >
          {act.icon}
          <span>{isBn ? act.labelBn : act.labelEn}</span>
        </button>
      ))}
    </div>
  );
}
