import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Renders as fully rounded circle for avatars and icons */
  circle?: boolean;
}

export function Skeleton({ className, circle, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton', circle && 'rounded-full', className)}
      style={style}
      {...props}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: string;
}

/**
 * Renders multiple skeleton lines with realistic human-text width variation
 * (e.g. 100%, 94%, 88%, 96%, with the last line shortened to ~58%).
 */
export function SkeletonText({ lines = 3, className, lineHeight = 'h-3.5' }: SkeletonTextProps) {
  const widths = ['100%', '94%', '88%', '96%', '78%', '60%'];
  
  return (
    <div className={cn('flex flex-col gap-2.5', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(lineHeight)}
          style={{ width: i === lines - 1 ? '58%' : widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}
