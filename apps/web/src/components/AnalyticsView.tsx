import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  Sliders,
  Database,
  TrendingUp,
  Activity,
  Flame,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { MCPToolResult } from '../types';

export const AnalyticsView: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<MCPToolResult | null>(null);
  const [timeRange, setTimeRange] = useState<number>(30);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange]);

  const fetchAnalytics = async (days: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'bigquery_analytics',
          timeRangeDays: days
        })
      });
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch BigQuery analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const moodData = analyticsData?.data?.moodDistribution
    ? Object.entries(analyticsData.data.moodDistribution).map(([name, count]) => ({
        name,
        count
      }))
    : [
        { name: 'Reflective', count: 4 },
        { name: 'Calm', count: 3 },
        { name: 'Grateful', count: 2 },
        { name: 'Overwhelmed', count: 1 }
      ];

  // Sample Trend points
  const trendData = [
    { day: 'Day 1', stress: 3, valence: 0.7 },
    { day: 'Day 4', stress: 5, valence: 0.5 },
    { day: 'Day 8', stress: 6, valence: 0.4 },
    { day: 'Day 12', stress: 4, valence: 0.6 },
    { day: 'Day 16', stress: 3, valence: 0.8 },
    { day: 'Day 20', stress: 4, valence: 0.72 }
  ];

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-xl space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-stone-200">
              BigQuery Affective & Temporal Analytics
            </h3>
            <p className="text-[11px] text-stone-400">
              Aggregated journaling metrics, sentiment valence, and stress correlations
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-1.5 rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                timeRange === days
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Last {days}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-stone-400">Avg Stress Index</div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {analyticsData?.data?.averageStressIndex || '3.5'}
            <span className="text-xs text-stone-500 font-normal"> / 10</span>
          </div>
          <div className="text-[10px] text-stone-500">Target: &lt; 4.5</div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-stone-400">Emotional Valence</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            +{analyticsData?.data?.averageEmotionalValence || '0.70'}
          </div>
          <div className="text-[10px] text-stone-500">Scale: -1.0 to +1.0</div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-stone-400">Writing Streak</div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {analyticsData?.data?.activeWritingStreakDays || 4}
            <span className="text-xs text-stone-500 font-normal"> days</span>
          </div>
          <div className="text-[10px] text-stone-500">Consistency score: High</div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3.5 space-y-1">
          <div className="text-[11px] font-medium text-stone-400">Total Words Logged</div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {analyticsData?.data?.totalWordsLogged || 116}
          </div>
          <div className="text-[10px] text-stone-500">Pruned & token-optimized</div>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Mood Distribution Bar Chart */}
        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
          <div className="text-xs font-semibold text-stone-200">
            Primary Mood Frequencies
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#78716c" fontSize={10} />
                <YAxis stroke="#78716c" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stress & Valence Trend Line Chart */}
        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
          <div className="text-xs font-semibold text-stone-200">
            30-Day Stress vs Valence Trajectory
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                <XAxis dataKey="day" stroke="#78716c" fontSize={10} />
                <YAxis stroke="#78716c" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: 8, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Stress (1-10)" />
                <Line type="monotone" dataKey="valence" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Valence (0-1)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BigQuery Raw SQL Query Accordion */}
      {analyticsData && (
        <div className="rounded-xl border border-stone-800 bg-stone-950 p-3 text-xs font-mono space-y-1.5 text-stone-400">
          <div className="flex items-center justify-between text-stone-300">
            <span className="text-[11px] text-amber-400 uppercase font-semibold">BigQuery MCP SQL Execution:</span>
            <span>{analyticsData.executionTimeMs}ms</span>
          </div>
          <p className="text-[11px] text-stone-400 break-all bg-stone-900/80 p-2 rounded border border-stone-800">
            {analyticsData.query}
          </p>
        </div>
      )}

    </div>
  );
};
