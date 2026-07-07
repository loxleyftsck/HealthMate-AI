import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { useHealthCompanion } from '../context/HealthCompanionContext';

const WELLNESS_TIPS = [
  'Jaga kesehatan dan pastikan kebutuhan air harian Anda terpenuhi.',
  'Jangan lupa untuk istirahat yang cukup setiap malam.',
  'Pola makan dengan gizi seimbang adalah kunci energi sepanjang hari.',
  'Aktivitas fisik ringan 15 menit sehari sangat baik untuk sirkulasi darah.',
  'Tarik napas dalam-dalam sejenak untuk mengurangi tingkat stres Anda.',
  'Bila merasa kurang sehat, beristirahatlah dan konsultasikan dengan dokter.',
];

// ─── Medi SVG Mascot ───────────────────────────────────────────────────────────
const MediMascot: React.FC<{ expression: string; onClick: () => void }> = ({
  expression,
  onClick,
}) => {
  // Eye configuration per expression
  const eyeConfig = () => {
    switch (expression) {
      case 'success':
      case 'greeting':
        // Happy ^^ eyes (curved)
        return { type: 'happy' };
      case 'error':
        // Concerned / sad eyes
        return { type: 'concerned' };
      case 'thinking':
        // Looking up-left
        return { type: 'thinking' };
      default:
        return { type: 'normal' };
    }
  };

  const { type: eyeType } = eyeConfig();

  // Mouth per expression
  const mouthPath = () => {
    switch (expression) {
      case 'success':
        return { d: 'M 30 58 Q 40 68 50 58', stroke: '#D97706', fill: 'none', wide: true };
      case 'greeting':
        return { d: 'M 31 57 Q 40 64 49 57', stroke: '#D97706', fill: 'none', wide: false };
      case 'error':
        return { d: 'M 32 62 Q 40 57 48 62', stroke: '#D97706', fill: 'none', wide: false };
      case 'thinking':
        return { d: 'M 34 59 Q 40 61 46 59', stroke: '#D97706', fill: 'none', wide: false };
      default:
        return { d: 'M 32 58 Q 40 63 48 58', stroke: '#D97706', fill: 'none', wide: false };
    }
  };

  const mouth = mouthPath();

  // Wave animation for greeting
  const leftArmAnimate = expression === 'greeting'
    ? { rotate: [0, -30, 5, -30, 0] }
    : { rotate: 0 };
  const leftArmTransition = expression === 'greeting'
    ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' as const }
    : {};

  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer select-none"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      animate={{ y: expression === 'thinking' ? [0, -4, 0] : [0, -7, 0] }}
      transition={{
        y: {
          repeat: Infinity,
          duration: expression === 'thinking' ? 1.4 : 3.5,
          ease: 'easeInOut',
        },
      }}
    >
      <svg
        width="90"
        height="100"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-xl"
      >
        <defs>
          {/* Head gradient - soft cream/white 3D look */}
          <radialGradient id="headGrad" cx="42%" cy="35%" r="58%">
            <stop offset="0%" stopColor="#FFFEF7" />
            <stop offset="55%" stopColor="#F5F0E8" />
            <stop offset="100%" stopColor="#E8DDD0" />
          </radialGradient>
          {/* Body gradient - green medical outfit */}
          <radialGradient id="bodyGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          {/* Arm gradient */}
          <radialGradient id="armGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </radialGradient>
          {/* Leaf gradient */}
          <radialGradient id="leafGrad" cx="40%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          {/* Blush gradient */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0" />
          </radialGradient>
          {/* Success glow */}
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
          </radialGradient>
          {/* Eye white gradient */}
          <radialGradient id="eyeWhiteL" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>
          <radialGradient id="eyeWhiteR" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E5E7EB" />
          </radialGradient>

          {/* Drop shadow filter */}
          <filter id="softShadow" x="-20%" y="-10%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#05966920" />
          </filter>
        </defs>

        {/* ── Success Glow Ring ── */}
        {expression === 'success' && (
          <motion.ellipse
            cx="40" cy="55" rx="32" ry="28"
            fill="url(#glowGrad)"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        )}

        {/* ── Shadow under body ── */}
        <ellipse cx="40" cy="96" rx="22" ry="4" fill="#00000015" />

        {/* ── Body (medical green outfit) ── */}
        <motion.rect
          x="14" y="54" width="52" height="38" rx="20" ry="20"
          fill="url(#bodyGrad)"
          filter="url(#softShadow)"
          animate={{
            scaleX: expression === 'thinking' ? [1, 1.02, 0.99, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ transformOrigin: '40px 73px' }}
        />

        {/* Medical cross on chest */}
        <rect x="37" y="64" width="6" height="14" rx="2" fill="white" opacity="0.9" />
        <rect x="33" y="68" width="14" height="6" rx="2" fill="white" opacity="0.9" />

        {/* ── Left Arm ── */}
        <motion.g
          style={{ transformOrigin: '18px 62px' }}
          animate={leftArmAnimate}
          transition={leftArmTransition}
        >
          <ellipse cx="13" cy="67" rx="7" ry="9" fill="url(#armGrad)" />
          {/* Hand */}
          <circle cx="10" cy="73" r="5" fill="url(#headGrad)" />
        </motion.g>

        {/* ── Right Arm ── */}
        <ellipse cx="67" cy="67" rx="7" ry="9" fill="url(#armGrad)" />
        {/* Hand */}
        <circle cx="70" cy="73" r="5" fill="url(#headGrad)" />

        {/* ── Head ── */}
        <motion.circle
          cx="40" cy="38" r="30"
          fill="url(#headGrad)"
          filter="url(#softShadow)"
          animate={{
            scaleY: expression === 'idle' ? [1, 0.98, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        />

        {/* Head outline subtle */}
        <circle cx="40" cy="38" r="30" fill="none" stroke="#D1C4A8" strokeWidth="0.8" />

        {/* ── Leaf / Sprout on top ── */}
        <motion.g
          animate={expression === 'greeting' ? { rotate: [0, 8, -8, 8, 0] } : { rotate: 0 }}
          transition={expression === 'greeting'
            ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
            : {}}
          style={{ transformOrigin: '40px 10px' }}
        >
          {/* Stem */}
          <path d="M 40 10 Q 40 6 40 4" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          {/* Left leaf */}
          <path d="M 40 8 Q 34 2 32 5 Q 33 9 40 9 Z" fill="url(#leafGrad)" />
          {/* Right leaf */}
          <path d="M 40 7 Q 47 1 49 4 Q 47 9 40 8 Z" fill="url(#leafGrad)" />
        </motion.g>

        {/* ── Eyes ── */}
        {eyeType === 'normal' && (
          <motion.g
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 0.15 }}
            style={{ transformOrigin: '40px 37px' }}
          >
            {/* Left eye white */}
            <ellipse cx="29" cy="37" rx="7" ry="7.5" fill="url(#eyeWhiteL)" />
            {/* Left pupil */}
            <circle cx="30" cy="38" r="3.5" fill="#1C1917" />
            {/* Left shine */}
            <circle cx="31.5" cy="35.5" r="1.2" fill="white" />
            {/* Right eye white */}
            <ellipse cx="51" cy="37" rx="7" ry="7.5" fill="url(#eyeWhiteR)" />
            {/* Right pupil */}
            <circle cx="52" cy="38" r="3.5" fill="#1C1917" />
            {/* Right shine */}
            <circle cx="53.5" cy="35.5" r="1.2" fill="white" />
          </motion.g>
        )}

        {eyeType === 'happy' && (
          <g>
            {/* Left eye - happy arc ^^ */}
            <path d="M 22 39 Q 29 30 36 39" stroke="#1C1917" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Right eye - happy arc */}
            <path d="M 44 39 Q 51 30 58 39" stroke="#1C1917" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}

        {eyeType === 'concerned' && (
          <g>
            {/* Left eye white */}
            <ellipse cx="29" cy="37" rx="7" ry="7.5" fill="url(#eyeWhiteL)" />
            <circle cx="29" cy="39" r="3.5" fill="#1C1917" />
            <circle cx="30.5" cy="36.5" r="1.2" fill="white" />
            {/* Right eye white */}
            <ellipse cx="51" cy="37" rx="7" ry="7.5" fill="url(#eyeWhiteR)" />
            <circle cx="51" cy="39" r="3.5" fill="#1C1917" />
            <circle cx="52.5" cy="36.5" r="1.2" fill="white" />
            {/* Concerned eyebrows slanted inward */}
            <path d="M 22 29 Q 29 33 35 30" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 45 30 Q 51 33 58 29" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {eyeType === 'thinking' && (
          <g>
            {/* Left eye white */}
            <ellipse cx="29" cy="37" rx="7" ry="7.5" fill="url(#eyeWhiteL)" />
            {/* Pupil shifted upper-left = looking up */}
            <circle cx="27" cy="34" r="3.5" fill="#1C1917" />
            <circle cx="28.5" cy="32.5" r="1.2" fill="white" />
            {/* Right eye white */}
            <ellipse cx="51" cy="37" rx="7" ry="7.5" fill="url(#eyeWhiteR)" />
            <circle cx="49" cy="34" r="3.5" fill="#1C1917" />
            <circle cx="50.5" cy="32.5" r="1.2" fill="white" />
          </g>
        )}

        {/* ── Blush cheeks ── */}
        <ellipse cx="20" cy="47" rx="7" ry="4.5" fill="url(#blushGrad)" />
        <ellipse cx="60" cy="47" rx="7" ry="4.5" fill="url(#blushGrad)" />

        {/* ── Mouth ── */}
        <motion.path
          d={mouth.d}
          stroke={mouth.stroke}
          strokeWidth={mouth.wide ? "2.5" : "2"}
          fill={mouth.fill}
          strokeLinecap="round"
          animate={{ y: expression === 'thinking' ? -2 : 0 }}
        />

        {/* Tongue on success */}
        {expression === 'success' && (
          <motion.path
            d="M 36 64 Q 40 70 44 64"
            fill="#F87171"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            style={{ transformOrigin: '40px 64px' }}
          />
        )}

        {/* ── Thinking dots above head ── */}
        {expression === 'thinking' && (
          <g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={58 + i * 6}
                cy={14 - i * 3}
                r={1.5 + i * 0.5}
                fill="#34D399"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.25 }}
              />
            ))}
          </g>
        )}

        {/* ── Sparkles on success ── */}
        {expression === 'success' && (
          <g>
            {[
              { x: 8, y: 18, size: 5, delay: 0 },
              { x: 68, y: 12, size: 4, delay: 0.2 },
              { x: 72, y: 38, size: 3, delay: 0.4 },
            ].map((s, i) => (
              <motion.g key={i} style={{ transformOrigin: `${s.x}px ${s.y}px` }}
                animate={{ scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: s.delay }}
              >
                <path
                  d={`M ${s.x} ${s.y - s.size} L ${s.x} ${s.y + s.size} M ${s.x - s.size} ${s.y} L ${s.x + s.size} ${s.y}`}
                  stroke="#FCD34D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </motion.g>
            ))}
          </g>
        )}
      </svg>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const HealthCompanion: React.FC = () => {
  const { expression, message, speak, clear } = useHealthCompanion();
  const [bubbleOpen, setBubbleOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Selamat datang kembali! Bagaimana saya bisa membantu perjalanan kesehatan Anda hari ini?', 'greeting', 8000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setBubbleOpen(!!message);
  }, [message]);

  const handleMascotClick = () => {
    if (expression === 'thinking') return;
    const tip = WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)];
    speak(tip, 'greeting', 8000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">

      {/* Speech Bubble */}
      <AnimatePresence>
        {bubbleOpen && message && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.88, x: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="mb-3 max-w-[260px] md:max-w-[300px] p-4 bg-white/97 dark:bg-slate-900/97 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl shadow-emerald-950/10 pointer-events-auto relative"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 fill-current" />
                MEDI — Health Companion
              </span>
              <button
                onClick={clear}
                title="Dismiss message"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-gray-800 dark:text-gray-200">
              {message}
            </p>
            {/* Bubble tail */}
            <div className="absolute right-7 -bottom-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-emerald-100 dark:border-emerald-900/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thinking dots */}
      <AnimatePresence>
        {expression === 'thinking' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-1.5 px-3 py-1.5 mb-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/60 dark:border-emerald-900/30 self-end mr-5"
          >
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay }}
                className="w-1.5 h-1.5 bg-emerald-500 rounded-full block"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <div className="pointer-events-auto mr-1">
        <MediMascot expression={expression} onClick={handleMascotClick} />
      </div>
    </div>
  );
};
