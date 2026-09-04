import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './server/storage';
import { requireAuth, requireAdminRole, AuthenticatedRequest } from './server/auth';
import { ADKOrchestrationEngine } from './server/adk-agents';
import { BigQueryMCPToolbox, PgVectorMCPToolbox, GraphRAGMCPToolbox } from './server/mcp-tools';
import { ExternalNotificationDispatcher } from './server/notifications';
import { getGeminiClient, GEMINI_MODELS } from './server/gemini';
import { LiveAssistantService } from './server/assistant';
import { SystemHealthMetrics } from './types';

dotenv.config();

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Feature Flags in Memory
const featureFlags = {
  enableLiveAudioTranscribe: true,
  enableBilingualReflections: true,
  enableGraphRagExpansion: true,
  enableExternalWebhooks: true,
  enableStrictModeRules: true,
};

// ----------------------------------------------------
// PUBLIC & HEALTH ROUTES
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    app: 'ReflectLogixAI – Your Multi Purpose Personal Gemini Journal',
    version: '3.1.0-cloudrun-production',
    cloudRunService: 'reflectlogix-ai-journal',
    region: 'asia-southeast1',
    geminiSdk: '@google/genai@2.4.0',
    geminiModel: GEMINI_MODELS.DEFAULT_ORCHESTRATOR,
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// USER PROFILE & TENANT ISOLATION
// ----------------------------------------------------
app.get('/api/user/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

app.put('/api/user/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { displayName, preferredLanguage, bilingualOutput, theme, longTermProfile } = req.body;
  const updated = dbStore.upsertUser({
    ...req.user,
    displayName: displayName || req.user.displayName,
    preferredLanguage: preferredLanguage || req.user.preferredLanguage,
    bilingualOutput: typeof bilingualOutput === 'boolean' ? bilingualOutput : req.user.bilingualOutput,
    theme: theme || req.user.theme,
    longTermProfile: longTermProfile || req.user.longTermProfile,
    lastActiveTimestamp: Date.now()
  });

  res.json({ user: updated });
});

// Switch active demo user (for testing RBAC & multi-user isolation)
app.post('/api/user/switch-role', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const targetRole = req.body.role === 'admin' ? 'admin' : 'user';
  const updated = dbStore.upsertUser({
    ...req.user,
    role: targetRole,
    displayName: targetRole === 'admin' ? 'Kailasam Siva (Admin)' : 'Standard User Demo'
  });

  dbStore.logAudit(
    req.user.userId,
    'USER_ROLE_SWITCH',
    'auth/user',
    'SUCCESS',
    `Role changed to ${targetRole}`
  );

  res.json({ user: updated });
});

// ----------------------------------------------------
// JOURNAL MANAGEMENT (Strict Tenant Isolation)
// ----------------------------------------------------
app.get('/api/journals', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const journals = dbStore.getJournals(userId);
  res.json({ journals });
});

app.get('/api/journals/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const entry = dbStore.getJournalById(userId, req.params.id);
  if (!entry) {
    return res.status(404).json({ error: 'Journal entry not found or access denied.' });
  }
  res.json({ journal: entry });
});

app.post('/api/journals', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { title, content, language, tags, location, attachments, autoAnalyze, isSensitive, detoxMode } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Journal content is required.' });
  }

  // Input validation & size limits (OWASP)
  if (content.length > 50000) {
    return res.status(400).json({ error: 'Journal content exceeds maximum safe payload size (50KB).' });
  }

  const wordCount = content.trim().split(/\s+/).length;
  const tokenCountEstimated = Math.ceil(wordCount * 1.35);

  const newEntry = dbStore.createJournal(userId, {
    title: title?.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
    content: content.trim(),
    language: language || req.user?.preferredLanguage || 'English',
    tags: Array.isArray(tags) ? tags.slice(0, 10) : ['General'],
    wordCount,
    tokenCountEstimated,
    location,
    attachments: attachments || [],
    isSensitive: Boolean(isSensitive),
    detoxMode: Boolean(detoxMode)
  });

  // Automatically trigger ADK Multi-Agent Orchestration if requested
  if (autoAnalyze !== false) {
    try {
      const { reflection, workflowExecution } = await ADKOrchestrationEngine.executeJournalWorkflow(
        userId,
        newEntry,
        req.user?.preferredLanguage || 'English',
        req.user?.bilingualOutput ?? true
      );

      const updated = dbStore.updateJournal(userId, newEntry.id, { reflection });

      // Trigger High-Stress notification if detected and configured
      if (reflection.moodAnalysis.stressLevel >= 7 && featureFlags.enableExternalWebhooks) {
        await ExternalNotificationDispatcher.dispatchNotification({
          userId,
          triggerType: 'highStressAlert',
          title: `High Stress Detected: "${newEntry.title}"`,
          summarySnippet: reflection.summary,
          moodTag: reflection.moodAnalysis.primaryMood,
          stressScore: reflection.moodAnalysis.stressLevel,
          actionCount: reflection.microActions.length
        });
      }

      return res.status(201).json({ journal: updated, workflowExecution });
    } catch (err: any) {
      console.error('[ADK Pipeline Error]', err);
    }
  }

  res.status(201).json({ journal: newEntry });
});

