'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
  Layers,
  Search,
} from 'lucide-react';
import { MentionDefinition, MentionCategory } from '@/lib/mentions/definitions';

interface MentionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMention: (mention: MentionDefinition) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  highlightedIndex: number;
  onHighlightedIndexChange: (index: number) => void;
  filteredMentions: MentionDefinition[];
  isBn: boolean;
}

const CATEGORY_LABELS: Record<MentionCategory, { en: string; bn: string }> = {
  create: { en: 'Create Workspace', bn: 'তৈরি করো (Workspace)' },
  learn: { en: 'Inquire & Learn', bn: 'শিখুন ও অনুশীলন' },
  solve: { en: 'Problem Solving', bn: 'সমস্যা সমাধান' },
  context: { en: 'Reference Context', bn: 'রেফারেন্স ও ফাইল' },
};

// Render matching Lucide icon dynamically
function MentionIcon({ name }: { name: string }) {
  const iconProps = { className: 'w-4 h-4 shrink-0' };
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
      return <Layers {...iconProps} className={`${iconProps.className} text-sky-500`} />;
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

export function MentionMenu({
  isOpen,
  onClose,
  onSelectMention,
  searchQuery,
  onSearchQueryChange,
  highlightedIndex,
  onHighlightedIndexChange,
  filteredMentions,
  isBn,
}: MentionMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Group items by category to display clean subheaders while preserving filtered indexing
  const categories: MentionCategory[] = ['create', 'learn', 'solve', 'context'];

  // Scroll active item into view
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector('[aria-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  if (!isOpen) return null;

  // Render Category Block
  const renderCategoryBlock = (category: MentionCategory) => {
    const items = filteredMentions.filter((m) => m.category === category);
    if (items.length === 0) return null;

    return (
      <div key={category} className="space-y-1">
        <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase select-none">
          {isBn ? CATEGORY_LABELS[category].bn : CATEGORY_LABELS[category].en}
        </div>
        {items.map((mention) => {
          // Find absolute index of this item in the filtered list
          const absoluteIndex = filteredMentions.findIndex((m) => m.id === mention.id);
          const isSelected = absoluteIndex === highlightedIndex;

          return (
            <div
              key={mention.id}
              role="option"
              aria-selected={isSelected}
              id={`mention-opt-${mention.id}`}
              onClick={() => onSelectMention(mention)}
              onMouseEnter={() => onHighlightedIndexChange(absoluteIndex)}
              className={`px-3 py-2 rounded-xl flex items-start gap-3 transition-colors cursor-pointer select-none text-left ${
                isSelected
                  ? 'bg-zinc-100 dark:bg-white/[0.06] text-zinc-900 dark:text-white'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.02]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <MentionIcon name={mention.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-white">
                    @{mention.label}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate leading-snug">
                  {mention.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute bottom-full left-0 right-0 z-50 mb-2 max-h-[310px] bg-white dark:bg-[#0E0E10] border border-zinc-200 dark:border-white/[0.08] shadow-2xl rounded-2xl flex flex-col overflow-hidden backdrop-blur-md"
    >
      {/* Mini Inline Search Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-white/[0.01]">
        <Search className="w-3.5 h-3.5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={isBn ? 'টুল বা রেফারেন্স খুঁজুন...' : 'Search tools or context...'}
          className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          autoFocus
          onKeyDown={(e) => {
            // Keep native input from hijacking keys intended for outer composer key listener
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault();
            }
          }}
        />
      </div>

      {/* Grouped Lists Scroll Container */}
      <div
        ref={containerRef}
        role="listbox"
        aria-label="Mentions list"
        className="flex-1 overflow-y-auto p-1.5 space-y-3 max-h-[260px] scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-white/[0.04]"
      >
        {filteredMentions.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            {isBn ? 'কোনো টুল পাওয়া যায়নি।' : 'No matches found.'}
          </div>
        ) : (
          categories.map((cat) => renderCategoryBlock(cat))
        )}
      </div>
    </motion.div>
  );
}
