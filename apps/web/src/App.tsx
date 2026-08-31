import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from './components/AppShell';
import { EntryHistoryList } from './components/EntryHistoryList';
import { JournalEditor } from './components/JournalEditor';
import { ReflectionCard } from './components/ReflectionCard';
import { ConversationThread } from './components/ConversationThread';
import { RightInsightsPane } from './components/RightInsightsPane';
import { AgentWorkflowInspector } from './components/AgentWorkflowInspector';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { AgenticRagView } from './components/AgenticRagView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationSettings } from './components/NotificationSettings';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { GeminiLiveVoiceModal } from './components/GeminiLiveVoiceModal';
import { LanguageProvider, useI18n } from './i18n';
import { ThemeProvider } from './context/ThemeContext';
import {
  UserProfile,
  JournalEntry,
  ADKWorkflowExecution,
  KnowledgeGraphData,
  LocationTag,
  JournalAttachment
} from './types';
import {
  Plus,
  Sparkles,
  Calendar,
  Tag,
  Clock,
  Trash2,
  Edit3,
  BookOpen,
  BrainCircuit,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

function MainAppContent() {
  const { t, currentLanguage } = useI18n();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [latestWorkflowExecution, setLatestWorkflowExecution] = useState<ADKWorkflowExecution | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphData | null>(null);

  const [activeTab, setActiveTab] = useState<'journal' | 'insights' | 'ask_history' | 'knowledge_graph' | 'admin'>('journal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Filters for History Pane
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showNotifications, setShowNotifications] = useState(false);
  const [showArchitectureDocs, setShowArchitectureDocs] = useState(false);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resUser, resJournals, resGraph, resTraces] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/journals'),
        fetch('/api/knowledge-graph'),
        fetch('/api/adk/traces'),
      ]);

      if (resUser.ok) {
        const userData = await resUser.json();
        setUser(userData.user);
      }

      if (resJournals.ok) {
        const journalData = await resJournals.json();
        const loadedJournals: JournalEntry[] = journalData.journals || [];
        setJournals(loadedJournals);
        if (loadedJournals.length > 0) {
          setSelectedJournal(loadedJournals[0]);
        }
      }

      if (resGraph.ok) {
        const graphData = await resGraph.json();
        setKnowledgeGraph(graphData.graph);
      }

      if (resTraces.ok) {
        const tracesData = await resTraces.json();
        if (tracesData.traces && tracesData.traces.length > 0) {
          setLatestWorkflowExecution(tracesData.traces[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleSaveAndAnalyze = async (entryData: {
    title: string;
    content: string;
    language: string;
    tags: string[];
    location?: LocationTag;
    attachments: JournalAttachment[];
    isSensitive?: boolean;
    detoxMode?: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entryData,
          autoAnalyze: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newJournal: JournalEntry = data.journal;
        setJournals((prev) => [newJournal, ...prev.filter((j) => j.id !== newJournal.id)]);
        setSelectedJournal(newJournal);
        if (data.workflowExecution) {
          setLatestWorkflowExecution(data.workflowExecution);
        }
        setIsCreatingNew(false);
        fetchKnowledgeGraph();
      }
    } catch (err) {
      console.error('Error saving journal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJournal = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/journals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const remaining = journals.filter((j) => j.id !== id);
        setJournals(remaining);
        if (selectedJournal?.id === id) {
          setSelectedJournal(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error('Delete journal error:', err);
    }
  };

  const handleToggleAction = async (actionId: string, completed: boolean) => {
    if (!selectedJournal) return;
    try {
      const res = await fetch(`/api/journals/${selectedJournal.id}/action-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, completed }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedJournal(data.journal);
        setJournals((prev) => prev.map((j) => (j.id === data.journal.id ? data.journal : j)));
      }
    } catch (err) {
      console.error('Action toggle failed:', err);
    }
  };

  const handleUpdateSensitiveState = async (isSensitive: boolean, detoxMode: boolean) => {
    if (!selectedJournal) return;
    try {
      const updated: JournalEntry = {
        ...selectedJournal,
        isSensitive,
        detoxMode,
      };
      setSelectedJournal(updated);
      setJournals((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } catch (err) {
      console.error('Failed to update sensitivity:', err);
    }
  };

  const handleUpdateJournal = (updated: JournalEntry) => {
    setSelectedJournal(updated);
    setJournals((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  const handleSwitchRole = async (role: 'user' | 'admin') => {
    try {
      const res = await fetch('/api/user/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user.role === 'user' && activeTab === 'admin') {
          setActiveTab('journal');
        }
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  const fetchKnowledgeGraph = async () => {
    try {
      const res = await fetch('/api/knowledge-graph');
      if (res.ok) {
        const data = await res.json();
        setKnowledgeGraph(data.graph);
      }
    } catch (err) {
      console.error('Graph refresh failed:', err);
    }
  };

  return (
    <AppShell
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      timeFilter={timeFilter}
      setTimeFilter={setTimeFilter}
      onOpenNotifications={() => setShowNotifications(true)}
      onOpenArchitectureDocs={() => setShowArchitectureDocs(true)}
      onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
      onSwitchRole={handleSwitchRole}
      onNewEntryClick={() => {
        setIsCreatingNew(true);
        setActiveTab('journal');
      }}
    >
      {/* 1. JOURNAL TAB: 3-PANE LAYOUT */}
      {activeTab === 'journal' && (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          
          {/* LEFT PANE: ENTRY HISTORY */}
          <EntryHistoryList
            entries={journals}
            selectedEntryId={selectedJournal?.id || null}
            onSelectEntry={(entry) => {
              setSelectedJournal(entry);
              setIsCreatingNew(false);
            }}
            onNewEntry={() => setIsCreatingNew(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            moodFilter={moodFilter}
            setMoodFilter={setMoodFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
          />

          {/* CENTER PANE: JOURNAL CANVAS & CONVERSATION */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-3 sm:p-5 space-y-5">
            {isCreatingNew || !selectedJournal ? (
              <JournalEditor
                onSaveAndAnalyze={handleSaveAndAnalyze}
                isSubmitting={isSubmitting}
                onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
              />
            ) : (
              <div className="space-y-5">
                {/* Entry Header & Actions */}
                <div className="panel-elevated rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-[var(--text-muted)] flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {new Date(selectedJournal.createdAt).toLocaleDateString(
                              currentLanguage === 'en' ? 'en-US' : currentLanguage,
                              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </span>
                        </span>
                        {selectedJournal.location && (
                          <span className="text-[11px] text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                            📍 {selectedJournal.location.placeName}
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif font-bold text-lg sm:text-xl text-[var(--text-primary)]">
                        {selectedJournal.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingNew(true)}
                        aria-label="Write a new journal entry"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs focus-ring min-h-[36px]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.timeline?.newEntry || 'New Entry'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteJournal(selectedJournal.id, e)}
                        aria-label={`Delete entry: ${selectedJournal.title}`}
                        className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-600 hover:border-rose-500/40 focus-ring min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Entry Body */}
                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <p className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-line">
                      {selectedJournal.content}
                    </p>
                  </div>

                  {/* Attached Images */}
                  {selectedJournal.attachments && selectedJournal.attachments.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
                      {selectedJournal.attachments.map((att) => (
                        <div key={att.id} className="rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                          {att.dataUrl && (
                            <img
                              src={att.dataUrl}
                              alt={`Attached visual: ${att.name}`}
                              className="max-h-48 object-cover rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {selectedJournal.tags && selectedJournal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {selectedJournal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-secondary)] text-[11px] text-[var(--text-secondary)] font-medium border border-[var(--border-subtle)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Gemini Socratic Reflection Card */}
                {selectedJournal.reflection && (
                  <ReflectionCard reflection={selectedJournal.reflection} />
                )}

                {/* Multi-turn Socratic Conversation Thread */}
                <ConversationThread
                  journal={selectedJournal}
                  onUpdateJournal={handleUpdateJournal}
                />

                {/* ADK Multi-Agent Trace Viewer */}
                {latestWorkflowExecution && (
                  <AgentWorkflowInspector execution={latestWorkflowExecution} />
                )}
              </div>
            )}
          </div>

          {/* RIGHT PANE: INSIGHTS & REFLECTION COACH */}
          <RightInsightsPane
            journals={journals}
            selectedJournal={selectedJournal}
            onSelectTag={(tag) => {
              setTagFilter(tag);
              setActiveTab('journal');
            }}
            onToggleAction={handleToggleAction}
            onUpdateSensitiveState={handleUpdateSensitiveState}
          />

        </div>
      )}

      {/* 2. INSIGHTS & TRENDS TAB */}
      {activeTab === 'insights' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnalyticsView journals={journals} />
        </div>
      )}

      {/* 3. ASK MY HISTORY (RAG) TAB */}
      {activeTab === 'ask_history' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AgenticRagView journals={journals} />
        </div>
      )}

      {/* 4. KNOWLEDGE GRAPH TAB */}
      {activeTab === 'knowledge_graph' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <KnowledgeGraphView graphData={knowledgeGraph} onRefresh={fetchKnowledgeGraph} />
        </div>
      )}

      {/* 5. ADMIN DASHBOARD TAB */}
      {activeTab === 'admin' && user?.role === 'admin' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AdminDashboard />
        </div>
      )}

      {/* MODALS */}
      {showNotifications && (
        <NotificationSettings onClose={() => setShowNotifications(false)} />
      )}

      {showArchitectureDocs && (
        <ArchitectureDocsModal onClose={() => setShowArchitectureDocs(false)} />
      )}

      {showLiveVoiceModal && (
        <GeminiLiveVoiceModal
          onClose={() => setShowLiveVoiceModal(false)}
          onAppendJournalContent={(dictated) => {
            if (dictated.trim()) {
              setIsCreatingNew(true);
              setActiveTab('journal');
            }
          }}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
