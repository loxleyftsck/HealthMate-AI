import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  hoverable = false,
  bordered = true,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseStyles = 'rounded-2xl transition-all duration-300';
  
  // Choose styles based on settings
  const borderStyle = bordered
    ? 'border border-gray-100 dark:border-slate-800/80'
    : '';

  const backgroundStyle = glass
    ? 'glassmorphism dark:glassmorphism-dark shadow-glass dark:shadow-glass-dark'
    : 'bg-white dark:bg-slate-900/40 shadow-soft';

  const cardClassName = `${baseStyles} ${borderStyle} ${backgroundStyle} ${paddings[padding]} ${className}`;

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
        className={cardClassName}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClassName} {...props}>
      {children}
    </div>
  );
};
