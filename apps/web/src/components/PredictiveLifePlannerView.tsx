import React, { useState } from 'react';
import {
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Heart,
  Award,
  AlertCircle
} from 'lucide-react';

export const PredictiveLifePlannerView: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const goals = [
    {
      id: 'g1',
      title: 'Launch Multi-Agent Serverless Production Microservices',
      category: 'Career & Craft',
      horizon: 'Monthly',
      progressPercent: 92,
      probabilityScore: 94,
      targetDate: 'End of Q3',
      status: 'On Track',
      actionNeeded: 'Finalize stress test benchmarks with 100 concurrent workers'
    },
    {
      id: 'g2',
      title: '30-Day Mindful Dawn Journaling & HRV Pacing',
      category: 'Health & Longevity',
      horizon: 'Monthly',
      progressPercent: 78,
      probabilityScore: 89,
      targetDate: 'Sep 30',
      status: 'On Track',
      actionNeeded: 'Maintain 9:00 PM digital sunset to protect deep sleep recovery'
    },
    {
      id: 'g3',
      title: 'Mindful Wealth & Emergency Reserve Milestone',
      category: 'Financial Peace',
      horizon: 'Yearly',
      progressPercent: 100,
      probabilityScore: 98,
      targetDate: 'Dec 2026',
      status: 'Completed',
      actionNeeded: 'Zero impulse spending for 4 consecutive months achieved'
    },
    {
      id: 'g4',
      title: 'Weekly 100,000 Step Cardio & Aerobic Longevity Base',
      category: 'Health & Longevity',
      horizon: 'Weekly',
      progressPercent: 84,
      probabilityScore: 91,
      targetDate: 'This Sunday',
      status: 'On Track',
      actionNeeded: '16,000 steps remaining across Saturday and Sunday walks'
    }
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-stone-900/60 to-purple-950/40 backdrop-blur-xl shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Predictive Time-Saver & Life Goal Forecast Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Daily Routine Optimizer & Future Milestones
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            AI-driven routine de-fragmentation saving 2.5+ hours daily, paired with multi-horizon goal forecasting across health, craft, financial peace, and meaningful life harmony.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[var(--bg-secondary)] px-4 py-3 rounded-2xl border border-[var(--border-subtle)]">
          <Clock className="h-6 w-6 text-indigo-400" />
          <div>
            <div className="text-xs text-[var(--text-muted)]">Time Saved Today</div>
            <div className="text-lg font-bold text-emerald-400">
              +2.8 Hours Reclaimed
            </div>
          </div>
        </div>
      </div>

      {/* 1. Time-Saver Schedule Recommendations */}
      <div className="glass-card p-6 rounded-3xl border border-white/30 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              AI Time-Saver Daily Schedule Blueprint
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            De-fragmented Flow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <span className="text-xs font-bold text-amber-400">06:30 - 08:00 AM</span>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Circadian Anchor & Movement</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Sunlight viewing + hydration + 20-min brisk walk. <em>Saved 30 mins by replacing morning phone scrolling.</em>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-teal-500/30 bg-teal-950/20 space-y-2">
            <span className="text-xs font-bold text-teal-400">08:30 - 11:30 AM (Peak Focus)</span>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Deep Architecture & Coding</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Two 90-min ultradian sprints with zero notifications. <em>Saved 1.5 hours of context switching fatigue.</em>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <span className="text-xs font-bold text-indigo-400">02:00 - 04:00 PM</span>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Collaborative Sync & Code Reviews</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Batch all asynchronous communication and review pull requests in one dedicated time block.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <span className="text-xs font-bold text-purple-400">08:30 - 09:30 PM</span>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">ReflectLogixAI Journal & Rest</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              3-min voice reflection with Nova Assistant followed by screen shutdown to ensure 2+ hours deep sleep.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Future Life & Financial Goals Forecaster */}
      <div className="glass-card p-6 rounded-3xl border border-white/30 dark:border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Multi-Horizon Goals & Financial Peace Forecast
            </h2>
          </div>

          <div className="flex items-center bg-[var(--bg-secondary)] rounded-2xl p-1 border border-[var(--border-subtle)] text-xs">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                  selectedHorizon === h
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {goal.category} • {goal.horizon}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>{goal.probabilityScore}% AI Likelihood</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-[var(--text-primary)]">
                  {goal.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Target: {goal.targetDate} • Status: <strong className="text-indigo-400">{goal.status}</strong>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[var(--text-muted)]">
                  <span>Execution Milestone</span>
                  <span>{goal.progressPercent}%</span>
                </div>
                <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${goal.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)] flex items-center space-x-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Next Move: {goal.actionNeeded}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Peace & Mindful Wealth Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-stone-900/40 to-teal-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Mindful Financial Peace Score: 94/100
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Zero impulsive purchase stress detected in recent reflections. Discretionary spending aligned with core life values.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            <span>Peaceful Wealth Harmony</span>
          </div>
        </div>
      </div>
    </div>
  );
};
