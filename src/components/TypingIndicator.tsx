import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  const dotVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const containerTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  };

  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 w-fit">
      <div className="flex gap-1.5 items-center justify-center h-2.5">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            variants={dotVariants}
            initial="start"
            animate="end"
            transition={{
              ...containerTransition,
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
};
