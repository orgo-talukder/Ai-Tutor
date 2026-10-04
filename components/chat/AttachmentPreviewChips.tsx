'use client';

import React from 'react';
import { AttachmentFile } from '@/lib/types';
import { formatFileSize } from '@/lib/constants/attachments';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Music,
  Video,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';

interface AttachmentPreviewChipsProps {
  attachments: AttachmentFile[];
  onRemoveAttachment: (id: string) => void;
  isBn?: boolean;
}

export function AttachmentPreviewChips({
  attachments,
  onRemoveAttachment,
  isBn = false,
}: AttachmentPreviewChipsProps) {
  if (attachments.length === 0) return null;

  const renderIcon = (att: AttachmentFile) => {
    switch (att.type) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
      case 'document':
      default: {
        const ext = att.name.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
          return <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
        }
        if (['xlsx', 'csv'].includes(ext || '')) {
          return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
        }
        if (['json', 'md', 'txt'].includes(ext || '')) {
          return <FileCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
        }
        return <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pb-2 px-1 pt-0.5">
      {attachments.map((att) => {
        const isReady = att.state === 'ready';
        const isError = att.state === 'error';
        const isLoading = att.state === 'uploading' || att.state === 'processing' || att.state === 'validating';

        return (
          <div
            key={att.id}
            className={`group relative flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl border text-xs transition-all max-w-[240px] sm:max-w-[280px] select-none ${
              isError
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : isReady
                ? 'bg-[#1D1D20] border-white/[0.12] text-zinc-200 hover:border-white/[0.22]'
                : 'bg-[#161618] border-white/[0.08] text-zinc-400'
            }`}
          >
            {/* Image Thumbnail or Category Icon */}
            {att.type === 'image' && att.previewUrl ? (
              <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/[0.1]">
                <Image
                  src={att.previewUrl}
                  alt={att.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="p-1 rounded-md bg-white/[0.05] shrink-0">
                {renderIcon(att)}
              </div>
            )}

            {/* File Info */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="truncate font-medium text-[11px] leading-tight text-zinc-200" title={att.name}>
                {att.name}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-0.5">
                <span>{formatFileSize(att.size)}</span>
                <span>•</span>
                {isLoading && (
                  <span className="flex items-center gap-1 text-[#7C8CFF]">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>{att.state === 'processing' ? (isBn ? 'প্রসেসিং...' : 'Processing...') : (isBn ? 'আপলোড হচ্ছে...' : 'Uploading...')}</span>
                  </span>
                )}
                {isReady && (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{isBn ? 'প্রস্তুত' : 'Ready'}</span>
                  </span>
                )}
                {isError && (
                  <span className="flex items-center gap-1 text-rose-400 font-medium" title={att.errorMessage}>
                    <AlertCircle className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[80px]">{isBn ? 'ব্যর্থ' : 'Failed'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => onRemoveAttachment(att.id)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
              title={isBn ? 'ফাইলটি সরান' : 'Remove attachment'}
              aria-label={`Remove ${att.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
