import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  HelpCircle,
  ShieldAlert,
  Flame,
  Languages,
  CheckCircle2,
  Heart,
  TrendingUp,
  BrainCircuit,
  Smile,
  Zap,
  Coffee,
  AlertCircle
} from 'lucide-react';
import { ReflectionInsight } from '../types';
import { useI18n } from '../i18n';

interface ReflectionCardProps {
  reflection: ReflectionInsight;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({ reflection }) => {
  const { t, currentLanguage } = useI18n();
  const [bilingualTab, setBilingualTab] = useState<'bilingual' | 'english'>('bilingual');
  const { summary, bilingualSummary, moodAnalysis, cognitiveStrengths, reframeSuggestions, socraticQuestions, keyThemes } = reflection;

  // Mood badge styling with high-contrast accessible borders
  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'Joyful':
      case 'Grateful':
      case 'Inspired':
        return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case 'Calm':
      case 'Reflective':
        return 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30';
      case 'Energized':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      case 'Overwhelmed':
      case 'Anxious':
      case 'Frustrated':
        return 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30';
      default:
        return 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)]';
    }
  };

  return (
    <div className="panel-elevated rounded-2xl p-4 sm:p-6 space-y-5 border border-[var(--border-subtle)] relative">
      
      {/* Header & Affect Gauge */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            aria-hidden="true"
          >
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[var(--text-primary)]">
              {t.reflection?.title || 'Gemini Cognitive Reflection & Socratic Analysis'}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {t.reflection?.agentOrchestrated || 'ADK Orchestrated • Socratic Agent • Cognitive Reframer'}
            </p>
          </div>
        </div>

        {/* Mood & Stress Indicators */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Emotional affect and stress score">
          <span
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold border ${getMoodBadge(moodAnalysis.primaryMood)}`}
            aria-label={`Primary mood: ${moodAnalysis.primaryMood}`}
          >
            {moodAnalysis.primaryMood}
          </span>
          {moodAnalysis.secondaryMood && (
            <span
              className={`rounded-xl px-2 py-0.5 text-xs border ${getMoodBadge(moodAnalysis.secondaryMood)}`}
              aria-label={`Secondary mood: ${moodAnalysis.secondaryMood}`}
            >
              {moodAnalysis.secondaryMood}
            </span>
          )}
          <span
            className={`rounded-xl px-2.5 py-1 text-xs font-mono font-medium border ${
              moodAnalysis.stressLevel >= 7
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-subtle)]'
            }`}
            aria-label={`Stress score: ${moodAnalysis.stressLevel} out of 10`}
          >
            {t.reflection?.stressScore || 'Stress Score'}: {moodAnalysis.stressLevel}/10
          </span>
        </div>
      </div>

      {/* Summary with Bilingual Adaptation */}
      <div className="space-y-2">
        {bilingualSummary && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Language: {bilingualSummary.detectedLanguage}</span>
            </div>
            <div className="flex rounded-xl bg-[var(--bg-secondary)] p-0.5 border border-[var(--border-subtle)] text-[11px]">
              <button
                type="button"
                onClick={() => setBilingualTab('bilingual')}
                className={`px-2.5 py-0.5 rounded-lg transition-all focus-ring ${
                  bilingualTab === 'bilingual'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs border border-[var(--border-strong)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                Vernacular Summary
              </button>
              <button
                type="button"
                onClick={() => setBilingualTab('english')}
                className={`px-2.5 py-0.5 rounded-lg transition-all focus-ring ${
                  bilingualTab === 'english'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-bold shadow-xs border border-[var(--border-strong)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                English
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-[var(--bg-secondary)] p-3.5 border border-[var(--border-subtle)]">
          <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
            {bilingualTab === 'bilingual' && bilingualSummary
              ? bilingualSummary.vernacularSummary
              : summary}
          </p>
        </div>
      </div>

      {/* Cognitive Strengths & Key Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Cognitive Strengths */}
        <div className="rounded-xl bg-[var(--bg-secondary)] p-3 border border-[var(--border-subtle)] space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.reflection?.cognitiveStrengths || 'Observed Cognitive Strengths'}</span>
          </div>
          <ul role="list" className="space-y-1" aria-label="Observed cognitive strengths">
            {cognitiveStrengths.map((str, i) => (
              <li key={i} role="listitem" className="text-xs text-[var(--text-secondary)] flex items-start space-x-1.5">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cognitive Reframe */}
        <div className="rounded-xl bg-[var(--bg-secondary)] p-3 border border-[var(--border-subtle)] space-y-1.5">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.reflection?.reframeTitle || 'Constructive Reframe'}</span>
          </div>
          <ul role="list" className="space-y-1" aria-label="Constructive cognitive reframes">
            {reframeSuggestions.map((ref, i) => (
              <li key={i} role="listitem" className="text-xs text-[var(--text-secondary)] flex items-start space-x-1.5">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{ref}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Socratic Inquiries */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-400">
          <Compass className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.reflection?.socraticTitle || 'Socratic Inquiries for Self-Reflection'}</span>
        </div>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label="Socratic reflection questions">
          {socraticQuestions.map((q, idx) => (
            <li
              key={idx}
              role="listitem"
              className="rounded-xl bg-[var(--bg-secondary)] p-3 border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] italic leading-relaxed"
            >
              "{q}"
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
