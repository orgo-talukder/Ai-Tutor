'use client';

import React, { useState } from 'react';
import { AppLanguage, SavedNote } from '@/lib/types';
import {
  Bookmark,
  X,
  Download,
  Copy,
  Check,
  Trash2,
  Sparkles,
  FileText,
} from 'lucide-react';

interface ScratchpadDrawerProps {
  language: AppLanguage;
  notes: SavedNote[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteNote: (id: string) => void;
  onClearNotes: () => void;
  onGenerateRecap: () => void;
}

export function ScratchpadDrawer({
  language,
  notes,
  isOpen,
  onClose,
  onDeleteNote,
  onClearNotes,
  onGenerateRecap,
}: ScratchpadDrawerProps) {
  const isBn = language === 'bn';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    if (notes.length === 0) return;
    const text = notes
      .map(
        (n, i) =>
          `### ${i + 1}. ${n.title} (${new Date(n.timestamp).toLocaleTimeString()})\n\n${n.snippet}\n`
      )
      .join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (notes.length === 0) return;
    const content = `# AI Tutor Study Notes & Formula Scratchpad
Generated on: ${new Date().toLocaleString()}

${notes
  .map(
    (n, i) =>
      `## ${i + 1}. ${n.title}\n*Saved at: ${new Date(n.timestamp).toLocaleString()}*\n\n${n.snippet}\n`
  )
  .join('\n---\n\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-tutor-study-notes-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? 'স্টাডি স্ক্র্যাচপ্যাড ও সূত্র' : 'Study Scratchpad & Notes'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {notes.length} {isBn ? 'টি সংরক্ষিত নোট' : 'saved note items'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
          <button
            onClick={onGenerateRecap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
            title={isBn ? 'সম্পূর্ণ সেশনের ৩০ সেকেন্ডের সারসংক্ষেপ' : 'Generate 30-second session revision recap'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? '৩০ সেকেন্ড রিভিশন' : '30s Recap'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyAll}
              disabled={notes.length === 0}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 transition-colors"
              title={isBn ? 'সব নোট কপি করুন' : 'Copy all notes to clipboard'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleExportMarkdown}
              disabled={notes.length === 0}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 transition-colors"
              title={isBn ? 'Markdown (.md) ফাইল ডাউনলোড' : 'Download notes as Markdown (.md)'}
            >
              <Download className="w-4 h-4" />
            </button>

            {notes.length > 0 && (
              <button
                onClick={onClearNotes}
                className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/60 transition-colors"
                title={isBn ? 'সব নোট মুছুন' : 'Clear all scratchpad notes'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {isBn
                  ? 'এখনো কোনো নোট সংরক্ষণ করেননি। টিউটরের উত্তরের নিচের বুকমার্ক আইকনে ক্লিক করে প্রয়োজনীয় সূত্র ও পয়েন্ট এখানে জমা রাখতে পারেন।'
                  : 'No notes saved yet. Click the bookmark icon under any tutor explanation or quiz to pin formulas and takeaways here.'}
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2 relative group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {note.title}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-slate-300 hover:text-rose-500 p-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg font-mono">
                  {note.snippet}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          {isBn
            ? 'সেশনটি অস্থায়ী (Ephemeral)—প্রয়োজনে Markdown হিসেবে এক্সপোর্ট করে রাখুন।'
            : 'Session is ephemeral — export as Markdown to retain offline notes.'}
        </div>
      </div>
    </div>
  );
}
