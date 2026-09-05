import React from 'react';
import {
  Search,
  Calendar,
  Smile,
  Heart,
  Zap,
  Coffee,
  AlertCircle,
  Sparkles,
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

  const getMoodBadge = (mood?: MoodType | string) => {
    switch (mood) {
      case 'Joyful':
      case 'Grateful':
      case 'Inspired':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Calm':
      case 'Reflective':
        return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
      case 'Energized':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'Anxious':
      case 'Overwhelmed':
      case 'Frustrated':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

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
      aria-label="Journal reflections timeline and search"
      className="flex flex-col h-full border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 backdrop-blur-md w-full lg:w-80 xl:w-96 shrink-0"
    >
      {/* Header & Search */}
      <div className="p-4 border-b border-[var(--border-subtle)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {t.timeline.title || 'Reflections Timeline'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onNewEntry}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs focus-ring"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.timeline.newEntry || 'New Reflection'}</span>
          </button>
        </div>

        {/* High Contrast Search Input */}
        <div className="relative">
          <label htmlFor="entry-search-input" className="sr-only">
            {t.timeline.searchPlaceholder || 'Search thoughts, tags, themes...'}
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            id="entry-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.timeline.searchPlaceholder || 'Search thoughts, tags, themes...'}
            className="w-full rounded-xl glass-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-[var(--text-muted)] focus-ring"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] font-medium focus-ring cursor-pointer"
            >
              <option value="all">{t.timeline.allMoods || 'All States'}</option>
              {availableMoods.filter((m) => m !== 'all').map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] font-medium focus-ring cursor-pointer"
            >
              <option value="all">{t.timeline.allTags || 'All Life Areas'}</option>
              {allTags.map((tg) => (
                <option key={tg} value={tg}>
                  #{tg}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Entry Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-sm text-[var(--text-muted)] font-medium">
              {t.timeline.noEntriesFound || 'No reflections found matching your criteria.'}
            </p>
          </div>
        ) : (
          (['today', 'yesterday', 'thisWeek', 'earlier'] as const).map((groupKey) => {
            const groupList = groupedEntries[groupKey];
            if (!groupList || groupList.length === 0) return null;

            const groupTitleMap = {
              today: t.timeline.todayGroup || 'Today',
              yesterday: t.timeline.yesterdayGroup || 'Yesterday',
              thisWeek: t.timeline.thisWeekGroup || 'This Week',
              earlier: t.timeline.earlierGroup || 'Earlier Reflections',
            };

            return (
              <div key={groupKey} className="space-y-2">
                <div className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
                  <span>{groupTitleMap[groupKey]}</span>
                  <span>{groupList.length}</span>
                </div>

                <ul role="list" className="space-y-2">
                  {groupList.map((entry) => {
                    const isSelected = selectedEntryId === entry.id;
                    const dateFormatted = new Date(entry.createdAt).toLocaleDateString(
                      currentLanguage === 'en' ? 'en-US' : currentLanguage,
                      { month: 'short', day: 'numeric' }
                    );
                    const mood = entry.reflection?.moodAnalysis.primaryMood || 'Reflective';
                    const snippet = entry.content.slice(0, 95);

                    return (
                      <li key={entry.id} role="listitem">
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => onSelectEntry(entry)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onSelectEntry(entry);
                            }
                          }}
                          className={`w-full p-4 rounded-2xl glass-card transition-all text-left cursor-pointer border ${
                            isSelected
                              ? 'border-teal-500 bg-teal-500/10 shadow-md ring-1 ring-teal-500/30'
                              : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${getMoodBadge(mood)}`}>
                              {mood}
                            </span>
                            <span className="text-xs text-[var(--text-muted)] font-medium">
                              {dateFormatted}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] line-clamp-1">
                            {entry.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
                            {snippet}...
                          </p>

                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {entry.tags.slice(0, 3).map((tItem) => (
                                <span
                                  key={tItem}
                                  className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-muted)] font-medium"
                                >
                                  #{tItem}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
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
