import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Droplet, Flame } from 'lucide-react';
import type { HealthMetricSummary } from '../types';
import { INITIAL_DASHBOARD_DATA } from '../services/mockData';

interface TopNavProps {
  onMenuToggle: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const [metrics, setMetrics] = useState<HealthMetricSummary>(INITIAL_DASHBOARD_DATA);

  // Load metrics to display quick updates in topnav
  useEffect(() => {
    const loadMetrics = () => {
      const saved = localStorage.getItem('healthmate-metrics');
      if (saved) {
        setMetrics(JSON.parse(saved));
      }
    };
    
    loadMetrics();
    window.addEventListener('storage', loadMetrics);
    window.addEventListener('metrics-updated', loadMetrics);
    
    return () => {
      window.removeEventListener('storage', loadMetrics);
      window.removeEventListener('metrics-updated', loadMetrics);
    };
  }, [location]);

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Beranda';
    if (path.startsWith('/chat')) return 'Konsultasi';
    if (path.startsWith('/dashboard')) return 'Dasbor Kesehatan';
    if (path.startsWith('/settings')) return 'Pengaturan';
    return 'Halaman Tidak Ditemukan';
  };

  const waterProgress = Math.round((metrics.waterIntake.current / metrics.waterIntake.goal) * 100);
  const caloriesProgress = Math.round((metrics.calories.current / metrics.calories.goal) * 100);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/80">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800/50 xl:hidden transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold font-display text-gray-900 dark:text-white leading-none">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Health Metrics Snapshot & Notification icon */}
      <div className="flex items-center gap-6">
        {/* Quick Health Stats - Desktop Only */}
        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
          {/* Hydration Stat */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border border-sky-100/30 dark:border-sky-900/30">
            <Droplet className="w-3.5 h-3.5 fill-current animate-pulse-slow" />
            <span>Air: {metrics.waterIntake.current} ml ({waterProgress}%)</span>
          </div>

          {/* Calorie Stat */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/30">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Kalori: {metrics.calories.current} kcal ({caloriesProgress}%)</span>
          </div>
        </div>

        {/* Notifications and Settings quick elements */}
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800/50 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white dark:border-slate-900" />
          </button>
        </div>
      </div>
    </header>
  );
};
