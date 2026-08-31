import React, { useState } from 'react';
import {
  Compass,
  Users,
  MapPin,
  Target,
  Sparkles,
  Heart,
  Activity,
  ArrowRight,
  Filter
} from 'lucide-react';
import { KnowledgeGraphData, GraphNode } from '../types';

interface JourneyMapProps {
  graphData: KnowledgeGraphData | null;
}

export const KnowledgeGraphView: React.FC<JourneyMapProps> = ({ graphData }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Fallback demo graph nodes if backend is connecting
  const nodes: GraphNode[] = graphData?.nodes || [
    { id: '1', label: 'Family & Loved Ones', type: 'Person', connections: 4, sentiment: 'Grateful' },
    { id: '2', label: 'Deep Architecture Focus', type: 'Goal', connections: 6, sentiment: 'Inspired' },
    { id: '3', label: 'Morning River Walk', type: 'Place', connections: 5, sentiment: 'Calm' },
    { id: '4', label: 'Daily Reflection Habit', type: 'Habit', connections: 8, sentiment: 'Reflective' },
    { id: '5', label: 'Mindful Boundaries', type: 'Value', connections: 3, sentiment: 'Calm' },
    { id: '6', label: 'Digital Detox Hour', type: 'Habit', connections: 4, sentiment: 'Restful' },
  ];

  const categories = [
    { id: 'all', label: 'All Connections', icon: Compass },
    { id: 'Person', label: 'People in Your Circle', icon: Users },
    { id: 'Place', label: 'Meaningful Places', icon: MapPin },
    { id: 'Goal', label: 'Goals & Aspirations', icon: Target },
    { id: 'Habit', label: 'Daily Habits', icon: Activity },
    { id: 'Value', label: 'Core Values', icon: Heart },
  ];

  const filteredNodes = activeCategory === 'all'
    ? nodes
    : nodes.filter(n => n.type.toLowerCase() === activeCategory.toLowerCase());

  const getNodeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person': return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
      case 'place': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'goal': return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'habit': return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
      default: return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-8 rounded-3xl glass-card space-y-3 border border-white/40 dark:border-white/10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Compass className="h-4 w-4" />
          <span>Life Tapestry & Relationships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Journey Map
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          See how people, places, goals, and daily habits interconnect in your reflections to shape your peace of mind.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all focus-ring ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-sm scale-[1.02]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Connections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Identified Life Elements ({filteredNodes.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="p-5 rounded-2xl glass-card glass-card-hover cursor-pointer border border-white/40 dark:border-white/10 space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getNodeColor(node.type)}`}>
                  {node.type}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {node.connections} reflections
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                {node.label}
              </h3>

              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                <span>Associated feeling:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {node.sentiment || 'Reflective'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Card if selected */}
      {selectedNode && (
        <div className="p-6 rounded-2xl glass-card border-2 border-teal-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${getNodeColor(selectedNode.type)}`}>
              {selectedNode.type}
            </span>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Dismiss
            </button>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            "{selectedNode.label}" in Your Journey
          </h3>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            This {selectedNode.type.toLowerCase()} appears across {selectedNode.connections} entries, consistently bringing a sense of {selectedNode.sentiment?.toLowerCase() || 'grounded clarity'}.
          </p>
        </div>
      )}
    </div>
  );
};
