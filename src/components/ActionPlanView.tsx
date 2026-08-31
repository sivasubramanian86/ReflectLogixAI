import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Flame,
  Calendar,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { MicroAction } from '../types';

interface ActionPlanViewProps {
  actions: MicroAction[];
  onToggleAction: (actionId: string, completed: boolean) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ actions, onToggleAction }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'wellness', 'productivity', 'mindset', 'rest'];
  const filteredActions = filterCategory === 'all'
    ? actions
    : actions.filter(a => a.category === filterCategory);

  const completedCount = actions.filter(a => a.completed).length;
  const progressPercent = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      default:
        return 'bg-stone-800 text-stone-400 border-stone-700';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'wellness':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'productivity':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'rest':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      default:
        return 'text-stone-300 bg-stone-800 border-stone-700';
    }
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-xl space-y-4">
      
      {/* Header & Progress */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-stone-200">
              ADK Micro-Action Roadmap
            </h3>
            <p className="text-[11px] text-stone-400">
              High-leverage micro habits to reduce friction & cognitive load
            </p>
          </div>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center space-x-3">
          <div className="w-28 h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs text-stone-300">
            {completedCount}/{actions.length} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        <span className="text-[11px] text-stone-500 mr-1 flex items-center space-x-1">
          <Filter className="h-3 w-3" />
          <span>Category:</span>
        </span>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-lg px-2.5 py-1 text-xs capitalize transition-colors ${
              filterCategory === cat
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Items List */}
      {filteredActions.length === 0 ? (
        <div className="py-6 text-center text-xs text-stone-500">
          No actions match the selected filter.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredActions.map(action => (
            <div
              key={action.id}
              onClick={() => onToggleAction(action.id, !action.completed)}
              className={`flex items-start justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                action.completed
                  ? 'border-emerald-500/20 bg-emerald-950/10 opacity-75'
                  : 'border-stone-800/80 bg-stone-950/60 hover:border-amber-500/30 hover:bg-stone-950'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  className="mt-0.5 text-stone-400 hover:text-amber-400 transition-colors"
                >
                  {action.completed ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Square className="h-4 w-4 text-stone-500" />
                  )}
                </button>
                <div className="space-y-0.5">
                  <div
                    className={`text-xs font-semibold ${
                      action.completed ? 'line-through text-stone-400' : 'text-stone-200'
                    }`}
                  >
                    {action.title}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border capitalize ${getCategoryBadge(
                    action.category
                  )}`}
                >
                  {action.category}
                </span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono border capitalize ${getPriorityBadge(
                    action.priority
                  )}`}
                >
                  {action.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
