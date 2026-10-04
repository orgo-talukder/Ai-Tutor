'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { AppLanguage } from '@/lib/types';

interface ThinkingIndicatorProps {
  language: AppLanguage;
  mode?: string;
  hasContent?: boolean;
}

export function ThinkingIndicator({
  language,
  mode = 'socratic',
  hasContent = false,
}: ThinkingIndicatorProps) {
  const isBn = language === 'bn';
  const [stepIndex, setStepIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Bengali and English thinking phases
  const stepsBn = [
    'প্রশ্ন ও প্রাসঙ্গিক বিষয়বস্তু বিশ্লেষণ করা হচ্ছে...',
    'সাক্রেটিক শিখন পদ্ধতি ও গাণিতিক সূত্র সাজানো হচ্ছে...',
    'সহজ ও স্পষ্ট উপমাসহ ব্যাখ্যা তৈরি করা হচ্ছে...',
  ];

  const stepsEn = [
    'Analyzing question & pedagogical context...',
    'Structuring Socratic breakdown & formula derivations...',
    'Formulating intuitive explanation & guided checks...',
  ];

  const currentSteps = isBn ? stepsBn : stepsEn;

  // Elapsed seconds timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle thinking phase text
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % currentSteps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [currentSteps.length]);

  return (
    <div className="my-2 select-none animate-fadeIn">
      {/* Outer Premium Glassmorphic Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500/[0.07] via-purple-500/[0.07] to-pink-500/[0.07] dark:from-indigo-500/[0.12] dark:via-purple-500/[0.12] dark:to-pink-500/[0.12] border border-indigo-500/20 dark:border-indigo-400/30 p-3 sm:p-3.5 shadow-sm transition-all duration-300">
        
        {/* Glowing Top Ambient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer-bg" />

        {/* Card Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Animated Glowing AI Orb */}
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-[#7C8CFF] via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping" />
            </div>

            {/* Title & Elapsed Timer */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5">
                <span className="animate-shimmer-text">
                  {isBn ? 'টিউটর চিন্তা করছেন' : 'AI Thinking'}
                </span>
              </span>

              <span className="text-[10px] sm:text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 shrink-0">
                {seconds}s
              </span>
            </div>
          </div>

          {/* Toggle Expand/Collapse Thought Detail */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.08] transition-colors"
            title={isExpanded ? (isBn ? 'সংকোচন করুন' : 'Collapse') : (isBn ? 'প্রসারিত করুন' : 'Expand')}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Detailed Reasoning Animation */}
        {isExpanded && (
          <div className="mt-2.5 pt-2 border-t border-indigo-500/10 dark:border-indigo-400/15 space-y-2 animate-fadeIn">
            {/* Dynamic Step Text */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 animate-spin-slow" />
              <span className="truncate transition-all duration-300">
                {currentSteps[stepIndex]}
              </span>
            </div>

            {/* Shimmering Thought Lines (shown when content is initial/empty) */}
            {!hasContent && (
              <div className="space-y-1.5 pt-1">
                <div className="h-2 rounded-full w-[88%] animate-shimmer-bg opacity-80" />
                <div className="h-2 rounded-full w-[65%] animate-shimmer-bg opacity-60" />
                <div className="h-2 rounded-full w-[42%] animate-shimmer-bg opacity-40" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
