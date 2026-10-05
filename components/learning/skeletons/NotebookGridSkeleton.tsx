import React from 'react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface NotebookGridSkeletonProps {
  isBn?: boolean;
  count?: number;
}

export function NotebookGridSkeleton({ isBn = false, count = 4 }: NotebookGridSkeletonProps) {
  return (
    <SkeletonRegion
      label={isBn ? 'সংরক্ষিত নোট লোড হচ্ছে...' : 'Loading saved notebook notes...'}
      className="space-y-4"
    >
      {/* Top action bar preview */}
      <div className="flex items-center justify-between pb-1">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>

      {/* Note cards list */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-2xs"
          >
            {/* Header: Tag + Date */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>

            {/* Title */}
            <Skeleton
              className="h-4 rounded-md"
              style={{ width: idx % 2 === 0 ? '70%' : '55%' }}
            />

            {/* Note Snippet */}
            <SkeletonText lines={2} lineHeight="h-3" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}
