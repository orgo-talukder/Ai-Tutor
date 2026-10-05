export const ease = [0.16, 1, 0.3, 1] as const;
export const easeSoftSpring = [0.34, 1.3, 0.64, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.18, ease: [0.64, 0, 0.78, 0] } },
};

export const stagger = (delay = 0.06) => ({
  visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.18, ease } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.12 } },
};

export const slideInLeft = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.28, ease } },
  exit: { x: '-100%', transition: { duration: 0.2, ease: [0.64, 0, 0.78, 0] } },
};
