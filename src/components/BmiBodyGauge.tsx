import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Scale, Ruler, HeartPulse, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface BmiBodyGaugeProps {
  heightCm: number;
  weightKg: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export const BmiBodyGauge: React.FC<BmiBodyGaugeProps> = ({
  heightCm,
  weightKg,
  age = 25,
  gender = 'male',
}) => {
  const { language } = useLanguage();

  // 1. Calculate BMI
  const heightM = heightCm / 100;
  const bmiVal = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 0;

  // 2. WHO Asia-Pacific Cutoffs & Medical-Grade Anatomical Controls (7.5-8 Head Standard)
  let category = 'Normal';
  let categoryEn = 'Normal';
  let statusColor = '#10b981'; // Emerald
  let categoryBadgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  // Proportional Parameters (ViewBox 0 0 100 200, centered x=50)
  // Head height = 22px (y=10 to y=32) -> 200/22 = 9.09 head total height (8-head medical standard)
  let shoulderW = 21.5;  // Broad shoulders (~2x head width)
  let chestW = 15.5;     // Subtle V-taper chest
  let waistW = 11.5;     // Natural waist taper
  let hipW = 14.5;       // Natural hip ratio
  let armAbduct = 23.5;  // Arms 20-30° abducted from body
  let thighW = 6.0;      // Balanced legs

  if (bmiVal < 18.5) {
    category = 'Kurus';
    categoryEn = 'Underweight';
    statusColor = '#3b82f6'; // Blue
    categoryBadgeBg = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
    shoulderW = 18.5;
    chestW = 11.5;
    waistW = 8.5;
    hipW = 11.5;
    armAbduct = 21.0;
    thighW = 4.5;
  } else if (bmiVal < 23.0) {
    category = 'Normal';
    categoryEn = 'Normal';
    statusColor = '#10b981'; // Emerald
    categoryBadgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    shoulderW = 21.5;
    chestW = 15.5;
    waistW = 11.5;
    hipW = 14.5;
    armAbduct = 23.5;
    thighW = 6.0;
  } else if (bmiVal < 27.5) {
    category = 'Gemuk';
    categoryEn = 'Overweight';
    statusColor = '#f59e0b'; // Amber
    categoryBadgeBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    shoulderW = 24.0;
    chestW = 19.5;
    waistW = 16.5;
    hipW = 18.5;
    armAbduct = 26.5;
    thighW = 8.0;
  } else {
    category = 'Obesis';
    categoryEn = 'Obese';
    statusColor = '#ef4444'; // Red
    categoryBadgeBg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    shoulderW = 26.0;
    chestW = 24.0;
    waistW = 21.5;
    hipW = 23.5;
    armAbduct = 29.5;
    thighW = 10.0;
  }

  // Ideal weight range
  const minIdealWeight = Math.round(18.5 * (heightM * heightM));
  const maxIdealWeight = Math.round(22.9 * (heightM * heightM));

  // Body fat % estimate
  const sexFactor = gender === 'male' ? 1 : 0;
  const estimatedBodyFat = Math.max(5, Math.min(50, Math.round((1.20 * bmiVal) + (0.23 * age) - (10.8 * sexFactor) - 5.4)));

  // Gauge needle angle (-90deg to 90deg)
  const clampedBmi = Math.max(12, Math.min(36, bmiVal));
  const needleDeg = ((clampedBmi - 12) / (36 - 12)) * 180 - 90;

  // Medical-Grade Flat-Vector Silhouette Path (Abducted 25° Arms, 7.5-8 Head Scale)
  const anatomicalPath = `
    M 50 10
    C 55.5 10 59.5 15.5 59.5 23.5
    C 59.5 29.5 56 33.5 53 35.5
    C 54 37.5 55 40 55 42.5
    C 55 44.5 ${50 + chestW} 45.5 ${50 + shoulderW} 47.5
    C ${50 + shoulderW + 3} 49 ${50 + armAbduct + 3} 66 ${50 + armAbduct + 5} 84
    C ${50 + armAbduct + 6} 92 ${50 + armAbduct + 6.5} 102 ${50 + armAbduct + 4} 106
    C ${50 + armAbduct + 2} 108 ${50 + armAbduct - 1} 106 ${50 + armAbduct - 3} 101
    C ${50 + armAbduct - 5.5} 93 ${50 + armAbduct - 5} 78 ${50 + chestW + 2} 64
    C ${50 + waistW + 3} 78 ${50 + waistW + 2.5} 92 ${50 + waistW + 1.5} 98
    C ${50 + hipW + 2} 105 ${50 + hipW + 1} 118 ${50 + thighW + 3} 146
    C ${50 + thighW + 2} 160 ${50 + thighW + 1} 178 56.5 192
    C 55.5 195 53.5 195 52.5 192
    C 51.5 180 50.8 162 50.5 146
    C 50.4 130 50.2 118 50 112
    C 49.8 118 49.6 130 49.5 146
    C 49.2 162 48.5 180 47.5 192
    C 46.5 195 44.5 195 43.5 192
    C ${50 - thighW - 1} 178 ${50 - thighW - 2} 160 ${50 - thighW - 3} 146
    C ${50 - hipW - 1} 118 ${50 - hipW - 2} 105 ${50 - waistW - 1.5} 98
    C ${50 - waistW - 2.5} 92 ${50 - waistW - 3} 78 ${50 - chestW - 2} 64
    C ${50 - armAbduct + 5} 78 ${50 - armAbduct + 5.5} 93 ${50 - armAbduct + 3} 101
    C ${50 - armAbduct + 1} 106 ${50 - armAbduct - 2} 108 ${50 - armAbduct - 4} 106
    C ${50 - armAbduct - 6.5} 102 ${50 - armAbduct - 6} 92 ${50 - armAbduct - 5} 84
    C ${50 - armAbduct - 3} 66 ${50 - shoulderW - 3} 49 ${50 - shoulderW} 47.5
    C ${50 - chestW} 45.5 45 44.5 45 42.5
    C 45 40 46 37.5 47 35.5
    C 44 33.5 40.5 29.5 40.5 23.5
    C 40.5 15.5 44.5 10 50 10 Z
  `.replace(/\s+/g, ' ');

  return (
    <div className="space-y-4">
      {/* ── ARC GAUGE (TOP) ── */}
      <div className="flex flex-col items-center justify-center text-center space-y-2">
        <div className="relative w-48 h-26 flex items-end justify-center overflow-hidden pt-2">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <defs>
              <linearGradient id="bmiArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="30%" stopColor="#10b981" />
                <stop offset="65%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
              className="dark:stroke-slate-800"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#bmiArcGradient)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            <g transform={`rotate(${needleDeg}, 100, 100)`} className="transition-transform duration-700 ease-out">
              <line x1="100" y1="100" x2="100" y2="34" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" className="dark:stroke-slate-100" />
              <circle cx="100" cy="100" r="7" fill="#1e293b" className="dark:fill-slate-100" />
              <circle cx="100" cy="34" r="5" fill={statusColor} stroke="#ffffff" strokeWidth="1.5" />
            </g>

            <text x="22" y="106" fontSize="10" fill="#94a3b8" fontWeight="bold">18.5</text>
            <text x="100" y="106" fontSize="10" fill="#94a3b8" textAnchor="middle" fontWeight="bold">23.0</text>
            <text x="175" y="106" fontSize="10" fill="#ef4444" fontWeight="bold">27.5</text>
          </svg>
        </div>

        {/* BMI Score & Status Badge */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-black font-display text-gray-900 dark:text-white leading-none">
              {bmiVal}
            </span>
            <span className="text-[10px] font-semibold text-gray-400">kg/m²</span>
          </div>

          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${categoryBadgeBg}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>{language === 'en' ? categoryEn : category}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── CENTER SECTION: MEDICAL-GRADE ANATOMICAL SILHOUETTE & HUD RINGS ── */}
      <div className="grid grid-cols-3 gap-2 items-center pt-1">
        {/* Left Side Info */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <Scale className="w-3 h-3 text-emerald-500" />
              <span>{language === 'en' ? 'Ideal' : 'Ideal'}</span>
            </div>
            <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5">
              {minIdealWeight}-{maxIdealWeight} kg
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <Ruler className="w-3 h-3 text-sky-500" />
              <span>{language === 'en' ? 'Height' : 'Tinggi'}</span>
            </div>
            <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5">
              {heightCm} cm
            </p>
          </div>
        </div>

        {/* Center: MEDICAL-GRADE SILHOUETTE WITH MINIMALIST CIRCULAR HUD */}
        <div className="flex items-center justify-center relative">
          <div className="relative w-36 h-48 flex items-center justify-center">
            
            {/* Outer Rotating HUD Ring with Indicator Nodes */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 dark:border-emerald-400/20 animate-spin" style={{ animationDuration: '36s' }}>
              <span className="absolute top-[12%] left-[12%] w-2 h-2 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 shadow-sm" />
              <span className="absolute top-[12%] right-[12%] w-2 h-2 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 shadow-sm" />
              <span className="absolute bottom-[12%] left-[12%] w-2 h-2 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 shadow-sm" />
              <span className="absolute bottom-[12%] right-[12%] w-2 h-2 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 shadow-sm" />
            </div>

            {/* Inner Concentric Dotted Guide Ring */}
            <div className="absolute inset-3 rounded-full border border-dashed border-emerald-500/15 dark:border-emerald-400/15 pointer-events-none" />

            {/* Ambient Soft Radial Backlight Glow */}
            <div
              className="absolute inset-3 rounded-full blur-2xl opacity-25 transition-colors duration-500"
              style={{ backgroundColor: statusColor }}
            />

            {/* Medical-Grade Vector Human Body SVG */}
            <svg viewBox="0 0 100 200" className="w-full h-full relative z-10 drop-shadow-md overflow-visible">
              <defs>
                <linearGradient id="medicalBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={statusColor} stopOpacity="0.30" />
                  <stop offset="50%" stopColor={statusColor} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={statusColor} stopOpacity="0.04" />
                </linearGradient>

                <clipPath id="medicalBodyClip">
                  <motion.path
                    d={anatomicalPath}
                    animate={{ d: anatomicalPath }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  />
                </clipPath>
              </defs>

              {/* Clean Flat-Vector Smooth Contour with Thin 1.8px Emerald Line */}
              <motion.path
                d={anatomicalPath}
                animate={{ d: anatomicalPath }}
                fill="url(#medicalBodyGradient)"
                stroke={statusColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="transition-colors duration-500"
              />
            </svg>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <HeartPulse className="w-3 h-3 text-rose-500" />
              <span>{language === 'en' ? 'Fat' : 'Lemak'}</span>
            </div>
            <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5">
              ~{estimatedBodyFat}%
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'en' ? 'Risk' : 'Risiko'}</span>
            </div>
            <p className="text-xs font-extrabold text-gray-900 dark:text-white mt-0.5">
              {bmiVal < 18.5 ? 'Defisiensi' : bmiVal < 23 ? 'Optimal' : bmiVal < 27.5 ? 'Sedang' : 'Tinggi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
