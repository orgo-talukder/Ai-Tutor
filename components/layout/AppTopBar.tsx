'use client';

import React from 'react';
import { AppLanguage } from '../../lib/types';
import { Menu, Plus, User as UserIcon, LogIn } from 'lucide-react';
import { useAuth } from '../../lib/firebase/authContext';

import Image from 'next/image';

interface AppTopBarProps {
  onToggleSidebar: () => void;
  language: AppLanguage;
  onNewChat: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
}

export function AppTopBar({
  onToggleSidebar,
  language,
  onNewChat,
  onOpenAuth,
  onOpenProfile,
}: AppTopBarProps) {
  const { user } = useAuth();
  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-30 h-13 sm:h-14 w-full bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/[0.08] px-3 sm:px-4 flex items-center justify-between transition-colors">
      {/* Left: Hamburger menu + Brand Identity */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSidebar();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
          aria-label={isBn ? 'মেনু খুলুন' : 'Open navigation menu'}
        >
          <Menu className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Right: + New Chat Button + Auth/Profile Button */}
      <div className="flex items-center gap-2 shrink-0 pl-2">
        <button
          type="button"
          onClick={onNewChat}
          className="h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-white text-xs font-medium border border-transparent dark:border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          aria-label={isBn ? 'নতুন চ্যাট শুরু করুন' : 'Start new chat'}
          title={isBn ? 'নতুন চ্যাট' : 'New Chat'}
        >
          <Plus className="w-3.5 h-3.5 text-[#7C8CFF] shrink-0" />
          <span className="hidden sm:inline">{isBn ? 'নতুন চ্যাট' : 'New Chat'}</span>
        </button>
      </div>
    </header>
  );
}
