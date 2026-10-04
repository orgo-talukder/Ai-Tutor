'use client';

import React from 'react';
import {
  Compass,
  GraduationCap,
  Sparkles,
  Award,
  Code,
  MessageSquare,
  CornerDownLeft,
  Undo2,
  Paperclip,
  Image as ImageIcon,
  Layout,
  FileText,
  Network,
  GitFork,
  Table as TableIcon,
  Cpu,
  Calendar,
  Activity,
  ListOrdered,
  X,
} from 'lucide-react';
import { MentionDefinition } from '@/lib/mentions/definitions';

interface MentionChipProps {
  mention: MentionDefinition;
  onRemove: () => void;
}

function ChipIcon({ name }: { name: string }) {
  const iconProps = { className: 'w-3 h-3 shrink-0' };
  switch (name) {
    case 'LayoutTemplate':
    case 'Layout':
      return <Layout {...iconProps} className={`${iconProps.className} text-indigo-500`} />;
    case 'FileText':
      return <FileText {...iconProps} className={`${iconProps.className} text-emerald-500`} />;
    case 'Network':
      return <Network {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    case 'GitFork':
      return <GitFork {...iconProps} className={`${iconProps.className} text-purple-500`} />;
    case 'Table':
      return <TableIcon {...iconProps} className={`${iconProps.className} text-amber-500`} />;
    case 'Compass':
      return <Compass {...iconProps} className={`${iconProps.className} text-[#7C8CFF]`} />;
    case 'ListOrdered':
      return <ListOrdered {...iconProps} className={`${iconProps.className} text-pink-500`} />;
    case 'Activity':
      return <Activity {...iconProps} className={`${iconProps.className} text-rose-500`} />;
    case 'GraduationCap':
      return <GraduationCap {...iconProps} className={`${iconProps.className} text-orange-500`} />;
    case 'Layers':
      return <GraduationCap {...iconProps} className={`${iconProps.className} text-sky-500`} />;
    case 'Sparkles':
      return <Sparkles {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    case 'Calendar':
      return <Calendar {...iconProps} className={`${iconProps.className} text-teal-500`} />;
    case 'Cpu':
      return <Cpu {...iconProps} className={`${iconProps.className} text-violet-500`} />;
    case 'Award':
      return <Award {...iconProps} className={`${iconProps.className} text-red-500`} />;
    case 'Code':
      return <Code {...iconProps} className={`${iconProps.className} text-emerald-500`} />;
    case 'MessageSquare':
      return <MessageSquare {...iconProps} className={`${iconProps.className} text-zinc-400`} />;
    case 'CornerDownLeft':
      return <CornerDownLeft {...iconProps} className={`${iconProps.className} text-zinc-400`} />;
    case 'Undo2':
      return <Undo2 {...iconProps} className={`${iconProps.className} text-zinc-400`} />;
    case 'Paperclip':
      return <Paperclip {...iconProps} className={`${iconProps.className} text-zinc-400`} />;
    case 'Image':
      return <ImageIcon {...iconProps} className={`${iconProps.className} text-zinc-400`} />;
    default:
      return <Sparkles {...iconProps} className={`${iconProps.className} text-zinc-400`} />;
  }
}

export function MentionChip({ mention, onRemove }: MentionChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200/80 dark:border-white/[0.08] text-xs font-medium text-zinc-800 dark:text-zinc-200 select-none shadow-2xs shrink-0 animate-fadeIn transition-all hover:border-zinc-300 dark:hover:border-white/[0.12]">
      <ChipIcon name={mention.icon} />
      <span className="text-xs font-semibold">@{mention.label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        title={`Remove @${mention.label}`}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}
