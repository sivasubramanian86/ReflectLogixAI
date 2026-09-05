import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Brain,
  CheckCircle2,
  Circle,
  HelpCircle,
  TrendingUp,
  Lightbulb,
  Compass,
  Smile,
  ArrowRight,
  MessageSquare,
  BookOpen,
  Calendar,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { JournalEntry, MicroAction, ReflectionInsight } from '../types';
import { useI18n } from '../i18n';
import { ReflectionCard } from './ReflectionCard';
import { ConversationThread } from './ConversationThread';

interface ReflectionCoachWorkspaceProps {
  journals: JournalEntry[];
  selectedJournal: JournalEntry | null;
  onSelectJournal: (entry: JournalEntry) => void;
  onUpdateJournal: (updated: JournalEntry) => void;
  onToggleAction?: (actionId: string, completed: boolean) => Promise<void>;
}

export const ReflectionCoachWorkspace: React.FC<ReflectionCoachWorkspaceProps> = ({
  journals,
  selectedJournal,
  onSelectJournal,
  onUpdateJournal,
  onToggleAction,
}) => {
  const { t, currentLanguage } = useI18n();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'chat' | 'actions'>('overview');

  const activeEntry = selectedJournal || (journals.length > 0 ? journals[0] : null);
  const reflection = activeEntry?.reflection;

  const handleToggle = async (actionId: string, currentCompleted: boolean) => {
    if (onToggleAction) {
      await onToggleAction(actionId, !currentCompleted);
    } else if (activeEntry && reflection?.microActions) {
      const updatedActions = reflection.microActions.map(a =>
        a.id === actionId ? { ...a, completed: !currentCompleted } : a
      );
      const updatedEntry: JournalEntry = {
        ...activeEntry,
        reflection: {
          ...reflection,
          microActions: updatedActions
        }
      };
      onUpdateJournal(updatedEntry);
    }
  };

  if (!activeEntry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[var(--bg-surface)]">
        <div className="p-4 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <Brain className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {t.reflection?.title || 'Reflection & Coach Insights'}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          {t.timeline?.noEntriesFound || 'No journal reflections found. Create your first reflection to receive Socratic insights and micro-actions.'}
        </p>
      </div>
    );
  }

  const microActions: MicroAction[] = reflection?.microActions || [];
  const completedCount = microActions.filter(a => a.completed).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Workspace Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold">
                <Brain className="h-3.5 w-3.5" />
                <span>{t.nav?.reflectionCoach || 'Socratic Reflection Coach'}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                <Sparkles className="h-3 w-3" />
                <span>Gemini 3.7 Empathetic Engine</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t.reflection?.title || 'Reflection & Coach Insights'}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Unpack cognitive strengths, challenge limiting narratives, explore deep Socratic inquiries, and track bite-sized micro-actions.
            </p>
          </div>

          {/* Active Entry Selector Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label htmlFor="reflection-entry-select" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Reflecting on:
            </label>
            <select
              id="reflection-entry-select"
              value={activeEntry.id}
              onChange={(e) => {
                const found = journals.find(j => j.id === e.target.value);
                if (found) onSelectJournal(found);
              }}
              className="px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] shadow-sm focus-ring cursor-pointer max-w-xs truncate"
            >
              {journals.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({new Date(j.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-5 border-t border-[var(--border-subtle)] overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeSubTab === 'overview'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.reflection?.summary || 'Core Insights & Socratic Dialogue'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeSubTab === 'chat'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{t.reflection?.chatWithCoach || 'Empathetic Reflection Chat'}</span>
            {activeEntry.conversation && activeEntry.conversation.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[11px]">
                {activeEntry.conversation.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('actions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeSubTab === 'actions'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{t.reflection?.microActionsTitle || 'Micro-Actions Tracker'}</span>
            {microActions.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[11px]">
                {completedCount}/{microActions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Selected Entry Preview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl glass-card border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {activeEntry.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-1">
            "{activeEntry.content.slice(0, 120)}..."
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium">
            {activeEntry.wordCount} words
          </span>
          {activeEntry.tags && activeEntry.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic Sub-Tab Views */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {reflection ? (
            <ReflectionCard reflection={reflection} />
          ) : (
            <div className="p-8 text-center rounded-2xl glass-card space-y-3">
              <Sparkles className="h-8 w-8 text-teal-500 mx-auto animate-pulse" />
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Synthesizing multi-agent reflection for this entry...
              </p>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'chat' && (
        <div className="space-y-6">
          <ConversationThread
            journal={activeEntry}
            onUpdateJournal={onUpdateJournal}
          />
        </div>
      )}

      {activeSubTab === 'actions' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <span>{t.reflection?.microActionsTitle || 'Bite-Sized Micro-Actions'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Small, 5-minute actionable steps synthesized by your reflection coach.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider block">
                {t.reflection?.actionProgress || 'Progress'}
              </span>
              <span className="text-base font-extrabold text-teal-700 dark:text-teal-300">
                {completedCount} of {microActions.length} completed
              </span>
            </div>
          </div>

          {/* Action List */}
          <div className="space-y-3">
            {microActions.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] py-6 text-center">
                {t.reflection?.noActionsYet || 'No micro-actions synthesized yet for this reflection.'}
              </p>
            ) : (
              microActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleToggle(action.id, action.completed)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    action.completed
                      ? 'bg-teal-500/10 border-teal-500/40 text-[var(--text-secondary)]'
                      : 'glass-card border-[var(--border-subtle)] hover:border-teal-500/50 hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={action.completed ? 'Mark undone' : 'Mark done'}
                    className={`h-5 w-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 transition-colors ${
                      action.completed
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-[var(--border-strong)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {action.completed && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm sm:text-base font-bold ${
                        action.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                      }`}>
                        {action.title}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium capitalize shrink-0">
                        {action.timeframe.replace('_', ' ')}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      action.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
