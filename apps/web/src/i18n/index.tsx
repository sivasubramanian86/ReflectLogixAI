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
    const cur = translations[currentLanguage] || en;
    return {
      ...en,
      ...cur,
      nav: { ...en.nav, ...(cur.nav || {}) },
      multimodal: { ...en.multimodal, ...(cur.multimodal || {}) },
      timeline: { ...en.timeline, ...(cur.timeline || {}) },
      editor: { ...en.editor, ...(cur.editor || {}) },
      reflection: { ...en.reflection, ...(cur.reflection || {}) },
      voice: { ...en.voice, ...(cur.voice || {}) },
      insights: { ...en.insights, ...(cur.insights || {}) },
      common: { ...en.common, ...(cur.common || {}) },
    };
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

export const getLanguageBCP47 = (langCode: string): string => {
  const map: Record<string, string> = {
    en: 'en-US',
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ja: 'ja-JP',
    zh: 'zh-CN',
    ar: 'ar-SA',
    pt: 'pt-BR',
    ru: 'ru-RU',
  };
  return map[langCode] || 'en-US';
};

export const getNovaGreeting = (userName: string, langCode: string): string => {
  switch (langCode) {
    case 'ta':
      return `வணக்கம் ${userName}! நான் உங்கள் நோவா (Nova) 3D AI துணைவன். உங்கள் சிந்தனைகளைப் பகிருங்கள், அல்லது கடந்த நினைவுகளைத் தேடலாம்.`;
    case 'hi':
      return `नमस्ते ${userName}! मैं आपका नोवा (Nova) 3D लाइव AI साथी हूँ। अपने विचारों को साझा करें, या आज का दैनिक सारांश बनाएं।`;
    case 'te':
      return `నమస్కారం ${userName}! నేను మీ నోవా (Nova) 3D లైవ్ AI సహాయకుడిని. మీ ఆలోచనలను పంచుకోండి.`;
    case 'kn':
      return `ನಮಸ್ಕಾರ ${userName}! ನಾನು ನಿಮ್ಮ ನೋವಾ (Nova) 3D ಲೈವ್ AI ಒಡನಾಡಿ. ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.`;
    case 'ml':
      return `നമസ്കാരം ${userName}! ഞാൻ നിങ്ങളുടെ നോവ (Nova) 3D ലൈവ് AI കൂട്ടുകാരനാണ്. உங்கள் ചിന്തകൾ പങ്കുവെക്കൂ.`;
    case 'bn':
      return `নমস্কার ${userName}! আমি আপনার নোভা (Nova) 3D লাইভ AI সঙ্গী। আপনার চিন্তা শেয়ার করুন।`;
    case 'mr':
      return `नमस्कार ${userName}! मी तुमचा नोव्हा (Nova) 3D AI सोबती आहे. तुमचे विचार सांगा.`;
    case 'gu':
      return `નમસ્તે ${userName}! હું તમારો નોવા (Nova) 3D AI સાથી છું. તમારા વિચારો શેર કરો.`;
    case 'pa':
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${userName}! ਮੈਂ ਤੁਹਾਡਾ ਨੋਵਾ (Nova) 3D AI ਸਾਥੀ ਹਾਂ।`;
    case 'es':
      return `¡Hola ${userName}! Soy Nova, tu compañero de reflexión 3D con IA. ¿De qué te gustaría hablar hoy?`;
    case 'fr':
      return `Bonjour ${userName} ! Je suis Nova, votre compagnon de réflexion 3D avec IA. Que souhaitez-vous partager ?`;
    case 'de':
      return `Hallo ${userName}! Ich bin Nova, dein 3D-KI-Reflexionsbegleiter. Worüber möchtest du heute sprechen?`;
    case 'ja':
      return `こんにちは ${userName}さん！私はNova、あなたの3DライブAIジャーナルコンパニオンです。`;
    case 'zh':
      return `你好 ${userName}！我是Nova，您的3D实时AI日志伴侣。今天有什么想分享的吗？`;
    case 'ar':
      return `مرحبًا ${userName}! أنا نوفا (Nova)، رفيقك للتفكير اليومي ثلاثي الأبعاد بالذكاء الاصطناعي.`;
    case 'pt':
      return `Olá ${userName}! Sou a Nova, sua companheira de reflexão 3D com IA. O que gostaria de compartilhar hoje?`;
    case 'ru':
      return `Здравствуйте, ${userName}! Я Нова (Nova), ваш 3D-спутник для размышлений с ИИ.`;
    default:
      return `Hello ${userName}! I'm Nova, your Live 3D AI Journal Companion. Speak to me to reflect, search past memories with pgvector RAG, or generate today's daily summary.`;
  }
};
