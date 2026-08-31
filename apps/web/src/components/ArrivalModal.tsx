import React from 'react';
import {
  Sparkles,
  X,
  Smile,
  Heart,
  Zap,
  Coffee,
  CloudRain,
  Compass,
  Mic,
  PenTool,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface ArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMood: (mood: string) => void;
  onQuickStart: (initialText?: string) => void;
  onOpenVoice: () => void;
  onViewInsights: () => void;
}

export const ArrivalModal: React.FC<ArrivalModalProps> = ({
  isOpen,
  onClose,
  onSelectMood,
  onQuickStart,
  onOpenVoice,
  onViewInsights,
}) => {
  if (!isOpen) return null;

  const moods = [
    { name: 'Calm', icon: Compass, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10 hover:bg-teal-500/20' },
    { name: 'Grateful', icon: Heart, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20' },
    { name: 'Inspired', icon: Zap, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 hover:bg-amber-500/20' },
    { name: 'Reflective', icon: Smile, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20' },
    { name: 'Tired', icon: Coffee, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10 hover:bg-orange-500/20' },
    { name: 'Overwhelmed', icon: CloudRain, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10 hover:bg-slate-500/20' },
  ];

  const dailyPrompts = [
    "What is one small moment from today that brought you a sense of ease?",
    "Where is your energy flowing right now, and what boundary would protect your peace?",
    "What is something you appreciate about your growth this week?",
    "If today had a theme, what intention would you set for yourself?"
  ];

  const randomPrompt = dailyPrompts[new Date().getDate() % dailyPrompts.length];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="arrival-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl p-6 sm:p-8 glass-card border border-white/40 dark:border-white/10 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-ring min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close arrival check-in"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Daily Arrival Check-in</span>
          </div>
          <h2 id="arrival-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            How are you arriving today?
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Take a gentle pause to name how you feel. No judgment, just awareness.
          </p>
        </div>

        {/* Mood Chips */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Select Your Current State
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {moods.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => {
                    onSelectMood(m.name);
                    onQuickStart(`Today I am feeling ${m.name.toLowerCase()}. `);
                  }}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border border-[var(--border-subtle)] ${m.bg} text-sm font-medium text-[var(--text-primary)] transition-all hover:scale-[1.02] focus-ring min-h-[48px]`}
                >
                  <Icon className={`h-4 w-4 ${m.color}`} />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Reflection Prompt Box */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
            Today's Gentle Prompt
          </span>
          <p className="text-sm sm:text-base font-medium italic text-[var(--text-primary)]">
            "{randomPrompt}"
          </p>
        </div>

        {/* 1-Click Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => onQuickStart()}
            className="flex items-center justify-between p-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm shadow-sm transition-all hover:scale-[1.02] focus-ring"
          >
            <div className="flex items-center space-x-2">
              <PenTool className="h-4 w-4" />
              <span>Write Freely</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenVoice();
            }}
            className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-sm transition-all hover:scale-[1.02] focus-ring"
          >
            <div className="flex items-center space-x-2">
              <Mic className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>Voice Note</span>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewInsights();
            }}
            className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-sm transition-all hover:scale-[1.02] focus-ring"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>View Trends</span>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
    </div>
  );
};
