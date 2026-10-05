'use client';

import React, { useSyncExternalStore } from 'react';
import { useAuth } from '@/lib/firebase/authContext';
import { Calculator, Atom, Dna, Code2, Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  language: 'bn' | 'en';
  onSelectSuggestion: (prompt: string) => void;
}

const emptySubscribe = () => () => {};

export function EmptyState({ language, onSelectSuggestion }: EmptyStateProps) {
  const { user } = useAuth();
  const isBn = language === 'bn';

  // Client-safe hydration snapshot: false on SSR, true on client
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const getGreeting = () => {
    if (!isClient) {
      return isBn ? 'স্বাগতম 👋' : 'Welcome 👋';
    }
    const hour = new Date().getHours();
    const name = user?.displayName ? ` ${user.displayName.split(' ')[0]}` : '';
    if (isBn) {
      if (hour >= 5 && hour < 12) return `শুভ সকাল${name} 👋`;
      if (hour >= 12 && hour < 17) return `শুভ দুপুর${name} 👋`;
      if (hour >= 17 && hour < 22) return `শুভ সন্ধ্যা${name} 👋`;
      return `শুভ রাত্রি${name} 👋`;
    }
    if (hour >= 5 && hour < 12) return `Good morning${name} 👋`;
    if (hour >= 12 && hour < 17) return `Good afternoon${name} 👋`;
    if (hour >= 17 && hour < 22) return `Good evening${name} 👋`;
    return `Hello${name} 👋`;
  };

  const suggestions = isBn
    ? [
        {
          subject: 'গণিত',
          icon: Calculator,
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
          title: 'দ্বিঘাত সমীকরণ সমাধান',
          desc: 'ax² + bx + c = 0 সূত্রের ধাপে ধাপে স্পষ্ট সমাধান',
          query: 'দ্বিঘাত সমীকরণ (ax² + bx + c = 0) কীভাবে ধাপে ধাপে সমাধান করতে হয় তা সূত্রের স্পষ্ট ব্যাখ্যা সহ দেখাও।',
        },
        {
          subject: 'পদার্থবিজ্ঞান',
          icon: Atom,
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
          title: 'নিউটনের ৩য় গতিসূত্র',
          desc: 'ক্রিয়া-প্রতিক্রিয়া বল কেন একে অপরকে কাটাকাটি করে না',
          query: 'নিউটনের ৩য় গতিসূত্র (Newton’s 3rd Law) কীভাবে কাজ করে এবং ক্রিয়া-প্রতিক্রিয়া বল কেন একে অপরকে কাটাকাটি করে না?',
        },
        {
          subject: 'জীববিজ্ঞান',
          icon: Dna,
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
          title: 'সালোকসংশ্লেষণ সহজে বুঝাও',
          desc: 'আলোর ভূমিকা ও ক্লোরোপ্লাস্ট প্রক্রিয়ার সহজ বাস্তব উপমা',
          query: 'সালোকসংশ্লেষণ (Photosynthesis) কীভাবে ঘটে এবং উদ্ভিদের খাদ্য তৈরিতে আলোর ভূমিকা কী—একটি সহজ বাস্তব জীবনের উপমায় বুঝিয়ে বলো।',
        },
        {
          subject: 'প্রোগ্রামিং',
          icon: Code2,
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          title: 'পাইথনে রিকার্শন (Recursion)',
          desc: 'কল-স্ট্যাক কীভাবে কাজ করে তা সাধারণ উদাহরণ দিয়ে বুঝাও',
          query: 'কম্পিউটার সায়েন্সে রিকার্শন (Recursion) কীভাবে কাজ করে? পাইথনে একটি সাধারণ উদাহরণ দিয়ে কল-স্ট্যাক বুঝিয়ে দাও।',
        },
      ]
    : [
        {
          subject: 'Mathematics',
          icon: Calculator,
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
          title: 'Derive Quadratic Formula',
          desc: 'Step-by-step intuition for ax² + bx + c = 0',
          query: 'Derive and explain the quadratic formula ax² + bx + c = 0 step by step with an intuitive verification check.',
        },
        {
          subject: 'Physics',
          icon: Atom,
          color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
          title: "Newton's 3rd Law of Motion",
          desc: 'Why action & reaction pairs never cancel each other',
          query: "Why do action and reaction pairs never cancel each other out in Newton's Third Law of Motion?",
        },
        {
          subject: 'Biology',
          icon: Dna,
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
          title: 'Photosynthesis Mechanism',
          desc: 'Light reaction explained with an everyday analogy',
          query: 'Explain photosynthesis and the light-dependent reaction using a simple, clear real-life analogy.',
        },
        {
          subject: 'Programming',
          icon: Code2,
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          title: 'Recursion & Call Stack',
          desc: 'How recursive calls behave under the hood in Python',
          query: 'How does recursion work under the hood in Python with the call stack? Explain with a clean example.',
        },
      ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto my-auto px-3 sm:px-6 py-2 sm:py-6 select-none animate-fadeIn min-w-0 align-self-stretch">
      {/* Background Radial Glow Effect */}
      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] h-[260px] sm:h-[320px] rounded-full pointer-events-none opacity-40 dark:opacity-30 blur-[90px]"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Logo Badge */}
      <div className="relative z-10 w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#7C86FF] to-[#6B76F5] flex items-center justify-center text-white mb-2.5 sm:mb-3.5 shadow-md shadow-[#6B76F5]/25">
        <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
      </div>

      {/* Personalized Greeting with Hydration Guard */}
      <h1
        suppressHydrationWarning
        className="relative z-10 text-lg sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-1 text-center text-balance"
      >
        {getGreeting()}
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 text-[11px] sm:text-[13px] text-[var(--text-secondary)] max-w-[520px] mx-auto mb-4 sm:mb-6 text-center leading-relaxed">
        {isBn
          ? 'আজ কী শিখতে চান? গণিত, বিজ্ঞান, কোডিং বা যেকোনো বিষয়ে প্রশ্ন করুন।'
          : 'What would you like to master today? Ask about mathematics, physics, biology, or coding.'}
      </p>

      {/* 2x2 Suggestion Cards Grid */}
      <div className="relative z-10 w-full grid grid-cols-2 gap-2.5 sm:gap-3 max-w-[720px] mx-auto">
        {suggestions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion(item.query)}
              className="group w-full min-w-0 p-3 sm:p-4 min-h-[96px] sm:min-h-[120px] rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] hover:border-[var(--accent)]/50 transition-all duration-200 flex flex-col justify-between text-left shadow-2xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border max-w-full truncate ${item.color}`}>
                  <Icon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.subject}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all hidden sm:block shrink-0" />
              </div>
              <h2 className="text-xs sm:text-[14px] font-semibold sm:font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-[1.45]">
                {item.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] line-clamp-2 hidden sm:block mt-0.5">
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
