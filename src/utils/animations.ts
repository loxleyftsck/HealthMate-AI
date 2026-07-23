import type { Variants } from 'framer-motion';

/**
 * Shared Framer Motion container variants for staggered children entrance animations.
 */
export const StaggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

/**
 * Shared Framer Motion item entrance variants (fade-in & spring slide up).
 */
export const StaggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};
