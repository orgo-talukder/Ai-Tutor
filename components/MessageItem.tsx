'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ChatMessage, AppLanguage } from '@/lib/types';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Lightbulb,
  FileSpreadsheet,
  HelpCircle,
  Award,
} from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
  language: AppLanguage;
  onActionClick: (action: 'simplify' | 'worked' | 'quiz' | 'teach_back', contextText: string) => void;
  onSaveNote: (snippet: string) => void;
}

export function MessageItem({
  message,
  language,
  onActionClick,
  onSaveNote,
}: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const isBn = language === 'bn';
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveNote(message.content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className="flex justify-end my-4">
        <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-tr-xs bg-slate-900 dark:bg-sky-600 text-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 dark:text-sky-100 mb-1">
            <span>{isBn ? 'আপনি' : 'You'}</span>
            <span aria-hidden="true">·</span>
            <span suppressHydrationWarning>{formattedTime}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
        </div>
      </div>
    );
  }

  // Assistant / AI Tutor Message
  return (
    <div className="flex gap-3 md:gap-4 my-6 group">
      {/* Tutor Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-sky-500/20 mt-1">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 max-w-full">
        {/* Zero-Pill Clean Metadata Header */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {isBn ? 'এআই টিউটর' : 'AI Tutor'}
          </span>
          <span aria-hidden="true">·</span>
          <span suppressHydrationWarning>{formattedTime}</span>
          {message.mode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{message.mode.replace('_', ' ')}</span>
            </>
          )}
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-slate-800 dark:text-slate-100 text-sm overflow-hidden">
          <div className="markdown-body">
            <Markdown>{message.content}</Markdown>
          </div>

          {/* Streaming Pulse Indicator */}
          {message.isStreaming && (
            <div className="flex items-center gap-2 mt-3 text-xs text-sky-600 dark:text-sky-400 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>{isBn ? 'টিউটর উত্তর সাজাচ্ছে...' : 'Tutor is formulating pedagogical steps...'}</span>
            </div>
          )}

          {/* Action Toolbar under AI Response (Visible once streaming ends) */}
          {!message.isStreaming && message.content && (
            <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <button
                onClick={() => onActionClick('simplify', message.content)}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-md transition-colors"
                title={isBn ? 'সহজ উপমায় ব্যাখ্যা করো' : 'Explain simpler with real-world analogy'}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{isBn ? 'সহজ উপমা' : 'Explain Simpler'}</span>
              </button>
              <button
                onClick={() => onActionClick('worked', message.content)}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-md transition-colors"
                title={isBn ? 'ধাপে ধাপে গাণিতিক সমাধান' : 'Show step-by-step mathematical derivation'}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isBn ? 'ধাপে সমাধান' : 'Worked Derivation'}</span>
              </button>
              <button
                onClick={() => onActionClick('quiz', message.content)}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-md transition-colors"
                title={isBn ? 'এই বিষয়ের ওপর কুইজ নাও' : 'Test understanding with an interactive quiz'}
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                <span>{isBn ? 'অনুশীলন কুইজ' : 'Quiz Me'}</span>
              </button>
              <button
                onClick={() => onActionClick('teach_back', message.content)}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-md transition-colors"
                title={isBn ? 'নিজে বুঝিয়ে টিউটরের ফিডব্যাক নাও' : 'Explain back in your words to test mastery'}
              >
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isBn ? 'নিজে বোঝাও' : 'Teach-Back'}</span>
              </button>
              <div className="ml-auto flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <button
                  onClick={handleSave}
                  className="p-1.5 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  title={isBn ? 'নোটবুক / স্ক্র্যাচপ্যাডে রাখুন' : 'Save note to scratchpad'}
                >
                  {saved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  title={isBn ? 'কপি করুন' : 'Copy markdown text'}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
