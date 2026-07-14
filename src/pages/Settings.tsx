import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Laptop,
  ToggleLeft,
  ToggleRight,
  Info,
  User,
  Sliders,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import type { AppSettings, UserProfile } from '../types';
import { INITIAL_SETTINGS, MOCK_PLUGINS } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Avatar';

export const Settings: React.FC = () => {
  const { theme: activeTheme, setTheme } = useTheme();
  const { t } = useLanguage();
  
  const navigate = useNavigate();
  const { user: profile, updateProfile, logout } = useAuth();
  const [settings, setSettings] = useLocalStorage<AppSettings>('healthmate-settings', INITIAL_SETTINGS);

  // Profile forms state
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [waterGoal, setWaterGoal] = useState(profile.waterGoal.toString());
  const [calorieGoal, setCalorieGoal] = useState(profile.calorieGoal.toString());

  // Gemini config form state
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [systemInstruction, setSystemInstruction] = useState(settings.systemInstruction);
  const [temperature, setTemperature] = useState(settings.temperature.toString());

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      avatar,
      isGuest: avatar === 'guest',
      waterGoal: parseInt(waterGoal) || 2000,
      calorieGoal: parseInt(calorieGoal) || 2000,
    };
    updateProfile(updated);

    // Sync water/calorie goals inside metrics as well
    const savedMetrics = localStorage.getItem('healthmate-metrics');
    if (savedMetrics) {
      const parsed = JSON.parse(savedMetrics);
      localStorage.setItem('healthmate-metrics', JSON.stringify({
        ...parsed,
        waterIntake: { ...parsed.waterIntake, goal: parseInt(waterGoal) || 2000 },
        calories: { ...parsed.calories, goal: parseInt(calorieGoal) || 2000 }
      }));
      window.dispatchEvent(new Event('metrics-updated'));
    }

    showSuccessMessage(t.profileSaved);
  };

  const handleSaveGeminiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: AppSettings = {
      ...settings,
      apiKey: apiKey.trim(),
      model,
      systemInstruction: systemInstruction.trim(),
      temperature: parseFloat(temperature) || 0.7,
    };
    setSettings(updatedSettings);
    window.dispatchEvent(new Event('settings-updated'));
    const msg = settings.language === 'en' ? 'Gemini API configuration saved successfully!' : 'Konfigurasi API Gemini berhasil disimpan!';
    showSuccessMessage(msg);
  };

  const handleTogglePlugin = (pluginId: string) => {
    const updatedPlugins = {
      ...settings.plugins,
      [pluginId]: !settings.plugins[pluginId],
    };
    setSettings({
      ...settings,
      plugins: updatedPlugins,
    });
    window.dispatchEvent(new Event('settings-updated'));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'id';
    const updatedSettings = {
      ...settings,
      language: newLang,
    };
    setSettings(updatedSettings);
    window.dispatchEvent(new Event('settings-updated'));
    
    const langName = newLang === 'en' ? 'English' : 'Bahasa Indonesia';
    const msg = newLang === 'en' ? `Language changed successfully to ${langName}` : `Bahasa berhasil diubah menjadi ${langName}`;
    showSuccessMessage(msg);
  };

  const showSuccessMessage = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 3000);
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Toast Feedback */}
      {savedFeedback && (
        <div className="fixed bottom-6 right-6 z-55 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm">
          <span>✓</span>
          <span>{savedFeedback}</span>
        </div>
      )}      {/* 1. PERSONAL PROFILE SECTION */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{t.userProfile}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t.manageProfileDesc}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
              {/* Left: Current Avatar Display & Selector */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.activeAvatar}
                </span>
                <Avatar src={avatar} name={name} size="xl" className="shadow-md border border-gray-100 dark:border-slate-800" />
              </div>

              {/* Right: Input Name */}
              <div className="flex-1 w-full">
                <Input
                  label={t.fullName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Avatar Picker Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                {t.changeAvatar}
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'avatar_leaf', label: 'Daun Sehat', color: 'from-emerald-400 to-teal-500', emoji: '🌿' },
                  { id: 'avatar_heart', label: 'Detak Jantung', color: 'from-rose-400 to-pink-500', emoji: '❤️' },
                  { id: 'avatar_doctor_m', label: 'Dokter Awan', color: 'from-blue-400 to-indigo-500', emoji: '🧑‍⚕️' },
                  { id: 'avatar_doctor_f', label: 'Dokter Bintang', color: 'from-purple-400 to-pink-500', emoji: '👩‍⚕️' },
                  { id: 'avatar_apple', label: 'Apel Bugar', color: 'from-amber-400 to-orange-500', emoji: '🍎' },
                  { id: 'guest', label: 'Tamu', color: 'from-gray-400 to-slate-500', emoji: '👤' },
                ].map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setAvatar(av.id)}
                    className={`relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr ${av.color} shadow-sm transition-all duration-200 hover:scale-105
                      ${avatar === av.id ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 shadow-md' : 'opacity-70'}
                    `}
                    title={av.label}
                  >
                    {av.id === 'guest' ? (
                      <span className="text-white text-lg">👤</span>
                    ) : (
                      <span className="text-lg">{av.emoji}</span>
                    )}
                    {avatar === av.id && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-bold border border-white dark:border-slate-900">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t.dailyWaterGoal}
                type="number"
                min="500"
                max="10000"
                value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)}
                required
              />
              <Input
                label={t.dailyCalorieGoal}
                type="number"
                min="1000"
                max="6000"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-955/20 dark:hover:bg-rose-955/35 dark:text-rose-400 font-bold text-sm transition-all duration-200"
              >
                {t.exitAccount}
              </button>
              <Button type="submit" className="px-5 rounded-2xl">
                {t.saveProfile}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* 2. PREFERENCES (THEME & LANGUAGE) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold font-display text-gray-900 dark:text-white">{t.appTheme}</h3>
                <p className="text-xs text-gray-455">{t.chooseThemeDesc}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'light', icon: <Sun className="w-4 h-4 mb-1" />, label: t.lightMode },
                { type: 'dark', icon: <Moon className="w-4 h-4 mb-1" />, label: t.darkMode },
                { type: 'system', icon: <Laptop className="w-4 h-4 mb-1" />, label: t.systemMode },
              ].map((themeBtn) => (
                <button
                  key={themeBtn.type}
                  onClick={() => setTheme(themeBtn.type as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200
                    ${
                      activeTheme === themeBtn.type
                        ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600 dark:text-emerald-455 font-bold shadow-sm shadow-emerald-500/5'
                        : 'border-gray-100 dark:border-slate-800 bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/40'
                    }
                  `}
                >
                  {themeBtn.icon}
                  <span className="text-xs">{themeBtn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Info className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold font-display text-gray-900 dark:text-white">{t.languageSettings}</h3>
                  <p className="text-xs text-gray-455">{t.chooseLanguageDesc}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 block ml-1">{t.language}</label>
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 text-xs font-semibold text-gray-800 dark:text-gray-200 dark:bg-slate-900/50 outline-none h-[42px] cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="id">Bahasa Indonesia (ID)</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* 3. PLUGIN MANAGER */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{t.featureManager}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t.togglePluginsDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_PLUGINS.map((plugin) => {
              const isEnabled = settings.plugins[plugin.id] ?? false;
              
              // Localized plugin name/desc
              let localizedName = plugin.name;
              let localizedDesc = plugin.description;
              if (plugin.id === 'symptomChecker') {
                localizedName = t.pluginSymptomName;
                localizedDesc = t.pluginSymptomDesc;
              } else if (plugin.id === 'nutritionAdvice') {
                localizedName = t.pluginNutritionName;
                localizedDesc = t.pluginNutritionDesc;
              } else if (plugin.id === 'workoutSplit') {
                localizedName = t.pluginWorkoutName;
                localizedDesc = t.pluginWorkoutDesc;
              } else if (plugin.id === 'lifestyleTips') {
                localizedName = t.pluginLifestyleName;
                localizedDesc = t.pluginLifestyleDesc;
              }

              return (
                <div
                  key={plugin.id}
                  className={`flex items-start justify-between p-4 rounded-2xl border transition-all duration-205
                    ${
                      isEnabled
                        ? 'border-emerald-250 bg-emerald-50/5 dark:border-slate-800/80 dark:bg-slate-900/30'
                        : 'border-gray-100 bg-gray-50/20 dark:border-slate-850 dark:bg-slate-955/20 opacity-70'
                    }
                  `}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{localizedName}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400">
                        v{plugin.version}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-505 leading-relaxed">
                      {localizedDesc}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTogglePlugin(plugin.id)}
                    className="text-gray-400 hover:text-emerald-500 transition-colors duration-150 shrink-0"
                    title={isEnabled ? (settings.language === 'en' ? 'Disable module' : 'Nonaktifkan modul') : (settings.language === 'en' ? 'Enable module' : 'Aktifkan modul')}
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-10 h-6 text-emerald-550 shrink-0" />
                    ) : (
                      <ToggleLeft className="w-10 h-6 shrink-0" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* DATA MANAGEMENT (DANGER ZONE) */}
      <motion.div variants={itemVariants}>
        <Card className="border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-455">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{t.dataManagement}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t.manageDataDesc}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (confirm(t.confirmClearChat)) {
                  localStorage.removeItem('healthmate-chat-sessions');
                  window.dispatchEvent(new Event('chat-sessions-updated'));
                  showSuccessMessage(t.chatCleared);
                }
              }}
              className="flex-1 px-4 py-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 bg-rose-50/20 hover:bg-rose-50/50 dark:hover:bg-rose-955/20 text-xs font-bold transition-all duration-200"
            >
              {t.clearChatHistory}
            </button>
            <button
              onClick={() => {
                if (confirm(t.confirmResetData)) {
                  localStorage.removeItem('healthmate-metrics');
                  window.dispatchEvent(new Event('metrics-updated'));
                  showSuccessMessage(t.dataReset);
                }
              }}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 bg-gray-50/20 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 text-xs font-bold transition-all duration-200"
            >
              {t.resetHealthData}
            </button>
          </div>
        </Card>
      </motion.div>

      {/* 4. FUTURE GEMINI CONFIGURATION */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-gray-900 dark:text-white">{t.geminiConfigTitle}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t.geminiConfigDesc}</p>
            </div>
          </div>

          <div className="p-3 mb-6 flex gap-3 border border-emerald-100 bg-emerald-50/15 rounded-2xl text-xs text-emerald-700 dark:border-emerald-950/20 dark:bg-emerald-955/5 dark:text-emerald-400">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {settings.language === 'en' ? (
                <>
                  <strong>Get a free API Key</strong> at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">aistudio.google.com</a>. Without an API key, the app runs in offline mode (local responses).
                </>
              ) : (
                <>
                  <strong>Dapatkan API Key gratis</strong> di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">aistudio.google.com</a>. Tanpa API key, aplikasi akan menggunakan mode offline (respons lokal).
                </>
              )}
            </p>
          </div>

          <form onSubmit={handleSaveGeminiConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t.geminiApiKey}
                placeholder="AIzaSy..."
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-450 ml-1">{t.geminiModel}</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 text-xs font-semibold text-gray-800 dark:text-gray-200 dark:bg-slate-900/50 outline-none h-[42px]"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Direkomendasikan) ⚡</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Pintar &amp; Detail)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Cepat)</option>
                  <option value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite (Paling Hemat)</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <Input
                  label={t.temperature}
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Textarea
                  label={t.systemInstruction}
                  rows={3}
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="px-5 rounded-2xl">
                {t.saveConfiguration}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* 5. ABOUT & MEDICAL DISCLAIMER */}
      <motion.div variants={itemVariants}>
        <Card className="border-rose-100 bg-rose-50/5 dark:border-rose-955/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-455">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h3 className="text-lg font-bold font-display text-rose-800 dark:text-rose-450">{t.disclaimerTitle}</h3>
              <p className="text-xs text-rose-600/80 dark:text-rose-550/80">{t.disclaimerSubtitle}</p>
            </div>
          </div>

          <div className="text-xs leading-relaxed text-gray-550 dark:text-gray-400 space-y-3">
            <p>
              {t.disclaimerParagraph1}
            </p>
            <p className="font-bold text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/10 p-3.5 rounded-xl border border-rose-100/50 dark:border-rose-950/30">
              {t.disclaimerParagraph2}
            </p>
            <p>
              {t.disclaimerParagraph3}
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
