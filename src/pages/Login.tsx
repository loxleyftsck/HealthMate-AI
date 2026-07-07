import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { User, ShieldAlert, Sparkles } from 'lucide-react';

const AVATAR_PRESETS = [
  { id: 'avatar_leaf', label: 'Daun Sehat', color: 'from-emerald-400 to-teal-500', emoji: '🌿' },
  { id: 'avatar_heart', label: 'Detak Jantung', color: 'from-rose-400 to-pink-500', emoji: '❤️' },
  { id: 'avatar_doctor_m', label: 'Dokter Awan', color: 'from-blue-400 to-indigo-500', emoji: '🧑‍⚕️' },
  { id: 'avatar_doctor_f', label: 'Dokter Bintang', color: 'from-purple-400 to-pink-500', emoji: '👩‍⚕️' },
  { id: 'avatar_apple', label: 'Apel Bugar', color: 'from-amber-400 to-orange-500', emoji: '🍎' },
];

export const Login: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar_leaf');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Silakan masukkan nama Anda');
      return;
    }
    const numWeight = parseFloat(weight) || 70;
    const numHeight = parseFloat(height) || 170;
    login(name.trim(), selectedAvatar, numWeight, numHeight);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-slate-50 via-emerald-50/20 to-teal-50/10 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-155 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl shadow-emerald-950/5 relative z-10"
      >
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center text-center mb-8">
          <Logo iconSize={48} className="mb-2" />
          <h2 className="text-2xl font-extrabold font-display text-gray-900 dark:text-white tracking-tight mt-3">
            Selamat Datang di HealthMate
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Asisten AI pribadi untuk memantau kesehatan & pola hidup Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Custom Name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Masukkan nama Anda..."
                className="w-full px-4 py-3 pl-10 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-505 transition-all text-sm"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
            {error && (
              <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Optional Health Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Contoh: 170"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-505 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Contoh: 65"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-505 transition-all text-sm"
              />
            </div>
          </div>

          {/* Avatar Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
              Pilih Avatar Profil
            </label>
            <div className="flex justify-between gap-2 mt-1">
              {AVATAR_PRESETS.map((avatar) => (
                <button
                  type="button"
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatar.color} shadow-sm transition-all duration-200 hover:scale-105
                    ${selectedAvatar === avatar.id ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-110 shadow-md' : 'opacity-70'}
                  `}
                  title={avatar.label}
                >
                  <span className="text-xl">{avatar.emoji}</span>
                  {selectedAvatar === avatar.id && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-bold border border-white dark:border-slate-900">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-3">
            {/* Login button */}
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/10 rounded-2xl transition-all"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Masuk dengan Profil Kustom
            </Button>

            {/* Guest button */}
            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full py-3 bg-transparent border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-850 font-semibold rounded-2xl transition-all text-sm"
            >
              Masuk sebagai Tamu (Guest)
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
