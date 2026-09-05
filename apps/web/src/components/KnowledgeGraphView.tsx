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
import { useI18n } from '../i18n';

interface JourneyMapProps {
  graphData: KnowledgeGraphData | null;
}

export const KnowledgeGraphView: React.FC<JourneyMapProps> = ({ graphData }) => {
  const { t, currentLanguage } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

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
    { id: 'Person', label: 'People in Circle', icon: Users },
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
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
            <Compass className="h-4 w-4" />
            <span>{t.nav?.knowledgeGraph || 'Journey Map'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {t.nav?.knowledgeGraph || 'Journey Map'} • GraphRAG Entity Mesh
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Explore the interconnected graph of people, places, habits, and core values discovered across your journaling history.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus-ring cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Connections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
            Identified Life Elements ({filteredNodes.length})
          </h2>
          <span className="text-xs text-[var(--text-muted)]">
            Click any entity for deeper insights
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10 hover:border-teal-500/40 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getNodeColor(node.type)}`}>
                  {node.type}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-medium">
                  {node.connections} reflections
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {node.label}
              </h3>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                <span>Associated mood: <strong className="text-teal-600 dark:text-teal-400 font-semibold">{node.sentiment}</strong></span>
                <ArrowRight className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
