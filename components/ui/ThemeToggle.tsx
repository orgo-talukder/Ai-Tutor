'use client';

import React, { useSyncExternalStore } from 'react';
import { useTheme } from '@/lib/theme/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'button' | 'segmented';
  className?: string;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ variant = 'button', className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const currentTheme = mounted ? theme : 'dark';

  if (variant === 'segmented') {
    const options = [
      { id: 'light' as const, label: 'Light', icon: Sun },
      { id: 'dark' as const, label: 'Dark', icon: Moon },
      { id: 'system' as const, label: 'System', icon: Monitor },
    ];

    return (
      <div className={`flex items-center gap-1 p-1 bg-zinc-100 dark:bg-white/[0.05] rounded-xl border border-zinc-200/80 dark:border-white/[0.08] ${className}`}>
        {options.map((opt) => {
          const isActive = theme === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#1E1E24] text-zinc-900 dark:text-white shadow-xs font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? 'Light mode' : theme === 'dark' ? 'Dark mode' : 'System theme';

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`Current: ${label}. Click to switch theme`}
      aria-label={`Current: ${label}. Click to switch theme`}
      className={`group relative grid h-9 w-9 place-items-center rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-200 cursor-pointer active:scale-95 border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.06] ${className}`}
    >
      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
    </button>
  );
}
