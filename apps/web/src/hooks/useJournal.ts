import { useState, useEffect } from 'react';
import { JournalEntry } from '../../../../src/types';

export function useJournal() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/journals')
      .then(res => res.json())
      .then(data => {
        setJournals(data.journals || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { journals, setJournals, loading };
}
