import React from 'react';
import { JournalEntry } from '../../../../src/types';
import { JournalEditor } from '../../../../src/components/JournalEditor';
import { ConversationThread } from '../../../../src/components/ConversationThread';

export const JournalPage: React.FC<{
  journals: JournalEntry[];
  selectedJournal: JournalEntry | null;
  onUpdateJournal: (updated: JournalEntry) => void;
}> = ({ selectedJournal, onUpdateJournal }) => {
  return (
    <div className="space-y-4">
      {selectedJournal && (
        <ConversationThread
          journal={selectedJournal}
          onUpdateJournal={onUpdateJournal}
        />
      )}
    </div>
  );
};
