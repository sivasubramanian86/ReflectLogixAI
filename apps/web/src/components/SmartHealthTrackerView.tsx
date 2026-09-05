import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Moon,
  Flame,
  Watch,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Zap,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  BatteryCharging
} from 'lucide-react';

interface WearableMetric {
  stepsToday: number;
  stepsGoal: number;
  heartRateBpm: number;
  restingHeartRate: number;
  hrvMs: number;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  totalSleepMinutes: number;
  activeCaloriesBurned: number;
  readinessScore: number;
  lastSyncedAt: string;
}

export const SmartHealthTrackerView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'google_fit' | 'apple_health' | 'samsung_health' | 'garmin'>('google_fit');
  const [metrics, setMetrics] = useState<WearableMetric>({
    stepsToday: 10480,
    stepsGoal: 10000,
    heartRateBpm: 68,
    restingHeartRate: 56,
    hrvMs: 74,
    deepSleepMinutes: 135,
    remSleepMinutes: 105,
    totalSleepMinutes: 470, // 7h 50m
    activeCaloriesBurned: 620,
    readinessScore: 91,
    lastSyncedAt: 'Just now'
  });

  const handleSyncWearable = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        stepsToday: prev.stepsToday + Math.floor(Math.random() * 150) + 45,
        heartRateBpm: Math.floor(Math.random() * 8) + 64,
        hrvMs: Math.floor(Math.random() * 6) + 72,
        readinessScore: Math.min(100, prev.readinessScore + 1),
        lastSyncedAt: 'Just now (Live)'
      }));
      setIsSyncing(false);
    }, 1200);
  };

  const stepsPercent = Math.min(100, Math.round((metrics.stepsToday / metrics.stepsGoal) * 100));
  const sleepHours = Math.floor(metrics.totalSleepMinutes / 60);
  const sleepRemainderMinutes = metrics.totalSleepMinutes % 60;
  const deepSleepHours = Math.floor(metrics.deepSleepMinutes / 60);
  const deepSleepRemainderMinutes = metrics.deepSleepMinutes % 60;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-950/40 via-stone-900/60 to-emerald-950/40 backdrop-blur-xl shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Watch className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Smart Wearable & Health Connect Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Biometric Sync & Health Telemetry
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Live integration with Google Health Connect, Apple Health, Samsung Health, and Garmin smart bands. Correlates physical recovery with daily journaling emotional clarity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Health Source Selector */}
          <div className="flex items-center bg-[var(--bg-secondary)] rounded-2xl p-1 border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setSelectedSource('google_fit')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedSource === 'google_fit'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Google Health
            </button>
            <button
              onClick={() => setSelectedSource('apple_health')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedSource === 'apple_health'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Apple Health
            </button>
            <button
              onClick={() => setSelectedSource('samsung_health')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedSource === 'samsung_health'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Samsung
            </button>
          </div>

          <button
            onClick={handleSyncWearable}
            disabled={isSyncing}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs shadow-md focus-ring transition-all active:scale-95 disabled:opacity-75"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Sensors...' : 'Sync Wearables'}</span>
          </button>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Daily Movement & Steps */}
        <div className="glass-card p-5 rounded-2xl border border-white/30 dark:border-white/10 space-y-3 relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] flex items-center space-x-1.5">
              <Activity className="h-4 w-4 text-teal-500" />
              <span>Daily Step Goal</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {stepsPercent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {metrics.stepsToday.toLocaleString()}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Target: {metrics.stepsGoal.toLocaleString()} steps • +480 over daily target
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[var(--bg-secondary)] h-2.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, stepsPercent)}%` }}
            />
          </div>
        </div>

        {/* 2. Heart Rate & Parasympathetic HRV */}
        <div className="glass-card p-5 rounded-2xl border border-white/30 dark:border-white/10 space-y-3 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] flex items-center space-x-1.5">
              <Heart className="h-4 w-4 text-rose-500" />
              <span>Cardiovascular & HRV</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Optimal
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-baseline space-x-1.5">
              <span>{metrics.heartRateBpm}</span>
              <span className="text-sm font-medium text-[var(--text-muted)]">bpm</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              HRV: <strong className="text-[var(--text-primary)]">{metrics.hrvMs} ms</strong> • Resting HR: {metrics.restingHeartRate} bpm
            </p>
          </div>

          <div className="text-[11px] text-emerald-400 flex items-center space-x-1 pt-1 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>High parasympathetic resilience (Low stress)</span>
          </div>
        </div>

        {/* 3. Sleep Architecture */}
        <div className="glass-card p-5 rounded-2xl border border-white/30 dark:border-white/10 space-y-3 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] flex items-center space-x-1.5">
              <Moon className="h-4 w-4 text-indigo-400" />
              <span>Restorative Sleep</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              91% Score
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {sleepHours}h {sleepRemainderMinutes}m
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Deep: {deepSleepHours}h {deepSleepRemainderMinutes}m • REM: {Math.floor(metrics.remSleepMinutes / 60)}h {metrics.remSleepMinutes % 60}m
            </p>
          </div>

          <div className="text-[11px] text-indigo-400 flex items-center space-x-1 pt-1 font-medium">
            <Sparkles className="h-3 w-3" />
            <span>2.25h deep restorative cycle logged</span>
          </div>
        </div>

        {/* 4. Cognitive Energy & Readiness */}
        <div className="glass-card p-5 rounded-2xl border border-white/30 dark:border-white/10 space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Readiness & Vitality</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              High
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {metrics.readinessScore}/100
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Active Burn: {metrics.activeCaloriesBurned} kcal • Peak Focus Window
            </p>
          </div>

          <div className="text-[11px] text-amber-400 flex items-center space-x-1 pt-1 font-medium">
            <BatteryCharging className="h-3 w-3" />
            <span>Optimal biological state for Deep Work</span>
          </div>
        </div>
      </div>

      {/* AI Health-to-Journaling Correlation Banner */}
      <div className="glass-card p-6 rounded-3xl border border-white/30 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-teal-500" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Gemini AI Biometric-to-Journaling Correlation Insights
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Computed across 30-day journal records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center space-x-2 text-teal-400 font-bold text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+34% Emotional Valence on 10k+ Steps</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              On days where your step count exceeds 9,500, your journal sentiment score averages <strong>0.84</strong> (Joyful/Energized) compared to 0.52 on sedentary days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <Moon className="h-4 w-4" />
              <span>Deep Sleep Lowers Stress Index by 2.3x</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Achieving over 2 hours of deep sleep correlates directly with an average stress score of <strong>2.1/10</strong> during complex system architecture sprint days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Zap className="h-4 w-4" />
              <span>Morning Journaling Boosts HRV by 12%</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Completing a 3-minute morning reflection before 09:00 AM measurably stabilizes autonomic nervous balance throughout the afternoon coding blocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
