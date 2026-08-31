import React, { useState, useEffect } from 'react';
import { AppShell } from './components/AppShell';
import { EntryHistoryList } from './components/EntryHistoryList';
import { JournalEditor } from './components/JournalEditor';
import { ReflectionCard } from './components/ReflectionCard';
import { ConversationThread } from './components/ConversationThread';
import { RightInsightsPane } from './components/RightInsightsPane';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { AgenticRagView } from './components/AgenticRagView';
import { AnalyticsView } from './components/AnalyticsView';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationSettings } from './components/NotificationSettings';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { GeminiLiveVoiceModal } from './components/GeminiLiveVoiceModal';
import { ArrivalModal } from './components/ArrivalModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { SettingsPage } from './pages/SettingsPage';
import { LanguageProvider, useI18n } from './i18n';
import { ThemeProvider } from './context/ThemeContext';
import {
  UserProfile,
  JournalEntry,
  ADKWorkflowExecution,
  KnowledgeGraphData,
  LocationTag,
  JournalAttachment,
  NavigationTab
} from './types';
import {
  Plus,
  Sparkles,
  Calendar,
  Trash2,
  MapPin
} from 'lucide-react';

function MainAppContent() {
  const { currentLanguage } = useI18n();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphData | null>(null);

  const [activeTab, setActiveTab] = useState<NavigationTab>('journal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState('');

  // Filters for History Pane
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showNotifications, setShowNotifications] = useState(false);
  const [showArchitectureDocs, setShowArchitectureDocs] = useState(false);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resUser, resJournals, resGraph] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/journals'),
        fetch('/api/knowledge-graph'),
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
        setIsCreatingNew(false);
        setInitialEditorContent('');
        fetchKnowledgeGraph();
      }
    } catch (err) {
      console.error('Error saving reflection:', err);
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
      console.error('Delete reflection error:', err);
    }
  };

  const handleUpdateJournal = (updated: JournalEntry) => {
    setSelectedJournal(updated);
    setJournals((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
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
      onOpenArrivalModal={() => setShowArrivalModal(true)}
      onSwitchRole={handleSwitchRole}
      onNewEntryClick={() => {
        setIsCreatingNew(true);
        setInitialEditorContent('');
        setActiveTab('journal');
      }}
    >
      {/* 1. MY JOURNAL (3-PANE LAYOUT) */}
      {activeTab === 'journal' && (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Left: Entry Timeline */}
          <EntryHistoryList
            entries={journals}
            selectedEntryId={selectedJournal?.id || null}
            onSelectEntry={(entry) => {
              setSelectedJournal(entry);
              setIsCreatingNew(false);
            }}
            onNewEntry={() => {
              setIsCreatingNew(true);
              setInitialEditorContent('');
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            moodFilter={moodFilter}
            setMoodFilter={setMoodFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
          />

          {/* Center: Canvas & Insights */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-4 sm:p-6 space-y-6">
            {isCreatingNew || !selectedJournal ? (
              <JournalEditor
                initialContent={initialEditorContent}
                onSaveAndAnalyze={handleSaveAndAnalyze}
                isSubmitting={isSubmitting}
                onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
              />
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                {/* Active Entry Glass Card */}
                <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border border-white/40 dark:border-white/10 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[var(--text-muted)] flex items-center space-x-1 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          <span>
                            {new Date(selectedJournal.createdAt).toLocaleDateString(
                              currentLanguage === 'en' ? 'en-US' : currentLanguage,
                              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </span>
                        </span>
                        {selectedJournal.location && (
                          <span className="text-xs text-[var(--text-muted)] px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                            <span>{selectedJournal.location.placeName}</span>
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        {selectedJournal.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNew(true);
                          setInitialEditorContent('');
                        }}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs focus-ring min-h-[38px]"
                      >
                        <Plus className="h-4 w-4" />
                        <span>New Reflection</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteJournal(selectedJournal.id, e)}
                        className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-600 hover:border-rose-500/40 focus-ring min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content with 16px+ legible typography */}
                  <div className="pt-3 border-t border-[var(--border-subtle)]">
                    <p className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)] whitespace-pre-line">
                      {selectedJournal.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedJournal.tags && selectedJournal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedJournal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-xl bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] font-medium border border-[var(--border-subtle)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Friendly Coach Reflection Card */}
                {selectedJournal.reflection && (
                  <ReflectionCard reflection={selectedJournal.reflection} />
                )}

                {/* Multi-turn Empathetic Conversation Thread */}
                <ConversationThread
                  journal={selectedJournal}
                  onUpdateJournal={handleUpdateJournal}
                />
              </div>
            )}
          </div>

          {/* Right: Insights & Reflection Coach */}
          <RightInsightsPane
            selectedJournal={selectedJournal}
            onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
            onQuickPrompt={(prompt) => {
              setIsCreatingNew(true);
              setInitialEditorContent(`Reflecting on: "${prompt}"\n\n`);
            }}
          />
        </div>
      )}

      {/* 2. INSIGHTS & TRENDS */}
      {activeTab === 'insights' && <AnalyticsView />}

      {/* 3. DEEP REFLECTIONS (SEARCH HISTORY) */}
      {activeTab === 'ask_history' && <AgenticRagView />}

      {/* 4. JOURNEY MAP */}
      {activeTab === 'knowledge_graph' && <KnowledgeGraphView graphData={knowledgeGraph} />}

      {/* 5. ABOUT REFLECTLOGIXAI */}
      {activeTab === 'about' && <AboutPage />}

      {/* 6. FAQ & HELP */}
      {activeTab === 'faq' && <FAQPage />}

      {/* 7. SETTINGS & PREFERENCES */}
      {activeTab === 'settings' && (
        <SettingsPage
          user={user}
          onUpdateProfile={handleUpdateProfile}
          onOpenNotifications={() => setShowNotifications(true)}
        />
      )}

      {/* 8. SPACE SETTINGS (ADMIN) */}
      {activeTab === 'admin' && user?.role === 'admin' && (
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AdminDashboard />
        </div>
      )}

      {/* MODALS */}
      <ArrivalModal
        isOpen={showArrivalModal}
        onClose={() => setShowArrivalModal(false)}
        onSelectMood={(mood) => {
          setMoodFilter(mood);
        }}
        onQuickStart={(initialText) => {
          setShowArrivalModal(false);
          setIsCreatingNew(true);
          setInitialEditorContent(initialText || '');
          setActiveTab('journal');
        }}
        onOpenVoice={() => setShowLiveVoiceModal(true)}
        onViewInsights={() => setActiveTab('insights')}
      />

      {showNotifications && (
        <NotificationSettings
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showArchitectureDocs && (
        <ArchitectureDocsModal
          isOpen={showArchitectureDocs}
          onClose={() => setShowArchitectureDocs(false)}
        />
      )}

      {showLiveVoiceModal && (
        <GeminiLiveVoiceModal
          isOpen={showLiveVoiceModal}
          onClose={() => setShowLiveVoiceModal(false)}
          onSaveVoiceEntry={async (_title, transcript) => {
            if (transcript.trim()) {
              setIsCreatingNew(true);
              setInitialEditorContent(`Voice Reflection:\n${transcript}\n\n`);
              setActiveTab('journal');
              setShowLiveVoiceModal(false);
            }
          }}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <MainAppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
