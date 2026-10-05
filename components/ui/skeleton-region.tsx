import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accessible container for skeleton loading blocks.
 * Informs screen readers once politely that content is loading,
 * preventing noisy reading of meaningless empty placeholders.
 */
export function SkeletonRegion({
  label = 'Loading content...',
  children,
  className,
  ...props
}: SkeletonRegionProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn('w-full', className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
