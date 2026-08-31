import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  HelpCircle,
  CheckCircle2,
  Heart,
  TrendingUp,
  Smile,
  Lightbulb,
  ArrowRight,
  Globe
} from 'lucide-react';
import { ReflectionInsight, BilingualSummary } from '../types';
import { useI18n } from '../i18n';

interface ReflectionCardProps {
  reflection: ReflectionInsight;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({ reflection }) => {
  const { t } = useI18n();
  const [bilingualTab, setBilingualTab] = useState<'bilingual' | 'english'>('bilingual');
  const { summary, bilingualSummary, moodAnalysis, cognitiveStrengths, reframeSuggestions, socraticQuestions } = reflection;

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'Joyful':
      case 'Grateful':
      case 'Inspired':
        return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case 'Calm':
      case 'Reflective':
        return 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30';
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

  const renderSummaryContent = () => {
    if (bilingualSummary && typeof bilingualSummary === 'object') {
      const bSummary = bilingualSummary as BilingualSummary;
      if (bilingualTab === 'bilingual') {
        return (
          <div className="space-y-3">
            {bSummary.originalSummary && (
              <div>
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
                  {bSummary.detectedLanguage ? `${bSummary.detectedLanguage} Reflection` : 'Native Reflection'}
                </span>
                <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
                  {bSummary.originalSummary}
                </p>
              </div>
            )}
            {bSummary.englishSummary && bSummary.englishSummary !== bSummary.originalSummary && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                  English Reflection
                </span>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed italic">
                  {bSummary.englishSummary}
                </p>
              </div>
            )}
          </div>
        );
      } else {
        return (
          <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
            {bSummary.englishSummary || bSummary.originalSummary || (typeof summary === 'string' ? summary : '')}
          </p>
        );
      }
    }

    if (typeof summary === 'string') {
      return (
        <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
          {summary}
        </p>
      );
    }

    if (summary && typeof summary === 'object') {
      const sObj = summary as any;
      return (
        <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
          {sObj.originalSummary || sObj.englishSummary || JSON.stringify(sObj)}
        </p>
      );
    }

    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-7 space-y-6 border border-white/40 dark:border-white/10 shadow-sm relative">
      {/* Header & Emotional Gauge */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center space-x-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Reflection & Coach Insights
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              Thoughtful perspectives & gentle guidance for your day
            </p>
          </div>
        </div>

        {/* Mood & Stress Indicators */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Emotional affect and stress level">
          <span
            className={`rounded-xl px-3 py-1 text-xs sm:text-sm font-semibold border ${getMoodBadge(moodAnalysis.primaryMood)}`}
            aria-label={`Primary state: ${moodAnalysis.primaryMood}`}
          >
            {moodAnalysis.primaryMood}
          </span>
          {moodAnalysis.secondaryMood && (
            <span
              className={`rounded-xl px-2.5 py-1 text-xs border ${getMoodBadge(moodAnalysis.secondaryMood)}`}
              aria-label={`Secondary state: ${moodAnalysis.secondaryMood}`}
            >
              {moodAnalysis.secondaryMood}
            </span>
          )}
          <span
            className={`rounded-xl px-3 py-1 text-xs sm:text-sm font-medium border ${
              moodAnalysis.stressLevel >= 7
                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 font-semibold'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
            }`}
            aria-label={`Stress score: ${moodAnalysis.stressLevel} out of 10`}
          >
            Ease Level: {10 - moodAnalysis.stressLevel}/10
          </span>
        </div>
      </div>

      {/* Bilingual / Original Toggle */}
      {bilingualSummary && (
        <div className="flex items-center space-x-2 border-b border-[var(--border-subtle)] pb-2">
          <button
            type="button"
            onClick={() => setBilingualTab('bilingual')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus-ring ${
              bilingualTab === 'bilingual'
                ? 'bg-teal-600 text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Native & English
          </button>
          <button
            type="button"
            onClick={() => setBilingualTab('english')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus-ring ${
              bilingualTab === 'english'
                ? 'bg-teal-600 text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            English Summary
          </button>
        </div>
      )}

      {/* Summary Narrative */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Clarity & Essence
        </span>
        {renderSummaryContent()}
      </div>

      {/* Cognitive Strengths */}
      {cognitiveStrengths && cognitiveStrengths.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base">
            <Heart className="h-4 w-4" />
            <span>Recognized Strengths & Resilience</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cognitiveStrengths.map((str, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-[var(--text-primary)]"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coach Inquiries */}
      {socraticQuestions && socraticQuestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 font-bold text-sm sm:text-base">
            <HelpCircle className="h-4 w-4" />
            <span>Thoughtful Inquiries for You</span>
          </div>
          <div className="space-y-2">
            {socraticQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm sm:text-base text-[var(--text-secondary)] italic leading-relaxed"
              >
                "{q}"
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reframes & Micro-Actions */}
      {reframeSuggestions && reframeSuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-sm sm:text-base">
            <Lightbulb className="h-4 w-4" />
            <span>Supportive Micro-Steps & Reframes</span>
          </div>
          <div className="space-y-2">
            {reframeSuggestions.map((sug, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm sm:text-base text-[var(--text-primary)]"
              >
                <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                <span>{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
