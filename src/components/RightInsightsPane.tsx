import React from 'react';
import {
  TrendingUp,
  Tag,
  Target,
  Shield,
  HelpCircle,
  Compass,
  CheckCircle2,
  Circle,
  Sparkles,
  Lock,
  BrainCircuit,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { JournalEntry, ReflectionInsight, MicroAction } from '../types';
import { useI18n } from '../i18n';

interface RightInsightsPaneProps {
  journals: JournalEntry[];
  selectedJournal: JournalEntry | null;
  onSelectTag?: (tag: string) => void;
  onToggleAction?: (actionId: string, completed: boolean) => void;
  onUpdateSensitiveState?: (isSensitive: boolean, detoxMode: boolean) => void;
}

export const RightInsightsPane: React.FC<RightInsightsPaneProps> = ({
  journals,
  selectedJournal,
  onSelectTag,
  onToggleAction,
  onUpdateSensitiveState,
}) => {
  const { t, currentLanguage } = useI18n();

  // Aggregate mood trends
  const entriesWithMood = journals.filter((j) => j.reflection?.moodAnalysis);

  // Extract all tags and count frequencies
  const tagCounts: Record<string, number> = {};
  journals.forEach((j) => {
    (j.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Calculate averages
  const avgStress = entriesWithMood.length > 0
    ? (
        entriesWithMood.reduce((acc, curr) => acc + (curr.reflection?.moodAnalysis.stressLevel || 0), 0) /
        entriesWithMood.length
      ).toFixed(1)
    : '3.2';

  const avgValenceNum = entriesWithMood.length > 0
    ? Math.round(
        (entriesWithMood.reduce((acc, curr) => acc + (curr.reflection?.moodAnalysis.valence || 0), 0) /
          entriesWithMood.length) *
          100
      )
    : 72;

  const reflection: ReflectionInsight | undefined = selectedJournal?.reflection;

  return (
    <aside
      aria-label="Insights, Mood Trends, and Socratic Coach Recommendations"
      className="w-full lg:w-80 xl:w-96 border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-5 overflow-y-auto shrink-0"
    >
      
      {/* 1. MOOD TREND CHART (Wrapped in <figure> with <figcaption> per WCAG 2.2 AA) */}
      <figure
        role="figure"
        aria-label="30-day mood trajectory chart and emotional valence"
        className="panel-elevated rounded-2xl p-4 sm:p-5 space-y-3.5"
      >
        <figcaption className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="font-serif font-bold text-xs text-[var(--text-primary)]">
              {t.insights?.affectCurve || '30-Day Mood Trajectory'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {entriesWithMood.length} {entriesWithMood.length === 1 ? 'reflection' : 'reflections'}
          </span>
        </figcaption>

        {/* Quick Metric Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-[var(--bg-secondary)] p-3 border border-[var(--border-subtle)]">
            <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-semibold">
              {t.insights?.avgStress || 'Avg Stress'}
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{avgStress}</span>
              <span className="text-[10px] text-[var(--text-muted)]">/ 10</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={parseFloat(avgStress)}
              aria-valuemin={0}
              aria-valuemax={10}
              aria-label="Average stress level score"
              className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden"
            >
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (parseFloat(avgStress) / 10) * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-[var(--bg-secondary)] p-3 border border-[var(--border-subtle)]">
            <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-semibold">
              {t.insights?.positivityRatio || 'Valence'}
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{avgValenceNum}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={avgValenceNum}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Positive valence ratio"
              className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--bg-surface)] overflow-hidden"
            >
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${avgValenceNum}%` }}
              />
            </div>
          </div>
        </div>

        {/* Accessible Visual Bar Trajectory */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>Recent Reflections</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">Valence Curve</span>
          </div>

          <div className="flex items-end space-x-1.5 h-14 pt-2 px-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)]">
            {journals.slice(0, 10).reverse().map((entry, idx) => {
              const valence = entry.reflection?.moodAnalysis.valence ?? 0.6;
              const heightPct = Math.max(25, Math.round(((valence + 1) / 2) * 100));
              const isCurrent = selectedJournal?.id === entry.id;
              const primaryMood = entry.reflection?.moodAnalysis.primaryMood || 'Calm';

              return (
                <button
                  key={entry.id || idx}
                  type="button"
                  aria-label={`${entry.title}: mood ${primaryMood}, valence ${(valence * 100).toFixed(0)}%`}
                  className="flex-1 h-full flex flex-col justify-end items-center group focus-ring rounded-xs"
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      isCurrent
                        ? 'bg-amber-500 ring-2 ring-amber-400 ring-offset-1'
                        : valence >= 0.5
                        ? 'bg-amber-500/70 group-hover:bg-amber-500'
                        : 'bg-stone-400 dark:bg-stone-700 group-hover:bg-stone-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </button>
              );
            })}
          </div>

          {/* Accessible text summary under figure */}
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed pt-1">
            Your mood has trended steadily upward over the last two weeks with stable calm valence and active restorative boundaries.
          </p>
        </div>
      </figure>

      {/* 2. SOCRATIC REFLECTION COACH CARD */}
      {reflection && (
        <section
          aria-label="Reflection Coach Socratic questions and micro-actions"
          className="panel-elevated rounded-2xl p-4 sm:p-5 space-y-4 border-amber-500/30"
        >
          <div className="flex items-center space-x-2 border-b border-[var(--border-subtle)] pb-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Compass className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-[var(--text-primary)]">
                {t.reflection?.socraticTitle || 'Socratic Reflection Coach'}
              </h3>
              <p className="text-[10px] text-[var(--text-muted)]">Gemini Deep Cognitive Guidance</p>
            </div>
          </div>

          {/* Top Socratic Questions */}
          {reflection.socraticQuestions && reflection.socraticQuestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center space-x-1.5">
                <HelpCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span>Reflection Prompts (Top 3)</span>
              </div>
              <ul role="list" className="space-y-2" aria-label="Socratic reflection questions">
                {reflection.socraticQuestions.slice(0, 3).map((q, idx) => (
                  <li
                    key={idx}
                    role="listitem"
                    className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed italic"
                  >
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Micro-Actions (Accessible Button Triggers) */}
          {reflection.microActions && reflection.microActions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Target className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Recommended Micro-Actions</span>
                </div>
                <span className="font-mono text-[10px]">
                  {reflection.microActions.filter((a) => a.completed).length}/{reflection.microActions.length} Done
                </span>
              </div>

              <ul role="list" className="space-y-2" aria-label="Recommended micro-actions">
                {reflection.microActions.map((act) => (
                  <li key={act.id} role="listitem">
                    <button
                      type="button"
                      onClick={() => onToggleAction && onToggleAction(act.id, !act.completed)}
                      aria-label={`Action: ${act.title}. Status: ${act.completed ? 'completed' : 'pending'}. Click to toggle.`}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 focus-ring ${
                        act.completed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--text-muted)]'
                          : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="pt-0.5" aria-hidden="true">
                        {act.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-stone-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-semibold ${act.completed ? 'line-through opacity-70' : ''}`}>
                          {act.title}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                          {act.description}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sensitive & Detox Quick Switch Controls */}
          {selectedJournal && onUpdateSensitiveState && (
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Privacy & Retention
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(selectedJournal.isSensitive)}
                aria-label="Mark this entry as sensitive and limit storage"
                onClick={() =>
                  onUpdateSensitiveState(!selectedJournal.isSensitive, Boolean(selectedJournal.detoxMode))
                }
                className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs focus-ring ${
                  selectedJournal.isSensitive
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="font-medium">Sensitive Entry</span>
                </div>
                <span className="font-mono text-[10px]">
                  {selectedJournal.isSensitive ? 'Active' : 'Off'}
                </span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* 3. TAG CLOUD & FREQUENCY (Semantic List) */}
      <section aria-label="Topic tags and frequency" className="panel-elevated rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-[var(--border-subtle)] pb-2">
          <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <h3 className="font-serif font-bold text-xs text-[var(--text-primary)]">
            {t.timeline?.allTags || 'Recurring Themes & Tags'}
          </h3>
        </div>

        {sortedTags.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)]">No tags recorded yet.</p>
        ) : (
          <ul role="list" className="flex flex-wrap gap-1.5" aria-label="List of tags">
            {sortedTags.map(([tag, count]) => (
              <li key={tag} role="listitem">
                <button
                  type="button"
                  onClick={() => onSelectTag && onSelectTag(tag)}
                  aria-label={`Filter by tag ${tag}, appears in ${count} ${count === 1 ? 'entry' : 'entries'}`}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] hover:bg-amber-500/15 text-xs text-[var(--text-secondary)] hover:text-amber-700 dark:hover:text-amber-300 border border-[var(--border-subtle)] focus-ring transition-colors"
                >
                  <span className="font-medium">#{tag}</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">
                    {count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

    </aside>
  );
};