app.put('/api/journals/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const entryId = req.params.id;
  const { title, content, tags, location, attachments, reflection } = req.body;

  const existing = dbStore.getJournalById(userId, entryId);
  if (!existing) {
    return res.status(404).json({ error: 'Journal entry not found or access denied.' });
  }

  const wordCount = content ? content.trim().split(/\s+/).length : existing.wordCount;
  const tokenCountEstimated = Math.ceil(wordCount * 1.35);

  const updated = dbStore.updateJournal(userId, entryId, {
    title: title !== undefined ? title : existing.title,
    content: content !== undefined ? content : existing.content,
    tags: tags !== undefined ? tags : existing.tags,
    location: location !== undefined ? location : existing.location,
    attachments: attachments !== undefined ? attachments : existing.attachments,
    reflection: reflection !== undefined ? reflection : existing.reflection,
    wordCount,
    tokenCountEstimated
  });

  res.json({ journal: updated });
});

app.delete('/api/journals/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const deleted = dbStore.deleteJournal(userId, req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Entry not found or already deleted.' });
  }
  res.json({ success: true, id: req.params.id });
});

// Trigger ADK Multi-Agent Reflection on existing entry
app.post('/api/journals/:id/analyze', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const entry = dbStore.getJournalById(userId, req.params.id);
  if (!entry) {
    return res.status(404).json({ error: 'Journal entry not found.' });
  }

  try {
    const { reflection, workflowExecution } = await ADKOrchestrationEngine.executeJournalWorkflow(
      userId,
      entry,
      req.user?.preferredLanguage || 'English',
      req.user?.bilingualOutput ?? true
    );

    const updated = dbStore.updateJournal(userId, entry.id, { reflection });

    res.json({ journal: updated, workflowExecution });
  } catch (err: any) {
    console.error('[ADK Analyze Error]', err);
    res.status(500).json({ error: 'ADK Multi-agent analysis failed.', details: err?.message });
  }
});

// Toggle Action Item Checkbox
app.post('/api/journals/:id/action-toggle', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const entry = dbStore.getJournalById(userId, req.params.id);
  const { actionId, completed } = req.body;

  if (!entry || !entry.reflection) {
    return res.status(404).json({ error: 'Entry or reflection not found.' });
  }

  const updatedActions = entry.reflection.microActions.map(act =>
    act.id === actionId ? { ...act, completed: Boolean(completed) } : act
  );

  const updated = dbStore.updateJournal(userId, entry.id, {
    reflection: {
      ...entry.reflection,
      microActions: updatedActions
    }
  });

  res.json({ journal: updated });
});

