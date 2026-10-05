'use client';

import React, { createContext, useContext, useCallback, useSyncExternalStore, useMemo } from 'react';
import { translations, Language, TranslationSchema } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
  isBangla: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'thinkwise_preferred_language';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('thinkwise_lang_change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('thinkwise_lang_change', callback);
  };
}

function getClientSnapshot(): Language {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'bn' ? 'bn' : 'en';
}

function getServerSnapshot(): Language {
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentLanguage = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const setLanguage = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
      window.dispatchEvent(new Event('thinkwise_lang_change'));
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const nextLang: Language = currentLanguage === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
  }, [currentLanguage, setLanguage]);

  const t = useMemo(() => {
    return translations[currentLanguage] || translations.en;
  }, [currentLanguage]);

  const value = useMemo(
    () => ({
      language: currentLanguage,
      setLanguage,
      toggleLanguage,
      t,
      isBangla: currentLanguage === 'bn',
    }),
    [currentLanguage, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
