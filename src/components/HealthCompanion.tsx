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

const MediMascot: React.FC<{ expression: string; onClick: () => void }> = ({ expression, onClick }) => {
  const isHappy   = expression === 'success' || expression === 'greeting';
  const isConcern = expression === 'error';
  const isThink   = expression === 'thinking';
  const isWave    = expression === 'greeting';

  const renderEyes = () => {
    if (isHappy) {
      return (
        <g>
          <path d="M 36 53 Q 41 47 46 53" stroke="#1a1008" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M 54 53 Q 59 47 64 53" stroke="#1a1008" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </g>
      );
    }
    if (isConcern) {
      return (
        <g>
          <circle cx="41" cy="53" r="5" fill="#1a1008" />
          <circle cx="59" cy="53" r="5" fill="#1a1008" />
          <circle cx="43" cy="50.5" r="1.8" fill="white" />
          <circle cx="61" cy="50.5" r="1.8" fill="white" />
          <path d="M 35 45 Q 41 49 46 46" stroke="#5a3e1b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 54 46 Q 59 49 65 45" stroke="#5a3e1b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    }
    if (isThink) {
      return (
        <g>
          <circle cx="41" cy="53" r="5.5" fill="#1a1008" />
          <circle cx="59" cy="53" r="5.5" fill="#1a1008" />
          <circle cx="39.5" cy="50" r="2" fill="white" />
          <circle cx="57.5" cy="50" r="2" fill="white" />
        </g>
      );
    }
    return (
      <motion.g
        animate={{ scaleY: [1, 1, 0.06, 1, 1] }}
        transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 0.1 }}
        style={{ transformOrigin: '50px 53px' }}
      >
        <circle cx="41" cy="53" r="5.5" fill="#1a1008" />
        <circle cx="59" cy="53" r="5.5" fill="#1a1008" />
        <circle cx="43" cy="50" r="2" fill="white" />
        <circle cx="61" cy="50" r="2" fill="white" />
      </motion.g>
    );
  };

  const renderMouth = () => {
    if (isHappy)   return <path d="M 38 63 Q 50 74 62 63" stroke="#b45309" strokeWidth="2.2" fill="none" strokeLinecap="round" />;
    if (isConcern) return <path d="M 40 68 Q 50 63 60 68" stroke="#b45309" strokeWidth="2"   fill="none" strokeLinecap="round" />;
    if (isThink)   return <path d="M 43 65 Q 50 68 57 65" stroke="#b45309" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
    return <path d="M 40 64 Q 50 71 60 64" stroke="#b45309" strokeWidth="2" fill="none" strokeLinecap="round" />;
  };

  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer select-none"
      whileHover={{ scale: 1.08, rotate: 2 }}
      whileTap={{ scale: 0.93 }}
      animate={{ y: [0, -7, 0] }}
      transition={{ y: { repeat: Infinity, duration: 3.2, ease: 'easeInOut' } }}
    >
      <svg
        width="100" height="118" viewBox="0 0 100 118"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        style={{ filter: 'drop-shadow(0px 10px 20px rgba(5,120,80,0.22)) drop-shadow(0px 3px 6px rgba(0,0,0,0.14))' }}
      >
        <defs>
          <radialGradient id="hG" cx="36%" cy="26%" r="64%">
            <stop offset="0%"   stopColor="#FFFFFF" />
            <stop offset="30%"  stopColor="#F7F2E8" />
            <stop offset="72%"  stopColor="#E8DFC8" />
            <stop offset="100%" stopColor="#C9BDA5" />
          </radialGradient>
          <radialGradient id="specG" cx="34%" cy="28%" r="38%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="scrG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#4ADE80" />
            <stop offset="40%"  stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="armG" cx="30%" cy="25%" r="65%">
            <stop offset="0%"   stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#16A34A" />
          </radialGradient>
          <linearGradient id="lfG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#BBF7D0" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="blG" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FCA5A5" stopOpacity="0.70" />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="50" cy="115" rx="24" ry="4" fill="#00000018" />

        {/* Success glow */}
        {expression === 'success' && (
          <motion.ellipse cx="50" cy="90" rx="42" ry="22"
            fill="#34D399" fillOpacity="0.18"
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.6, 0.25] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}

        {/* Left arm */}
        <motion.g
          style={{ transformOrigin: '20px 88px' }}
          animate={isWave ? { rotate: [0, -40, 5, -40, 0] } : { rotate: 0 }}
          transition={isWave ? { repeat: Infinity, duration: 1.0, ease: 'easeInOut' } : {}}
        >
          <ellipse cx="17" cy="86" rx="8" ry="6.5" fill="url(#armG)" transform="rotate(-25 17 86)" />
          <circle cx="12" cy="82" r="5.5" fill="url(#armG)" />
        </motion.g>

        {/* Right arm */}
        <g>
          <ellipse cx="83" cy="86" rx="8" ry="6.5" fill="url(#armG)" transform="rotate(25 83 86)" />
          <circle cx="88" cy="82" r="5.5" fill="url(#armG)" />
        </g>

        {/* Scrubs body */}
        <rect x="26" y="80" width="48" height="28" rx="12" ry="12" fill="url(#scrG)" />

        {/* Medical cross */}
        <rect x="46.5" y="85" width="7" height="16" rx="2.5" fill="white" opacity="0.95" />
        <rect x="42"   y="89.5" width="16" height="7" rx="2.5" fill="white" opacity="0.95" />

        {/* Stethoscope */}
        <path d="M 35 80 Q 28 74 30 66 Q 32 60 38 60"
          stroke="#e2e8f0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.85" />
        <circle cx="38" cy="59" r="4" fill="#94a3b8" opacity="0.9" />
        <circle cx="38" cy="59" r="2" fill="#e2e8f0" opacity="0.9" />

        {/* Head */}
        <motion.circle cx="50" cy="48" r="40" fill="url(#hG)"
          animate={{ scaleX: [1, 0.985, 1], scaleY: [1, 1.008, 1] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: 'easeInOut' }}
          style={{ transformOrigin: '50px 48px' }}
        />
        <circle cx="50" cy="48" r="40" fill="url(#specG)" />
        <circle cx="50" cy="48" r="40" fill="none" stroke="rgba(180,160,130,0.28)" strokeWidth="1" />

        {/* Leaf sprouts */}
        <motion.g
          style={{ transformOrigin: '50px 10px' }}
          animate={isWave
            ? { rotate: [0, 12, -12, 12, 0] }
            : { rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: isWave ? 1.0 : 3.8, ease: 'easeInOut' }}
        >
          <line x1="50" y1="10" x2="50" y2="5" stroke="#15803D" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M 50 9 Q 38 0 34 4 Q 36 11 50 10 Z" fill="url(#lfG)" />
          <path d="M 50 8 Q 62 -1 66 3 Q 64 11 50 9 Z" fill="url(#lfG)" />
          <path d="M 50 9 Q 41 4 36 5" stroke="#15803D" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path d="M 50 8 Q 59 3 64 4" stroke="#15803D" strokeWidth="0.9" fill="none" opacity="0.5" />
        </motion.g>

        {/* Eyes */}
        {renderEyes()}

        {/* Blush cheeks */}
        <ellipse cx="28" cy="63" rx="10" ry="6.5" fill="url(#blG)" />
        <ellipse cx="72" cy="63" rx="10" ry="6.5" fill="url(#blG)" />

        {/* Mouth */}
        {renderMouth()}

        {/* Tongue on success */}
        {expression === 'success' && (
          <motion.ellipse cx="50" cy="72" rx="6" ry="5" fill="#F87171"
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            style={{ transformOrigin: '50px 68px' }}
          />
        )}

        {/* Thinking bubbles */}
        {isThink && [
          { cx: 70, cy: 28, r: 2.8, d: 0    },
          { cx: 78, cy: 18, r: 3.8, d: 0.18 },
          { cx: 88, cy:  7, r: 5,   d: 0.36 },
        ].map((b, i) => (
          <motion.circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#6EE7B7" opacity="0.8"
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: b.d }}
          />
        ))}

        {/* Sparkles */}
        {expression === 'success' && [
          { x: 7,  y: 28, sz: 6,   d: 0   },
          { x: 88, y: 20, sz: 5,   d: 0.2 },
          { x: 92, y: 52, sz: 4.5, d: 0.4 },
        ].map((s, i) => (
          <motion.g key={i} style={{ transformOrigin: `${s.x}px ${s.y}px` }}
            animate={{ scale: [0, 1.3, 0], rotate: [0, 90, 180] }}
            transition={{ repeat: Infinity, duration: 1.6, delay: s.d }}
          >
            <line x1={s.x} y1={s.y - s.sz} x2={s.x} y2={s.y + s.sz}
              stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
            <line x1={s.x - s.sz} y1={s.y} x2={s.x + s.sz} y2={s.y}
              stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
};

export const HealthCompanion: React.FC = () => {
  const { expression, message, speak, clear } = useHealthCompanion();
  const [bubbleOpen, setBubbleOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      speak('Halo! Saya Medi, asisten kesehatan Anda. Ada yang bisa saya bantu hari ini? 👋', 'greeting', 8000);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { setBubbleOpen(!!message); }, [message]);

  const handleClick = () => {
    if (expression === 'thinking') return;
    const tip = WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)];
    speak(tip, 'greeting', 8000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">

      <AnimatePresence>
        {bubbleOpen && message && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.86 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,  y: 10, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            className="mb-4 max-w-[260px] md:max-w-[290px] p-4 bg-white/98 dark:bg-slate-900/98 backdrop-blur-lg border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl pointer-events-auto relative"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3 h-3 fill-current" /> Medi
              </span>
              <button onClick={clear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-medium leading-relaxed text-gray-700 dark:text-gray-200">{message}</p>
            <div className="absolute right-8 -bottom-[7px] w-3.5 h-3.5 bg-white dark:bg-slate-900 border-r border-b border-emerald-100 dark:border-emerald-900/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expression === 'thinking' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex gap-1.5 px-3 py-2 mb-1 mr-6 rounded-full bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-md"
          >
            {[0, 0.15, 0.3].map((d, i) => (
              <motion.span key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full block"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: d }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto mr-1">
        <MediMascot expression={expression} onClick={handleClick} />
      </div>
    </div>
  );
};