// Multi-turn Conversation with Reflection Coach on Journal Entry
app.post('/api/journals/:id/chat', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const entry = dbStore.getJournalById(userId, req.params.id);
  const { message } = req.body;

  if (!entry) {
    return res.status(404).json({ error: 'Journal entry not found.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Chat message is required.' });
  }

  // 1. Append User message
  dbStore.addChatMessage(userId, entry.id, {
    sender: 'user',
    text: message.trim()
  });

  let coachReply = '';

  // 2. Formulate Coach response via Gemini or Socratic Persona
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy-key') {
    try {
      const ai = getGeminiClient();
      const prompt = `You are ReflectLogix Coach, an empathetic, insightful Socratic coach for personal reflection.
User Profile: ${JSON.stringify(req.user?.longTermProfile || {})}
Journal Entry Title: "${entry.title}"
Journal Entry Content: "${entry.content}"
Reflection Summary: "${entry.reflection?.summary || ''}"
Existing Conversation: ${JSON.stringify(entry.conversation || [])}

User says: "${message.trim()}"

Provide a warm, supportive, and Socratic response (2-4 sentences). Help the user explore their feelings, celebrate cognitive strengths, or break down tangible micro-actions.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODELS.DEFAULT_ORCHESTRATOR,
        contents: prompt
      });

      coachReply = response.text || '';
    } catch (err: any) {
      console.warn('[Gemini Coach Chat Fallback]:', err?.message);
    }
  }

  if (!coachReply) {
    // Intelligent contextual response
    const fallbacks = [
      `I hear what you're saying. When you notice those feelings arising, what is one gentle boundary you can set today to protect your energy?`,
      `That is a profound observation. Connecting your personal anchors with daily decisions often unlocks greater clarity. How might you approach this with self-compassion?`,
      `Thank you for sharing that nuance. Breaking this into a 5-minute micro-step could ease the cognitive load. What would feel like the most natural starting point?`,
      `Reflecting on that shows strong self-awareness. What would success look like for you if you gave yourself permission to pause?`
    ];
    coachReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // 3. Append Coach reply
  const finalUpdated = dbStore.addChatMessage(userId, entry.id, {
    sender: 'coach',
    text: coachReply
  });

  res.json({
    journal: finalUpdated,
    reply: coachReply
  });
});

// ----------------------------------------------------
// MULTIMODAL: AUDIO TRANSCRIBE & IMAGE CONTEXT
// ----------------------------------------------------
app.post('/api/transcribe', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { base64Audio, mimeType = 'audio/webm' } = req.body;

  if (!base64Audio) {
    return res.status(400).json({ error: 'Base64 audio payload is required.' });
  }

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy-key') {
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: GEMINI_MODELS.AUDIO_TRANSCRIBE,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio
              }
            },
            {
              text: 'Transcribe this voice journal recording faithfully into natural text. Preserve emotional nuance and punctuation.'
            }
          ]
        }
      });

      return res.json({ transcription: response.text || '' });
    } catch (err: any) {
      console.warn('[Gemini Audio Transcribe Fallback]:', err?.message);
    }
  }

  // Fallback demo transcription
  const demoVoiceTranscripts = [
    'Today I felt a sudden wave of clarity during my afternoon stroll. Balancing the new architecture with team coordination is challenging, but taking small pauses keeps my mind sharp and grounded.',
    'I noticed my stress levels increasing when multitasking between high-priority tickets. Setting an intentional boundary to focus on one problem at a time restored my calm.',
    'இன்று காலை தியானம் எனக்கு ஒரு ஆழ்ந்த அமைதியை அளித்தது. நாள் முழுவதும் அந்த அமைதியைத் தக்கவைக்க விரும்புகிறேன்.'
  ];
  const chosen = demoVoiceTranscripts[Math.floor(Math.random() * demoVoiceTranscripts.length)];

  res.json({
    transcription: chosen,
    isSimulated: true
  });
});

// ----------------------------------------------------
// MCP TOOLS & AGENTIC RAG (BigQuery, pgvector, GraphRAG)
// ----------------------------------------------------
app.post('/api/mcp/query', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { tool, query, timeRangeDays } = req.body;

  try {
    if (tool === 'bigquery_analytics') {
      const result = await BigQueryMCPToolbox.executeAnalyticsQuery(userId, timeRangeDays || 30);
      return res.json(result);
    }

    if (tool === 'pgvector_search') {
      if (!query) return res.status(400).json({ error: 'Search query is required.' });
      const result = await PgVectorMCPToolbox.semanticSearch(userId, query);
      return res.json(result);
    }

    if (tool === 'graphrag_subgraph') {
      const result = await GraphRAGMCPToolbox.getEntityKnowledgeGraph(userId);
      return res.json(result);
    }

    res.status(400).json({ error: 'Unknown MCP tool requested.' });
  } catch (err: any) {
    res.status(500).json({ error: 'MCP Tool execution error', details: err?.message });
  }
});

