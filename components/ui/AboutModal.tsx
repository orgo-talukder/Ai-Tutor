'use client';

import React from 'react';
import { AppLanguage } from '@/lib/types';
import { X, Sparkles, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
}

export function AboutModal({ isOpen, onClose, language }: AboutModalProps) {
  if (!isOpen) return null;
  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-900 dark:text-[#F5F5F5] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C8CFF] to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {isBn ? 'থিঙ্কওয়াইজ এআই দর্শন' : 'ThinkWise AI Philosophy'}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {isBn ? 'বোঝাপড়া ও সক্রিয় শিখন কেন্দ্রিক' : 'Understanding-First Educational AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] space-y-1.5">
            <strong className="text-zinc-900 dark:text-white flex items-center gap-1.5 font-semibold">
              <Compass className="w-3.5 h-3.5 text-[#7C8CFF]" />
              {isBn ? 'সক্রেটিক শিখন ধারা:' : 'Socratic Pedagogical Core:'}
            </strong>
            <p>
              {isBn
                ? 'থিঙ্কওয়াইজ এআই কেবল সরাসরি উত্তর কপি করার জন্য নয়; বরং শিক্ষার্থী যেন নিজে চিন্তা করতে পারে, প্রশ্নের গভীরে গিয়ে সমস্যা বিশ্লেষণ করতে পারে এবং পরের বার নিজে সমাধান করতে পারে।'
                : 'ThinkWise AI is designed not for passive homework copying, but to scaffold understanding, guide intermediate logic, and build long-term problem-solving autonomy.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] space-y-1.5">
            <strong className="text-zinc-900 dark:text-white flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              {isBn ? 'দ্বিভাষিক স্পষ্টতা (Bilingual Synergy):' : 'Bilingual Terminology:'}
            </strong>
            <p>
              {isBn
                ? 'বাংলায় সাবলীল আলোচনার পাশাপাশি আন্তর্জাতিক পাঠ্যক্রমের সাথে সঙ্গতি বজায় রাখতে মূল বৈজ্ঞানিক ও গাণিতিক পারিভাষিক শব্দগুলো প্রথম বন্ধনীতে (Parentheses) রাখা হয়।'
                : 'Responses seamlessly blend natural language explanations with standard English academic terminology in parentheses for curriculum alignment.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] space-y-1.5">
            <strong className="text-zinc-900 dark:text-white flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              {isBn ? 'গোপনীয়তা ও সক্রিয় সেশন:' : 'Privacy & Ephemeral Storage:'}
            </strong>
            <p>
              {isBn
                ? 'আপনার সেশনটি ডিভাইসের লোকাল মেমরিতে সক্রিয় থাকে। সেশন শেষ হলে বা ব্রাউজার রিফ্রেশ করলে কোনো তথ্য অপব্যবহারের উদ্দেশ্যে স্থায়ীভাবে সংরক্ষণ করা হয় না।'
                : 'Conversations run in local memory without permanent profile tracking. Export your notes anytime to Markdown for permanent personal records.'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            {isBn ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}
