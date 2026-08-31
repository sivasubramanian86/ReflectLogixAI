import {
  JournalEntry,
  UserProfile,
  KnowledgeGraphData,
  NotificationConfig,
  NotificationLog,
  AuditLogEntry,
  ADKWorkflowExecution
} from '../types';

// Multi-tenant in-memory store simulating Firestore database with strict userId tenancy
class FirestoreDatabaseStore {
  private users: Map<string, UserProfile> = new Map();
  private journals: Map<string, JournalEntry[]> = new Map(); // Key: userId
  private knowledgeGraphs: Map<string, KnowledgeGraphData> = new Map(); // Key: userId
  private notificationConfigs: Map<string, NotificationConfig> = new Map(); // Key: userId
  private notificationLogs: NotificationLog[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private workflowExecutions: Map<string, ADKWorkflowExecution[]> = new Map(); // Key: userId

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const adminUserId = 'user_kailasam_001';
    const adminEmail = 'kailasamsiva@gmail.com';

    // 1. Seed User Profile
    const adminProfile: UserProfile = {
      userId: adminUserId,
      email: adminEmail,
      displayName: 'Kailasam Siva',
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
    this.users.set(adminUserId, adminProfile);

    // 2. Seed Initial Journal Entries for Kailasam Siva
    const sampleJournals: JournalEntry[] = [
      {
        id: 'entry_001',
        userId: adminUserId,
        title: 'Dawn Reflections on Systems Architecture and Deep Work',
        content: `Today began with crisp morning stillness. I spent the first hour sketching the ADK agent orchestration graph for the new Cloud Run deployment.
Sometimes in the rush of shipping, I notice my cognitive bandwidth fragmenting. Taking thirty seconds to pause, breathe, and ground myself before jumping into complex distributed systems logic made a world of difference.
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
              title: '2-Minute Box Breathing before Deep Work',
              description: 'Incorporate 4-4-4-4 breathing cycle prior to complex debugging sessions.',
              timeframe: 'this_week',
              priority: 'medium',
              completed: false,
              category: 'wellness'
            }
          ],
          keyThemes: ['Engineering Craft', 'Cognitive Rest', 'Intentionality']
        }
      },
      {
        id: 'entry_002',
        userId: adminUserId,
        title: 'Meeting Rhythm & Work-Life Balance Recovery',
        content: `Navigating several back-to-back cross-functional architecture reviews today required significant mental energy. Rather than letting the meeting fatigue linger into the evening, I took a 20-minute walk outside and spent quality time with family.
Grounding in what truly matters instantly recharged my focus and reaffirmed my commitment to setting structured calendar buffers.`,
        language: 'English',
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        tags: ['Patience', 'FamilyAnchor', 'WorkLifeBalance', 'Productivity'],
        wordCount: 52,
        tokenCountEstimated: 75,
        location: {
          placeName: 'Chennai Innovation Corridor, TN',
          latitude: 13.0827,
          longitude: 80.2707,
          privacyPrecision: 'city'
        },
        reflection: {
          summary: 'Navigated heavy meeting fatigue by grounding in evening family time and an outdoor walk, demonstrating adaptive emotional recovery.',
          bilingualSummary: {
            detectedLanguage: 'English',
            originalSummary: 'Navigated heavy meeting fatigue by grounding in evening family time and an outdoor walk, demonstrating adaptive emotional recovery.',
            englishSummary: 'Navigated meeting fatigue by leaning into grounding family moments and recognizing personal patience as a core strength.',
            keyPhrases: ['Meeting fatigue', 'Outdoor walk', 'Family anchor']
          },
          moodAnalysis: {
            primaryMood: 'Grateful',
            secondaryMood: 'Calm',
            valence: 0.68,
            arousal: 0.38,
            stressLevel: 4,
            tags: ['Family Grounding', 'Emotional Resilience', 'Patience'],
            sentimentScore: 0.75
          },
          cognitiveStrengths: ['Rapid self-regulation', 'Appreciation of emotional anchors outside of work'],
          reframeSuggestions: ['Notice how quickly stress dissolves when reconnected with authentic personal values.'],
          socraticQuestions: [
            'How might you structure your meeting calendar to include mini-decompression buffers throughout the day?'
          ],
          microActions: [
            {
              id: 'act_003',
              title: 'Schedule 10-Minute Meeting Buffers',
              description: 'Set default calendar meeting lengths from 30m to 25m, 60m to 50m.',
              timeframe: 'this_week',
              priority: 'high',
              completed: false,
              category: 'productivity'
            }
          ],
          keyThemes: ['Resilience', 'Family Anchors', 'Work Boundaries']
        }
      }
    ];
    this.journals.set(adminUserId, sampleJournals);

    // 3. Seed Knowledge Graph
    const sampleGraph: KnowledgeGraphData = {
      lastUpdated: Date.now(),
      nodes: [
        { id: 'n_arch', label: 'Cloud Systems Architecture', type: 'Topic', weight: 8, sentiment: 'positive' },
        { id: 'n_calm', label: 'Mindful Calm', type: 'Emotion', weight: 7, sentiment: 'positive' },
        { id: 'n_sleep', label: 'Sleep Hygiene', type: 'Goal', weight: 6, sentiment: 'positive' },
        { id: 'n_meetings', label: 'Context Switching & Meetings', type: 'Topic', weight: 5, sentiment: 'negative' },
        { id: 'n_family', label: 'Family Time', type: 'Habit', weight: 8, sentiment: 'positive' },
        { id: 'n_bangalore', label: 'Bangalore Studio', type: 'Location', weight: 4, sentiment: 'neutral' },
        { id: 'n_chennai', label: 'Chennai Coast', type: 'Location', weight: 3, sentiment: 'positive' },
        { id: 'n_stress', label: 'Cognitive Fatigue', type: 'Emotion', weight: 4, sentiment: 'negative' }
      ],
      edges: [
        { id: 'e_1', source: 'n_arch', target: 'n_calm', relationship: 'IMPROVES_WELLNESS', weight: 0.8, evidence: 'Deep uninterrupted design yields satisfaction' },
        { id: 'e_2', source: 'n_meetings', target: 'n_stress', relationship: 'TRIGGERS_EMOTION', weight: 0.7, evidence: 'Back-to-back calls spike cognitive fatigue' },
        { id: 'e_3', source: 'n_family', target: 'n_calm', relationship: 'IMPROVES_WELLNESS', weight: 0.9, evidence: 'Evening family interaction restores energy' },
        { id: 'e_4', source: 'n_sleep', target: 'n_arch', relationship: 'RELATES_TO_GOAL', weight: 0.85, evidence: 'Solid sleep directly boosts architecture clarity' },
        { id: 'e_5', source: 'n_arch', target: 'n_bangalore', relationship: 'ASSOCIATED_WITH_PLACE', weight: 0.6, evidence: 'Main work laboratory' }
      ]
    };
    this.knowledgeGraphs.set(adminUserId, sampleGraph);

    // 4. Seed Notification Config
    const sampleNotifConfig: NotificationConfig = {
      userId: adminUserId,
      emailAlertsEnabled: true,
      slackWebhookUrl: '',
      discordWebhookUrl: '',
      triggers: {
        highStressAlert: true,
        weeklyReflectionDigest: true,
        goalReminder: true,
        unresolvedActionItems: false
      },
      updatedAt: Date.now()
    };
    this.notificationConfigs.set(adminUserId, sampleNotifConfig);

    // 5. Seed Initial Audit Logs
    this.auditLogs.push(
      {
        id: 'audit_001',
        timestamp: Date.now() - 86400000 * 2,
        userId: adminUserId,
        action: 'USER_AUTHENTICATED',
        resource: 'firebase_auth/token_verify',
        ipAddressMasked: '192.168.***.***',
        status: 'SUCCESS',
        details: 'Admin user session initialized via verified JWT'
      },
      {
        id: 'audit_002',
        timestamp: Date.now() - 86400000,
        userId: adminUserId,
        action: 'ADK_WORKFLOW_DISPATCH',
        resource: 'adk/multi_agent_journal_pipeline',
        ipAddressMasked: '192.168.***.***',
        status: 'SUCCESS',
        details: 'Generated bilingual reflection across 5 subagents'
      }
    );
  }

  // User methods
  public getUser(userId: string): UserProfile | undefined {
    return this.users.get(userId);
  }

  public getUserByEmail(email: string): UserProfile | undefined {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return u;
      }
    }
    return undefined;
  }

  public upsertUser(profile: UserProfile): UserProfile {
    this.users.set(profile.userId, profile);
    return profile;
  }

  // Journal methods with strict tenant isolation
  public getJournals(userId: string): JournalEntry[] {
    const list = this.journals.get(userId) || [];
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }

  public getJournalById(userId: string, entryId: string): JournalEntry | undefined {
    const list = this.journals.get(userId) || [];
    return list.find(e => e.id === entryId);
  }

  public createJournal(userId: string, entry: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const id = `entry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEntry: JournalEntry = {
      ...entry,
      id,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const list = this.journals.get(userId) || [];
    list.unshift(newEntry);
    this.journals.set(userId, list);

    this.logAudit(userId, 'JOURNAL_CREATE', `journals/${id}`, 'SUCCESS', `Created entry "${newEntry.title.substring(0, 30)}"`);
    return newEntry;
  }

  public updateJournal(userId: string, entryId: string, updates: Partial<JournalEntry>): JournalEntry | null {
    const list = this.journals.get(userId) || [];
    const index = list.findIndex(e => e.id === entryId);
    if (index === -1) return null;

    const existing = list[index];
    const updated: JournalEntry = {
      ...existing,
      ...updates,
      id: existing.id,
      userId: existing.userId, // Immutable
      createdAt: existing.createdAt, // Immutable
      updatedAt: Date.now()
    };
    list[index] = updated;
    this.journals.set(userId, list);
    return updated;
  }

  public addChatMessage(userId: string, entryId: string, message: { sender: 'user' | 'coach'; text: string }): JournalEntry | null {
    const list = this.journals.get(userId) || [];
    const index = list.findIndex(e => e.id === entryId);
    if (index === -1) return null;

    const existing = list[index];
    const conversation = existing.conversation || [];
    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender: message.sender,
      text: message.text,
      timestamp: Date.now()
    };

    const updated: JournalEntry = {
      ...existing,
      conversation: [...conversation, newMsg],
      updatedAt: Date.now()
    };

    list[index] = updated;
    this.journals.set(userId, list);
    return updated;
  }

  public deleteJournal(userId: string, entryId: string): boolean {
    const list = this.journals.get(userId) || [];
    const filtered = list.filter(e => e.id !== entryId);
    if (filtered.length === list.length) return false;
    this.journals.set(userId, filtered);
    this.logAudit(userId, 'JOURNAL_DELETE', `journals/${entryId}`, 'SUCCESS', 'Deleted journal record');
    return true;
  }

  // Knowledge Graph methods
  public getKnowledgeGraph(userId: string): KnowledgeGraphData {
    return this.knowledgeGraphs.get(userId) || { nodes: [], edges: [], lastUpdated: Date.now() };
  }

  public updateKnowledgeGraph(userId: string, data: KnowledgeGraphData): void {
    this.knowledgeGraphs.set(userId, data);
  }

  // Notifications
  public getNotificationConfig(userId: string): NotificationConfig {
    return this.notificationConfigs.get(userId) || {
      userId,
      emailAlertsEnabled: true,
      triggers: {
        highStressAlert: true,
        weeklyReflectionDigest: true,
        goalReminder: true,
        unresolvedActionItems: false
      },
      updatedAt: Date.now()
    };
  }

  public updateNotificationConfig(userId: string, config: Partial<NotificationConfig>): NotificationConfig {
    const existing = this.getNotificationConfig(userId);
    const updated: NotificationConfig = {
      ...existing,
      ...config,
      userId,
      updatedAt: Date.now()
    };
    this.notificationConfigs.set(userId, updated);
    return updated;
  }

  public logNotification(log: Omit<NotificationLog, 'id' | 'timestamp'>): NotificationLog {
    const entry: NotificationLog = {
      ...log,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    this.notificationLogs.unshift(entry);
    if (this.notificationLogs.length > 200) this.notificationLogs.pop();
    return entry;
  }

  public getNotificationLogs(userId?: string): NotificationLog[] {
    if (userId) {
      return this.notificationLogs.filter(l => l.userId === userId);
    }
    return this.notificationLogs;
  }

  // Audit Logs (RBAC Admin)
  public logAudit(userId: string, action: string, resource: string, status: 'SUCCESS' | 'DENIED' | 'ERROR', details: string, ip = '127.0.0.1'): void {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      userId,
      action,
      resource,
      ipAddressMasked: ip.includes('.') ? ip.split('.').slice(0, 2).join('.') + '.***.***' : 'masked_ip',
      status,
      details
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) this.auditLogs.pop();
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  // ADK Workflow trace tracking
  public recordWorkflowExecution(userId: string, execution: ADKWorkflowExecution): void {
    const list = this.workflowExecutions.get(userId) || [];
    list.unshift(execution);
    if (list.length > 50) list.pop();
    this.workflowExecutions.set(userId, list);
  }

  public getWorkflowExecutions(userId: string): ADKWorkflowExecution[] {
    return this.workflowExecutions.get(userId) || [];
  }

  // System stats for Admin dashboard
  public getSystemStats() {
    let totalJournals = 0;
    let totalReflections = 0;
    for (const list of this.journals.values()) {
      totalJournals += list.length;
      totalReflections += list.filter(j => !!j.reflection).length;
    }

    return {
      totalUsers: this.users.size,
      totalJournals,
      totalReflections,
      auditLogCount: this.auditLogs.length,
      notificationLogCount: this.notificationLogs.length
    };
  }
}

export const dbStore = new FirestoreDatabaseStore();