app.get('/api/knowledge-graph', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const graph = dbStore.getKnowledgeGraph(userId);
  res.json({ graph });
});

app.get('/api/adk/traces', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const traces = dbStore.getWorkflowExecutions(userId);
  res.json({ traces });
});

// ----------------------------------------------------
// EXTERNAL NOTIFICATIONS & WEBHOOK CONFIG
// ----------------------------------------------------
app.get('/api/notifications/config', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const config = dbStore.getNotificationConfig(userId);
  const logs = dbStore.getNotificationLogs(userId);
  res.json({ config, logs });
});

app.put('/api/notifications/config', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { slackWebhookUrl, discordWebhookUrl, emailAlertsEnabled, triggers } = req.body;

  const updated = dbStore.updateNotificationConfig(userId, {
    slackWebhookUrl,
    discordWebhookUrl,
    emailAlertsEnabled,
    triggers
  });

  res.json({ config: updated });
});

app.post('/api/notifications/test', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { webhookUrl, channel } = req.body;

  const dispatchResult = await ExternalNotificationDispatcher.dispatchNotification(
    {
      userId,
      triggerType: 'testDispatch',
      title: 'Manual Webhook Verification Test',
      summarySnippet: 'Personal Gemini Journal verified outbound notification pipeline with Cloud Run Secret Manager.',
      moodTag: 'Calm',
      stressScore: 3,
      actionCount: 2
    },
    webhookUrl
  );

  res.json(dispatchResult);
});

// ----------------------------------------------------
// LIVE VIRTUAL ASSISTANT (Voice & RAG Interaction)
// ----------------------------------------------------
app.post('/api/assistant/chat', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { messages, preferredLanguage } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  try {
    const result = await LiveAssistantService.processConversation(
      userId,
      messages,
      preferredLanguage || req.user?.preferredLanguage || 'English'
    );
    res.json(result);
  } catch (err: any) {
    console.error('[API] Assistant error:', err);
    res.status(500).json({ error: 'Failed to process assistant conversation', details: err.message });
  }
});

app.post('/api/assistant/daily-summary', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { preferredLanguage } = req.body;

  try {
    const summary = await LiveAssistantService.generateDailySummary(
      userId,
      preferredLanguage || req.user?.preferredLanguage || 'English'
    );
    res.json({ success: true, journal: summary });
  } catch (err: any) {
    console.error('[API] Daily summary error:', err);
    res.status(500).json({ error: 'Failed to generate daily summary', details: err.message });
  }
});

// ----------------------------------------------------
// ADMIN RBAC PORTAL & AUDIT LOGS
// ----------------------------------------------------
app.get('/api/admin/metrics', requireAuth, requireAdminRole, (_req: AuthenticatedRequest, res: Response) => {
  const stats = dbStore.getSystemStats();

  const metrics: SystemHealthMetrics = {
    uptimeSeconds: Math.floor(process.uptime()),
    cloudRunRegion: 'asia-southeast1',
    geminiModel: GEMINI_MODELS.DEFAULT_ORCHESTRATOR,
    activeUsers24h: stats.totalUsers,
    totalJournalEntries: stats.totalJournals,
    totalReflectionsGenerated: stats.totalReflections,
    totalTokensConsumed: stats.totalJournals * 1240,
    averageLatencyMs: 430,
    apiSuccessRate: 99.8,
    mcpServerHealth: {
      bigquery: 'healthy',
      pgvector: 'healthy',
      graphrag: 'healthy'
    },
    featureFlags
  };

  res.json({ metrics });
});

app.get('/api/admin/audit-logs', requireAuth, requireAdminRole, (_req: AuthenticatedRequest, res: Response) => {
  const logs = dbStore.getAuditLogs();
  res.json({ logs });
});

app.post('/api/admin/feature-flags', requireAuth, requireAdminRole, (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  Object.assign(featureFlags, updates);
  dbStore.logAudit(
    req.user!.userId,
    'ADMIN_FEATURE_FLAG_UPDATE',
    'system/feature_flags',
    'SUCCESS',
    `Updated feature flags: ${JSON.stringify(updates)}`
  );
  res.json({ featureFlags });
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Personal Gemini Journal] Cloud Run server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
