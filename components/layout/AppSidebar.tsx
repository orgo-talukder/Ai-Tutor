'use client';

import React, { useState, useEffect } from 'react';
import { AppLanguage } from '../../lib/types';
import { DbChatSession } from '../../lib/firebase/chatService';
import { useAuth } from '../../lib/firebase/authContext';
import {
  Plus,
  HelpCircle,
  Sparkles,
  Layers,
  FileEdit,
  X,
  Trash2,
  Settings,
  MoreVertical,
  Pin,
  Pencil,
  LogIn,
  Flame,
} from 'lucide-react';
import Image from 'next/image';
import { ChatHistorySkeleton } from './skeletons/ChatHistorySkeleton';
import { UserCardSkeleton } from './skeletons/UserCardSkeleton';

// Utility to group chats by date categories
function groupChatsByDate(chats: DbChatSession[], isBn: boolean) {
  const groups: { [key: string]: DbChatSession[] } = {
    pinned: [],
    today: [],
    yesterday: [],
    last7Days: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const sevenDaysAgo = today - 86400000 * 7;

  chats.forEach((chat) => {
    if (chat.isPinned) {
      groups.pinned.push(chat);
      return;
    }

    const chatDate = chat.updatedAt;
    if (chatDate >= today) groups.today.push(chat);
    else if (chatDate >= yesterday) groups.yesterday.push(chat);
    else if (chatDate >= sevenDaysAgo) groups.last7Days.push(chat);
    else groups.older.push(chat);
  });

  const labels = {
    pinned: isBn ? 'পিন করা' : 'Pinned',
    today: isBn ? 'আজ' : 'Today',
    yesterday: isBn ? 'গতকাল' : 'Yesterday',
    last7Days: isBn ? 'গত ৭ দিন' : 'Last 7 Days',
    older: isBn ? 'পুরানো' : 'Older',
  };

  return { groups, labels };
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onNewChat: () => void;
  onClearSession: () => void;
  onOpenTool: (tool: 'quiz' | 'teach_back' | 'scratchpad' | 'canvas') => void;
  activeTool: 'quiz' | 'teach_back' | 'scratchpad' | 'canvas' | null;
  savedNotesCount: number;
  messageCount: number;
  onOpenAbout: () => void;
  onOpenSettings: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  chats?: DbChatSession[];
  isLoadingChats?: boolean;
  activeChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  onPinChat?: (chatId: string, isPinned: boolean) => void;
}

export function AppSidebar({
  isOpen,
  onClose,
  language,
  onNewChat,
  onClearSession,
  onOpenTool,
  activeTool,
  savedNotesCount,
  onOpenSettings,
  onOpenAuth,
  chats,
  isLoadingChats = false,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
}: AppSidebarProps) {
  const { user, loading: isAuthLoading } = useAuth();
  const isBn = language === 'bn';

  // Local UI States for Management
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renameChatId, setRenameChatId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!activeMenuId) return;
    const handleGlobalClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [activeMenuId]);

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameChatId && renameTitle.trim()) {
      onRenameChat?.(renameChatId, renameTitle.trim());
      setRenameChatId(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteChatId) {
      onDeleteChat?.(deleteChatId);
      setDeleteChatId(null);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C86FF] to-[#6B76F5] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
              {isBn ? 'থিঙ্কওয়াইজ এআই' : 'ThinkWise AI'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action: New Chat with Premium Glow and Shortcut Badge */}
        <div className="p-3.5">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="group relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-tr from-[#7C86FF] to-[#6374FF] hover:to-[#5566FF] text-white text-[13px] font-bold shadow-[0_4px_16px_-4px_rgba(107,118,245,0.45)] hover:shadow-[0_8px_24px_-4px_rgba(107,118,245,0.6)] transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="w-4 h-4 stroke-[3] drop-shadow-sm" />
              <span className="tracking-tight">{isBn ? 'নতুন চ্যাট শুরু' : 'New Chat'}</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/20 text-white/90 border border-white/20">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-6 text-xs no-scrollbar">
          {/* Interactive Learning Tools */}
          <div>
            <div className="px-1.5 py-1 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-1.5">
              {isBn ? 'লার্নিং টুলস' : 'Learning Tools'}
            </div>
            <div className="space-y-1">
              {[
                {
                  id: 'quiz',
                  label: isBn ? 'ডায়াগনস্টিক কুইজ' : 'Diagnostic Quiz',
                  icon: HelpCircle,
                  badgeBg: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
                },
                {
                  id: 'teach_back',
                  label: isBn ? 'টিচ-ব্যাক ল্যাব' : 'Teach-Back Lab',
                  icon: Layers,
                  badgeBg: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
                },
                {
                  id: 'scratchpad',
                  label: isBn ? 'সংরক্ষিত নোটবুক' : 'Notebook & Recap',
                  icon: FileEdit,
                  badgeBg: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20',
                  count: savedNotesCount,
                },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onOpenTool(tool.id as any);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer group ${
                    activeTool === tool.id
                      ? 'bg-[var(--bg-selected)] text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tool.badgeBg}`}>
                      <tool.icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-[12px]">{tool.label}</span>
                  </div>
                  {tool.count !== undefined && tool.count > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                      {tool.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Firestore Saved Chats List with Grouping */}
          {user && (
            <div className="space-y-5">
              {isLoadingChats ? (
                <ChatHistorySkeleton isBn={isBn} />
              ) : chats && chats.length > 0 ? (
                <div className="space-y-5 content-enter">
                  {(() => {
                    const { groups, labels } = groupChatsByDate(chats, isBn);
                    return Object.entries(groups).map(([key, groupChats]) => {
                      if (groupChats.length === 0) return null;
                      return (
                        <div key={key} className="space-y-1">
                          <div className="px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.1em] mb-1">
                            {labels[key as keyof typeof labels]}
                          </div>
                          {groupChats.map((c) => {
                            const isActive = activeChatId === c.id;
                            return (
                              <div
                                key={c.id}
                                className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                                  isActive
                                    ? 'bg-[var(--bg-selected)] text-[var(--text-primary)] shadow-xs font-semibold'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectChat?.(c.id);
                                    onClose();
                                  }}
                                  className="flex items-center gap-2.5 min-w-0 flex-1 text-left py-0.5"
                                >
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                                      isActive
                                        ? 'bg-[var(--accent)] scale-100'
                                        : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-zinc-400'
                                    }`}
                                  />
                                  <span className="truncate text-[12px]">
                                    {c.title || (isBn ? 'নতুন চ্যাট' : 'New Chat')}
                                  </span>
                                </button>

                                {/* 3-Dot Dropdown Menu Trigger */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(activeMenuId === c.id ? null : c.id);
                                    }}
                                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                      activeMenuId === c.id
                                        ? 'bg-[var(--bg-hover)] opacity-100'
                                        : 'opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)]'
                                    }`}
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </button>

                                  {activeMenuId === c.id && (
                                    <div
                                      className="absolute right-0 top-full mt-1 w-40 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-md animate-fadeIn"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onPinChat?.(c.id, !c.isPinned);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                                      >
                                        <Pin className={`w-3.5 h-3.5 ${c.isPinned ? 'fill-current text-[var(--accent)]' : ''}`} />
                                        <span>{c.isPinned ? (isBn ? 'আনপিন' : 'Unpin') : (isBn ? 'পিন করুন' : 'Pin Chat')}</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setRenameChatId(c.id);
                                          setRenameTitle(c.title);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                        <span>{isBn ? 'নাম পরিবর্তন' : 'Rename'}</span>
                                      </button>
                                      <div className="h-px bg-[var(--border-subtle)] my-1" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteChatId(c.id);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>{isBn ? 'মুছে ফেলুন' : 'Delete'}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="px-3 py-4 text-center rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] content-enter">
                  <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
                    {isBn ? 'এখনও কোনো সংরক্ষিত চ্যাট নেই' : 'No saved conversations yet'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Sidebar: User Profile Card + Streak Badge */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50">
          {isAuthLoading ? (
            <UserCardSkeleton isBn={isBn} />
          ) : user ? (
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="group w-full flex items-center justify-between p-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 hover:bg-[var(--bg-hover)] transition-all duration-300 cursor-pointer shadow-2xs content-enter"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  {user.photoURL ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--border-default)]">
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'Avatar'}
                        fill
                        className="object-cover"
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold text-xs">
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--bg-surface)] rounded-full" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="font-bold text-[var(--text-primary)] text-[12px] truncate leading-tight">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  {/* Subtle Streak Badge */}
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-amber-500 font-semibold">
                    <Flame className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                    <span>{isBn ? '১ দিনের স্ট্রিক' : '1 Day Streak'}</span>
                  </div>
                </div>
              </div>
              <Settings className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:rotate-45 transition-all duration-500 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth?.();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--brand-600)] text-white text-[12px] font-bold transition-all duration-200 cursor-pointer shadow-sm content-enter"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isBn ? 'সাইন-ইন করুন' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* --- CUSTOM MANAGEMENT MODALS --- */}
      {/* 1. Rename Modal */}
      {renameChatId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">
              {isBn ? 'চ্যাটের নাম পরিবর্তন করুন' : 'Rename Chat'}
            </h3>
            <form onSubmit={handleRenameSubmit}>
              <input
                autoFocus
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] mb-5 text-[var(--text-primary)]"
                placeholder={isBn ? 'নতুন নাম লিখুন...' : 'New title...'}
              />
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setRenameChatId(null)}
                  className="flex-1 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-[var(--accent)] hover:bg-[var(--brand-600)] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isBn ? 'সেভ করুন' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {deleteChatId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 shadow-2xl">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-3.5">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5">
              {isBn ? 'চ্যাটটি মুছে ফেলতে চান?' : 'Delete this chat?'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
              {isBn
                ? 'একবার মুছে ফেললে এই কথোপকথনটি আর ফিরে পাওয়া যাবে না। আপনি কি নিশ্চিত?'
                : 'This action cannot be undone. All messages in this conversation will be permanently removed.'}
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteChatId(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors cursor-pointer"
              >
                {isBn ? 'না, থাক' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {isBn ? 'হ্যাঁ, মুছুন' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
