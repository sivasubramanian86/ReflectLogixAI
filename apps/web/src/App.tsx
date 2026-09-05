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
import { LiveVoiceAssistantModal } from './components/LiveVoiceAssistantModal';
import { HomeCompanionHero } from './components/HomeCompanionHero';
import { ArrivalModal } from './components/ArrivalModal';
import { SmartHealthTrackerView } from './components/SmartHealthTrackerView';
import { LifestyleFlashcardsView } from './components/LifestyleFlashcardsView';
import { PredictiveLifePlannerView } from './components/PredictiveLifePlannerView';
import { MultiModalMediaHub } from './components/MultiModalMediaHub';
import { ReflectionCoachWorkspace } from './components/ReflectionCoachWorkspace';
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
  MapPin,
  ArrowRight
} from 'lucide-react';

const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'user_siva_001',
  email: 'kailasamsiva@gmail.com',
  displayName: 'Siva',
  role: 'admin',
  preferredLanguage: 'English',
  bilingualOutput: true,
  theme: 'dark',
  createdTimestamp: Date.now() - 14 * 86400000,
  lastActiveTimestamp: Date.now(),
  longTermProfile: {
    coreValues: ['Intellectual Curiosity', 'Mindful Resilience', 'Engineering Craftsmanship', 'Family Harmony'],
    primaryGoals: ['Architect zero-trust Cloud Run systems', 'Maintain daily mindfulness & sleep hygiene', 'Learn Tamil literature classics'],
    knownStressors: ['High-stakes context switching', 'Late-night architecture sprints', 'Fragmented focus'],
    positiveAnchors: ['Morning walk in nature', 'Deep technical writing', 'Evening herbal tea with family'],
    summary: 'Senior Cloud AI Architect striving for deep focus, calm reflection, and balanced high-performance engineering.'
  }
};

