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
  ThumbsUp,
  ThumbsDown,
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
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
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
        return <Maximize2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-pink-500 shrink-0" />;
      case 'document':
      default: {
        const ext = att.name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
        if (['xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
        if (['json', 'md', 'txt'].includes(ext || '')) return <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
        return <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
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
            <div className="relative max-w-3xl max-h-[85vh] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl overflow-hidden p-2 shadow-2xl">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] mb-2">
                <span className="text-xs font-mono text-[var(--text-secondary)] truncate max-w-sm">
                  {previewImage.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative w-full h-[65vh]">
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

        {/* User Message Bubble */}
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl sm:rounded-3xl px-4 py-3 bg-[var(--bubble-user-bg)] text-[var(--bubble-user-text)] border border-[var(--border-subtle)] shadow-xs">
          {/* Attached files preview */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2.5">
              {attachments.map((att) => {
                if (att.type === 'image' && att.previewUrl) {
                  return (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => setPreviewImage({ url: att.previewUrl!, name: att.name })}
                      className="group relative w-16 h-16 rounded-xl overflow-hidden border border-[var(--border-default)] cursor-pointer"
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
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-xs max-w-[220px]"
                  >
                    <div className="p-1 rounded-md bg-[var(--bg-hover)] shrink-0">
                      {renderAttachmentIcon(att)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[11px] text-[var(--text-primary)]" title={att.name}>
                        {att.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{formatFileSize(att.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* User Message Text */}
          {message.content && (
            <div className="whitespace-pre-wrap text-[14px] sm:text-[15px] leading-relaxed select-text">
              {message.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant / AI Tutor Response (Bubble-less, clean full-width markdown per §12.1)
  return (
    <div className="flex gap-3 sm:gap-3.5 my-6 sm:my-8 group animate-fadeIn">
      {/* Sleek Minimal Avatar */}
      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7C86FF] to-[#6B76F5] text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      {/* Main Content Body */}
      <div className="flex-1 min-w-0 max-w-full space-y-2">
        {/* Subtle Author Kicker */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] font-medium">
          <span className="text-[var(--text-primary)] font-bold">
            {isBn ? 'থিঙ্কওয়াইজ এআই' : 'ThinkWise AI'}
          </span>
          {message.mode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-[var(--text-secondary)]">{message.mode.replace('_', ' ')}</span>
            </>
          )}
        </div>

        {/* Clean Document Prose with KaTeX Math and Chemical Equation Rendering */}
        <div className="text-[var(--text-primary)] text-[14px] sm:text-[15px] leading-relaxed select-text">
          <div className="markdown-body">
            <Markdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {message.content}
            </Markdown>
          </div>

          {/* AI Thinking Indicator */}
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
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs border-t border-[var(--border-subtle)] mt-3">
            {/* Pedagogical Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => onActionClick('simplify', message.content)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
                title={isBn ? 'সহজ উপমা দিয়ে বুঝিয়ে বলো' : 'Explain simpler with an analogy'}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{isBn ? 'সহজ উপমা' : 'Explain simpler'}</span>
              </button>

              <button
                onClick={() => onActionClick('worked', message.content)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
                title={isBn ? 'ধাপে ধাপে সমাধান দেখাও' : 'Show step-by-step worked derivation'}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isBn ? 'ধাপে সমাধান' : 'Show steps'}</span>
              </button>

              <button
                onClick={() => onActionClick('quiz', message.content)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
                title={isBn ? 'এই বিষয়ের ওপর অনুশীলন কুইজ' : 'Practice quiz on this concept'}
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                <span>{isBn ? 'কুইজ দাও' : 'Quiz me'}</span>
              </button>

              <button
                onClick={() => onActionClick('teach_back', message.content)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)] transition-colors cursor-pointer"
                title={isBn ? 'নিজের ভাষায় বুঝিয়ে বলো' : 'Explain it back in your words'}
              >
                <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isBn ? 'নিজে বোঝাও' : 'Teach-back'}</span>
              </button>
            </div>

            {/* Response Utility Bar: Feedback, Save & Copy per §12.2 & §13.4 */}
            <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
              {/* Feedback Thumb Up */}
              <button
                type="button"
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  feedback === 'up'
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
                title={isBn ? 'ভালো উত্তর' : 'Helpful response'}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>

              {/* Feedback Thumb Down */}
              <button
                type="button"
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  feedback === 'down'
                    ? 'text-rose-500 bg-rose-500/10'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
                title={isBn ? 'সঠিক নয়' : 'Not helpful'}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>

              {/* Save Note to Notebook */}
              <button
                onClick={handleSave}
                className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer"
                title={isBn ? 'নোটবুক-এ সংরক্ষণ' : 'Save to Notebook'}
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>

              {/* Copy Response */}
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer"
                title={isBn ? 'কপি করুন' : 'Copy markdown text'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
