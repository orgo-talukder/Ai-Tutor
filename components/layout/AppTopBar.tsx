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
          onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
          aria-label={isBn ? 'মেনু খুলুন' : 'Open navigation menu'}
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-1.5 min-w-0 select-none">
          <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-white truncate">
            {isBn ? 'থিঙ্কওয়াইজ এআই' : 'ThinkWise AI'}
          </span>
        </div>
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

        {user ? (
          <button
            type="button"
            onClick={onOpenProfile || onOpenAuth}
            className="h-8.5 sm:h-9 px-2 sm:px-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-xs font-medium flex items-center gap-2 text-zinc-800 dark:text-zinc-200 cursor-pointer shrink-0 transition-colors"
            title={user.email || 'User Account'}
          >
            {user.photoURL ? (
              <div className="relative w-5.5 h-5.5 rounded-full overflow-hidden border border-[#7C8CFF] shrink-0">
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
              <div className="w-5.5 h-5.5 rounded-full bg-[#7C8CFF]/20 text-[#7C8CFF] flex items-center justify-center text-[10px] font-bold shrink-0">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span className="hidden md:inline max-w-[110px] truncate text-[11px] font-semibold">
              {user.displayName || user.email?.split('@')[0]}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="h-8.5 sm:h-9 px-3 rounded-xl bg-[#7C8CFF] hover:bg-[#6878EF] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <LogIn className="w-3.5 h-3.5 shrink-0" />
            <span>{isBn ? 'লগইন' : 'Sign in'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
