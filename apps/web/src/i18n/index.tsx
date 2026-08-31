import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { TranslationDictionary, SupportedLanguage } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { ta } from './locales/ta';
import { te } from './locales/te';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { bn } from './locales/bn';
import { mr } from './locales/mr';
import { gu } from './locales/gu';
import { pa } from './locales/pa';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ja } from './locales/ja';
import { zh } from './locales/zh';
import { ar } from './locales/ar';
import { pt } from './locales/pt';
import { ru } from './locales/ru';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  // Global Major Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', region: 'Global' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Global' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Global' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Global' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Global' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文', flag: '🇨🇳', region: 'Global' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Global' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Global' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Global' },

  // Indian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'India' },
];

const translations: Record<string, TranslationDictionary> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
  bn,
  mr,
  gu,
  pa,
  es,
  fr,
  de,
  ja,
  zh,
  ar,
  pt,
  ru,
};

interface I18nContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  t: TranslationDictionary;
  supportedLanguages: SupportedLanguage[];
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: en,
  supportedLanguages: SUPPORTED_LANGUAGES,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to 'en' on app load as requested ("Don't load the localization language on load of the app, that should be changing as per the language selector of the app")
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const setLanguage = (langCode: string) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
      try {
        localStorage.setItem('reflectlogix_user_lang', langCode);
      } catch {
        // localStorage ignore
      }
    }
  };

  const t = useMemo(() => {
    return translations[currentLanguage] || en;
  }, [currentLanguage]);

  const isRTL = currentLanguage === 'ar';

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isRTL,
      }}
    >
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-sans-rtl' : ''}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
