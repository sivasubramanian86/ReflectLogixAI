import React from 'react';
import {
  Sparkles,
  Heart,
  Shield,
  Compass,
  Lightbulb,
  Globe2,
  TrendingUp,
  Smile,
  CheckCircle2,
  Brain,
  Layers,
  Lock
} from 'lucide-react';
import { useI18n } from '../i18n';

export const AboutPage: React.FC = () => {
  const { t, currentLanguage } = useI18n();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden space-y-3">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold relative z-10">
          <Sparkles className="h-4 w-4" />
          <span>{t.nav?.about || 'About ReflectLogixAI'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] relative z-10">
          Welcome to ReflectLogixAI
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl relative z-10">
          {t.appSubtitle || 'Your Multi-Purpose Personal Gemini Journal & Socratic Life Companion'} — a calm, zero-trust sanctuary designed to help you pause, reflect with clarity, and navigate life with self-compassion and actionable momentum.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Socratic Coach */}
        <div className="p-6 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-2.5">
          <div className="h-10 w-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Brain className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Socratic Reflection Coaching</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Multi-agent cognitive reframing powered by Gemini 3.7 & 2.5 Flash, identifying cognitive distortions and synthesizing 15-minute high-impact micro-actions.
          </p>
        </div>

        {/* Card 2: Multi-Modal Studio */}
        <div className="p-6 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-2.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Multi-Modal Media Studio</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Seamlessly capture Sticky Notes, Handwritten journal scans, 1-Minute voice memos, and video reflection logs stored securely in Google Cloud Storage.
          </p>
        </div>

        {/* Card 3: Biometric Health Sync */}
        <div className="p-6 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-2.5">
          <div className="h-10 w-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Heart className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Smart Wearable Biometrics</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Correlate daily journal valence with resting heart rate, HRV, deep sleep stages, and step counts via Health Connect, Samsung Health, Apple HealthKit, and Garmin.
          </p>
        </div>

        {/* Card 4: Zero-Trust Security */}
        <div className="p-6 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-2.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Zero-Trust Privacy & Cloud Run</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            User-isolated Firestore security rules, Google Cloud Secret Manager vaulting, and ephemeral Detox Mode ensure total personal data sovereignty.
          </p>
        </div>
      </div>

      {/* Multilingual Support Banner */}
      <div className="p-6 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-3">
        <div className="flex items-center space-x-2.5 text-teal-600 dark:text-teal-400">
          <Globe2 className="h-5 w-5" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            18-Language Internationalization
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          ReflectLogixAI provides native conversational and reflective capabilities across Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, Chinese, and English with dynamic voice synthesis.
        </p>
      </div>
    </div>
  );
};
