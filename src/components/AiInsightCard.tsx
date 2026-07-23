import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';
import { Card } from './Card';

interface AiInsightCardProps {
  waterIntake: number;
  waterGoal: number;
  sleepDuration: number;
  steps: number;
  language?: 'en' | 'id';
  onNavigateChat?: () => void;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({
  waterIntake,
  waterGoal,
  sleepDuration,
  steps,
  language = 'id',
  onNavigateChat,
}) => {
  const [insightText, setInsightText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Evaluate dynamic clinical wellness tip based on user's active dashboard stats
  useEffect(() => {
    const isEn = language === 'en';
    
    if (waterIntake < waterGoal * 0.5) {
      setInsightText(
        isEn
          ? "💧 Hydration warning: Your water intake is currently 40% below target. We recommend drinking two glasses of water now to prevent cognitive fatigue."
          : "💧 Peringatan Hidrasi: Asupan air Anda terpantau 40% di bawah target harian. Pertimbangkan untuk minum 2 gelas air putih hangat sekarang agar terhindar dari lemas."
      );
    } else if (sleepDuration < 7) {
      setInsightText(
        isEn
          ? "😴 Rest recovery: You slept less than 7 hours last night. A short 15-minute power nap or sleeping 30 minutes earlier tonight will significantly boost heart recovery."
          : "😴 Pemulihan Tidur: Tidur Anda kurang dari 7 jam tadi malam. Membaca buku tanpa layar 30 menit sebelum tidur malam ini akan membantu meningkatkan fase REM Anda."
      );
    } else if (steps < 5000) {
      setInsightText(
        isEn
          ? "🏃 Sedentary alert: You have taken less than 5,000 steps today. A light 10-minute stretch or walk after meals will lower blood glucose spikes."
          : "🏃 Peringatan Aktif: Langkah kaki Anda masih di bawah 5.000 langkah. Berjalan kaki santai 10 menit setelah makan dapat menurunkan lonjakan gula darah harian Anda."
      );
    } else {
      setInsightText(
        isEn
          ? "✨ Heart health on track: Excellent consistency! Your vitals, sleep cycles, and daily workout metrics are fully optimized today. Keep up the great work."
          : "✨ Vitals & Kebugaran Optimal: Konsistensi luar biasa! Detak jantung, pola tidur, dan langkah kaki Anda berada dalam ritme ideal hari ini. Pertahankan pola hidup sehat ini."
      );
    }
  }, [waterIntake, waterGoal, sleepDuration, steps, language, triggerRefresh]);

  // Typewriter effect
  useEffect(() => {
    setDisplayText('');
    if (!insightText) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < insightText.length) {
        setDisplayText(insightText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [insightText]);

  const t = {
    en: {
      title: 'AI Smart Coach',
      cta: 'Ask Coach',
    },
    id: {
      title: 'Rekomendasi Pintar AI',
      cta: 'Tanya Asisten AI',
    },
  }[language];

  return (
    <Card hoverable className="relative overflow-hidden group flex items-start gap-4 h-full">
      {/* Dynamic light blur background for AI card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      <div className="space-y-2.5 flex-1 flex flex-col justify-between h-full min-h-[96px]">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-gray-900 dark:text-white flex items-center gap-1.5 select-none">
              <BrainCircuit className="w-4 h-4 text-amber-500" />
              {t.title}
            </h3>
            {/* Refresh button to re-evaluate */}
            <button 
              onClick={() => setTriggerRefresh(p => p + 1)}
              title="Refresh Insights"
              className="p-1 rounded text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Animated typing text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium min-h-[48px] mt-1.5 transition-all duration-300">
            {displayText}
            <span className="w-1.5 h-3 bg-amber-500 inline-block ml-0.5 animate-pulse" />
          </p>
        </div>

        <button
          onClick={onNavigateChat}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:translate-x-1 transition-transform w-fit self-end mt-2"
        >
          {t.cta} &rarr;
        </button>
      </div>
    </Card>
  );
};
