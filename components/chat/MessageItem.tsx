'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChatMessage, AppLanguage, AttachmentFile } from '@/lib/types';
import { formatFileSize } from '@/lib/constants/attachments';
import {
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Lightbulb,
  FileSpreadsheet,
  HelpCircle,
  Award,
  FileText,
  Music,
  Video,
  FileCode,
  X,
  Maximize2,
} from 'lucide-react';
import Image from 'next/image';
import { ThinkingIndicator } from './ThinkingIndicator';

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
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const isBn = language === 'bn';
  const isUser = message.role === 'user';
  const attachments = message.attachments || [];

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

  const renderAttachmentIcon = (att: AttachmentFile) => {
    switch (att.type) {
      case 'image':
        return <Maximize2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 shrink-0" />;
      case 'document':
      default: {
        const ext = att.name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />;
        if (['xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />;
        if (['json', 'md', 'txt'].includes(ext || '')) return <FileCode className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />;
        return <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />;
      }
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-4 animate-fadeIn">
        {/* Full Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-3xl max-h-[85vh] bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden p-2 shadow-2xl">
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-white/[0.08] mb-2">
                <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-sm">
                  {previewImage.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative w-full h-[60vh] max-h-[600px] flex items-center justify-center">
                <Image
                  src={previewImage.url}
                  alt={previewImage.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[88%] sm:max-w-[78%] rounded-2xl bg-zinc-100 dark:bg-[#1D1D20] border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-[#F5F5F5] px-4 py-3 shadow-xs space-y-2">
          {/* User Attachments List */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {attachments.map((att) => {
                if (att.type === 'image' && att.previewUrl) {
                  return (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setPreviewImage({ url: att.previewUrl!, name: att.name })}
                      className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-zinc-300 dark:border-white/10 hover:border-[#7C8CFF] bg-black/10 dark:bg-black/40 transition-all cursor-zoom-in"
                      title={att.name}
                    >
                      <Image
                        src={att.previewUrl}
                        alt={att.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  );
                }

                return (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08] text-xs max-w-[220px]"
                  >
                    <div className="p-1 rounded-md bg-zinc-100 dark:bg-white/[0.06] shrink-0">
                      {renderAttachmentIcon(att)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[11px] text-zinc-800 dark:text-zinc-200" title={att.name}>
                        {att.name}
                      </p>
                      <p className="text-[10px] text-zinc-500">{formatFileSize(att.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* User Message Text */}
          {message.content && (
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed select-text">
              {message.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant / AI Tutor Response (Document/Content style with KaTeX Math rendering)
  return (
    <div className="flex gap-3.5 my-6 sm:my-8 group animate-fadeIn">
      {/* Sleek Minimal Avatar */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C8CFF] to-indigo-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-w-0 max-w-full space-y-2">
        {/* Subtle Author Kicker */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <span className="text-zinc-800 dark:text-zinc-300 font-semibold">
            {isBn ? 'থিঙ্কওয়াইজ এআই' : 'ThinkWise AI'}
          </span>
          {message.mode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-zinc-500 dark:text-zinc-400">{message.mode.replace('_', ' ')}</span>
            </>
          )}
        </div>

        {/* Clean Document Prose with KaTeX Math and Chemical Equation Rendering */}
        <div className="text-zinc-800 dark:text-zinc-100 text-[15px] leading-relaxed select-text">
          <div className="markdown-body">
            <Markdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {message.content}
            </Markdown>
          </div>

          {/* Premium Glassmorphic AI Thinking Indicator */}
          {message.isStreaming && (
            <ThinkingIndicator
              language={language}
              mode={message.mode}
              hasContent={Boolean(message.content && message.content.trim().length > 0)}
            />
          )}
        </div>

        {/* Contextual Pedagogical Micro-Actions (Appear under completed AI response) */}
        {!message.isStreaming && message.content && (
          <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
            <button
              onClick={() => onActionClick('simplify', message.content)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-white/[0.05] transition-colors"
              title={isBn ? 'সহজ উপমা দিয়ে বুঝিয়ে বলো' : 'Explain simpler with an analogy'}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{isBn ? 'সহজ উপমা' : 'Explain simpler'}</span>
            </button>

            <button
              onClick={() => onActionClick('worked', message.content)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-white/[0.05] transition-colors"
              title={isBn ? 'ধাপে ধাপে সমাধান দেখাও' : 'Show step-by-step worked derivation'}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>{isBn ? 'ধাপে সমাধান' : 'Show steps'}</span>
            </button>

            <button
              onClick={() => onActionClick('quiz', message.content)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-white/[0.05] transition-colors"
              title={isBn ? 'এই বিষয়ের ওপর অনুশীলন কুইজ' : 'Practice quiz on this concept'}
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>{isBn ? 'কুইজ দাও' : 'Quiz me'}</span>
            </button>

            <button
              onClick={() => onActionClick('teach_back', message.content)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-white/[0.05] transition-colors"
              title={isBn ? 'নিজের ভাষায় বুঝিয়ে বলো' : 'Explain it back in your words'}
            >
              <Award className="w-3.5 h-3.5 text-[#7C8CFF]" />
              <span>{isBn ? 'নিজে বোঝাও' : 'Teach-back'}</span>
            </button>

            {/* Right Tools: Save & Copy */}
            <div className="ml-auto flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
              <button
                onClick={handleSave}
                className="p-1.5 rounded-md hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-white/[0.06] transition-colors"
                title={isBn ? 'স্ক্র্যাচপ্যাডে সংরক্ষণ' : 'Save note to scratchpad'}
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-white/[0.06] transition-colors"
                title={isBn ? 'কপি করুন' : 'Copy markdown text'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
