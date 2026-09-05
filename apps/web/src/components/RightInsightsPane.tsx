import React from 'react';
import {
  TrendingUp,
  Smile,
  Heart,
  Lightbulb,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  Flame
} from 'lucide-react';
import { JournalEntry, ReflectionInsight } from '../types';

import { useI18n } from '../i18n';

interface RightInsightsPaneProps {
  selectedJournal: JournalEntry | null;
  journals?: JournalEntry[];
  onOpenLiveVoice?: () => void;
  onQuickPrompt?: (prompt: string) => void;
  onSelectTag?: (tag: string) => void;
  onToggleAction?: (actionId: string, completed: boolean) => Promise<void>;
  onUpdateSensitiveState?: (isSensitive: boolean, detoxMode: boolean) => Promise<void>;
}

export const RightInsightsPane: React.FC<RightInsightsPaneProps> = ({
  selectedJournal,
  journals,
  onOpenLiveVoice,
  onQuickPrompt,
}) => {
  const { t } = useI18n();
  const reflection = selectedJournal?.reflection;

  const coachQuestions = reflection?.socraticQuestions || [
    "What gave you the strongest sense of calm or progress today?",
    "Where could you set a gentle boundary to protect your time?",
    "What is one thing you can let go of this evening?"
  ];

  const microActions = reflection?.reframeSuggestions || [
    "Take 3 intentional deep breaths before your next task.",
    "Write down 1 small win from today and celebrate it.",
    "Step away from screens for a 10-minute restorative walk."
  ];

  return (
    <aside
      role="complementary"
      aria-label="Insights, trends, and reflection coach"
      className="w-full lg:w-80 xl:w-96 flex flex-col space-y-4 p-4 sm:p-5 overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 backdrop-blur-md"
    >
      {/* Gentle Writing Streak Card */}
      <div className="p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Flame className="h-4 w-4" />
            <span>{t.insights?.activeStreak || 'Consistency Streak'}</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
            8 {t.insights?.streakDays || 'Days'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          You've reflected consistently for 8 days. Small daily pauses build lifelong clarity.
        </p>
      </div>

      {/* 30-Day Mood Journey Card */}
      <div className="p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-3">
        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
          <TrendingUp className="h-4 w-4" />
          <span>{t.insights?.moodTrends || 'Mood Journey'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--text-muted)] font-medium">{t.insights?.avgStress || 'Average Ease'}</span>
            <div className="text-lg font-bold text-teal-700 dark:text-teal-300">7.8 / 10</div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--text-muted)] font-medium">{t.insights?.positivityRatio || 'Positive Days'}</span>
            <div className="text-lg font-bold text-teal-700 dark:text-teal-300">85%</div>
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Your thoughts reflect an upward trajectory of calm focus and intentional pacing.
        </p>
      </div>

      {/* Reflection Coach Card */}
      <div className="p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-3.5">
        <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>{t.reflection?.title || 'Reflection Coach'}</span>
        </div>

        {/* Top Questions */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.reflection?.socraticTitle || 'Curious Questions for You'}
          </span>
          <div className="space-y-1.5">
            {coachQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickPrompt && onQuickPrompt(q)}
                className="w-full text-left p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus-ring"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Micro-Actions */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {t.reflection?.microActionsTitle || 'Micro-Actions'}
          </span>
          <div className="space-y-1.5">
            {microActions.slice(0, 3).map((action, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 p-2 rounded-lg bg-teal-500/5 text-xs text-[var(--text-secondary)]"
              >
                <ArrowRight className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
