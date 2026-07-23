import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import {
  User,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Droplet,
  Flame,
  Moon,
  Activity,
  Lock,
  Heart,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle,
  ChevronDown,
  HelpCircle,
  TrendingUp,
  Zap,
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: 'avatar_leaf', label: 'Daun Sehat', color: 'from-emerald-400 to-teal-500', emoji: '🌿' },
  { id: 'avatar_heart', label: 'Detak Jantung', color: 'from-rose-400 to-pink-500', emoji: '❤️' },
  { id: 'avatar_doctor_m', label: 'Dokter Awan', color: 'from-blue-400 to-indigo-500', emoji: '🧑‍⚕️' },
  { id: 'avatar_doctor_f', label: 'Dokter Bintang', color: 'from-purple-400 to-pink-500', emoji: '👩‍⚕️' },
  { id: 'avatar_apple', label: 'Apel Bugar', color: 'from-amber-400 to-orange-500', emoji: '🍎' },
];

export const Login: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_leaf');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  // ── Pricing Plan State ──
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // ── Live Interactive Mockup States ──
  const [mockWater, setMockWater] = useState(1750);
  const [mockCal, setMockCal] = useState(1420);

  const mockWaterProgress = Math.min(100, Math.round((mockWater / 2500) * 100));
  const mockCalProgress = Math.min(100, Math.round((mockCal / 2000) * 100));
  const mockCalRemaining = Math.max(0, 2000 - mockCal);

  // ── Mascot Demo State ──
  const [demoSpeech, setDemoSpeech] = useState(
    'Halo! Saya Medi, asisten kesehatan pribadi Anda. Coba klik saya untuk mendapatkan tips kesehatan harian! 👋'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ── Simulator Warning & FAQ States ──
  const [showSimulatorWarning, setShowSimulatorWarning] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleMascotClick = () => {
    const tips = [
      'Minum segelas air putih hangat saat bangun tidur sangat baik untuk melancarkan metabolisme tubuh Anda! 💧',
      'Luangkan waktu 10-15 menit untuk meregangkan otot di antara jam kerja untuk mencegah pegal linu! 🧘‍♀️',
      'Kurangi konsumsi gula berlebih hari ini untuk menghindari kelesuan mendadak di sore hari! 🍎',
      'Tidur berkualitas selama 7-8 jam membantu regenerasi sel dan menjaga fokus Anda esok hari! 😴',
      'Tarik napas dalam-dalam selama 5 detik, tahan, lalu embuskan secara perlahan untuk meredakan kecemasan! 🌿',
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDemoSpeech(randomTip);

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(randomTip);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Silakan masukkan nama Anda');
      return;
    }
    if (trimmedName.length > 50) {
      setError('Nama terlalu panjang (maksimal 50 karakter)');
      return;
    }
    const numWeight = parseFloat(weight) || 70;
    const numHeight = parseFloat(height) || 170;
    if (weight && (numWeight < 20 || numWeight > 300)) {
      setError('Berat badan tidak valid (20–300 kg)');
      return;
    }
    if (height && (numHeight < 100 || numHeight > 250)) {
      setError('Tinggi badan tidak valid (100–250 cm)');
      return;
    }
    login(trimmedName, selectedAvatar, numWeight, numHeight);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfbf9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative overflow-hidden font-sans selection:bg-emerald-500/25 selection:text-emerald-900">
      
      {/* ── Subtle Background Grid (Reduced to 3-5% opacity for premium SaaS look) ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-[0.04] dark:opacity-[0.03]" />
      
      {/* ── Soft Ambient Radial Lighting Glow ── */}
      <div className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-emerald-500/12 via-teal-500/6 to-transparent dark:from-emerald-500/8 dark:via-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ── STICKY GLASSMORPHISM NAVBAR ── */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/40 dark:border-slate-800/40 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo iconSize={34} />
            <span className="font-extrabold text-lg font-display tracking-tight text-slate-900 dark:text-white">
              HealthMate <span className="text-emerald-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#fitur" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Fitur</a>
            <a href="#demo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Simulasi Live</a>
            <a href="#harga" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Harga</a>
            <a href="#keamanan" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privasi</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={loginAsGuest}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 transition-colors"
            >
              Masuk Tamu
            </button>
            <Button
              size="sm"
              onClick={() => setShowOnboarding(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-5 py-2 shadow-sm shadow-emerald-500/20"
            >
              Mulai Sekarang
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-10 pb-12 lg:pt-14 lg:pb-16 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left: Text Content & CTAs */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>HealthMate AI Engine Gen 2 • Live Release</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.08] text-slate-900 dark:text-white">
            Dasbor Keseimbangan Hidup.<br />
            Diperkuat <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 bg-clip-text text-transparent">Kecerdasan AI</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl lg:max-w-2xl mx-auto lg:mx-0 font-medium">
            HealthMate AI adalah pendamping gaya hidup modern Anda. Kelola hidrasi, asupan gizi harian, kualitas istirahat malam, dan analisis massa tubuh Anda dalam satu alur visual premium terenkripsi penuh.
          </p>

          {/* CTA Hierarchy: Dominant Primary + Refined Ghost Secondary */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 ring-4 ring-emerald-500/10 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Mulai Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={loginAsGuest}
              className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Uji Coba Cepat (Guest)</span>
            </button>
          </div>

          {/* Trust Indicators: Refined Pill Badges Row */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Data Local-First AES-256</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>HIPAA-Ready Architecture</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Standar Medis WHO</span>
            </div>
          </div>

        </div>

        {/* Right: Enlarged (15-20%) Realistic Interactive SaaS Dashboard Product Preview */}
        <div id="demo" className="flex-1 lg:flex-[1.25] w-full max-w-2xl relative">
          
          {/* Subtle Ambient Radial Backlight behind Mockup */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-indigo-500/15 rounded-[36px] blur-3xl transform rotate-1 pointer-events-none opacity-90" />

          {/* Floating UI Pill Badge (Top-Right) */}
          <div className="absolute -top-4 -right-2 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-bold text-slate-800 dark:text-slate-100 animate-bounce" style={{ animationDuration: '4s' }}>
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>AI Health Score 94/100</span>
          </div>

          {/* Floating UI Pill Badge (Bottom-Left) */}
          <div className="absolute -bottom-4 -left-2 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-bold text-slate-800 dark:text-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero-Knowledge Storage</span>
          </div>

          {/* Realistic SaaS Product Preview Window Card (Layered Soft Floating Shadows) */}
          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-[28px] p-6 shadow-[0_20px_50px_rgba(16,185,129,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Header Window Bar */}
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest font-display">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE PRODUCT PREVIEW
                </span>
              </div>
            </div>

            {/* Top Micro Vitals Summary Bar */}
            <div className="grid grid-cols-4 gap-2 mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-800/50">
              <div className="text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Heart Rate</span>
                <span className="text-xs font-black text-rose-500 dark:text-rose-400 flex items-center justify-center gap-0.5">
                  <Heart className="w-3 h-3 fill-current animate-pulse" /> 72 BPM
                </span>
              </div>
              <div className="text-center border-l border-slate-200/60 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sleep</span>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-0.5">
                  <Moon className="w-3 h-3 fill-current" /> 7.8 hrs
                </span>
              </div>
              <div className="text-center border-l border-slate-200/60 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">BMI Index</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                  <Activity className="w-3 h-3" /> 21.2
                </span>
              </div>
              <div className="text-center border-l border-slate-200/60 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Steps</span>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> 8.4k
                </span>
              </div>
            </div>

            {/* Content Widgets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              
              {/* Interactive Water Widget */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/40 dark:border-slate-800 p-4 rounded-2xl relative overflow-hidden h-[135px] flex flex-col justify-between">
                
                {/* Dynamic animated liquid wave */}
                <div 
                  className="absolute inset-x-0 bottom-0 w-full overflow-hidden transition-all duration-1000 ease-out z-0" 
                  style={{ 
                    height: `${mockWaterProgress}%`,
                    minHeight: mockWaterProgress > 0 ? '16px' : '0px'
                  }}
                >
                  <svg 
                    viewBox="0 0 120 28" 
                    className="absolute bottom-0 w-full h-[32px] overflow-visible" 
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="liveWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.65" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      fill="url(#liveWaterGrad)"
                      d="M0 15 C 30 10, 30 20, 60 15 C 90 10, 90 20, 120 15 L 120 40 L 0 40 Z"
                      animate={{ x: [0, -60, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      fill="url(#liveWaterGrad)"
                      opacity="0.5"
                      d="M0 18 C 30 23, 30 13, 60 18 C 90 23, 90 13, 120 18 L 120 40 L 0 40 Z"
                      animate={{ x: [-60, 0, -60] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    />
                  </svg>
                  <div 
                    className="w-full bg-[#0284c7]/40 dark:bg-[#0284c7]/25"
                    style={{ height: 'calc(100% - 14px)' }}
                  />
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Droplet className="w-4 h-4 fill-current" />
                  </span>
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400">{mockWaterProgress}%</span>
                </div>
                <div className="relative z-10">
                  <span className="text-2xl font-black font-display text-slate-900 dark:text-white leading-none">
                    {mockWater} <span className="text-xs font-semibold text-slate-400 leading-none">/ 2500 ml</span>
                  </span>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">Asupan Hidrasi Harian</p>
                </div>
              </div>

              {/* Interactive Calories Widget */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/40 dark:border-slate-800 p-4 rounded-2xl h-[135px] flex flex-col justify-between relative overflow-hidden">
                
                {/* Dynamic heat glow bg */}
                <div 
                  className="absolute inset-x-0 bottom-0 bg-amber-500/10 dark:bg-amber-500/5 transition-transform duration-1000 ease-out z-0" 
                  style={{ height: `${mockCalProgress}%` }}
                />

                {/* Evaporating Calorie Bubbles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  {[...Array(5)].map((_, i) => {
                    const size = 5 + (i % 3) * 2.5;
                    const left = 10 + (i * 22) % 75;
                    const delay = i * 0.5;
                    const duration = 2.0 + (i % 2) * 1.0;
                    return (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-amber-400/20 dark:bg-amber-400/10"
                        style={{
                          bottom: '-10%',
                          left: `${left}%`,
                          width: size,
                          height: size,
                        }}
                        animate={{
                          y: ['0%', '-120%'],
                          x: ['0px', i % 2 === 0 ? '8px' : '-8px', '0px'],
                          opacity: [0, 0.6, 0.2, 0],
                        }}
                        transition={{
                          duration: duration,
                          repeat: Infinity,
                          delay: delay,
                          ease: 'easeInOut',
                        }}
                      />
                    );
                  })}
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Flame className="w-4 h-4 fill-current" />
                  </span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">{mockCalRemaining} kcal left</span>
                </div>
                <div className="relative z-10">
                  <span className="text-2xl font-black font-display text-slate-900 dark:text-white leading-none">
                    {mockCal} <span className="text-xs font-semibold text-slate-400 leading-none">/ 2000 kcal</span>
                  </span>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">Kuotasi Energi Kalori</p>
                </div>
              </div>

            </div>

            {/* Interactive Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => setMockWater(prev => Math.min(2500, prev + 250))}
                className="flex-1 py-2.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-bold transition-all active:scale-[0.98]"
              >
                + Minum 250ml Air
              </button>
              <button
                onClick={() => setMockCal(prev => Math.min(2000, prev + 350))}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20 text-amber-700 dark:text-amber-350 text-xs font-bold transition-all active:scale-[0.98]"
              >
                + Makan (350 kcal)
              </button>
              <button
                onClick={() => setShowSimulatorWarning(true)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 hover:bg-rose-500/20 text-rose-700 dark:text-rose-350 text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Gejala Kritis
              </button>
              <button
                onClick={() => { setMockWater(1250); setMockCal(850); setShowSimulatorWarning(false); }}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all"
              >
                Reset
              </button>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3 font-medium">
              *Tekan tombol di atas untuk menguji coba reaksi dasbor secara langsung!
            </p>

            {/* Safety Safeguard Emergency Warning Overlay */}
            <AnimatePresence>
              {showSimulatorWarning && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-x-4 top-16 bottom-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-red-500/30 rounded-2xl p-5 flex flex-col justify-between z-30 shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-red-650 dark:text-red-400 font-extrabold text-xs uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
                      <span>PERINGATAN GEJALA DARURAT</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                      Sistem AI mendeteksi keluhan kritis (seperti sesak napas akut atau nyeri dada). 
                      <strong> Harap segera hubungi layanan darurat medis (112)</strong> atau pergi ke IGD rumah sakit terdekat. Chatbot AI tidak boleh digunakan untuk kondisi darurat.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSimulatorWarning(false)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Tutup & Lanjutkan Simulasi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── MASCOT COMPANION INTEGRATION SECTION ── */}
      <section className="w-full max-w-6xl mx-auto px-6 py-10 relative z-10">
        <div className="glassmorphism dark:glassmorphism-dark rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          
          <div className="relative shrink-0">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
                transform: 'scale(1.4)',
              }}
              animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            />
            <motion.div
              onClick={handleMascotClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg cursor-pointer relative z-10 select-none"
            >
              <Sparkles className="w-8 h-8 text-white fill-current/10" />
              {/* Voice Visualizer Waves */}
              {isSpeaking && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 z-20">
                  {[...Array(5)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="w-0.5 bg-emerald-400 rounded-full"
                      animate={{ height: [4, 14, 4] }}
                      transition={{
                        duration: 0.4 + (idx % 3) * 0.1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatType: 'reverse'
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 z-20">
              {isSpeaking ? (
                <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-white/70" />
              )}
            </div>
          </div>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
              <Heart className="w-3 h-3 fill-current" /> Pendamping Sehat (Medi)
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Tanyakan Apapun Kepada Medi</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              "{demoSpeech}"
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
              *Tekan daun Medi di sebelah kiri untuk mendengarkan rekomendasi harian Anda!
            </p>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES GRID ── */}
      <section id="fitur" className="w-full max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-slate-100 dark:border-slate-900/50">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Dasbor Lengkap untuk Keseimbangan Anda
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Menyatukan analisis kebugaran, asupan nutrisi harian, kualitas tidur, dan berat badan ideal dalam dasbor visual premium.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 block w-fit">
                <MessageSquare className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Analisis Kesehatan AI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Diskusikan pola makan, gejala ringan, atau rancangan kebugaran Anda secara personal dengan model AI yang mematuhi batas keamanan klinis.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 block w-fit">
                <Droplet className="w-5 h-5 fill-current" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Pemantau Hidrasi Harian</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                Catat asupan air harian secara teratur dengan visualisasi gelombang cairan interaktif untuk memantau target hidrasi tubuh.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 block w-fit">
                <Flame className="w-5 h-5 fill-current" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Manajemen Kalori & Energi</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                Pantau kuota sisa energi harian dengan indikator pembakaran kalori aktif untuk menjaga pola konsumsi gizi yang seimbang.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 block w-fit">
                <Moon className="w-5 h-5 fill-current" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Evaluasi Siklus Tidur</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                Evaluasi tahapan tidur Anda (Deep, Light, REM) yang direpresentasikan secara visual melalui grafik langit malam beranimasi.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 block w-fit">
                <Activity className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Siluet Indeks Massa Tubuh (IMT)</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                Visualisasikan klasifikasi berat badan ideal secara dinamis melalui model siluet anatomi manusia yang proporsional.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="p-3 rounded-2xl bg-slate-500/10 text-slate-600 dark:text-slate-400 block w-fit">
                <Lock className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">Keamanan Lokal Penuh</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                Semua data Anda (mulai dari data fisik hingga obrolan konsultasi AI) disimpan secara lokal di browser Anda. Tidak ada data yang diunggah ke cloud luar.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── PRICING PLANS SECTION ── */}
      <section id="harga" className="w-full max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-slate-100 dark:border-slate-900/50">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Pilih Paket Dasbor Anda
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Paket offline Sandbox sepenuhnya gratis selamanya. Dapatkan fitur AI tanpa batas dengan Paket Pro Cloud.
          </p>

          {/* Toggle Cycle */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200/60 dark:border-slate-800/80">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-650'
              }`}
            >
              Tahunan <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-extrabold uppercase">Hemat 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plan 1: Local Sandbox (Free) */}
          <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-[28px] flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">OFFLINE ONLY</span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">Local Sandbox</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dasbor kebugaran lokal yang aman, gratis, dan privat.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-display text-slate-900 dark:text-white">Rp 0</span>
                <span className="text-xs text-slate-400">/ selamanya</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Fitur yang didapat:</span>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dasbor Hidrasi, Kalori, dan Tidur Lengkap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Siluet Anatomi Tubuh IMT Adaptif</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Penyimpanan Lokal Terenkripsi (Offline)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 line-through">
                    <CheckCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                    <span>Akses Asisten Obrolan Gemini AI</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                onClick={loginAsGuest}
                className="w-full py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 bg-transparent font-bold rounded-xl"
              >
                Mulai sebagai Tamu (Toko Lokal)
              </Button>
            </div>
          </div>

          {/* Plan 2: Pro Cloud (Paid) */}
          <div className="bg-white/60 dark:bg-slate-900/40 border-2 border-emerald-500/80 dark:border-emerald-600/80 p-8 rounded-[28px] flex flex-col justify-between shadow-md relative overflow-hidden">
            
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
              POPULER
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">CLOUD CONNECT</span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">Professional AI</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dapatkan asisten kesehatan AI komprehensif di mana saja.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-display text-slate-900 dark:text-white">
                  {billingCycle === 'monthly' ? 'Rp 39.000' : 'Rp 31.000'}
                </span>
                <span className="text-xs text-slate-400">/ bulan {billingCycle === 'yearly' && ' (ditagih tahunan)'}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Semua fitur Sandbox, ditambah:</span>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Akses Asisten Obrolan Gemini AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Symptom Checker & Workout Planner Cerdas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sinkronisasi Multi-Device Aman Cloud</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Eksport Laporan Rekam Kesehatan PDF</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => setShowOnboarding(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md shadow-emerald-500/10"
              >
                Mulai Setup Profil Kustom
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECURITY & SECURITY COMPLIANCE ── */}
      <section id="keamanan" className="w-full max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-slate-100 dark:border-slate-900/50 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-widest mx-auto">
            <Lock className="w-3 h-3" /> Privasi Data adalah Hak Asasi
          </div>
          <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Keamanan Data Setingkat Perbankan
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Data Anda dienkripsi dari ujung ke ujung menggunakan algoritma AES-256 lokal pada browser perangkat Anda. Kami tidak menyimpan kunci dekripsi ataupun menjual data rekam medis Anda ke pihak ketiga.
          </p>
        </div>

        {/* Compliance badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">AES-256 Encrypted</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center gap-2">
            <Lock className="w-8 h-8 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Offline First Mode</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">HIPAA Compliant</span>
          </div>
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 flex flex-col items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Consent Oriented</span>
          </div>
        </div>
      </section>

      {/* ── MEDICAL TRUST & SAFETY FAQ ACCORDION ── */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12 relative z-10 border-t border-slate-100 dark:border-slate-900/50">
        <div className="text-center mb-10 space-y-3">
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto">
            <HelpCircle className="w-3.5 h-3.5" /> KLINIKAL & TRANSPARANSI AI
          </span>
          <h2 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Validasi Medis & Kepercayaan Layanan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Pelajari bagaimana sistem kami menjaga keamanan data rekam medis Anda, mematuhi standar WHO, serta membatasi bahaya melalui penapisan gejala kritis.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Apakah HealthMate AI mendiagnosis penyakit saya?',
              a: 'Tidak. HealthMate AI adalah asisten edukasi gaya hidup dan kebugaran mandiri. Rekomendasi kalori, hidrasi, dan analisis chat bersifat informatif dan edukatif saja, bukan diagnosis klinis formal. Hubungi dokter jika Anda mengalami gejala penyakit.'
            },
            {
              q: 'Bagaimana platform mendeteksi dan menangani gejala kritis?',
              a: 'Kami mengintegrasikan Clinical Safety Safeguard yang mendeteksi kata kunci gejala kritis secara real-time (misalnya nyeri dada, sesak napas akut, mati rasa mendadak). Sistem akan langsung memblokir obrolan AI dan mengarahkan Anda untuk segera menghubungi layanan darurat 112 atau ambulans terdekat.'
            },
            {
              q: 'Apakah pedoman nutrisi dan IMT yang digunakan akurat?',
              a: 'Ya. Rumus perhitungan target air harian, kuota kalori harian, serta klasifikasi indeks massa tubuh (IMT) diselaraskan langsung dengan standar medis Organisasi Kesehatan Dunia (WHO) dan pedoman gizi seimbang Kementerian Kesehatan RI.'
            },
            {
              q: 'Apakah data medis saya aman dari kebocoran cloud?',
              a: 'Sangat aman. Dengan arsitektur Zero-Knowledge & Offline-First, seluruh riwayat chat konsultasi, parameter berat/tinggi badan, dan asupan harian disimpan secara lokal dan dienkripsi AES-256 pada perangkat Anda sendiri. Tidak ada data kesehatan yang disimpan di server luar.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
                >
                  <span className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 dark:text-slate-500 shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-4 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 dark:border-slate-900/50 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <div>
          <span className="font-semibold text-slate-500 dark:text-slate-400">HealthMate AI</span> &copy; 2026. Designed with premium SaaS principles.
        </div>
        <div className="max-w-md md:text-right leading-relaxed italic text-[10px]">
          Penafian: HealthMate AI menyajikan informasi kesehatan umum yang murni bersifat edukatif. Layanan ini bukan merupakan diagnosis klinis resmi dan tidak menggantikan rujukan dari dokter berwenang.
        </div>
      </footer>

      {/* ── ONBOARDING SLIDE-IN OVERLAY PANEL ── */}
      <AnimatePresence>
        {showOnboarding && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOnboarding(false)}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Form Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800/80 p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Logo iconSize={28} />
                  <h3 className="font-extrabold text-base font-display text-slate-900 dark:text-white">
                    Setup Profil Anda
                  </h3>
                </div>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ×
                </button>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-6">
                Data profil Anda digunakan secara offline untuk memproyeksikan target air harian, kuota kalori seimbang, dan mengklasifikasikan IMT Anda.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Masukkan nama Anda..."
                      className="w-full px-4 py-3 pl-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold"
                    />
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                  {error && (
                    <p className="text-rose-500 text-[10px] mt-1.5 flex items-center gap-1 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Tinggi Badan (cm)
                    </label>
                    <input
                      type="number"
                      required
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Contoh: 170"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Berat Badan (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Contoh: 65"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Avatar Presets */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Pilih Avatar Profil
                  </label>
                  <div className="flex justify-between gap-2 mt-1">
                    {AVATAR_PRESETS.map((avatar) => (
                      <button
                        type="button"
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr ${avatar.color} shadow-sm transition-all duration-200 hover:scale-105
                          ${selectedAvatar === avatar.id ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 shadow-md opacity-100' : 'opacity-60'}
                        `}
                        title={avatar.label}
                      >
                        <span className="text-lg">{avatar.emoji}</span>
                        {selectedAvatar === avatar.id && (
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[8px] text-white font-bold border border-white dark:border-slate-900">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md shadow-emerald-500/10 rounded-2xl transition-all"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Simpan & Masuk Dasbor
                  </Button>
                  <button
                    type="button"
                    onClick={loginAsGuest}
                    className="w-full py-3 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 font-bold rounded-2xl transition-all text-xs"
                  >
                    Masuk Langsung sebagai Tamu
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
