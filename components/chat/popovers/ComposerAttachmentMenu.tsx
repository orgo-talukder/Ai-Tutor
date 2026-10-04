'use client';

import React from 'react';
import { AppLanguage } from '@/lib/types';
import { ComposerPopover } from '@/components/ui/ComposerPopover';
import { FileText, Image as ImageIcon, Music, Video } from 'lucide-react';

interface ComposerAttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onPickDocuments: () => void;
  onPickImages: () => void;
  onPickAudio: () => void;
  onPickVideo: () => void;
}

export function ComposerAttachmentMenu({
  isOpen,
  onClose,
  language,
  onPickDocuments,
  onPickImages,
  onPickAudio,
  onPickVideo,
}: ComposerAttachmentMenuProps) {
  const isBn = language === 'bn';

  const items = [
    {
      id: 'docs',
      labelEn: 'Files & Documents',
      labelBn: 'ফাইল ও ডকুমেন্টস',
      descEn: 'PDF, Word, CSV, PPTX, Text',
      descBn: 'PDF, Word, CSV, PPTX, টেক্সট',
      icon: <FileText className="w-4 h-4 text-rose-500 shrink-0" />,
      action: onPickDocuments,
    },
    {
      id: 'images',
      labelEn: 'Images & Diagrams',
      labelBn: 'ছবি ও ডায়াগ্রাম',
      descEn: 'PNG, JPG, WEBP, Diagrams',
      descBn: 'PNG, JPG, WEBP, চিত্র',
      icon: <ImageIcon className="w-4 h-4 text-sky-500 shrink-0" />,
      action: onPickImages,
    },
    {
      id: 'audio',
      labelEn: 'Audio Recordings',
      labelBn: 'অডিও লেকচার',
      descEn: 'MP3, WAV, Voice Notes',
      descBn: 'MP3, WAV, ভয়েস নোট',
      icon: <Music className="w-4 h-4 text-purple-500 shrink-0" />,
      action: onPickAudio,
    },
    {
      id: 'video',
      labelEn: 'Video Lessons',
      labelBn: 'ভিডিও পাঠ',
      descEn: 'MP4, MOV, Class Recordings',
      descBn: 'MP4, MOV, ক্লাস রেকর্ডিং',
      icon: <Video className="w-4 h-4 text-pink-500 shrink-0" />,
      action: onPickVideo,
    },
  ];

  return (
    <ComposerPopover
      isOpen={isOpen}
      onClose={onClose}
      widthClass="w-64 sm:w-72"
      ariaLabel={isBn ? 'ফাইল যুক্ত করুন' : 'Add to chat'}
    >
      <div className="px-2 py-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-white/[0.06] mb-1">
        {isBn ? 'ফাইল নির্বাচন' : 'Add to Chat'}
      </div>

      <div className="space-y-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            onClick={() => {
              item.action();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.05] focus:bg-black/[0.04] dark:focus:bg-white/[0.05] focus:outline-none transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-[#222225] flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-900 dark:text-[#F5F5F5] leading-tight">
                {isBn ? item.labelBn : item.labelEn}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-[#A1A1AA] truncate mt-0.5">
                {isBn ? item.descBn : item.descEn}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ComposerPopover>
  );
}
