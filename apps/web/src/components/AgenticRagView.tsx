import React, { useState } from 'react';
import {
  Search,
  Cpu,
  Sparkles,
  Database,
  Calendar,
  Tag,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { MCPToolResult } from '../types';

export const AgenticRagView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragResult, setRagResult] = useState<MCPToolResult | null>(null);

  const sampleQueries = [
    'How do I handle back-to-back meetings and cognitive fatigue?',
    'What brings me the most stillness and peace of mind?',
    'What were my reflections during my work in Chennai?',
    'Show my habits around sleep hygiene and evening screen shutdown.'
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'pgvector_search',
          query: searchQuery
        })
      });
      const data = await res.json();
      setRagResult(data);
    } catch (err) {
      console.error('RAG Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-stone-200">
              Agentic RAG: Query Your Life History
            </h3>
            <p className="text-[11px] text-stone-400">
              Cloud SQL pgvector semantic embeddings & timeline memory recall
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <Database className="h-3 w-3" />
          <span>MCP Server: pgvector_mcp</span>
        </div>
      </div>

      {/* Query Bar */}
      <div className="space-y-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
            <input
              type="text"
              placeholder="Ask anything about your past reflections, emotional patterns, or decisions..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-950/90 pl-9 pr-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
            />
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-semibold text-stone-950 shadow-md hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isLoading ? 'Vector Searching...' : 'Query Memory'}</span>
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-stone-500 self-center mr-1">Try asking:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              className="rounded-lg bg-stone-950 px-2 py-1 text-[11px] text-stone-400 hover:text-amber-300 hover:bg-stone-800 border border-stone-800 text-left transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* RAG Results Display */}
      {ragResult && (
        <div className="space-y-3 pt-2">
          
          {/* Query metadata */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 bg-stone-950/80 p-2.5 rounded-lg border border-stone-800">
            <span>Query: "{ragResult.data.query}"</span>
            <span className="text-amber-400">{ragResult.executionTimeMs}ms • {ragResult.data.matchesCount} vector matches</span>
          </div>

          {/* Matches List */}
          <div className="grid grid-cols-1 gap-2.5">
            {ragResult.data.results.map((match: any) => (
              <div
                key={match.id}
                className="rounded-xl border border-stone-800 bg-stone-950/70 p-3.5 space-y-2 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-stone-200 font-serif">
                    {match.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono">
                      {(match.similarityScore * 100).toFixed(0)}% Similarity
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {match.snippet}
                </p>

                {match.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {match.tags.map((t: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded bg-stone-800 px-1.5 py-0.2 text-[10px] text-stone-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
