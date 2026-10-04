'use client';

import React from 'react';
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
} from 'lucide-react';
import Image from 'next/image';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onNewChat: () => void;
  onClearSession: () => void;
  onOpenTool: (tool: 'quiz' | 'teach_back' | 'scratchpad') => void;
  activeTool: 'quiz' | 'teach_back' | 'scratchpad' | null;
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
}: AppSidebarProps) {
  const { user, logout } = useAuth();
  const isBn = language === 'bn';

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

        {/* Primary Action: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-white text-xs font-medium border border-transparent dark:border-white/[0.08] shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#7C8CFF]" />
            <span>{isBn ? 'নতুন চ্যাট শুরু' : 'New Chat'}</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4 text-xs no-scrollbar">
          {/* Firestore Saved Chats List */}
          {user && chats && chats.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {isBn ? 'সংরক্ষিত কথোপকথন' : 'Saved Chats'}
              </div>
              <div className="mt-1 space-y-0.5">
                {chats.map((c) => {
                  const isActive = activeChatId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`group flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-black/[0.06] dark:bg-white/[0.08] text-zinc-900 dark:text-white font-medium'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectChat?.(c.id);
                          onClose();
                        }}
                        className="flex items-center gap-2 min-w-0 flex-1 text-left"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#7C8CFF] shrink-0" />
                        <span className="truncate text-xs">{c.title || (isBn ? 'নতুন চ্যাট' : 'New Chat')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(isBn ? 'এই চ্যাটটি মুছে ফেলতে চান?' : 'Delete this chat?')) {
                            onDeleteChat?.(c.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-rose-500 transition-opacity"
                        title={isBn ? 'মুছুন' : 'Delete'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Learning Tools */}
          <div>
            <div className="px-2 py-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {isBn ? 'লার্নিং টুলস' : 'Learning Tools'}
            </div>
            <div className="mt-1 space-y-1">
              {/* Quiz Lab */}
              <button
                onClick={() => {
                  onOpenTool('quiz');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeTool === 'quiz'
                    ? 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  <span>{isBn ? 'ডায়াগনস্টিক কুইজ' : 'Diagnostic Quiz'}</span>
                </div>
              </button>

              {/* Teach-Back Lab */}
              <button
                onClick={() => {
                  onOpenTool('teach_back');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeTool === 'teach_back'
                    ? 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>{isBn ? 'টিচ-ব্যাক ল্যাব' : 'Teach-Back Lab'}</span>
                </div>
              </button>

              {/* Scratchpad & Notes */}
              <button
                onClick={() => {
                  onOpenTool('scratchpad');
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeTool === 'scratchpad'
                    ? 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-900 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-[#7C8CFF]" />
                  <span>{isBn ? 'সংরক্ষিত নোটবুক' : 'Notebook & Recap'}</span>
                </div>
                {savedNotesCount > 0 && (
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-[#7C8CFF]/15 text-[#7C8CFF]">
                    {savedNotesCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: User Profile / Auth + Settings + About */}
        <div className="p-3 border-t border-zinc-200 dark:border-white/[0.06] space-y-1 text-xs">
          {user ? (
            <button
              onClick={() => {
                onOpenProfile?.();
                onClose();
              }}
              className="w-full mb-2 flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-zinc-200/60 dark:border-white/[0.06] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                {user.photoURL ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#7C8CFF] shrink-0">
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
                  <div className="w-7 h-7 rounded-full bg-[#7C8CFF]/20 text-[#7C8CFF] flex items-center justify-center font-bold text-xs shrink-0">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="min-w-0 text-left">
                  <div className="font-semibold text-zinc-900 dark:text-white truncate leading-tight">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{user.email}</div>
                </div>
              </div>
              <UserIcon className="w-4 h-4 text-zinc-400 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth?.();
                onClose();
              }}
              className="w-full mb-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#7C8CFF] hover:bg-[#6878EF] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isBn ? 'সাইন-ইন / অ্যাকাউন্ট' : 'Sign In to Save Chats'}</span>
            </button>
          )}

          {/* Settings Entry */}
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer font-medium"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
            <span>{isBn ? 'সেটিংস (Settings)' : 'Settings'}</span>
          </button>

          {/* About Entry */}
          <button
            onClick={() => {
              onOpenAbout();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4 text-zinc-400" />
            <span>{isBn ? 'অ্যাপ সম্পর্কে (About)' : 'About ThinkWise AI'}</span>
          </button>

          {/* Clear Session */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  isBn
                    ? 'আপনি কি বর্তমান চ্যাট ও মেমোরি ক্লিয়ার করতে চান?'
                    : 'Clear the current conversation and session memory?'
                )
              ) {
                onClearSession();
                onClose();
              }
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isBn ? 'সেশন ক্লিয়ার করুন' : 'Clear Session'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
