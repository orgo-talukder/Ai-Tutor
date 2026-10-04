'use client';

import React from 'react';
import { AppLanguage } from '@/lib/types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  language: AppLanguage;
  onSelectSuggestion: (text: string) => void;
}

export function EmptyState({ language, onSelectSuggestion }: EmptyStateProps) {
  const isBn = language === 'bn';

  const suggestions = isBn
    ? [
        {
          label: 'সালোকসংশ্লেষণ সহজে বুঝাও',
          query: 'সালোকসংশ্লেষণ (Photosynthesis) কীভাবে ঘটে এবং উদ্ভিদের খাদ্য তৈরিতে আলোর ভূমিকা কী—একটি সহজ বাস্তব জীবনের উপমায় বুঝিয়ে বলো।',
        },
        {
          label: 'দ্বিঘাত সমীকরণ কীভাবে সমাধান করে?',
          query: 'দ্বিঘাত সমীকরণ (ax² + bx + c = 0) কীভাবে ধাপে ধাপে সমাধান করতে হয় তা সূত্রের স্পষ্ট ব্যাখ্যা সহ দেখাও।',
        },
        {
          label: 'নিউটনের ৩য় সূত্র ব্যাখ্যা করো',
          query: 'নিউটনের ৩য় গতিসূত্র (Newton’s 3rd Law) কীভাবে কাজ করে এবং ক্রিয়া-প্রতিক্রিয়া বল কেন একে অপরকে কাটাকাটি করে না?',
        },
        {
          label: 'পাইথনে রিকার্শন (Recursion) বোঝাও',
          query: 'কম্পিউটার সায়েন্সে রিকার্শন (Recursion) কীভাবে কাজ করে? পাইথনে একটি সাধারণ উদাহরণ দিয়ে কল-স্ট্যাক বুঝিয়ে দাও।',
        },
      ]
    : [
        {
          label: 'Explain photosynthesis simply',
          query: 'Explain photosynthesis and the light-dependent reaction using a simple, clear real-life analogy.',
        },
        {
          label: 'Help me understand quadratic equations',
          query: 'Derive and explain the quadratic formula ax² + bx + c = 0 step by step with an intuitive verification check.',
        },
        {
          label: "Teach me Newton's 3rd Law",
          query: "Why do action and reaction pairs never cancel each other out in Newton's Third Law of Motion?",
        },
        {
          label: 'Explain recursion in Python',
          query: 'How does recursion work under the hood in Python with the call stack? Explain with a clean example.',
        },
      ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] px-3 sm:px-4 max-w-lg mx-auto my-auto animate-fadeIn py-6 sm:py-8 select-none">
      {/* Small Elegant AI Tutor Icon */}
      <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/90 dark:border-white/[0.08] flex items-center justify-center text-[#7C8CFF] mb-3.5 shadow-2xs">
        <Sparkles className="w-5 h-5" />
      </div>

      {/* Main Conversational Headline */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1.5 text-center">
        {isBn ? 'শিখতে চান? প্রশ্ন করুন।' : 'Ready to learn? Ask a question.'}
      </h1>

      {/* Supporting Guidance */}
      <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6 text-center leading-relaxed">
        {isBn
          ? 'গণিত, বিজ্ঞান, কোডিং বা যেকোনো বিষয় যা আপনি গভীরভাবে বুঝতে চান—আমাকে জিজ্ঞাসা করুন।'
          : 'Ask about mathematics, physics, biology, programming, or any concept you want to genuinely master.'}
      </p>

      {/* Compact, Lightweight Prompt Suggestions */}
      <div className="w-full flex flex-col gap-2">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(item.query)}
            className="group w-full min-h-[42px] px-3.5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 dark:bg-[#121215] dark:hover:bg-[#18181C] border border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.16] transition-all flex items-center justify-between text-left shadow-2xs cursor-pointer"
          >
            <span className="text-xs sm:text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
              {item.label}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#7C8CFF] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
