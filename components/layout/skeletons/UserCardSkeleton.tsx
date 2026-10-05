import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonRegion } from '@/components/ui/skeleton-region';

interface UserCardSkeletonProps {
  isBn?: boolean;
}

export function UserCardSkeleton({ isBn = false }: UserCardSkeletonProps) {
  return (
    <SkeletonRegion
      label={isBn ? 'ব্যবহারকারীর প্রোফাইল লোড হচ্ছে...' : 'Loading user profile...'}
      className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Skeleton circle className="w-8 h-8 shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-2.5 w-16 rounded-md" />
        </div>
      </div>
      <Skeleton className="w-4 h-4 rounded-md shrink-0" />
    </SkeletonRegion>
  );
}
