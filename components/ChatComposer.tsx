'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppLanguage, SubjectArea, TeachingMode } from '@/lib/types';
import { Send, Square, Sparkles, HelpCircle } from 'lucide-react';

interface ChatComposerProps {
  language: AppLanguage;
  currentMode: TeachingMode;
  selectedSubject: SubjectArea;
  isStreaming: boolean;
  onSendMessage: (text: string) => void;
  onStopStreaming: () => void;
}

export function ChatComposer({
  language,
  currentMode,
  selectedSubject,
  isStreaming,
  onSendMessage,
  onStopStreaming,
}: ChatComposerProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isBn = language === 'bn';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStreaming) {
      onStopStreaming();
      return;
    }
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Curated educational prompt starters
  const starterPrompts = isBn
    ? [
        'সালোকসংশ্লেষণ (Photosynthesis) প্রক্রিয়াটি সহজ উপমায় বুঝিয়ে বলো',
        'দ্বিঘাত সমীকরণ (Quadratic Equation) ax² + bx + c = 0 কীভাবে সমাধান করতে হয়?',
        'নিউটনের ৩য় সূত্র এবং ঘর্ষণ বলের মধ্যে পার্থক্য কী?',
        'আমার উত্তর: 2x + 7 = 19 হলে x = 8 আসছে, এটা কি সঠিক?',
      ]
    : [
        'Explain photosynthesis and the light reaction in simple terms',
        'Step-by-step derivation of the quadratic formula ax² + bx + c = 0',
        'Why does an action-reaction pair never cancel out in Newton’s 3rd Law?',
        'Check my answer: If 2x + 7 = 19, I got x = 8. Is that right?',
      ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Starter Prompts Carousel (when input is empty) */}
      {!input && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            {isBn ? 'উদাহরণ:' : 'Starters:'}
          </span>
          {starterPrompts.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(starter);
                textareaRef.current?.focus();
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap text-left shrink-0 max-w-xs truncate"
            >
              {starter}
            </button>
          ))}
        </div>
      )}

      {/* Main Composer Form */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all p-2.5"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={
            isBn
              ? 'আপনার প্রশ্ন বা সমস্যা লিখুন (যেমন: এই সমীকরণটি ধাপে ধাপে বুঝিয়ে দাও...)'
              : 'Ask your question or problem (e.g. Derive formula, diagnose mistake, or explain step-by-step)...'
          }
          className="w-full resize-none bg-transparent px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none min-h-[44px] max-h-40 leading-relaxed"
        />

        <div className="flex items-center justify-between pt-2 px-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              {isBn ? 'মোড:' : 'Mode:'}{' '}
              <strong className="text-slate-700 dark:text-slate-300 capitalize font-medium">
                {currentMode.replace('_', ' ')}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="hidden sm:inline">
              {isBn ? 'পাঠাতে Enter, নতুন লাইনে Shift+Enter' : 'Press Enter to send, Shift+Enter for new line'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
                title={isBn ? 'উত্তর থামান' : 'Stop generating'}
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{isBn ? 'থামান' : 'Stop'}</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                  input.trim()
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBn ? 'পাঠান' : 'Ask Tutor'}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
