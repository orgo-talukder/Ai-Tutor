'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Info,
  MessageSquare,
  LogIn,
  LogOut,
  User as UserIcon,
  MoreVertical,
  Pin,
  Pencil,
} from 'lucide-react';
import Image from 'next/image';

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
  messageCount,
  onOpenAbout,
  onOpenSettings,
  onOpenAuth,
  onOpenProfile,
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
}: AppSidebarProps) {
  const { user, logout } = useAuth();
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-[270px] bg-white dark:bg-[#0E0E10] border-r border-zinc-200 dark:border-white/[0.06] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C8CFF] to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-white">
              {isBn ? 'থিঙ্কওয়াইজ এআই' : 'ThinkWise AI'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action: New Chat with Premium Glow */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="group relative w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-tr from-[#7C8CFF] to-[#6374FF] hover:to-[#5566FF] text-white text-[13px] font-bold shadow-[0_4px_20px_-4px_rgba(124,140,255,0.4)] hover:shadow-[0_8px_25px_-4px_rgba(124,140,255,0.6)] transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Plus className="w-4 h-4 stroke-[3] drop-shadow-sm" />
            <span className="tracking-tight">{isBn ? 'নতুন চ্যাট শুরু' : 'New Chat'}</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-7 text-xs no-scrollbar">
          {/* Interactive Learning Tools (Now first) */}
          <div>
            <div className="px-1 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] mb-2">
              {isBn ? 'লার্নিং টুলস' : 'Learning Tools'}
            </div>
            <div className="space-y-1">
              {[
                { id: 'quiz', label: isBn ? 'ডায়াগনস্টিক কুইজ' : 'Diagnostic Quiz', icon: HelpCircle, color: 'text-purple-500', bg: 'hover:bg-purple-500/10' },
                { id: 'teach_back', label: isBn ? 'টিচ-ব্যাক ল্যাব' : 'Teach-Back Lab', icon: Layers, color: 'text-emerald-500', bg: 'hover:bg-emerald-500/10' },
                { id: 'scratchpad', label: isBn ? 'সংরক্ষিত নোটবুক' : 'Notebook & Recap', icon: FileEdit, color: 'text-amber-500', bg: 'hover:bg-amber-500/10', count: savedNotesCount },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    onOpenTool(tool.id as any);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group ${
                    activeTool === tool.id
                      ? 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white font-bold'
                      : `text-zinc-500 dark:text-zinc-400 ${tool.bg} hover:text-zinc-900 dark:hover:text-zinc-200`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tool.icon className={`w-4 h-4 ${tool.color}`} />
                    <span className="text-[12px] font-medium">{tool.label}</span>
                  </div>
                  {tool.count !== undefined && tool.count > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                      {tool.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Firestore Saved Chats List with Grouping */}
          {user && chats && chats.length > 0 && (
            <div className="space-y-6">
              {(() => {
                const { groups, labels } = groupChatsByDate(chats, isBn);
                return Object.entries(groups).map(([key, groupChats]) => {
                  if (groupChats.length === 0) return null;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="px-1 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] mb-1">
                        {labels[key as keyof typeof labels]}
                      </div>
                      {groupChats.map((c) => {
                        const isActive = activeChatId === c.id;
                        return (
                          <div
                            key={c.id}
                            className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                              isActive
                                ? 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white shadow-xs'
                                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/[0.03] hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onSelectChat?.(c.id);
                                onClose();
                              }}
                              className="flex items-center gap-3 min-w-0 flex-1 text-left py-0.5"
                            >
                              <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${isActive ? 'bg-[#7C8CFF] scale-100' : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600'}`} />
                              <div className="flex flex-col min-w-0">
                                <span className={`truncate text-[12px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                                  {c.title || (isBn ? 'নতুন চ্যাট' : 'New Chat')}
                                </span>
                              </div>
                            </button>

                            {/* 3-Dot Dropdown Menu Trigger */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === c.id ? null : c.id);
                                }}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeMenuId === c.id ? 'bg-zinc-200 dark:bg-white/[0.1] opacity-100' : 'opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-white/[0.1]'}`}
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                              
                              {activeMenuId === c.id && (
                                <div 
                                  className="absolute right-0 top-full mt-1 w-40 py-1.5 bg-white dark:bg-[#1A1A1D] border border-zinc-200 dark:border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-md animate-fadeIn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      onPinChat?.(c.id, !c.isPinned); 
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
                                  >
                                    <Pin className={`w-3.5 h-3.5 ${c.isPinned ? 'fill-current text-[#7C8CFF]' : ''}`} />
                                    <span>{c.isPinned ? (isBn ? 'আনপিন' : 'Unpin') : (isBn ? 'পিন করুন' : 'Pin Chat')}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRenameChatId(c.id);
                                      setRenameTitle(c.title);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>{isBn ? 'নাম পরিবর্তন' : 'Rename'}</span>
                                  </button>
                                  <div className="h-px bg-zinc-100 dark:bg-white/[0.05] my-1" />
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
          )}
        </div>

        {/* Bottom Sidebar: Premium Glassmorphic Profile Card */}
        <div className="p-4 border-t border-zinc-200 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.01]">
          {user ? (
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="group w-full flex items-center justify-between p-3 rounded-2xl bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-zinc-200 dark:border-white/[0.05] hover:border-[#7C8CFF]/30 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-300 cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {user.photoURL ? (
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#7C8CFF]/50 transition-all">
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C8CFF]/20 to-indigo-500/20 text-[#7C8CFF] flex items-center justify-center font-bold text-sm border border-[#7C8CFF]/20 transition-all group-hover:scale-105">
                      {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0E0E10] rounded-full" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="font-bold text-zinc-900 dark:text-white text-[13px] truncate leading-tight">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">{user.email}</div>
                </div>
              </div>
              <Settings className="w-4 h-4 text-zinc-400 group-hover:text-[#7C8CFF] group-hover:rotate-45 transition-all duration-500 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth?.();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#7C8CFF] hover:bg-[#6374FF] text-white text-[13px] font-bold transition-all duration-300 cursor-pointer shadow-lg shadow-[#7C8CFF]/20"
            >
              <LogIn className="w-4 h-4" />
              <span>{isBn ? 'সাইন-ইন করুন' : 'Sign In'}</span>
            </button>
          )}

        </div>
      </aside>

      {/* --- CUSTOM MANAGEMENT MODALS --- */}
      
      {/* 1. Rename Modal */}
      {renameChatId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
              {isBn ? 'চ্যাটের নাম পরিবর্তন করুন' : 'Rename Chat'}
            </h3>
            <form onSubmit={handleRenameSubmit}>
              <input
                autoFocus
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#7C8CFF] mb-6"
                placeholder={isBn ? 'নতুন নাম লিখুন...' : 'New title...'}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRenameChatId(null)}
                  className="flex-1 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold text-white bg-[#7C8CFF] hover:bg-[#6374FF] rounded-2xl shadow-lg shadow-[#7C8CFF]/20 transition-all cursor-pointer"
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
          <div className="w-full max-w-sm bg-white dark:bg-[#121215] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
              {isBn ? 'চ্যাটটি মুছে ফেলতে চান?' : 'Delete this chat?'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              {isBn 
                ? 'একবার মুছে ফেললে এই কথোপকথনটি আর ফিরে পাওয়া সম্ভব হবে না। আপনি কি নিশ্চিত?' 
                : 'This action cannot be undone. All messages in this conversation will be permanently removed.'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteChatId(null)}
                className="flex-1 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer"
              >
                {isBn ? 'না, থাক' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
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
