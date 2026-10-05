import React from 'react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface TeachBackSkeletonProps {
  isBn?: boolean;
}

export function TeachBackSkeleton({ isBn = false }: TeachBackSkeletonProps) {
  return (
    <SkeletonRegion
      label={isBn ? 'আপনার ব্যাখ্যা মূল্যায়ন করা হচ্ছে...' : 'Evaluating your Feynman explanation...'}
      className="space-y-5 max-w-xl mx-auto w-full pt-2"
    >
      {/* Assessment Header Card */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton circle className="w-6 h-6 shrink-0" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <SkeletonText lines={3} />
      </div>

      {/* Strengths Card */}
      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton circle className="w-4 h-4 bg-emerald-500/20 shrink-0" />
          <Skeleton className="h-3.5 w-36 bg-emerald-500/20 rounded-md" />
        </div>
        <SkeletonText lines={2} lineHeight="h-3" />
      </div>

      {/* Misconceptions / Missing Concepts Card */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton circle className="w-4 h-4 bg-amber-500/20 shrink-0" />
          <Skeleton className="h-3.5 w-44 bg-amber-500/20 rounded-md" />
        </div>
        <SkeletonText lines={2} lineHeight="h-3" />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </SkeletonRegion>
  );
}
