import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  badge,
  onClick,
}) => {
  const location = useLocation();
  // Check if link is active
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-200 select-none group
        ${
          isActive
            ? 'text-white bg-primary'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-900/50'
        }
      `}
    >
      {/* Active background slider animation using Framer Motion */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 bg-primary rounded-2xl -z-10"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}

      <div className="flex items-center gap-3">
        <span className={`w-5 h-5 flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
          {icon}
        </span>
        <span className="font-display tracking-wide">{label}</span>
      </div>

      {badge !== undefined && (
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors duration-200
            ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-700'
            }
          `}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};
