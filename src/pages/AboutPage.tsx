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
  CheckCircle2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/40 dark:border-white/10 space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Your Life Reflection Companion</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Welcome to ReflectLogixAI
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          A calm, private haven designed to help you pause, reflect with clarity, and navigate life's daily moments with self-compassion and actionable purpose.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Safe Expression */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="h-10 w-10 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Compass className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Mindful Expression</h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Write or speak freely in your preferred language. ReflectLogixAI captures the emotional nuances and anchors of your thoughts without clutter or judgment.
          </p>
        </div>

        {/* Card 2: Empathetic Coach */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lightbulb className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Gentle Reflection Coach</h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Unpack your entries through thoughtful questions, celebrate your cognitive strengths, and break big challenges into 5-minute micro-actions.
          </p>
        </div>

        {/* Card 3: Life Patterns */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Life Journey & Patterns</h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Notice how your mood, energy, and priorities evolve over time across Work, Health, Relationships, Growth, and Creativity.
          </p>
        </div>

        {/* Card 4: Strict Privacy */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Uncompromising Privacy</h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Your journal belongs solely to you. Zero-trust tenant isolation, sensitive entry protection, and optional digital detox modes ensure total confidentiality.
          </p>
        </div>
      </div>

      {/* Multilingual & Inclusivity */}
      <div className="p-6 sm:p-8 rounded-2xl glass-card space-y-4">
        <div className="flex items-center space-x-3">
          <Globe2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Reflect in the Language of Your Heart
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          ReflectLogixAI provides native vernacular reflection across 18+ regional and global languages—including Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, Chinese, and English.
        </p>
      </div>
    </div>
  );
};
