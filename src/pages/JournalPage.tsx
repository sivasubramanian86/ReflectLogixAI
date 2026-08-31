import React from 'react';
import { JournalEntry, LocationTag, JournalAttachment } from '../types';
import { JournalEditor } from '../components/JournalEditor';
import { ReflectionCard } from '../components/ReflectionCard';
import { ConversationThread } from '../components/ConversationThread';
import { EntryHistoryList } from '../components/EntryHistoryList';
import { RightInsightsPane } from '../components/RightInsightsPane';

export interface JournalPageProps {
  journals: JournalEntry[];
  selectedJournal: JournalEntry | null;
  isCreatingNew: boolean;
  isSubmitting: boolean;
  searchQuery: string;
  moodFilter: string;
  tagFilter: string;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  onSetSearchQuery: (q: string) => void;
  onSetMoodFilter: (m: string) => void;
  onSetTagFilter: (t: string) => void;
  onSaveAndAnalyze: (entryData: {
    title: string;
    content: string;
    language: string;
    tags: string[];
    location?: LocationTag;
    attachments: JournalAttachment[];
    isSensitive?: boolean;
    detoxMode?: boolean;
  }) => Promise<void>;
  onUpdateJournal: (updated: JournalEntry) => void;
  onToggleAction: (actionId: string, completed: boolean) => Promise<void>;
  onUpdateSensitiveState: (isSensitive: boolean, detoxMode: boolean) => Promise<void>;
  onOpenLiveVoice: () => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  journals,
  selectedJournal,
  isCreatingNew,
  isSubmitting,
  searchQuery,
  moodFilter,
  tagFilter,
  onSelectEntry,
  onNewEntry,
  onSetSearchQuery,
  onSetMoodFilter,
  onSetTagFilter,
  onSaveAndAnalyze,
  onUpdateJournal,
  onToggleAction,
  onUpdateSensitiveState,
  onOpenLiveVoice,
}) => {
  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
      {/* 1. LEFT PANE: HISTORY TIMELINE */}
      <EntryHistoryList
        entries={journals}
        selectedEntryId={selectedJournal?.id || null}
        onSelectEntry={onSelectEntry}
        onNewEntry={onNewEntry}
        searchQuery={searchQuery}
        setSearchQuery={onSetSearchQuery}
        moodFilter={moodFilter}
        setMoodFilter={onSetMoodFilter}
        tagFilter={tagFilter}
        setTagFilter={onSetTagFilter}
      />

      {/* 2. CENTER PANE: JOURNAL CANVAS */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-3 sm:p-5 space-y-5">
        {isCreatingNew || !selectedJournal ? (
          <JournalEditor
            onSaveAndAnalyze={onSaveAndAnalyze}
            isSubmitting={isSubmitting}
            onOpenLiveVoice={onOpenLiveVoice}
          />
        ) : (
          <div className="space-y-5">
            {/* Socratic Reflection Card */}
            {selectedJournal.reflection && (
              <ReflectionCard reflection={selectedJournal.reflection} />
            )}

            {/* Conversation Thread */}
            <ConversationThread
              journal={selectedJournal}
              onUpdateJournal={onUpdateJournal}
            />
          </div>
        )}
      </div>

      {/* 3. RIGHT PANE: INSIGHTS & HABITS */}
      <RightInsightsPane
        journals={journals}
        selectedJournal={selectedJournal}
        onSelectTag={onSetTagFilter}
        onToggleAction={onToggleAction}
        onUpdateSensitiveState={onUpdateSensitiveState}
      />
    </div>
  );
};
