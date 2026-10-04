'use client';

import React, { useEffect, useRef } from 'react';
import { AppLanguage } from '@/lib/types';
import { X, FileText, Image as ImageIcon, Music, Video } from 'lucide-react';

interface AttachmentMenuBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onPickDocuments: () => void;
  onPickImages: () => void;
  onPickAudio: () => void;
  onPickVideo: () => void;
}

export function AttachmentMenuBottomSheet({
  isOpen,
  onClose,
  language,
  onPickDocuments,
  onPickImages,
  onPickAudio,
  onPickVideo,
}: AttachmentMenuBottomSheetProps) {
  const isBn = language === 'bn';
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Card (Slide-up on Mobile, Compact Card on Desktop) */}
      <div
        ref={menuRef}
        className="relative w-full sm:max-w-xs bg-white dark:bg-[#141416] border-t sm:border border-zinc-200 dark:border-white/[0.1] rounded-t-[28px] sm:rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-slideUp text-zinc-900 dark:text-[#F5F5F5]"
      >
        <div className="p-4 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {isBn ? 'ফাইল যুক্ত করুন' : 'Add to Chat'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Dedicated Category Buttons */}
          <div className="bg-zinc-50 dark:bg-[#1A1A1D] border border-zinc-200/80 dark:border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-zinc-200/80 dark:divide-white/[0.06]">
            {/* 1. Files / Documents */}
            <button
              type="button"
              onClick={() => {
                onPickDocuments();
                onClose();
              }}
              className="w-full p-3 flex items-center gap-3 text-left hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {isBn ? '📄 ডকুমেন্টস ও PDF' : '📄 Files & Documents'}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                  PDF, DOCX, TXT, CSV, PPTX
                </div>
              </div>
            </button>

            {/* 2. Images */}
            <button
              type="button"
              onClick={() => {
                onPickImages();
                onClose();
              }}
              className="w-full p-3 flex items-center gap-3 text-left hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {isBn ? '🖼 ছবি ও ডায়াগ্রাম' : '🖼 Images & Diagrams'}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                  PNG, JPG, JPEG, WEBP, HEIC
                </div>
              </div>
            </button>

            {/* 3. Audio */}
            <button
              type="button"
              onClick={() => {
                onPickAudio();
                onClose();
              }}
              className="w-full p-3 flex items-center gap-3 text-left hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Music className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {isBn ? '🎵 অডিও লেকচার' : '🎵 Audio Recordings'}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                  MP3, WAV, M4A, OGG, AAC, FLAC
                </div>
              </div>
            </button>

            {/* 4. Video */}
            <button
              type="button"
              onClick={() => {
                onPickVideo();
                onClose();
              }}
              className="w-full p-3 flex items-center gap-3 text-left hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <Video className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {isBn ? '🎬 ভিডিও পাঠ' : '🎬 Video Lessons'}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                  MP4, MOV, WebM, MPEG
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
