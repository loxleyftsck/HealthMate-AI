import React, { useMemo } from 'react';
import { Moon, Sun, ArrowRight, Flame } from 'lucide-react';
import { Card } from './Card';
import { MiniTrendChart } from './MiniTrendChart';

interface SleepCardProps {
  sleepHours?: number;
  bedTime?: string;
  wakeTime?: string;
  deepPct?: number;
  lightPct?: number;
  remPct?: number;
  streakDays?: number;
  trendData?: number[];
  onViewDetail?: () => void;
}

export const SleepCard: React.FC<SleepCardProps> = ({
  sleepHours = 7.5,
  bedTime = '22:45',
  wakeTime = '06:15',
  deepPct = 22,
  lightPct = 53,
  remPct = 25,
  streakDays = 5,
  trendData,
  onViewDetail,
}) => {
  const quality = getSleepQuality(sleepHours);

  const durationLabel = useMemo(() => {
    const h = Math.floor(sleepHours);
    const m = Math.round((sleepHours - h) * 60);
    return `${h}j ${m > 0 ? m + 'm' : ''}`.trim();
  }, [sleepHours]);

  // Positions of twinkling stars (consistent on every render)
  const stars = useMemo(
    () => [
      { x: 24, y: 22, r: 1.6, delay: 0 },
      { x: 52, y: 44, r: 1.2, delay: 0.4 },
      { x: 90, y: 18, r: 1.8, delay: 0.9 },
      { x: 130, y: 50, r: 1.3, delay: 1.4 },
      { x: 170, y: 26, r: 1.6, delay: 0.2 },
      { x: 210, y: 46, r: 1.2, delay: 1.1 },
      { x: 245, y: 20, r: 1.7, delay: 0.6 },
      { x: 270, y: 48, r: 1.3, delay: 1.7 },
      { x: 40, y: 62, r: 1.1, delay: 2.0 },
      { x: 195, y: 60, r: 1.1, delay: 0.7 },
    ],
    []
  );

  return (
    <Card hoverable className="h-full flex flex-col justify-between overflow-hidden relative">
      
      {/* Consistency Streak Flame Badge */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <div className="streak-badge-pulse flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 border border-orange-500/20 text-[10px] font-bold select-none">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{streakDays}d</span>
        </div>
      </div>

      <style>{`
        .sleep-star {
          animation: sleepTwinkle 2.6s ease-in-out infinite;
        }
        @keyframes sleepTwinkle {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 1; }
        }
        .sleep-moon-glow {
          animation: sleepMoonGlow 3.4s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes sleepMoonGlow {
          0%, 100% { opacity: 0.35; r: 24; }
          50%      { opacity: 0.65; r: 28; }
        }
        .sleep-moon-body {
          animation: sleepMoonFloat 6s ease-in-out infinite;
        }
        @keyframes sleepMoonFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .sleep-cloud {
          animation: sleepDrift 20s linear infinite;
        }
        @keyframes sleepDrift {
          0%   { transform: translateX(-15px); }
          100% { transform: translateX(25px); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
            <Moon className="w-5 h-5 fill-current" />
          </span>
          <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">Kualitas Tidur</span>
        </div>
        <span
          className="text-xs font-bold font-display"
          style={{ color: quality.color }}
        >
          {quality.pct}%
        </span>
      </div>

      {/* Night Sky Graphic */}
      <div className="relative h-[130px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#111827] via-[#1e1b4b] to-[#312e81] mb-4 shadow-inner">
        <svg viewBox="0 0 300 130" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {stars.map((s, i) => (
            <circle
              key={i}
              className="sleep-star"
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#ffffff"
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}

          {/* Glowing Moon */}
          <g transform="translate(240, 32)">
            <circle className="sleep-moon-glow" cx="0" cy="0" r="24" fill="#fde047" opacity="0.4" />
            <g className="sleep-moon-body">
              <path
                d="M12,-14 A14,14 0 1 0 12,14 A11,11 0 1 1 12,-14 Z"
                fill="#fef08a"
              />
            </g>
          </g>

          {/* Drifting Cloud */}
          <g className="sleep-cloud" opacity="0.15">
            <ellipse cx="65" cy="98" rx="28" ry="8" fill="#ffffff" />
            <ellipse cx="85" cy="94" rx="20" ry="7" fill="#ffffff" />
          </g>
        </svg>

        {/* Big duration text */}
        <div className="absolute left-0 right-0 bottom-4 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white font-display tracking-tight leading-none">
              {durationLabel}
            </span>
            <span className="text-[10px] text-sky-200/80 font-bold uppercase tracking-widest font-display">
              Tidur
            </span>
          </div>
        </div>
      </div>

      {/* Quality Badge */}
      <div className="flex justify-center mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300"
          style={{
            background: quality.color + '18',
            color: quality.color,
          }}
        >
          <span className="text-sm leading-none">{quality.emoji}</span>
          {quality.label}
        </span>
      </div>

      {/* 7-Day Sparkline Trend Chart */}
      <div className="mb-3">
        <MiniTrendChart data={trendData || [7.2, 6.8, 7.5, 8.0, 7.0, 7.5, sleepHours]} color="#6366f1" height={36} />
      </div>

      {/* Sleep Stages Progress Bar */}
      <div className="w-full">
        <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800/80 mb-3">
          <div className="bg-[#4c5fd6]" style={{ width: `${deepPct}%` }} title={`Deep Sleep: ${deepPct}%`} />
          <div className="bg-[#7ea6f2]" style={{ width: `${lightPct}%` }} title={`Light Sleep: ${lightPct}%`} />
          <div className="bg-[#b98af0]" style={{ width: `${remPct}%` }} title={`REM Sleep: ${remPct}%`} />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4c5fd6]" /> Deep {deepPct}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7ea6f2]" /> Light {lightPct}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b98af0]" /> REM {remPct}%
          </span>
        </div>
      </div>

      {/* Footer / Bed & Wake Times */}
      <div className="pt-3.5 mt-auto border-t border-gray-100 dark:border-slate-800/40 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block leading-none mb-0.5">Tidur</span>
              <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 leading-none">{bedTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block leading-none mb-0.5">Bangun</span>
              <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 leading-none">{wakeTime}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onViewDetail}
          className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-350 flex items-center gap-1 hover:underline transition-all"
        >
          Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};

function getSleepQuality(hours: number) {
  if (hours >= 7) {
    return {
      key: 'restful',
      label: 'Tidur Nyenyak',
      emoji: '😴',
      color: '#10B981', // emerald
      pct: Math.min(100, Math.round((hours / 8) * 100)),
    };
  }
  if (hours >= 6) {
    return {
      key: 'ok',
      label: 'Tidur Cukup',
      emoji: '🙂',
      color: '#F59E0B', // amber
      pct: Math.round((hours / 8) * 100),
    };
  }
  return {
    key: 'poor',
    label: 'Tidur Kurang',
    emoji: '😵',
    color: '#EF4444', // red
    pct: Math.round((hours / 8) * 100),
  };
}
