/**
 * Core Type Definitions for Personal Gemini Journal
 * Multi-Agent System, Firestore Models, and MCP Tooling
 */

export type UserRole = 'user' | 'admin';

export type NavigationTab =
  | 'journal'
  | 'reflection_coach'
  | 'multimodal'
  | 'health_sync'
  | 'lifestyle_flashcards'
  | 'life_planner'
  | 'insights'
  | 'ask_history'
  | 'knowledge_graph'
  | 'about'
  | 'faq'
  | 'settings'
  | 'admin';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  preferredLanguage: string;
  bilingualOutput: boolean;
  avatarUrl?: string;
  theme: 'dark' | 'warm';
  createdTimestamp: number;
  lastActiveTimestamp: number;
  longTermProfile: {
    coreValues: string[];
    primaryGoals: string[];
    knownStressors: string[];
    positiveAnchors: string[];
    summary: string;
  };
}

export type MoodType =
  | 'Joyful'
  | 'Calm'
  | 'Melancholy'
  | 'Anxious'
  | 'Energized'
  | 'Frustrated'
  | 'Grateful'
  | 'Reflective'
  | 'Overwhelmed'
  | 'Inspired';

export interface LocationTag {
  placeName: string;
  latitude: number;
  longitude: number;
  privacyPrecision: 'exact' | 'neighborhood' | 'city';
}

export interface JournalAttachment {
  id: string;
  type: 'image' | 'audio';
  name: string;
  mimeType: string;
  dataUrl?: string;
  transcription?: string;
  uploadedAt: number;
}

export interface MicroAction {
  id: string;
  title: string;
  description: string;
  timeframe: 'today' | 'this_week' | 'habitual';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: 'wellness' | 'productivity' | 'mindset' | 'relationship' | 'rest';
}

export interface MoodAnalysis {
  primaryMood: MoodType;
  secondaryMood?: MoodType;
  valence: number; // -1.0 (Very Negative) to +1.0 (Very Positive)
  arousal: number; // 0.0 (Low Energy / Sleepy) to 1.0 (High Energy / Intense)
  stressLevel: number; // 1 to 10
  tags: string[];
  sentimentScore: number;
}

export interface BilingualSummary {
  detectedLanguage: string;
  originalSummary: string;
  englishSummary: string;
  keyPhrases: string[];
}

export interface ReflectionInsight {
  summary: string;
  bilingualSummary?: BilingualSummary;
  moodAnalysis: MoodAnalysis;
  cognitiveStrengths: string[];
  reframeSuggestions: string[];
  socraticQuestions: string[];
  microActions: MicroAction[];
  keyThemes: string[];
}

export interface JournalChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  language: string;
  createdAt: number;
  updatedAt: number;
  attachments?: JournalAttachment[];
  location?: LocationTag;
  reflection?: ReflectionInsight;
  tags: string[];
  wordCount: number;
  tokenCountEstimated: number;
  isArchived?: boolean;
  isSensitive?: boolean;
  detoxMode?: boolean;
  conversation?: JournalChatMessage[];
}

// ADK (Agent Development Kit) Workflow Models
export type AgentType =
  | 'orchestrator'
  | 'summarizer_reflection'
  | 'mood_classifier'
  | 'action_planner'
  | 'multilingual_agent'
  | 'context_optimizer';

export type AgentStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ADKAgentTraceStep {
  stepId: string;
  agentType: AgentType;
  agentName: string;
  status: AgentStepStatus;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  inputSnippet: string;
  outputSnippet?: string;
  reasoningTrace?: string;
  tokensConsumed: {
    input: number;
    output: number;
    total: number;
  };
  toolsInvoked?: string[];
  confidenceScore?: number;
}

export interface ADKWorkflowExecution {
  executionId: string;
  journalEntryId: string;
  workflowName: string;
  startedAt: number;
  completedAt?: number;
  totalDurationMs?: number;
  status: 'running' | 'completed' | 'failed';
  totalTokens: number;
  estimatedCostUsd: number;
  steps: ADKAgentTraceStep[];
}

// Knowledge Graph and GraphRAG Models
export interface GraphNode {
  id: string;
  label: string;
  type: 'Topic' | 'Goal' | 'Emotion' | 'Person' | 'Habit' | 'Location' | 'Value' | string;
  weight?: number; // frequency or importance
  connections?: number;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'Grateful' | 'Inspired' | 'Calm' | 'Reflective' | 'Restful' | string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship:
    | 'HAS_TOPIC'
    | 'RELATES_TO_GOAL'
    | 'TRIGGERS_EMOTION'
    | 'CO_OCCURS_WITH'
    | 'IMPROVES_WELLNESS'
    | 'ASSOCIATED_WITH_PLACE';
  weight: number;
  evidence: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  lastUpdated: number;
}

// MCP (Model Context Protocol) Server Tools
export interface MCPToolResult {
  toolName: string;
  server: 'bigquery_mcp' | 'pgvector_mcp' | 'graphrag_mcp';
  executionTimeMs: number;
  data: any;
  query: string;
}

// Notifications and Webhook Config
export interface NotificationConfig {
  userId: string;
  slackWebhookUrl?: string;
  discordWebhookUrl?: string;
  emailAlertsEnabled: boolean;
  triggers: {
    highStressAlert: boolean;
    weeklyReflectionDigest: boolean;
    goalReminder: boolean;
    unresolvedActionItems: boolean;
  };
  updatedAt: number;
}

export interface NotificationLog {
  id: string;
  userId: string;
  destination: 'slack' | 'discord' | 'email';
  triggerType: string;
  timestamp: number;
  status: 'delivered' | 'failed' | 'skipped';
  payloadSummary: string;
  errorMessage?: string;
}

// Admin RBAC & Audit
export interface SystemHealthMetrics {
  uptimeSeconds: number;
  cloudRunRegion: string;
  geminiModel: string;
  activeUsers24h: number;
  totalJournalEntries: number;
  totalReflectionsGenerated: number;
  totalTokensConsumed: number;
  averageLatencyMs: number;
  apiSuccessRate: number;
  mcpServerHealth: {
    bigquery: 'healthy' | 'degraded' | 'offline';
    pgvector: 'healthy' | 'degraded' | 'offline';
    graphrag: 'healthy' | 'degraded' | 'offline';
  };
  featureFlags: {
    enableLiveAudioTranscribe: boolean;
    enableBilingualReflections: boolean;
    enableGraphRagExpansion: boolean;
    enableExternalWebhooks: boolean;
    enableStrictModeRules: boolean;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  resource: string;
  ipAddressMasked: string;
  status: 'SUCCESS' | 'DENIED' | 'ERROR';
  details: string;
}