const DEFAULT_INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'entry_001',
    userId: 'user_siva_001',
    title: 'Dawn Reflections on Systems Architecture and Deep Work',
    content: `Today began with crisp morning stillness. I spent the first hour sketching the ADK agent orchestration graph for the new Cloud Run deployment.
Taking thirty seconds to pause, breathe, and ground myself before jumping into complex distributed systems logic made a world of difference.
Goal for this evening: disconnect completely by 9 PM to preserve restorative sleep cycles.`,
    language: 'English',
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now() - 2 * 86400000,
    tags: ['Architecture', 'Mindfulness', 'DeepWork', 'SleepHygiene'],
    wordCount: 78,
    tokenCountEstimated: 112,
    location: {
      placeName: 'Bangalore Tech District, KA',
      latitude: 12.9716,
      longitude: 77.5946,
      privacyPrecision: 'neighborhood'
    },
    reflection: {
      summary: 'Balanced morning combining systems architecture design with mindful pacing and an explicit sleep hygiene boundary.',
      bilingualSummary: {
        detectedLanguage: 'English',
        originalSummary: 'Balanced morning combining systems architecture design with mindful pacing and an explicit sleep hygiene boundary.',
        englishSummary: 'Balanced morning combining systems architecture design with mindful pacing and an explicit sleep hygiene boundary.',
        keyPhrases: ['ADK agent graph', 'Cognitive bandwidth', 'Restorative sleep']
      },
      moodAnalysis: {
        primaryMood: 'Reflective',
        secondaryMood: 'Calm',
        valence: 0.72,
        arousal: 0.45,
        stressLevel: 3,
        tags: ['Clarity', 'Mindful Focus', 'Proactive Boundaries'],
        sentimentScore: 0.8
      },
      cognitiveStrengths: ['High metacognitive awareness', 'Proactive boundary setting for recovery'],
      reframeSuggestions: ['Acknowledge that strategic pauses accelerate system velocity rather than slowing you down.'],
      socraticQuestions: [
        'What physical cues tell you your bandwidth is fragmenting before it impacts your mood?',
        'How can you replicate this calm dawn environment on high-intensity sprint days?'
      ],
      microActions: [
        {
          id: 'act_001',
          title: '9:00 PM Screen Shutdown',
          description: 'Transition devices to charging station away from bedside.',
          timeframe: 'today',
          priority: 'high',
          completed: true,
          category: 'rest'
        },
        {
          id: 'act_002',
          title: 'Morning 5-Min Breathwork',
          description: 'Perform 4-7-8 grounding breaths before checking email inbox.',
          timeframe: 'this_week',
          priority: 'medium',
          completed: true,
          category: 'wellness'
        }
      ],
      longitudinalGrowth: {
        patternDetected: 'Positive correlation between morning pauses and sustained evening cognitive energy.',
        trendDirection: 'improving',
        consistencyScore: 92,
        coachNote: 'Siva, your intentional pacing is demonstrating clear compound benefits across your cognitive stamina.'
      }
    }
  },
  {
    id: 'entry_002',
    userId: 'user_siva_001',
    title: '10,480 Steps Morning Clarity Walk in Nature',
    content: `Completed a brisk 10,480 steps walk through the park at sunrise.
Breathing in fresh air, noticing the bird calls, and feeling gratitude for good health.
Key realization: Slowing down intentionally actually speeds up long-term architectural clarity.`,
    language: 'English',
    createdAt: Date.now() - 1 * 86400000,
    updatedAt: Date.now() - 1 * 86400000,
    tags: ['Wellness', '10kSteps', 'Gratitude', 'Mindset'],
    wordCount: 52,
    tokenCountEstimated: 75,
    reflection: {
      summary: 'Energizing sunrise walk with 10k steps and a pivotal mindset reframe on sustainable velocity.',
      bilingualSummary: {
        detectedLanguage: 'English',
        originalSummary: 'Energizing sunrise walk with 10k steps and a pivotal mindset reframe on sustainable velocity.',
        englishSummary: 'Energizing sunrise walk with 10k steps and a pivotal mindset reframe on sustainable velocity.',
        keyPhrases: ['10k steps', 'Sunrise clarity', 'Sustainable velocity']
      },
      moodAnalysis: {
        primaryMood: 'Energized',
        secondaryMood: 'Grateful',
        valence: 0.88,
        arousal: 0.65,
        stressLevel: 2,
        tags: ['Vitality', 'Physical Wellbeing', 'Clarity'],
        sentimentScore: 0.92
      },
      cognitiveStrengths: ['Physical-mental integration', 'Appreciation for restorative habits'],
      reframeSuggestions: ['Anchor this post-walk mental clarity as your creative springboard for architecture.'],
      socraticQuestions: [
        'How does physical movement change the way you approach complex engineering roadblocks?',
        'What is one small way to protect this morning walking ritual every single day?'
      ],
      microActions: [
        {
          id: 'act_003',
          title: 'Hydrate & Electrolytes',
          description: 'Drink 500ml water with electrolytes after morning walk.',
          timeframe: 'today',
          priority: 'medium',
          completed: true,
          category: 'wellness'
        }
      ]
    }
  },
  {
    id: 'entry_003',
    userId: 'user_siva_001',
    title: 'Important Meeting Reminder: APAC Cloud Architecture Review at 11:00 AM',
    content: `Voice Note Reflection: Remind me about the upcoming APAC Cloud Architecture Review meeting at 11:00 AM today with the engineering leads.
Key agenda points to highlight: zero-trust Cloud KMS envelope encryption, ADK multi-agent orchestration concurrency, and keeping our 94/100 team peace index score steady.`,
    language: 'English',
    createdAt: Date.now() - 4 * 3600000,
    updatedAt: Date.now() - 4 * 3600000,
    tags: ['MeetingReminder', 'Architecture', '11AMMeeting', 'ADK'],
    wordCount: 65,
    tokenCountEstimated: 95,
    reflection: {
      summary: 'Proactive preparation for 11:00 AM APAC Cloud Architecture Review with focus on zero-trust KMS and multi-agent concurrency.',
      bilingualSummary: {
        detectedLanguage: 'English',
        originalSummary: 'Proactive preparation for 11:00 AM APAC Cloud Architecture Review with focus on zero-trust KMS and multi-agent concurrency.',
        englishSummary: 'Proactive preparation for 11:00 AM APAC Cloud Architecture Review with focus on zero-trust KMS and multi-agent concurrency.',
        keyPhrases: ['11 AM Meeting', 'KMS envelope encryption', 'Team peace index']
      },
      moodAnalysis: {
        primaryMood: 'Inspired',
        secondaryMood: 'Reflective',
        valence: 0.82,
        arousal: 0.6,
        stressLevel: 2,
        tags: ['Leadership', 'High Focus', 'Preparation'],
        sentimentScore: 0.85
      },
      cognitiveStrengths: ['Proactive agenda setting', 'Holistic view of engineering excellence and team well-being'],
      reframeSuggestions: ['Lead the architecture review with calm confidence — your zero-trust design is rock-solid.'],
      socraticQuestions: [
        'What key outcome will make the 11 AM architecture review a resounding success?',
        'How can you ensure the team leaves the meeting feeling energized rather than drained?'
      ],
      microActions: [
        {
          id: 'act_004',
          title: 'Review KMS Architecture Slides',
          description: 'Double-check Cloud KMS key rotation policy before 11 AM.',
          timeframe: 'today',
          priority: 'high',
          completed: false,
          category: 'productivity'
        }
      ]
    }
  }
];

