'use client';

import React, { useEffect, useRef } from 'react';

interface ComposerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClass?: string;
  align?: 'left' | 'right';
  ariaLabel?: string;
}

export function ComposerPopover({
  isOpen,
  onClose,
  children,
  widthClass = 'w-64 sm:w-72',
  align = 'left',
  ariaLabel = 'Menu',
}: ComposerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      role="menu"
      aria-label={ariaLabel}
      className={`fixed sm:absolute bottom-[76px] sm:bottom-full ${
        align === 'right' ? 'right-3 sm:right-0 sm:left-auto' : 'left-3 sm:left-0 sm:right-auto'
      } sm:mb-2.5 max-w-[calc(100vw-24px)] mx-auto z-[100] bg-white dark:bg-[#171719] border border-zinc-200 dark:border-white/[0.1] rounded-2xl shadow-2xl p-1.5 animate-fadeIn text-zinc-900 dark:text-[#F5F5F5] ${widthClass}`}
    >
      {children}
    </div>
  );
}
