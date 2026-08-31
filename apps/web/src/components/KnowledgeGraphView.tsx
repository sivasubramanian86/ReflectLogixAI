import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Share2,
  Filter,
  Info,
  Sparkles,
  Zap,
  RefreshCw,
  Search
} from 'lucide-react';
import { KnowledgeGraphData, GraphNode, GraphEdge } from '../types';

interface KnowledgeGraphViewProps {
  graphData: KnowledgeGraphData | null;
  onRefreshGraph: () => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  graphData,
  onRefreshGraph
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const nodeTypes = ['ALL', 'Topic', 'Goal', 'Emotion', 'Habit', 'Location'];

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  const filteredNodes = nodes.filter(n => {
    const matchesType = filterType === 'ALL' || n.type === filterType;
    const matchesQuery = n.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  // Calculate layout coordinates in a neat radial/orbital arrangement
  const width = 640;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const nodePositions = new Map<string, { x: number; y: number }>();
  filteredNodes.forEach((node, idx) => {
    const angle = (idx / Math.max(1, filteredNodes.length)) * 2 * Math.PI;
    const radius = 120 + ((idx % 3) * 35);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodePositions.set(node.id, { x, y });
  });

  const getNodeColor = (type: string, sentiment: string) => {
    switch (type) {
      case 'Emotion':
        return sentiment === 'positive' ? '#10b981' : '#f43f5e';
      case 'Goal':
        return '#f59e0b';
      case 'Habit':
        return '#06b6d4';
      case 'Location':
        return '#a855f7';
      default:
        return '#e2e8f0';
    }
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-xl space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-stone-200">
              GraphRAG & Cognitive Knowledge Graph
            </h3>
            <p className="text-[11px] text-stone-400">
              Bi-directional semantic entity graph extracted from multi-agent reflections
            </p>
          </div>
        </div>

        {/* Toolbar: Search, Filter, Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search graph..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="rounded-lg border border-stone-800 bg-stone-950 pl-8 pr-3 py-1 text-xs text-stone-200 placeholder:text-stone-600 focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          <button
            onClick={onRefreshGraph}
            className="flex items-center space-x-1 rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1 text-xs text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {nodeTypes.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
              filterType === t
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative overflow-hidden rounded-xl border border-stone-800 bg-stone-950 h-[380px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Radial Grid Backdrop */}
          <circle cx={centerX} cy={centerY} r={120} fill="none" stroke="#292524" strokeDasharray="3,3" />
          <circle cx={centerX} cy={centerY} r={155} fill="none" stroke="#292524" strokeDasharray="3,3" />
          <circle cx={centerX} cy={centerY} r={190} fill="none" stroke="#292524" strokeDasharray="3,3" />

          {/* Central Persona Node */}
          <circle cx={centerX} cy={centerY} r={22} fill="#78350f" stroke="#f59e0b" strokeWidth={2} />
          <text
            x={centerX}
            y={centerY + 4}
            textAnchor="middle"
            fill="#fef3c7"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ME
          </text>

          {/* Edges */}
          {edges.map(edge => {
            const src = nodePositions.get(edge.source);
            const tgt = nodePositions.get(edge.target);
            if (!src || !tgt) return null;

            return (
              <g key={edge.id}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke="#44403c"
                  strokeWidth={edge.weight * 2}
                  strokeOpacity={0.7}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map(node => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;
            const isSelected = selectedNode?.id === node.id;
            const color = getNodeColor(node.type, node.sentiment);

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 16 : 12}
                  fill="#1c1917"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <circle cx={pos.x} cy={pos.y} r={isSelected ? 6 : 4} fill={color} />
                <text
                  x={pos.x}
                  y={pos.y + 24}
                  textAnchor="middle"
                  fill="#d6d3d1"
                  fontSize="9"
                  fontFamily="sans-serif"
                  className="pointer-events-none select-none font-medium drop-shadow-sm"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Inspector Flyout */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 rounded-xl border border-amber-500/40 bg-stone-900/95 p-3.5 shadow-2xl backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode.type, selectedNode.sentiment) }}
                />
                <span className="text-xs font-bold text-stone-100">{selectedNode.label}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-stone-400 hover:text-stone-200 text-xs"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-400">
              <span>Type: {selectedNode.type}</span>
              <span>•</span>
              <span className="capitalize">Sentiment: {selectedNode.sentiment}</span>
            </div>
            <p className="text-[11px] text-stone-300">
              Extracted from recurring journaling patterns, cognitive reframing, and habit correlations.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
