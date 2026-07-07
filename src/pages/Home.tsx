import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Activity,
  Heart,
  Droplet,
  Flame,
  ArrowRight,
  Award,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HealthMetricSummary } from '../types';
import { INITIAL_DASHBOARD_DATA } from '../services/mockData';
import { useHealthCompanion } from '../context/HealthCompanionContext';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useHealthCompanion();
  const { user: profile } = useAuth();
  const [metrics, setMetrics] = useLocalStorage<HealthMetricSummary>('healthmate-metrics', INITIAL_DASHBOARD_DATA);
  const [greeting, setGreeting] = useState('Selamat datang kembali');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat pagi');
    else if (hour < 15) setGreeting('Selamat siang');
    else if (hour < 18) setGreeting('Selamat sore');
    else setGreeting('Selamat malam');
  }, []);

  const handleAddWater = () => {
    const amount = 250;
    const isGoalMetNow = metrics.waterIntake.current < metrics.waterIntake.goal && 
                         (metrics.waterIntake.current + amount) >= metrics.waterIntake.goal;

    const updated = {
      ...metrics,
      waterIntake: {
        ...metrics.waterIntake,
        current: Math.min(metrics.waterIntake.current + amount, 5000),
        logs: [
          ...metrics.waterIntake.logs,
          { id: Math.random().toString(), amount, timestamp: new Date().toISOString() },
        ],
      },
    };
    setMetrics(updated);

    if (isGoalMetNow) {
      speak('Luar biasa! Target asupan air minum Anda hari ini telah tercapai.', 'success', 6000);
    } else {
      speak('Air minum berhasil dicatat. Jaga selalu hidrasi tubuh Anda!', 'success', 4000);
    }

    // Dispatch custom event to notify TopNav
    window.dispatchEvent(new Event('metrics-updated'));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  const waterProgress = Math.round((metrics.waterIntake.current / metrics.waterIntake.goal) * 100);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Hero Welcome Banner */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-0 py-8 px-8 md:px-10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-100/80 font-display">
                Asisten Kesehatan Pribadi
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">
                {greeting}, {profile.name}!
              </h2>
              <p className="text-emerald-50/90 text-sm max-w-xl leading-relaxed">
                HealthMate AI telah mengumpulkan ringkasan aktivitas kesehatan Anda hari ini. Anda telah mencatat {metrics.waterIntake.current} ml air minum dan melakukan aktivitas fisik selama {metrics.exercise.duration} menit.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/chat')}
              className="w-fit bg-white hover:bg-emerald-50 text-emerald-700 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Mulai Konsultasi AI
            </Button>
          </div>

          {/* Decorative glowing circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl translate-y-12 pointer-events-none" />
        </Card>
      </motion.div>

      {/* Health Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* BMI Overview */}
        <motion.div variants={itemVariants}>
          <Card hoverable className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">Indeks Massa Tubuh</span>
                </div>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-3xl font-black font-display text-gray-900 dark:text-white leading-none">
                  {metrics.bmi ? metrics.bmi.bmi : 'N/A'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                  Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{metrics.bmi ? metrics.bmi.category : 'N/A'}</span>
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-50 dark:border-slate-800/40 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">Berdasarkan {profile.height} cm, {profile.weight} kg</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                Hitung Ulang <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Water Intake Overview */}
        <motion.div variants={itemVariants}>
          <Card hoverable className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400">
                    <Droplet className="w-5 h-5 fill-current" />
                  </span>
                  <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">Asupan Air Harian</span>
                </div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{waterProgress}%</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black font-display text-gray-900 dark:text-white leading-none">
                  {metrics.waterIntake.current} <span className="text-sm font-medium text-gray-400">/ {metrics.waterIntake.goal} ml</span>
                </h3>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(waterProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-50 dark:border-slate-800/40 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">Target: {metrics.waterIntake.goal} ml</span>
              <button
                onClick={handleAddWater}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/20 dark:hover:bg-sky-950/40 px-2.5 py-1 rounded-xl transition-all"
              >
                + 250 ml
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Calories Overview */}
        <motion.div variants={itemVariants}>
          <Card hoverable className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
                    <Flame className="w-5 h-5 fill-current" />
                  </span>
                  <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">Target Kalori Harian</span>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  {metrics.calories.goal - metrics.calories.current} kcal tersisa
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black font-display text-gray-900 dark:text-white leading-none">
                  {metrics.calories.current} <span className="text-sm font-medium text-gray-400">/ {metrics.calories.goal} kcal</span>
                </h3>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(waterProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-50 dark:border-slate-800/40 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">{metrics.calories.logs.length} makanan tercatat</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
              >
                Catat Makanan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Consultation Quick Links */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Consultation */}
        <Card hoverable className="relative overflow-hidden group flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold font-display text-gray-900 dark:text-white">
              Panduan Gejala & Kesehatan AI
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Tanyakan seputar gejala fisik, sakit kepala, batuk, atau keluhan kesehatan lainnya. Dapatkan informasi edukatif yang mudah dipahami.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Mulai Konsultasi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Life Recommendations */}
        <Card hoverable className="relative overflow-hidden group flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold font-display text-gray-900 dark:text-white">
              Rekomendasi Aktivitas & Gizi Seimbang
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Dapatkan rekomendasi pembagian latihan fisik, porsi kalori seimbang, dan tips untuk mengoptimalkan waktu tidur Anda.
            </p>
            <button
              onClick={() => navigate('/chat?topic=workout')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Lihat Panduan Olahraga <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
