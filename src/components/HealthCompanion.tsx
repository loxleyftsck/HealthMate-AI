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

export const HealthCompanion: React.FC = () => {
  const { expression, message, speak, clear } = useHealthCompanion();
  const [bubbleOpen, setBubbleOpen] = useState(false);

  // Greet user on first mount (App Opening)
  useEffect(() => {
    // Wait a brief moment after mount to speak
    const timer = setTimeout(() => {
      speak('Selamat datang kembali! Bagaimana saya bisa membantu perjalanan kesehatan Anda hari ini?', 'greeting', 8000);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sync speech bubble visibility with context message state
  useEffect(() => {
    if (message) {
      setBubbleOpen(true);
    } else {
      setBubbleOpen(false);
    }
  }, [message]);

  // Mascot click handler - plays a greeting or a random wellness tip
  const handleMascotClick = () => {
    if (expression === 'thinking') return;
    const randomTip = WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)];
    speak(randomTip, 'greeting', 8000);
  };

  // Determine SVG elements based on expression
  const getEyesPath = () => {
    // Returns keyframe values for scaleY or y offsets
    switch (expression) {
      case 'greeting':
      case 'success':
        // Happy closed curved eyes (^^)
        return {
          left: 'M 11 13 Q 13 10 15 13',
          right: 'M 21 13 Q 23 10 25 13',
          strokeWidth: 2,
          fill: 'none',
        };
      case 'error':
        // Concerned/sad eyes (slanted curves)
        return {
          left: 'M 11 14 Q 13 16 15 15',
          right: 'M 21 15 Q 23 16 25 14',
          strokeWidth: 2,
          fill: 'none',
        };
      case 'thinking':
        // Looking upward (shift dots up)
        return {
          left: 'M 13 10 A 1.5 1.5 0 1 1 13.01 10',
          right: 'M 23 10 A 1.5 1.5 0 1 1 23.01 10',
          strokeWidth: 3,
          fill: 'currentColor',
        };
      default:
        // Regular blinking dots
        return {
          left: 'M 13 13 A 1.5 1.5 0 1 1 13.01 13',
          right: 'M 23 13 A 1.5 1.5 0 1 1 23.01 13',
          strokeWidth: 3,
          fill: 'currentColor',
        };
    }
  };

  const getMouthPath = () => {
    switch (expression) {
      case 'success':
        // Big open happy smile
        return 'M 14 17 Q 18 22 22 17 Z';
      case 'greeting':
        // Friendly smile
        return 'M 14 17 Q 18 20 22 17';
      case 'error':
        // Concerned downcurve
        return 'M 15 19 Q 18 17 21 19';
      case 'thinking':
        // Tiny flat line / circle
        return 'M 16 18 L 20 18';
      default:
        // Standard gentle smile
        return 'M 15 18 Q 18 20 21 18';
    }
  };

  const isHappyMouth = expression === 'success';
  const eyes = getEyesPath();
  const mouthPath = getMouthPath();

  // Arm/leaf wave animation variables
  const waveTransition = expression === 'greeting'
    ? {
        rotate: {
          repeat: Infinity,
          duration: 1.2,
          ease: 'easeInOut' as const,
        },
      }
    : {};

  const waveAnimate = expression === 'greeting'
    ? { rotate: [0, -35, 10, -35, 0] }
    : { rotate: 0 };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      
      {/* Speech Bubble Container */}
      <AnimatePresence>
        {bubbleOpen && message && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring' as const, stiffness: 350, damping: 26 }}
            className="mb-3 max-w-[260px] md:max-w-[300px] p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-100/80 dark:border-emerald-950/40 rounded-2xl shadow-xl shadow-emerald-950/10 pointer-events-auto relative flex flex-col gap-1.5"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 fill-current" />
                HealthMate Companion
              </span>
              <button
                onClick={clear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                title="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-xs font-semibold leading-relaxed text-gray-800 dark:text-gray-200">
              {message}
            </p>
            
            {/* Speech Bubble Tail */}
            <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-white dark:bg-slate-900 border-r border-b border-emerald-100/80 dark:border-emerald-950/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thinking Typing Indicator Dots above Mascot */}
      <AnimatePresence>
        {expression === 'thinking' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex items-center gap-1 px-3 py-1.5 mb-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/40 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450 self-end mr-4"
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className="w-1.5 h-1.5 bg-current rounded-full"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
              className="w-1.5 h-1.5 bg-current rounded-full"
            />
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
              className="w-1.5 h-1.5 bg-current rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot SVG trigger element */}
      <motion.div
        animate={{
          y: expression === 'thinking' ? [0, -5, 0] : [0, -6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: expression === 'thinking' ? 1.5 : 3.5,
          ease: 'easeInOut' as const,
        }}
        className="pointer-events-auto cursor-pointer filter drop-shadow-md select-none group mr-2"
        onClick={handleMascotClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        <svg
          width="76"
          height="76"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Glowing Aura on Success/Hover */}
          <motion.circle
            cx="18"
            cy="20"
            r="12"
            fill="rgba(16, 185, 129, 0.15)"
            animate={{
              scale: expression === 'success' ? [1, 1.3, 1] : 1,
              opacity: expression === 'success' ? [0.6, 0.9, 0.6] : 0,
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />

          {/* SVG Droplet/Blob Body */}
          <motion.path
            d="M 18 6 C 10 16 7 24 10 28 C 13 32 23 32 26 28 C 29 24 26 16 18 6 Z"
            fill="url(#dropletGradient)"
            stroke="#10B981"
            strokeWidth="1.2"
            animate={{
              scaleY: expression === 'thinking' ? [1, 0.96, 1.02, 1] : [1, 1.03, 1],
              scaleX: expression === 'thinking' ? [1, 1.04, 0.98, 1] : [1, 0.97, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: expression === 'thinking' ? 1.5 : 3.5,
              ease: 'easeInOut' as const,
            }}
            style={{ transformOrigin: 'bottom center' }}
          />

          {/* Medical Cap / Nurse Headband */}
          <g transform="translate(11, 4)">
            {/* White Cap Base */}
            <path
              d="M 2 4 C 2 1.5, 12 1.5, 12 4 L 10 6 L 4 6 Z"
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth="0.8"
            />
            {/* Green Cross emblem */}
            <path
              d="M 6.5 2.5 L 7.5 2.5 M 7 2 L 7 3"
              stroke="#10B981"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </g>

          {/* Animated Blinking Eyes Group */}
          <motion.g
            fill="#1F2937"
            className="dark:fill-slate-100"
            animate={
              expression === 'idle'
                ? { scaleY: [1, 1, 0.1, 1, 1] }
                : { scaleY: 1 }
            }
            transition={{
              repeat: Infinity,
              repeatDelay: 4,
              duration: 0.2,
            }}
            style={{ transformOrigin: '18px 13px' }}
          >
            {/* Left Eye */}
            <path
              d={eyes.left}
              stroke={eyes.strokeWidth > 0 ? '#1F2937' : 'none'}
              strokeWidth={eyes.strokeWidth}
              fill={eyes.fill}
              className="dark:stroke-slate-100"
              strokeLinecap="round"
            />
            {/* Right Eye */}
            <path
              d={eyes.right}
              stroke={eyes.strokeWidth > 0 ? '#1F2937' : 'none'}
              strokeWidth={eyes.strokeWidth}
              fill={eyes.fill}
              className="dark:stroke-slate-100"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Mouth */}
          <motion.path
            d={mouthPath}
            stroke="#1F2937"
            strokeWidth="1.2"
            fill={isHappyMouth ? '#1F2937' : 'none'}
            className="dark:stroke-slate-100 dark:fill-slate-100"
            strokeLinecap="round"
            animate={{
              y: expression === 'thinking' ? -1 : 0,
            }}
          />

          {/* Left Arm / Leaf (Waving Arm) */}
          <motion.path
            d="M 9 20 C 5 18, 4 23, 8 22 Z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="0.8"
            style={{ transformOrigin: '8px 21px' }}
            animate={waveAnimate}
            transition={waveTransition}
          />

          {/* Right Arm / Leaf */}
          <path
            d="M 27 20 C 31 18, 32 23, 28 22 Z"
            fill="#34D399"
            stroke="#10B981"
            strokeWidth="0.8"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="dropletGradient" x1="18" y1="6" x2="18" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="60%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
