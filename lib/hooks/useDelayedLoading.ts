'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useDelayedLoading Hook:
 * - If `isLoading` is true, waits `delay` ms before setting `showSkeleton = true`.
 *   This avoids annoying flashes when data loads in < 200ms.
 * - Once shown, guarantees `showSkeleton` stays active for at least `minDuration` ms
 *   to avoid jarring layout jump or flicker.
 */
export function useDelayedLoading(
  isLoading: boolean,
  delay: number = 200,
  minDuration: number = 400
): boolean {
  const [show, setShow] = useState<boolean>(false);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      showTimer = setTimeout(() => {
        shownAtRef.current = Date.now();
        setShow(true);
      }, delay);
    } else if (shownAtRef.current !== null) {
      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(0, minDuration - elapsed);
      hideTimer = setTimeout(() => {
        setShow(false);
        shownAtRef.current = null;
      }, remaining);
    } else {
      setShow(false);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isLoading, delay, minDuration]);

  return show;
}
