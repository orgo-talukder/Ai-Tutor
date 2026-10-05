import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface ChatHistorySkeletonProps {
  isBn?: boolean;
}

export function ChatHistorySkeleton({ isBn = false }: ChatHistorySkeletonProps) {
  const topWidths = ['76%', '62%', '84%', '58%'];
  const bottomWidths = ['70%', '82%', '64%'];

  return (
    <SkeletonRegion
      label={isBn ? 'চ্যাট হিস্ট্রি লোড হচ্ছে...' : 'Loading chat history...'}
      className="space-y-4 px-1"
    >
      {/* Group 1: Today */}
      <div>
        <div className="px-2.5 mb-1.5 flex items-center">
          <Skeleton className="h-2.5 w-12 rounded-sm" />
        </div>
        <div className="space-y-1">
          {topWidths.map((width, idx) => (
            <div
              key={`today-${idx}`}
              className="w-full flex items-center px-3 py-2 rounded-xl border border-transparent"
            >
              <div className="flex items-center gap-2.5 w-full">
                <Skeleton className="w-3.5 h-3.5 rounded-sm shrink-0" />
                <Skeleton className="h-3 rounded-md" style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group 2: Previous 7 Days */}
      <div>
        <div className="px-2.5 mb-1.5 flex items-center">
          <Skeleton className="h-2.5 w-20 rounded-sm" />
        </div>
        <div className="space-y-1">
          {bottomWidths.map((width, idx) => (
            <div
              key={`prev-${idx}`}
              className="w-full flex items-center px-3 py-2 rounded-xl border border-transparent"
            >
              <div className="flex items-center gap-2.5 w-full">
                <Skeleton className="w-3.5 h-3.5 rounded-sm shrink-0" />
                <Skeleton className="h-3 rounded-md" style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}
