'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimatedComposerPlaceholderProps {
  isBn: boolean;
  isVisible: boolean;
}

export function AnimatedComposerPlaceholder({ isBn, isVisible }: AnimatedComposerPlaceholderProps) {
  const [index, setIndex] = useState(0);

  const placeholders = isBn
    ? ['ThinkWise AI-কে যেকোনো কিছু জিজ্ঞাসা করুন…', 'গণিত, বিজ্ঞান, কোডিং বা যেকোনো বিষয়ে প্রশ্ন করুন…']
    : ['Ask ThinkWise AI anything…', 'Ask about math, science, coding, or any topic…'];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 4500); // Polished pacing: ~4.5s visibility per state

    return () => clearInterval(interval);
  }, [isVisible, placeholders.length]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-[12px] left-[10px] right-[10px] pointer-events-none select-none overflow-hidden max-w-full z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index + (isBn ? '-bn' : '-en')}
          initial={{ opacity: 0, filter: 'blur(6px)', y: 4, scale: 0.99 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)', y: -4, scale: 0.99 }}
          transition={{
            duration: 0.55,
            ease: [0.25, 0.1, 0.25, 1], // Premium easing
          }}
          className="text-sm sm:text-[15px] text-zinc-400 dark:text-zinc-500 font-normal truncate max-w-full leading-relaxed"
        >
          {placeholders[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
