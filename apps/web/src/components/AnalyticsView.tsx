import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Smile,
  Zap,
  Calendar,
  Flame,
  Award,
  BookOpen,
  PieChart as PieIcon,
  Heart,
  Target,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<number>(30);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    // Simulated or fetched analytical trends
    setAnalyticsData({
      averageStress: 3.2,
      averageValence: 0.74,
      dominantMood: 'Reflective & Calm',
      streakDays: 8,
      totalEntries: 24,
      lifeAreas: [
        { name: 'Growth', value: 35, color: '#0d9488' },
        { name: 'Work & Craft', value: 25, color: '#6366f1' },
        { name: 'Health & Rest', value: 20, color: '#10b981' },
        { name: 'Relationships', value: 12, color: '#f59e0b' },
        { name: 'Creativity', value: 8, color: '#ec4899' },
      ],
      moodTrend: [
        { day: 'Day 1', stress: 6, valence: 0.4 },
        { day: 'Day 5', stress: 5, valence: 0.6 },
        { day: 'Day 10', stress: 3, valence: 0.8 },
        { day: 'Day 15', stress: 4, valence: 0.7 },
        { day: 'Day 20', stress: 2, valence: 0.9 },
        { day: 'Day 25', stress: 3, valence: 0.8 },
        { day: 'Today', stress: 2, valence: 0.85 },
      ],
      topThemes: [
        { name: 'Mindful Morning Routines', count: 12 },
        { name: 'Deep Architecture & Craft', count: 9 },
        { name: 'Family & Walk Pauses', count: 7 },
        { name: 'Cognitive Boundaries', count: 5 },
      ]
    });
  }, [timeframe]);

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-card space-y-3 border border-white/40 dark:border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>Personal Life Journey & Insights</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-xl bg-[var(--bg-secondary)] p-1 border border-[var(--border-subtle)]">
            {[7, 14, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setTimeframe(days)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors focus-ring ${
                  timeframe === days
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Insights & Trends
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          See how your emotional well-being, life focus, and mindful habits evolve over time.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <Flame className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Consistency</span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {analyticsData?.streakDays || 8} Days
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Active writing streak—nourishing your clarity
          </p>
        </div>

        {/* Dominant State */}
        <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
            <Smile className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Primary State</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] truncate">
            {analyticsData?.dominantMood || 'Reflective'}
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Most frequent emotional anchor
          </p>
        </div>

        {/* Average Stress */}
        <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <Zap className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Stress Index</span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {analyticsData?.averageStress || 3.2} <span className="text-sm font-normal text-[var(--text-muted)]">/ 10</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Low & balanced stress levels
          </p>
        </div>

        {/* Total Reflections */}
        <div className="p-5 rounded-2xl glass-card space-y-2 border border-white/40 dark:border-white/10">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Reflections</span>
          </div>
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {analyticsData?.totalEntries || 24} Entries
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Captured across your journey
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood & Stress Trajectory */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-white/40 dark:border-white/10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Mood & Ease Trajectory
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Tracking your balance over the last {timeframe} days
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.moodTrend || []}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 10]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  name="Stress Level (1-10)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Life Areas Distribution */}
        <div className="p-6 rounded-3xl glass-card space-y-4 border border-white/40 dark:border-white/10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
              Life Areas Focus
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Where your attention and energy have been centered
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {analyticsData?.lifeAreas.map((area: any) => (
              <div key={area.name} className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                  <span>{area.name}</span>
                  <span>{area.value}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${area.value}%`, backgroundColor: area.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
