import React from 'react';
import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  leftIcon?: React.ReactNode;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onClick,
  active = false,
  leftIcon,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer select-none';
  
  const activeStyles = 'bg-primary text-white shadow-sm shadow-emerald-500/20';
  const inactiveStyles = 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100 dark:bg-slate-900/50 dark:text-gray-300 dark:hover:bg-slate-800/80 dark:border-slate-800/80';

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${active ? activeStyles : inactiveStyles} ${className}`}
    >
      {leftIcon && <span className="text-base flex items-center justify-center">{leftIcon}</span>}
      <span>{label}</span>
    </motion.div>
  );
};
