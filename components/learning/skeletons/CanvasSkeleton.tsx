import React from 'react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface CanvasSkeletonProps {
  isBn?: boolean;
}

export function CanvasSkeleton({ isBn = false }: CanvasSkeletonProps) {
  return (
    <SkeletonRegion
      label={isBn ? 'ক্যানভাস কন্টেন্ট তৈরি হচ্ছে...' : 'Generating canvas document...'}
      className="space-y-6 w-full max-w-2xl mx-auto p-4"
    >
      {/* Document Title Header */}
      <div className="space-y-2 pb-3 border-b border-[var(--border-subtle)]">
        <Skeleton className="h-6 w-2/3 rounded-lg" />
        <Skeleton className="h-3.5 w-1/3 rounded-md" />
      </div>

      {/* Section 1 */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded-md" />
        <SkeletonText lines={4} />
      </div>

      {/* Visual / Key Takeaway Card */}
      <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton circle className="w-5 h-5 shrink-0" />
          <Skeleton className="h-3.5 w-32 rounded-md" />
        </div>
        <SkeletonText lines={2} lineHeight="h-3" />
      </div>

      {/* Section 2 */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-48 rounded-md" />
        <SkeletonText lines={3} />
      </div>
    </SkeletonRegion>
  );
}
