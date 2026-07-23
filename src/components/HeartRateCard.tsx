import React from 'react';
import { Heart, Activity, ShieldCheck } from 'lucide-react';
import { Card } from './Card';

interface HeartRateCardProps {
  bpm: number;
  bloodPressure: string;
  history: { bpm: number; bp: string; timestamp: string }[];
  language?: 'en' | 'id';
  onCheck?: () => void;
}

export const HeartRateCard: React.FC<HeartRateCardProps> = ({
  bpm = 72,
  bloodPressure = '118/78',
  history = [],
  language = 'id',
  onCheck,
}) => {
  const t = {
    en: {
      title: 'Heart Vitals',
      statusNormal: 'Normal Vitals',
      lastChecked: 'Recent Logs',
      checkNow: 'Check Vitals',
      bpmLabel: 'Heart Rate',
      bpLabel: 'Blood Pressure',
    },
    id: {
      title: 'Detak Jantung',
      statusNormal: 'Vitals Normal',
      lastChecked: 'Riwayat Vitals',
      checkNow: 'Konsultasi Vitals',
      bpmLabel: 'Denyut Nadi',
      bpLabel: 'Tekanan Darah',
    },
  }[language];

  return (
    <Card hoverable className="h-full flex flex-col justify-between relative overflow-hidden">
      
      <div className="space-y-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5 fill-current animate-pulse" />
            </span>
            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400">{t.title}</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            {t.statusNormal}
          </span>
        </div>

        {/* ── Real-Time Scrolling EKG Line ── */}
        <div className="ekg-scroll-container bg-slate-900/[0.03] dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800/60 rounded-2xl p-2.5 flex flex-col justify-center select-none">
          <div className="ekg-scroll-wave h-12">
            <svg viewBox="0 0 140 50" className="ekg-path" preserveAspectRatio="none">
              <path d="M 0 25 L 30 25 Q 35 18 40 25 L 50 25 L 53 30 L 58 5 L 63 45 L 68 25 L 80 25 Q 88 12 96 25 L 140 25" />
            </svg>
            <svg viewBox="0 0 140 50" className="ekg-path" preserveAspectRatio="none">
              <path d="M 0 25 L 30 25 Q 35 18 40 25 L 50 25 L 53 30 L 58 5 L 63 45 L 68 25 L 80 25 Q 88 12 96 25 L 140 25" />
            </svg>
          </div>
        </div>

        {/* ── Main Vital Display ── */}
        <div className="grid grid-cols-2 gap-4 py-1">
          {/* BPM display */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {t.bpmLabel}
            </span>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400 font-display leading-none mt-1">
              {bpm}
              <span className="text-xs text-gray-400 font-medium ml-1">bpm</span>
            </span>
          </div>

          {/* Blood Pressure display */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {t.bpLabel}
            </span>
            <span className="text-2xl font-black text-gray-800 dark:text-white font-display leading-none mt-1.5">
              {bloodPressure}
              <span className="text-[10px] text-gray-400 font-medium ml-1">mmHg</span>
            </span>
          </div>
        </div>

        {/* ── Recent Log List (Spark data) ── */}
        {history && history.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">
              {t.lastChecked}
            </span>
            <div className="space-y-1">
              {history.slice(0, 2).map((item, index) => {
                const logTime = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={index} className="flex items-center justify-between text-[11px] bg-gray-50/50 dark:bg-slate-800/40 px-2.5 py-1.5 rounded-xl border border-gray-100/10 select-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{logTime}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      {item.bpm} bpm &bull; {item.bp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="pt-4 mt-auto border-t border-gray-100 dark:border-slate-800/40 flex items-center justify-between">
        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          {language === 'en' ? 'Normal Rhythm' : 'Sinus Ritme Normal'}
        </span>
        <button
          onClick={onCheck}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-450 dark:hover:text-rose-350 flex items-center gap-1 transition-colors"
        >
          {t.checkNow} &rarr;
        </button>
      </div>

    </Card>
  );
};
