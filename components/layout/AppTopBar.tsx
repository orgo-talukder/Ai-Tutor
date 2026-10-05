'use client';

import React from 'react';
import { AppLanguage } from '../../lib/types';
import { Menu, Plus, Share2, Sparkles, LogIn, Check } from 'lucide-react';
import { useAuth } from '../../lib/firebase/authContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import Image from 'next/image';

interface AppTopBarProps {
  onToggleSidebar: () => void;
  language: AppLanguage;
  onNewChat: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onToggleLanguage?: () => void;
  chatTitle?: string;
}

export function AppTopBar({
  onToggleSidebar,
  language,
  onNewChat,
  onOpenAuth,
  onOpenProfile,
  onToggleLanguage,
  chatTitle,
}: AppTopBarProps) {
  const { user } = useAuth();
  const isBn = language === 'bn';
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 w-full shrink-0 bg-[var(--bg-canvas)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-3 sm:px-4 flex items-center justify-between transition-colors">
      {/* Left: Sidebar Toggle + Chat Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSidebar();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer shrink-0 active:scale-95"
          aria-label={isBn ? 'সাইডবার টগল করুন' : 'Toggle sidebar'}
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[13px] sm:text-sm font-semibold text-[var(--text-primary)] truncate max-w-[160px] sm:max-w-[320px]">
            {chatTitle || (isBn ? 'নতুন কথোপকথন' : 'New Chat')}
          </span>
        </div>
      </div>

      {/* Right: Actions (Language, Theme, Share, New Chat, Profile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Language Switcher Pill */}
        {onToggleLanguage && (
          <button
            type="button"
            onClick={onToggleLanguage}
            title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            className="h-8 px-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className={!isBn ? 'text-[var(--accent)] font-extrabold' : ''}>EN</span>
            <span className="text-[var(--text-tertiary)]">/</span>
            <span className={isBn ? 'text-[var(--accent)] font-extrabold' : ''}>বাংলা</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          title={copied ? (isBn ? 'লিঙ্ক কপি হয়েছে' : 'Link copied') : (isBn ? 'চ্যাট শেয়ার করুন' : 'Share chat')}
          aria-label={isBn ? 'চ্যাট লিঙ্ক শেয়ার করুন' : 'Share chat link'}
          className="grid h-9 w-9 place-items-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all cursor-pointer active:scale-95 border border-transparent hover:border-[var(--border-subtle)]"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
        </button>

        {/* + New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="h-9 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white/[0.08] dark:hover:bg-white/[0.14] dark:text-white text-xs font-semibold border border-transparent dark:border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs active:scale-95"
          aria-label={isBn ? 'নতুন চ্যাট শুরু করুন' : 'Start new chat'}
          title={isBn ? 'নতুন চ্যাট' : 'New Chat'}
        >
          <Plus className="w-3.5 h-3.5 text-[#7C8CFF] shrink-0 stroke-[2.5]" />
          <span className="hidden sm:inline">{isBn ? 'নতুন চ্যাট' : 'New Chat'}</span>
        </button>

        {/* Auth / Avatar Quick Access */}
        {user ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full overflow-hidden border border-[var(--border-default)] hover:border-[var(--accent)] transition-all shrink-0 cursor-pointer relative"
            title={user.displayName || user.email || 'User Profile'}
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'Avatar'}
                fill
                className="object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center font-bold text-xs">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isBn ? 'লগইন' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
}
