import React, { useState } from 'react';
import { Sparkles, Search, BookOpen, Calendar, ArrowRight, Lightbulb, Compass, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { getLocalizedPageContent } from '../i18n/pageContent';

interface DeepReflectionsProps {
  onSelectEntry?: (entryId: string) => void;
}

export const AgenticRagView: React.FC<DeepReflectionsProps> = ({ onSelectEntry }) => {
  const { t, currentLanguage } = useI18n();
  const pageData = getLocalizedPageContent(currentLanguage);
  const rag = pageData.rag;

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const samplePrompts = rag.examplePrompts;

  const handleSearch = async (searchPrompt?: string) => {
    const q = searchPrompt || query;
    if (!q.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch('/api/mcp/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'pgvector_search',
          query: q.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      } else {
        setSearchResults(rag.sampleResults.map((r, i) => ({
          entryId: `entry_${i + 1}`,
          title: r.title,
          snippet: r.snippet,
          similarityScore: i === 0 ? 0.94 : 0.88,
          matchedTags: r.tags,
          date: r.date
        })));
      }
    } catch {
      setSearchResults(rag.sampleResults.map((r, i) => ({
        entryId: `entry_${i + 1}`,
        title: r.title,
        snippet: r.snippet,
        similarityScore: i === 0 ? 0.94 : 0.88,
        matchedTags: r.tags,
        date: r.date
      })));
    } finally {
      setIsSearching(false);
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
            <span>{t.nav?.agenticRag || 'Deep Reflections'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {rag.title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {rag.subtitle}
          </p>

          {/* Search Input */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={rag.searchPlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input focus-ring text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-xs focus-ring flex items-center justify-center space-x-2 shrink-0 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{rag.searchingBtn}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{rag.searchBtn}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Suggested Inspiration Chips */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>{rag.examplePromptsTitle}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(prompt);
                handleSearch(prompt);
              }}
              className="p-3.5 rounded-2xl glass-card border border-[var(--border-subtle)] hover:border-teal-500/40 text-left text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="font-medium">"{prompt}"</span>
              <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-teal-500 shrink-0 ml-2 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <span>{rag.resultsTitle} ({searchResults.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-3 hover:border-teal-500/30 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
                    {result.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold shrink-0">
                    {Math.round(result.similarityScore * 100)}% {rag.matchSuffix}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {result.snippet}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{result.date}</span>
                  </div>
                  {result.matchedTags && (
                    <div className="flex gap-1.5">
                      {result.matchedTags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[10px] font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
