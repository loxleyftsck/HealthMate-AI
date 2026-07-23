import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Droplet,
  Flame,
  Dumbbell,
  Moon,
  Heart,
  Plus,
  Trash2,
  Check,
  Calendar,
  MessageSquare,
  Pill,
  RotateCcw,
  Sparkles,
  Send,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { HealthMetricSummary, WaterLog, CalorieLog, ExerciseLog, SleepLog, BMIRecord, ChatSession } from '../types';
import { INITIAL_DASHBOARD_DATA, MOCK_CHAT_HISTORY } from '../services/mockData';
import { useHealthCompanion } from '../context/HealthCompanionContext';
import { BmiBodyGauge } from '../components/BmiBodyGauge';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const DEFAULT_MEDICATIONS: Medication[] = [
  { id: 'med-1', name: 'Vitamin C 500mg', dosage: '1 Tablet', time: 'Pagi (08:00)', taken: false },
  { id: 'med-2', name: 'Omega 3 Fish Oil', dosage: '1 Kapsul', time: 'Malam (20:00)', taken: false },
  { id: 'med-3', name: 'B-Complex', dosage: '1 Tablet', time: 'Siang (12:00)', taken: false },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useHealthCompanion();
  const [metrics, setMetrics] = useLocalStorage<HealthMetricSummary>('healthmate-metrics', INITIAL_DASHBOARD_DATA);
  const [meds, setMeds] = useLocalStorage<Medication[]>('healthmate-meds', DEFAULT_MEDICATIONS);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // Load chat sessions to find the last consultation
  useEffect(() => {
    const saved = localStorage.getItem('healthmate-chat-sessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch {
        setSessions(MOCK_CHAT_HISTORY);
      }
    } else {
      setSessions(MOCK_CHAT_HISTORY);
    }
  }, []);

  // BMI local inputs state
  const [weightInput, setWeightInput] = useState(metrics.bmi?.weight.toString() || '70');
  const [heightInput, setHeightInput] = useState(metrics.bmi?.height.toString() || '175');

  // Water local inputs state
  const [waterGoalInput, setWaterGoalInput] = useState(metrics.waterIntake.goal.toString());

  // Calorie local inputs state
  const [foodName, setFoodName] = useState('');
  const [caloriesAmount, setCaloriesAmount] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  // Exercise local inputs state
  const [activityType, setActivityType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');
  const [exerciseSteps, setExerciseSteps] = useState('');

  // Sleep local inputs state
  const [sleepDuration, setSleepDuration] = useState('');
  const [sleepQuality, setSleepQuality] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Good');

  const MAX_LOGS = 50;

  // Trigger metrics update custom event
  const notifyMetricsUpdated = () => {
    window.dispatchEvent(new Event('metrics-updated'));
  };

  // Reset semua data harian (total tetap, log hari ini dihapus)
  const handleResetToday = () => {
    if (!confirm('Reset semua pencatatan hari ini? Data historis tetap tersimpan.')) return;
    const reset = {
      ...metrics,
      waterIntake: { ...metrics.waterIntake, current: 0, logs: [] },
      calories: { ...metrics.calories, current: 0, logs: [] },
      exercise: { ...metrics.exercise, duration: 0, steps: 0, logs: [] },
      sleep: { ...metrics.sleep, duration: 0, logs: [] },
    };
    setMetrics(reset);
    speak('Data harian berhasil direset. Semangat menjalani hari baru!', 'success', 5000);
    notifyMetricsUpdated();
  };

  // Teruskan Laporan Dasbor ke Konsultasi Chat AI
  const handleForwardReportToConsultation = () => {
    const bmiInfo = metrics.bmi
      ? `${metrics.bmi.bmi} kg/m² (${metrics.bmi.category})`
      : 'Belum dihitung';

    const waterPct = Math.round((metrics.waterIntake.current / metrics.waterIntake.goal) * 100);
    const calRemaining = metrics.calories.goal - metrics.calories.current;

    const reportPrompt = `[Laporan Kesehatan Dasbor Saya]
• Indeks Massa Tubuh (IMT): ${bmiInfo} (TB: ${heightInput} cm, BB: ${weightInput} kg)
• Asupan Air Harian: ${metrics.waterIntake.current} / ${metrics.waterIntake.goal} ml (${waterPct}%)
• Konsumsi Kalori: ${metrics.calories.current} / ${metrics.calories.goal} kcal (${calRemaining > 0 ? `${calRemaining} kcal tersisa` : 'target terpenuhi'})
• Durasi Olahraga: ${metrics.exercise.duration} menit (${metrics.exercise.steps} langkah)
• Durasi Tidur: ${metrics.sleep.duration} jam (${metrics.sleep.quality || 'Baik'})
• Detak Jantung / Tensi: ${metrics.heartHealth.bpm} BPM (${metrics.heartHealth.bloodPressure})

Halo Medi AI! Mohon berikan analisis komprehensif, evaluasi gaya hidup, serta rekomendasi kesehatan untuk laporan dasbor harian saya di atas.`;

    sessionStorage.setItem('pending_health_report_prompt', reportPrompt);
    speak('Laporan kesehatan dasbor Anda berhasil diteruskan ke Konsultasi AI!', 'success', 5000);
    navigate('/chat');
  };

  // BMI calculations
  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightInput);
    const h = parseFloat(heightInput);
    if (!w || !h) return;

    const heightM = h / 100;
    const bmiVal = parseFloat((w / (heightM * heightM)).toFixed(1));

    // WHO Asia-Pacific 2004 cutoffs (appropriate for Indonesian users)
    let cat = 'Berat Badan Normal';
    if (bmiVal < 18.5) cat = 'Kurus (Underweight)';
    else if (bmiVal < 23.0) cat = 'Berat Badan Normal';
    else if (bmiVal < 27.5) cat = 'Gemuk (Overweight)';
    else cat = 'Sangat Gemuk (Obese)';

    const newRecord: BMIRecord = {
      id: Math.random().toString(),
      weight: w,
      height: h,
      bmi: bmiVal,
      category: cat,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...metrics,
      bmi: newRecord,
    };
    setMetrics(updated);
    
    // Sync to user profile as well
    const savedProfile = localStorage.getItem('healthmate-profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      localStorage.setItem(
        'healthmate-profile',
        JSON.stringify({ ...parsed, weight: w, height: h })
      );
    }

    speak(`IMT Anda berhasil dihitung! Kategori Anda: ${cat}. Mari jaga kesehatan Anda.`, 'success', 7000);
    notifyMetricsUpdated();
  };

  // Water logs
  const addWater = (amount: number) => {
    const isGoalMetNow = metrics.waterIntake.current < metrics.waterIntake.goal && 
                         (metrics.waterIntake.current + amount) >= metrics.waterIntake.goal;

    const newLog: WaterLog = {
      id: Math.random().toString(),
      amount,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...metrics,
      waterIntake: {
        ...metrics.waterIntake,
        current: metrics.waterIntake.current + amount,
        logs: [newLog, ...metrics.waterIntake.logs].slice(0, MAX_LOGS),
      },
    };

    setMetrics(updated);

    if (isGoalMetNow) {
      speak('Luar biasa! Target asupan air minum Anda hari ini telah tercapai.', 'success', 6000);
    } else {
      speak('Air minum berhasil dicatat. Jaga selalu hidrasi tubuh Anda!', 'success', 4000);
    }

    notifyMetricsUpdated();
  };

  const deleteWaterLog = (id: string, amount: number) => {
    const updated = {
      ...metrics,
      waterIntake: {
        ...metrics.waterIntake,
        current: Math.max(0, metrics.waterIntake.current - amount),
        logs: metrics.waterIntake.logs.filter((log) => log.id !== id),
      },
    };
    setMetrics(updated);
    notifyMetricsUpdated();
  };

  const updateWaterGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = parseInt(waterGoalInput);
    if (!newGoal) return;

    const updated = {
      ...metrics,
      waterIntake: {
        ...metrics.waterIntake,
        goal: newGoal,
      },
    };
    setMetrics(updated);
    notifyMetricsUpdated();
  };

  // Calorie logs
  const addCalorieLog = (e: React.FormEvent) => {
    e.preventDefault();
    const name = foodName.trim() || 'Makanan Tercatat';
    const cals = parseInt(caloriesAmount);
    if (!cals) return;

    const newLog: CalorieLog = {
      id: Math.random().toString(),
      amount: cals,
      timestamp: new Date().toISOString(),
      type: mealType,
      foodName: name,
    };

    const updated = {
      ...metrics,
      calories: {
        ...metrics.calories,
        current: metrics.calories.current + cals,
        logs: [newLog, ...metrics.calories.logs].slice(0, MAX_LOGS),
      },
    };

    setMetrics(updated);
    setFoodName('');
    setCaloriesAmount('');
    notifyMetricsUpdated();
  };

  const deleteCalorieLog = (id: string, amount: number) => {
    const updated = {
      ...metrics,
      calories: {
        ...metrics.calories,
        current: Math.max(0, metrics.calories.current - amount),
        logs: metrics.calories.logs.filter((log) => log.id !== id),
      },
    };
    setMetrics(updated);
    notifyMetricsUpdated();
  };

  // Exercise logs
  const addExerciseLog = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(exerciseDuration);
    const steps = parseInt(exerciseSteps) || 0;
    const type = activityType.trim() || 'Aktivitas';
    if (!duration) return;

    const newLog: ExerciseLog = {
      id: Math.random().toString(),
      duration,
      steps,
      activityType: type,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...metrics,
      exercise: {
        duration: metrics.exercise.duration + duration,
        steps: metrics.exercise.steps + steps,
        logs: [newLog, ...metrics.exercise.logs].slice(0, MAX_LOGS),
      },
    };

    setMetrics(updated);
    setActivityType('');
    setExerciseDuration('');
    setExerciseSteps('');
    notifyMetricsUpdated();
  };

  const deleteExerciseLog = (id: string, duration: number, steps: number) => {
    const updated = {
      ...metrics,
      exercise: {
        duration: Math.max(0, metrics.exercise.duration - duration),
        steps: Math.max(0, metrics.exercise.steps - steps),
        logs: metrics.exercise.logs.filter((log) => log.id !== id),
      },
    };
    setMetrics(updated);
    notifyMetricsUpdated();
  };

  // Sleep logs
  const addSleepLog = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseFloat(sleepDuration);
    if (!duration) return;

    const newLog: SleepLog = {
      id: Math.random().toString(),
      duration,
      quality: sleepQuality,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...metrics,
      sleep: {
        duration,
        quality: sleepQuality,
        logs: [newLog, ...metrics.sleep.logs].slice(0, MAX_LOGS),
      },
    };

    setMetrics(updated);
    setSleepDuration('');

    if (duration >= 7) {
      speak('Kerja bagus! Waktu tidur Anda sudah memenuhi target untuk pemulihan optimal.', 'success', 6000);
    } else {
      speak('Tidur yang cukup sangat penting untuk menjaga daya tahan tubuh Anda.', 'success', 5000);
    }

    notifyMetricsUpdated();
  };

  // Medication Toggle
  const toggleMedication = (id: string) => {
    const updatedMeds = meds.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med));
    setMeds(updatedMeds);
  };

  // ── Streak Gamification ──────────────────────────────────────────────────
  const [streak, setStreak] = useState(0);
  const [streakMilestone, setStreakMilestone] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const raw = localStorage.getItem('healthmate-streak');
    const data = raw ? JSON.parse(raw) : { lastActive: '', count: 0 };

    if (data.lastActive === today) {
      // Already counted today
      setStreak(data.count);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = data.lastActive === yesterday.toDateString();
      const newCount = isConsecutive ? data.count + 1 : 1;
      const updated = { lastActive: today, count: newCount };
      localStorage.setItem('healthmate-streak', JSON.stringify(updated));
      setStreak(newCount);

      // Check milestones
      if (newCount === 7) setStreakMilestone('🥈 7 Hari Berturut-turut!');
      else if (newCount === 30) setStreakMilestone('🥇 30 Hari Hebat!');
      else if (newCount === 100) setStreakMilestone('🏆 100 Hari Legenda!');
    }
  }, []);

  const getStreakMessage = (days: number) => {
    if (days >= 100) return 'Legenda Kesehatan! 🏆';
    if (days >= 30) return 'Konsistensi Luar Biasa! 🥇';
    if (days >= 14) return 'Dua Minggu Kuat! 💪';
    if (days >= 7) return 'Satu Minggu Penuh! 🥈';
    if (days >= 3) return 'Mulai Membangun Kebiasaan!';
    return 'Ayo Jaga Konsistensinya!';
  };
  // ─────────────────────────────────────────────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  const getSleepQualityBadge = (qual: string) => {
    if (qual === 'Excellent' || qual === 'Sangat Baik') return 'success';
    if (qual === 'Good' || qual === 'Baik') return 'info';
    if (qual === 'Fair' || qual === 'Cukup') return 'warning';
    return 'danger';
  };

  const getTranslatedSleepQuality = (qual: string) => {
    if (qual === 'Excellent') return 'Sangat Baik';
    if (qual === 'Good') return 'Baik';
    if (qual === 'Fair') return 'Cukup';
    if (qual === 'Poor') return 'Kurang';
    return qual;
  };

  const getTranslatedMealType = (type: string) => {
    if (type === 'breakfast') return 'Sarapan';
    if (type === 'lunch') return 'Makan Siang';
    if (type === 'dinner') return 'Makan Malam';
    return 'Camilan';
  };

  const latestSession = sessions.length > 0
    ? [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto"
    >
      
      {/* Daily Reset Bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Catat dan pantau aktivitas kesehatan Anda hari ini
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleForwardReportToConsultation}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/20"
            title="Teruskan seluruh laporan dasbor ke Chat AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Teruskan ke Chat AI
          </button>
          <button
            onClick={handleResetToday}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-colors"
            title="Reset semua data hari ini"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Hari Ini
          </button>
        </div>
      </div>

      {/* ── FORWARD DASHBOARD REPORT TO AI BANNER ── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 z-10">
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md text-white shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold font-display leading-snug">
              Konsultasikan Laporan Dasbor ke Chat AI
            </h3>
            <p className="text-xs text-emerald-100/90 font-medium">
              Kirim ringkasan riwayat IMT, hidrasi air, kalori, tidur, dan olahraga Anda langsung ke Medi AI untuk analisis medis personal.
            </p>
          </div>
        </div>

        <button
          onClick={handleForwardReportToConsultation}
          className="z-10 shrink-0 px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5 text-emerald-600" />
          <span>Teruskan Laporan Sekarang</span>
        </button>

        {/* Decorative Glow Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
      </motion.div>

      {/* ── Streak Gamification Banner ─────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl px-5 py-4 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-orange-500/8 to-rose-500/10 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-rose-500/15 border border-amber-200/40 dark:border-amber-500/20"
      >
        {/* Decorative glow */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 min-w-0">
          {/* Fire icon + streak count */}
          <div className="relative shrink-0">
            <span className="text-3xl select-none" role="img" aria-label="streak">
              {streak >= 30 ? '🏆' : streak >= 7 ? '🔥' : '✨'}
            </span>
            {streak > 0 && (
              <span className="absolute -bottom-1 -right-2 text-[10px] font-black text-white bg-amber-500 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {streak > 99 ? '99+' : streak}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
              {streak > 0 ? `${streak} Hari Streak!` : 'Mulai Streak Hari Ini'}
            </p>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/80 truncate">
              {getStreakMessage(streak)}
            </p>
          </div>
        </div>

        {/* Milestone badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
            streak >= 7
              ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
              : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-slate-800 dark:text-gray-600 dark:border-slate-700'
          }`}>7 hari</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
            streak >= 30
              ? 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/40'
              : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-slate-800 dark:text-gray-600 dark:border-slate-700'
          }`}>30 hari</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
            streak >= 100
              ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40'
              : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-slate-800 dark:text-gray-600 dark:border-slate-700'
          }`}>100 hari</span>
        </div>

        {/* Milestone pop notification */}
        {streakMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-2 right-2 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-bold shadow-lg"
          >
            {streakMilestone}
          </motion.div>
        )}
      </motion.div>
      {/* ─────────────────────────────────────────────────────────── */}

      {/* 2-Column Grid for Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. BMI CALCULATOR CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Kalkulator & Peta Anatomi IMT (BMI)</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Klasifikasi massa tubuh & estimasi komposisi lemak tubuh WHO Asia-Pasifik</p>
                  </div>
                </div>

                {/* Inline Quick Calculation Input Form */}
                <form onSubmit={calculateBMI} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <div className="w-28">
                    <Input
                      label="BB (kg)"
                      type="number"
                      min="30"
                      max="300"
                      step="0.1"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      label="TB (cm)"
                      type="number"
                      min="100"
                      max="250"
                      value={heightInput}
                      onChange={(e) => setHeightInput(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="py-2.5 px-4 mt-5 rounded-2xl shrink-0">
                    Hitung
                  </Button>
                </form>
              </div>

              {/* BmiBodyGauge Component with Arc Gauge & SVG Silhouette */}
              <BmiBodyGauge
                heightCm={parseFloat(heightInput) || 170}
                weightKg={parseFloat(weightInput) || 70}
              />
            </div>
          </Card>
        </motion.div>

        {/* 2. WATER HYDRATION CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Droplet className="w-6 h-6 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Asupan Air Harian</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Catat dan pantau asupan air minum Anda</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  Target: {metrics.waterIntake.goal} ml
                </span>
              </div>

              {/* Quick add water buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => addWater(250)}
                  className="py-3 border-sky-100 hover:bg-sky-50/50 hover:text-sky-600 dark:border-sky-950/30 dark:hover:bg-sky-950/20 text-sky-500 rounded-2xl"
                >
                  + 250 ml (Gelas)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addWater(500)}
                  className="py-3 border-sky-100 hover:bg-sky-50/50 hover:text-sky-600 dark:border-sky-950/30 dark:hover:bg-sky-950/20 text-sky-500 rounded-2xl"
                >
                  + 500 ml (Botol)
                </Button>
              </div>

              {/* Edit goal inline */}
              <form onSubmit={updateWaterGoal} className="flex gap-2 items-end pt-2">
                <Input
                  label="Sesuaikan Target Air Harian (ml)"
                  type="number"
                  min="500"
                  max="10000"
                  value={waterGoalInput}
                  onChange={(e) => setWaterGoalInput(e.target.value)}
                  className="py-2"
                />
                <Button type="submit" variant="secondary" className="py-2.5 rounded-2xl">
                  Simpan
                </Button>
              </form>
            </div>

            {/* Water log list */}
            <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Log Asupan Hari Ini</span>
              {metrics.waterIntake.logs.length === 0 ? (
                <span className="text-xs text-gray-400 italic block">Belum ada asupan air yang tercatat.</span>
              ) : (
                metrics.waterIntake.logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/60 rounded-xl text-xs font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">Minum {log.amount} ml</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => deleteWaterLog(log.id, log.amount)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* 3. CALORIES & MEALS CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Flame className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Pencatat Kalori & Makanan</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Pantau konsumsi kalori harian Anda</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Target: {metrics.calories.goal} kcal
                </span>
              </div>

              {/* Log meal inputs */}
              <form onSubmit={addCalorieLog} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nama Makanan / Minuman"
                    placeholder="mis. Dada ayam bakar"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                  />
                  <Input
                    label="Kalori (kcal)"
                    type="number"
                    placeholder="mis. 250"
                    min="1"
                    max="5000"
                    value={caloriesAmount}
                    onChange={(e) => setCaloriesAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400">Jenis Makanan:</span>
                    <select
                      value={mealType}
                      onChange={(e: any) => setMealType(e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 font-semibold outline-none"
                    >
                      <option value="breakfast">Sarapan</option>
                      <option value="lunch">Makan Siang</option>
                      <option value="dinner">Makan Malam</option>
                      <option value="snack">Camilan</option>
                    </select>
                  </div>
                  <Button type="submit" size="sm" className="rounded-xl px-4 py-2" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Catat Makanan
                  </Button>
                </div>
              </form>
            </div>

            {/* Calorie log list */}
            <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Daftar Makanan Hari Ini</span>
              {metrics.calories.logs.length === 0 ? (
                <span className="text-xs text-gray-400 italic block">Belum ada makanan yang dicatat.</span>
              ) : (
                metrics.calories.logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2.5 px-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/60 rounded-xl text-xs font-semibold">
                    <div className="flex flex-col min-w-0">
                      <span className="text-gray-800 dark:text-gray-200 truncate font-semibold">{log.foodName}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{getTranslatedMealType(log.type)}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{log.amount} kcal</span>
                      <button
                        onClick={() => deleteCalorieLog(log.id, log.amount)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* 4. EXERCISE ACTIVITY CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Dumbbell className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Aktivitas Fisik</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Catat latihan fisik dan langkah harian Anda</p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-xs font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400">{metrics.exercise.duration} menit</span>
                  <span className="text-gray-400">{metrics.exercise.steps} langkah</span>
                </div>
              </div>

              {/* Log exercise inputs */}
              <form onSubmit={addExerciseLog} className="grid grid-cols-2 gap-4">
                <Input
                  label="Aktivitas (mis. Sepeda, Lari)"
                  placeholder="Lari Santai"
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  required
                />
                <Input
                  label="Durasi (menit)"
                  type="number"
                  placeholder="30"
                  min="1"
                  max="300"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(e.target.value)}
                  required
                />
                <div className="col-span-2 flex items-end gap-3">
                  <Input
                    label="Jumlah Langkah (opsional)"
                    type="number"
                    placeholder="3000"
                    min="0"
                    value={exerciseSteps}
                    onChange={(e) => setExerciseSteps(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="rounded-xl px-4 py-2.5 shrink-0" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Catat Aktivitas
                  </Button>
                </div>
              </form>
            </div>

            {/* Exercise log list */}
            <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Log Latihan Hari Ini</span>
              {metrics.exercise.logs.length === 0 ? (
                <span className="text-xs text-gray-400 italic block">Belum ada aktivitas fisik yang dicatat.</span>
              ) : (
                metrics.exercise.logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/60 rounded-xl text-xs font-semibold">
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-300 font-bold">{log.activityType}</span>
                      <span className="text-[10px] text-gray-400">{log.duration} menit {log.steps > 0 ? `• ${log.steps} langkah` : ''}</span>
                    </div>
                    <button
                      onClick={() => deleteExerciseLog(log.id, log.duration, log.steps)}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* 5. SLEEP COACH CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Moon className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Jurnal Tidur</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Catat dan pantau waktu tidur malam Anda</p>
                  </div>
                </div>
                {metrics.sleep.logs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant={getSleepQualityBadge(metrics.sleep.quality)}>{getTranslatedSleepQuality(metrics.sleep.quality)}</Badge>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{metrics.sleep.duration} jam</span>
                  </div>
                )}
              </div>

              {/* Log sleep inputs */}
              <form onSubmit={addSleepLog} className="grid grid-cols-2 gap-4 items-end">
                <Input
                  label="Durasi Tidur (jam)"
                  type="number"
                  step="0.1"
                  min="1"
                  max="24"
                  placeholder="7.5"
                  value={sleepDuration}
                  onChange={(e) => setSleepDuration(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Kualitas</label>
                  <select
                    value={sleepQuality}
                    onChange={(e: any) => setSleepQuality(e.target.value)}
                    className="px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 text-xs font-semibold text-gray-800 dark:text-gray-200 dark:bg-slate-900/50 outline-none h-[42px]"
                  >
                    <option value="Excellent">Sangat Baik</option>
                    <option value="Good">Baik</option>
                    <option value="Fair">Cukup</option>
                    <option value="Poor">Kurang</option>
                  </select>
                </div>
                <Button type="submit" className="col-span-2 py-2.5 rounded-2xl" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Catat Waktu Tidur
                </Button>
              </form>
            </div>

            {/* Sleep logs summary list */}
            <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Riwayat Kualitas Tidur</span>
              {metrics.sleep.logs.length === 0 ? (
                <span className="text-xs text-gray-400 italic block">Belum ada catatan tidur.</span>
              ) : (
                metrics.sleep.logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/60 rounded-xl text-xs font-semibold">
                    <span className="text-gray-700 dark:text-gray-300">Tidur selama {log.duration} jam</span>
                    <div className="flex items-center gap-3">
                      <Badge variant={getSleepQualityBadge(log.quality)}>{getTranslatedSleepQuality(log.quality)}</Badge>
                      <span className="text-[10px] text-gray-400">
                        {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* 6. HEART HEALTH CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse">
                    <Heart className="w-6 h-6 fill-current" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Kesehatan Jantung</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Pantau denyut jantung dan tekanan darah</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/60 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Denyut Jantung</span>
                  <span className="text-3xl font-black font-display text-gray-900 dark:text-white leading-none">
                    {metrics.heartHealth.bpm}
                  </span>
                  <span className="text-xs text-gray-400 block font-semibold">bpm (Istirahat)</span>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/60 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tekanan Darah</span>
                  <span className="text-3xl font-black font-display text-gray-900 dark:text-white leading-none">
                    {metrics.heartHealth.bloodPressure}
                  </span>
                  <span className="text-xs text-gray-400 block font-semibold">mmHg (Optimal)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Catatan Denyut Jantung</span>
              {metrics.heartHealth.history.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/60 rounded-xl text-xs font-semibold">
                  <span className="text-gray-700 dark:text-gray-300">Nadi: {h.bpm} bpm</span>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{h.bp} mmHg</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 7. NEW: PENGINGAT OBAT (MEDICATION REMINDER) CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Pill className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Pengingat Obat</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Daftar obat dan suplemen harian Anda</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {meds.filter(m => m.taken).length} / {meds.length} Diminum
                </span>
              </div>

              {/* Medication Checklist */}
              <div className="space-y-3">
                {meds.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => toggleMedication(med.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none
                      ${
                        med.taken
                          ? 'border-emerald-200 bg-emerald-50/15 dark:border-slate-800 dark:bg-slate-900/30 opacity-75'
                          : 'border-gray-100 bg-gray-50/20 dark:border-slate-800 dark:bg-slate-950/15 hover:bg-gray-50/60 dark:hover:bg-slate-900/10'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors
                          ${
                            med.taken
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                          }
                        `}
                      >
                        {med.taken && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${med.taken ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-250'}`}>
                          {med.name}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                          {med.dosage} • {med.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 dark:border-slate-800/40 text-left">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-relaxed block italic">
                *Pengingat Mandiri: Centang obat jika telah selesai dikonsumsi hari ini.
              </span>
            </div>
          </Card>
        </motion.div>

        {/* 8. NEW: KONSULTASI TERAKHIR (RECENT CONSULTATION) CARD */}
        <motion.div variants={itemVariants}>
          <Card className="h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <MessageSquare className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">Konsultasi Terakhir</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Ringkasan edukasi kesehatan terakhir Anda</p>
                  </div>
                </div>
              </div>

              {latestSession ? (
                <div className="p-4 bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-800/60 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                      {latestSession.title}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(latestSession.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-3 leading-relaxed">
                    {latestSession.messages.length > 0
                      ? latestSession.messages[latestSession.messages.length - 1].text.replace(/[#*>]/g, '')
                      : 'Belum ada obrolan aktif.'}
                  </p>
                </div>
              ) : (
                <div className="p-5 text-center text-xs text-gray-400 italic">
                  Belum ada riwayat konsultasi.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-50 dark:border-slate-800/40 flex justify-end">
              <Button
                onClick={() => {
                  if (latestSession) {
                    navigate(`/chat?session=${latestSession.id}`);
                  } else {
                    navigate('/chat');
                  }
                }}
                className="rounded-xl px-4 py-2"
                leftIcon={<MessageSquare className="w-3.5 h-3.5 text-white" />}
              >
                {latestSession ? 'Lanjutkan Obrolan' : 'Mulai Konsultasi'}
              </Button>
            </div>
          </Card>
        </motion.div>

      </div>

    </motion.div>
  );
};
