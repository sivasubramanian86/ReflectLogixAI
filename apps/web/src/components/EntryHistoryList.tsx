import React from 'react';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  Clock,
  Sparkles,
  Smile,
  Heart,
  Zap,
  Coffee,
  AlertCircle,
  HelpCircle,
  Plus,
  Compass
} from 'lucide-react';
import { JournalEntry, MoodType } from '../types';
import { useI18n } from '../i18n';

interface EntryHistoryListProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  moodFilter: string;
  setMoodFilter: (mood: string) => void;
  tagFilter: string;
  setTagFilter: (tag: string) => void;
}

export const EntryHistoryList: React.FC<EntryHistoryListProps> = ({
  entries,
  selectedEntryId,
  onSelectEntry,
  onNewEntry,
  searchQuery,
  setSearchQuery,
  moodFilter,
  setMoodFilter,
  tagFilter,
  setTagFilter,
}) => {
  const { t, currentLanguage } = useI18n();

  // Mood Icon Helper with Accessible Labels
  const getMoodIcon = (mood?: MoodType | string) => {
    switch (mood) {
      case 'Joyful':
      case 'Grateful':
      case 'Inspired':
        return <Smile className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />;
      case 'Calm':
      case 'Reflective':
        return <Coffee className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />;
      case 'Energized':
        return <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />;
      case 'Anxious':
      case 'Overwhelmed':
      case 'Frustrated':
        return <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-stone-500 shrink-0" aria-hidden="true" />;
    }
  };

  // Group entries by day: Today, Yesterday, This Week, Earlier
  const now = Date.now();
  const oneDay = 86400000;
  const sevenDays = 7 * oneDay;

  const groupedEntries: { [key: string]: JournalEntry[] } = {
    today: [],
    yesterday: [],
    thisWeek: [],
    earlier: [],
  };

  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags || []))).slice(0, 8);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.tags && entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesMood =
      moodFilter === 'all' ||
      entry.reflection?.moodAnalysis.primaryMood.toLowerCase() === moodFilter.toLowerCase();

    const matchesTag =
      tagFilter === 'all' ||
      (entry.tags && entry.tags.includes(tagFilter));

    return matchesSearch && matchesMood && matchesTag;
  });

  filteredEntries.forEach((entry) => {
    const diff = now - entry.createdAt;
    if (diff < oneDay) {
      groupedEntries.today.push(entry);
    } else if (diff < 2 * oneDay) {
      groupedEntries.yesterday.push(entry);
    } else if (diff < sevenDays) {
      groupedEntries.thisWeek.push(entry);
    } else {
      groupedEntries.earlier.push(entry);
    }
  });

  const availableMoods = ['all', 'Joyful', 'Calm', 'Reflective', 'Energized', 'Grateful', 'Anxious', 'Overwhelmed'];

  return (
    <section
      aria-label="Journal entry history and filters"
      className="flex flex-col h-full border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] w-full lg:w-80 xl:w-96 shrink-0"
    >
      {/* Header & New Entry CTA */}
      <div className="p-3 sm:p-4 border-b border-[var(--border-subtle)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <h2 className="font-serif font-bold text-sm text-[var(--text-primary)]">
              {t.timeline?.title || 'Journal History'}
            </h2>
          </div>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* Accessible Search Input */}
        <div className="relative">
          <label htmlFor="entry-search-input" className="sr-only">
            Search journal entries by title, keywords, or tags
          </label>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="entry-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.timeline?.searchPlaceholder || 'Search entries, feelings, tags...'}
            className="w-full rounded-xl glass-input pl-9 pr-3 py-2 text-xs placeholder:text-[var(--text-muted)] focus-ring"
          />
        </div>

        {/* Filters: Mood & Tag */}
        <div className="flex items-center gap-2">
          {/* Mood Dropdown */}
          <div className="flex-1">
            <label htmlFor="mood-filter-select" className="sr-only">
              Filter by mood
            </label>
            <select
              id="mood-filter-select"
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="w-full rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2 py-1.5 text-xs text-[var(--text-secondary)] font-medium focus-ring cursor-pointer"
            >
              <option value="all">{t.timeline?.allMoods || 'All Moods'}</option>
              {availableMoods.filter((m) => m !== 'all').map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Dropdown */}
          <div className="flex-1">
            <label htmlFor="tag-filter-select" className="sr-only">
              Filter by tag
            </label>
            <select
              id="tag-filter-select"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2 py-1.5 text-xs text-[var(--text-secondary)] font-medium focus-ring cursor-pointer"
            >
              <option value="all">{t.timeline?.allTags || 'All Tags'}</option>
              {allTags.map((tg) => (
                <option key={tg} value={tg}>
                  #{tg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grouped Entry History List (Semantic <ul role="list">) */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)]" aria-hidden="true">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {searchQuery || moodFilter !== 'all' || tagFilter !== 'all'
                ? t.timeline?.noEntriesMatch || 'No journal entries match your search criteria.'
                : t.timeline?.noEntriesFound || 'No journal entries yet. Write your first reflection!'}
            </p>
            <button
              type="button"
              onClick={onNewEntry}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-500 text-stone-950 px-3 py-1.5 text-xs font-bold shadow-sm focus-ring"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.timeline?.newEntry || 'Write New Entry'}</span>
            </button>
          </div>
        ) : (
          (['today', 'yesterday', 'thisWeek', 'earlier'] as const).map((groupKey) => {
            const groupList = groupedEntries[groupKey];
            if (!groupList || groupList.length === 0) return null;

            const groupTitleMap = {
              today: t.timeline?.todayGroup || 'Today',
              yesterday: t.timeline?.yesterdayGroup || 'Yesterday',
              thisWeek: t.timeline?.thisWeekGroup || 'This Week',
              earlier: t.timeline?.earlierGroup || 'Earlier Reflections',
            };

            return (
              <div key={groupKey} className="space-y-1.5">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                  <span>{groupTitleMap[groupKey]}</span>
                  <span className="font-mono text-[10px]">{groupList.length}</span>
                </div>

                <ul role="list" className="space-y-1.5" aria-label={`${groupTitleMap[groupKey]} entries`}>
                  {groupList.map((entry) => {
                    const isSelected = selectedEntryId === entry.id;
                    const dateFormatted = new Date(entry.createdAt).toLocaleDateString(
                      currentLanguage === 'en' ? 'en-US' : currentLanguage,
                      { month: 'short', day: 'numeric' }
                    );
                    const mood = entry.reflection?.moodAnalysis.primaryMood || 'Reflective';
                    const snippet = entry.content.slice(0, 110);
                    const accessibleSummary = `Entry from ${dateFormatted}, mood: ${mood}. Title: ${entry.title}. Preview: ${snippet}`;

                    return (
                      <li key={entry.id} role="listitem">
                        <button
                          type="button"
                          onClick={() => onSelectEntry(entry)}
                          aria-label={accessibleSummary}
                          aria-current={isSelected ? 'true' : undefined}
                          className={`w-full text-left p-3 rounded-xl transition-all focus-ring border min-h-[58px] ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/40 text-[var(--text-primary)] shadow-sm'
                              : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center space-x-1.5 truncate">
                              {getMoodIcon(mood)}
                              <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                                {entry.title}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                              {dateFormatted}
                            </span>
                          </div>

                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-2">
                            {snippet}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                                {mood}
                              </span>
                              {entry.tags && entry.tags.length > 0 && (
                                <span className="truncate max-w-[90px] text-[var(--text-muted)]">
                                  #{entry.tags[0]}
                                </span>
                              )}
                            </div>
                            <span className="font-mono">{entry.wordCount} words</span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