function MainAppContent() {
  const { currentLanguage } = useI18n();
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER_PROFILE);
  const [journals, setJournals] = useState<JournalEntry[]>(DEFAULT_INITIAL_JOURNALS);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(DEFAULT_INITIAL_JOURNALS[0]);
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
        if (userData.user) {
          setUser(userData.user);
        }
      }

      if (resJournals.ok) {
        const journalData = await resJournals.json();
        const loadedJournals: JournalEntry[] = journalData.journals || [];
        if (loadedJournals.length > 0) {
          setJournals(loadedJournals);
          setSelectedJournal(loadedJournals[0]);
        }
      }

      if (resGraph.ok) {
        const graphData = await resGraph.json();
        if (graphData.graph) {
          setKnowledgeGraph(graphData.graph);
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
            {/* 3D Virtual Voice Assistant Hero Widget */}
            <div className="max-w-4xl mx-auto w-full">
              <HomeCompanionHero
                userName={user?.displayName || 'Siva'}
                preferredLanguage={user?.preferredLanguage || 'English'}
                onJournalCreated={(newEntry) => {
                  setJournals(prev => [newEntry, ...prev]);
                  setSelectedJournal(newEntry);
                  setIsCreatingNew(false);
                }}
                onOpenFullModal={() => setShowLiveVoiceModal(true)}
              />
            </div>

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

                {/* Socratic Coach Quick Access Banner */}
                {selectedJournal.reflection && (
                  <div className="glass-card rounded-2xl p-5 border border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-indigo-500/5 to-transparent space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400 font-bold text-sm">
                          <Sparkles className="h-4 w-4" />
                          <span>Socratic Reflection Coach & Empathetic Chat</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                          Deep cognitive reframing, Socratic questions, and interactive coach dialogue ready in your dedicated workspace.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('reflection_coach')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs focus-ring flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer"
                      >
                        <span>Open Coach Workspace</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    {selectedJournal.reflection.microActions && selectedJournal.reflection.microActions.length > 0 && (
                      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Top Micro-Actions
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedJournal.reflection.microActions.slice(0, 2).map((action) => (
                            <div
                              key={action.id}
                              onClick={() => handleToggleAction(action.id, action.completed)}
                              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-teal-500/40 text-xs flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                              <span className={`h-4 w-4 rounded flex items-center justify-center border text-[10px] ${action.completed ? 'bg-teal-600 border-teal-600 text-white' : 'border-[var(--border-strong)]'}`}>
                                {action.completed && '✓'}
                              </span>
                              <span className={`truncate font-medium ${action.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                                {action.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Insights & Consistency Streak */}
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

      {/* 2. DEDICATED REFLECTION COACH & EMPATHETIC CHAT */}
      {activeTab === 'reflection_coach' && (
        <ReflectionCoachWorkspace
          journals={journals}
          selectedJournal={selectedJournal}
          onSelectJournal={setSelectedJournal}
          onUpdateJournal={handleUpdateJournal}
          onToggleAction={handleToggleAction}
        />
      )}

      {/* 2. MULTI-MODAL MEDIA STUDIO */}
      {activeTab === 'multimodal' && (
        <MultiModalMediaHub
          onJournalCreated={(newEntry) => {
            setJournals((prev) => [newEntry, ...prev.filter((j) => j.id !== newEntry.id)]);
            setSelectedJournal(newEntry);
          }}
          onNavigateToTimeline={() => setActiveTab('journal')}
        />
      )}

      {/* 3. SMART HEALTH & WEARABLES */}
      {activeTab === 'health_sync' && <SmartHealthTrackerView />}

      {/* 3. LIFESTYLE & LONGEVITY FLASHCARDS */}
      {activeTab === 'lifestyle_flashcards' && <LifestyleFlashcardsView />}

      {/* 4. PREDICTIVE LIFE & GOALS PLANNER */}
      {activeTab === 'life_planner' && <PredictiveLifePlannerView />}

      {/* 5. INSIGHTS & TRENDS */}
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
        <LiveVoiceAssistantModal
          isOpen={showLiveVoiceModal}
          onClose={() => setShowLiveVoiceModal(false)}
          preferredLanguage={currentLanguage}
          userName={user?.displayName || 'Siva'}
          onJournalCreated={(entry) => {
            setJournals((prev) => [entry, ...prev]);
            setSelectedJournal(entry);
            setActiveTab('journal');
            setShowLiveVoiceModal(false);
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
