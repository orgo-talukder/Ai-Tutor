import React from 'react';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface ChatMessagesSkeletonProps {
  isBn?: boolean;
}

export function ChatMessagesSkeleton({ isBn = false }: ChatMessagesSkeletonProps) {
  return (
    <SkeletonRegion
      label={isBn ? 'কথোপকথনের মেসেজ লোড হচ্ছে...' : 'Loading conversation messages...'}
      className="max-w-3xl mx-auto w-full space-y-8 py-6 px-4"
    >
      {/* 1. User Message (Right Aligned) */}
      <div className="flex justify-end">
        <div className="w-[60%] sm:w-[48%] rounded-2xl rounded-tr-sm bg-[var(--bubble-user-bg)] p-4 border border-[var(--border-subtle)] space-y-2">
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-3/4 rounded-md" />
        </div>
      </div>

      {/* 2. AI Assistant Response (Left Aligned) */}
      <div className="flex gap-3.5 items-start">
        <Skeleton circle className="w-8 h-8 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-4">
          {/* Header pill */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>

          {/* Paragraph lines */}
          <SkeletonText lines={4} />

          {/* Code/Formula Box Preview */}
          <div className="w-full rounded-xl border border-[var(--code-border)] bg-[var(--code-bg)] p-4 space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
              <Skeleton className="h-2.5 w-16 rounded-sm" />
              <Skeleton className="h-2.5 w-10 rounded-sm" />
            </div>
            <Skeleton className="h-3 w-4/5 rounded-md font-mono" />
            <Skeleton className="h-3 w-2/3 rounded-md font-mono" />
            <Skeleton className="h-3 w-3/4 rounded-md font-mono" />
          </div>

          {/* Following paragraph */}
          <SkeletonText lines={3} />
        </div>
      </div>

      {/* 3. Second User Message */}
      <div className="flex justify-end">
        <div className="w-[45%] sm:w-[35%] rounded-2xl rounded-tr-sm bg-[var(--bubble-user-bg)] p-3.5 border border-[var(--border-subtle)]">
          <Skeleton className="h-3.5 w-full rounded-md" />
        </div>
      </div>

      {/* 4. Second AI Assistant Response */}
      <div className="flex gap-3.5 items-start">
        <Skeleton circle className="w-8 h-8 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-3.5 w-20 rounded-md" />
          <SkeletonText lines={3} />
        </div>
      </div>
    </SkeletonRegion>
  );
}
