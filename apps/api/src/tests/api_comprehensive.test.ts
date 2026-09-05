import { describe, it, expect, beforeEach } from 'vitest';
import { dbStore } from '../server/storage';
import { ADKOrchestrationEngine } from '../server/adk-agents';
import { BigQueryMCPToolbox, PgVectorMCPToolbox, GraphRAGMCPToolbox } from '../server/mcp-tools';
import { ExternalNotificationDispatcher } from '../server/notifications';
import { LLMSecurityGuardrail } from '../server/security';
import { JournalEntry, UserProfile } from '../types';

describe('ReflectLogixAI Enterprise Backend & MCP Tooling Test Suite', () => {
  const testUserId = 'user_test_comprehensive_001';

  beforeEach(() => {
    dbStore.upsertUser({
      userId: testUserId,
      displayName: 'Sivasubramanian Test',
      email: 'siva.test@example.com',
      role: 'admin',
      preferredLanguage: 'English',
      bilingualOutput: true,
      theme: 'dark',
      createdTimestamp: Date.now(),
      lastActiveTimestamp: Date.now(),
      longTermProfile: {
        coreValues: ['Integrity', 'Architectural Excellence'],
        primaryGoals: ['Build scalable AI systems'],
        knownStressors: ['Tight deadlines'],
        positiveAnchors: ['Deep work'],
        summary: 'Cloud AI Architect'
      }
    });
  });

  // 1. User Storage & RBAC Tests
  it('should manage user profile and persistence correctly', () => {
    const user = dbStore.getUser(testUserId);
    expect(user).toBeDefined();
    expect(user?.displayName).toBe('Sivasubramanian Test');
    expect(user?.role).toBe('admin');

    const updated = dbStore.upsertUser({
      ...user!,
      theme: 'warm'
    });
    expect(updated.theme).toBe('warm');
  });

  // 2. Journal CRUD & Tenant Isolation Tests
  it('should create, retrieve, and isolate user journals', () => {
    const entry1 = dbStore.createJournal(testUserId, {
      title: 'Deep Work on Cloud Run',
      content: 'Architected serverless microservices with sub-second cold starts.',
      language: 'English',
      tags: ['CloudRun', 'Architecture'],
      wordCount: 10,
      tokenCountEstimated: 14
    });

    expect(entry1.id).toBeDefined();
    expect(entry1.userId).toBe(testUserId);

    const userJournals = dbStore.getJournals(testUserId);
    expect(userJournals.length).toBeGreaterThanOrEqual(1);

    // Verify tenant isolation: other user cannot see entry1
    const otherUserJournals = dbStore.getJournals('other_tenant_user_999');
    expect(otherUserJournals.find(j => j.id === entry1.id)).toBeUndefined();
  });

  it('should delete journals cleanly', () => {
    const entry = dbStore.createJournal(testUserId, {
      title: 'Temporary Note',
      content: 'Testing deletion cycle.',
      language: 'English',
      tags: ['Test'],
      wordCount: 3,
      tokenCountEstimated: 5
    });

    const deleted = dbStore.deleteJournal(testUserId, entry.id);
    expect(deleted).toBe(true);

    const check = dbStore.getJournals(testUserId).find(j => j.id === entry.id);
    expect(check).toBeUndefined();
  });

  // 3. ADK Multi-Agent Workflow Engine Tests
  it('should execute full 5-agent ADK reflection workflow in parallel', async () => {
    const sampleEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      userId: testUserId,
      title: 'Navigating High Stakes Deadlines',
      content: 'Felt very tense about the architecture review, but taking a mindful pause helped clear mental fatigue.',
      language: 'English',
      wordCount: 19,
      tokenCountEstimated: 26,
      tags: ['Work', 'Mindfulness'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const result = await ADKOrchestrationEngine.executeJournalWorkflow(
      testUserId,
      sampleEntry,
      'Tamil',
      true
    );

    expect(result.reflection).toBeDefined();
    expect(result.reflection.moodAnalysis).toBeDefined();
    expect(result.reflection.socraticQuestions.length).toBeGreaterThanOrEqual(2);
    expect(result.reflection.microActions.length).toBeGreaterThanOrEqual(2);
    expect(result.workflowExecution.steps.length).toBeGreaterThanOrEqual(4);
    expect(result.workflowExecution.totalDurationMs).toBeGreaterThan(0);
  });

  // 4. MCP Tools: BigQuery, pgvector, GraphRAG
  it('should query BigQuery MCP toolbox for aggregated metrics', async () => {
    const result = await BigQueryMCPToolbox.executeAnalyticsQuery(testUserId, 30);
    expect(result.server).toBe('bigquery_mcp');
    expect(result.data.periodDays).toBe(30);
    expect(result.data.averageStressIndex).toBeGreaterThanOrEqual(1);
    expect(result.data.activeWritingStreakDays).toBeGreaterThanOrEqual(0);
  });

  it('should perform semantic search via Cloud SQL pgvector MCP toolbox', async () => {
    const result = await PgVectorMCPToolbox.semanticSearch(testUserId, 'anxiety and burnout', 3);
    expect(result.server).toBe('pgvector_mcp');
    expect(result.data.matchesCount).toBeGreaterThanOrEqual(0);
  });

  it('should expand knowledge graph via GraphRAG MCP toolbox', async () => {
    const testEntry: JournalEntry = {
      id: 'graph_test_1',
      userId: testUserId,
      title: 'Health and Focus Harmony',
      content: 'Walking 10,000 steps daily directly improved my coding endurance and sleep quality.',
      language: 'English',
      wordCount: 14,
      tokenCountEstimated: 19,
      tags: ['Health', 'Focus', 'Sleep'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await GraphRAGMCPToolbox.expandGraphFromJournal(testUserId, testEntry);
    const graphResult = await GraphRAGMCPToolbox.getEntityKnowledgeGraph(testUserId);
    expect(graphResult.data.nodes.length).toBeGreaterThanOrEqual(3);
    expect(graphResult.data.edges.length).toBeGreaterThanOrEqual(1);
  });

  // 5. Notifications Dispatcher
  it('should handle webhook notification dispatch gracefully', async () => {
    const dispatchResult = await ExternalNotificationDispatcher.dispatchNotification(
      {
        userId: testUserId,
        triggerType: 'testDispatch',
        title: 'CI Test Alert',
        summarySnippet: 'Test notification message from CI suite'
      },
      'https://hooks.slack.com/services/T000/B000/XXXX'
    );

    expect(dispatchResult.success).toBe(true);
    expect(dispatchResult.channels).toContain('slack');
  });

  // 6. Security Audit Logging & Rate Limiting
  it('should log audit entries and enforce rate limiting', () => {
    dbStore.logAudit(
      testUserId,
      'TEST_AUDIT_ACTION',
      'system/test',
      'SUCCESS',
      'Unit test audit verification entry'
    );

    const logs = dbStore.getAuditLogs();
    expect(logs.length).toBeGreaterThanOrEqual(1);
    const lastLog = logs[0];
    expect(lastLog.userId).toBe(testUserId);
    expect(lastLog.action).toBe('TEST_AUDIT_ACTION');

    // Rate Limiting
    const rateCheck = LLMSecurityGuardrail.checkRateLimit('client_unit_test_ip', 100, 60000);
    expect(rateCheck.allowed).toBe(true);
    expect(rateCheck.remaining).toBe(99);
  });
});
