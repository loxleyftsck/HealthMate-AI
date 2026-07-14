import { useState, useEffect } from 'react';
import { translations, type Language } from '../utils/translations';
import { INITIAL_SETTINGS } from '../services/mockData';
import type { AppSettings } from '../types';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('healthmate-settings');
      if (saved) {
        const parsed = JSON.parse(saved) as AppSettings;
        return parsed.language || 'id';
      }
    } catch {
      // Ignore
    }
    return (INITIAL_SETTINGS.language as Language) || 'id';
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = window.localStorage.getItem('healthmate-settings');
        if (saved) {
          const parsed = JSON.parse(saved) as AppSettings;
          if (parsed.language && parsed.language !== language) {
            setLanguage(parsed.language as Language);
          }
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener('settings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('settings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [language]);

  const t = translations[language];

  return { language, t };
}
