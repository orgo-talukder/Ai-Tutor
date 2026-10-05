import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface QuizQuestionSkeletonProps {
  isBn?: boolean;
}

export function QuizQuestionSkeleton({ isBn = false }: QuizQuestionSkeletonProps) {
  return (
    <SkeletonRegion
      label={isBn ? 'কুইজ প্রশ্ন তৈরি হচ্ছে...' : 'Generating diagnostic quiz...'}
      className="space-y-6 max-w-xl mx-auto w-full pt-2"
    >
      {/* Top Meta: Question counter & score pill */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>

      {/* Progress Bar */}
      <Skeleton className="h-2 w-full rounded-full" />

      {/* Question Card */}
      <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3 shadow-2xs">
        <Skeleton className="h-4 w-24 rounded-sm" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-4/5 rounded-md" />
      </div>

      {/* 4 Option Buttons */}
      <div className="space-y-3">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="w-full flex items-center gap-3.5 p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-canvas)]"
          >
            <Skeleton circle className="w-6 h-6 shrink-0" />
            <Skeleton
              className="h-4 rounded-md"
              style={{ width: idx % 2 === 0 ? '75%' : '60%' }}
            />
          </div>
        ))}
      </div>

      {/* Bottom hint block */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </SkeletonRegion>
  );
}
