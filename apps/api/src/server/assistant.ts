import { getGeminiClient, GEMINI_MODELS } from './gemini';
import { dbStore } from './storage';
import { BigQueryMCPToolbox, PgVectorMCPToolbox, GraphRAGMCPToolbox } from './mcp-tools';
import { ADKOrchestrationEngine } from './adk-agents';
import { JournalEntry, UserProfile } from '../types';

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantResponse {
  message: string;
  toolsUsed: Array<{
    name: string;
    description: string;
    data?: any;
  }>;
  createdEntry?: JournalEntry;
}

/**
 * Live Virtual Assistant Service powered by Gemini 3.7 Flash
 * Provides real-time conversational intelligence, Agentic RAG,
 * BigQuery analytics, subagent mesh delegation, and daily summary generation.
 */
export class LiveAssistantService {
  public static async processConversation(
    userId: string,
    messages: AssistantMessage[],
    preferredLanguage = 'English'
  ): Promise<AssistantResponse> {
    const userProfile = dbStore.getUser(userId) || {
      userId,
      displayName: 'Siva',
      preferredLanguage: 'English',
      longTermProfile: { summary: 'Mindful Cloud Architect' }
    } as UserProfile;

    const journals = dbStore.getJournals(userId);
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';

    const toolsUsed: Array<{ name: string; description: string; data?: any }> = [];

    // Analyze intent to see if MCP tools or subagents should be proactively invoked
    const lower = lastUserMsg.toLowerCase();
    let ragContext = '';
    let analyticsContext = '';
    let subagentContext = '';
    let createdEntry: JournalEntry | undefined = undefined;

    // 1. Check if user requests a daily summary or day's reflection
    if (lower.includes('daily summary') || lower.includes('summarize today') || lower.includes('today\'s summary') || lower.includes('summarize my day')) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayJournals = journals.filter(j => j.createdAt >= todayStart.getTime());

      toolsUsed.push({
        name: 'daily_summary_generator',
        description: `Aggregated ${todayJournals.length} entries logged today for synthesis.`
      });

      if (todayJournals.length === 0) {
        ragContext += `\n[Context: User has not written any journal entries yet today. Offer to listen to their thoughts right now and create their first reflection.]\n`;
      } else {
        const combinedContent = todayJournals.map(j => `Entry "${j.title}": ${j.content}`).join('\n\n');
        const wordCount = combinedContent.split(/\s+/).length;
        
        // Prepare temporary entry object for workflow
        const tempEntry: JournalEntry = {
          id: `temp_${Date.now()}`,
          userId,
          title: `Daily Summary: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          content: `Consolidated daily reflection from ${todayJournals.length} moments:\n\n${combinedContent.substring(0, 3000)}`,
          language: preferredLanguage,
          wordCount,
          tokenCountEstimated: Math.ceil(wordCount * 1.35),
          tags: ['DailySummary', 'Mindfulness', 'AICompanion'],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        const { reflection } = await ADKOrchestrationEngine.executeJournalWorkflow(
          userId,
          tempEntry,
          preferredLanguage,
          true
        );

        // Persist to store via createJournal
        createdEntry = dbStore.createJournal(userId, {
          title: tempEntry.title,
          content: tempEntry.content,
          language: tempEntry.language,
          tags: tempEntry.tags,
          wordCount: tempEntry.wordCount,
          tokenCountEstimated: tempEntry.tokenCountEstimated,
          reflection
        });

        GraphRAGMCPToolbox.expandGraphFromJournal(userId, createdEntry);

        toolsUsed.push({
          name: 'adk_agent_mesh',
          description: `Dispatched Reflection Coach, Mood Classifier, and Action Planner for today's summary.`,
          data: { title: createdEntry.title, mood: reflection.moodAnalysis.primaryMood, actionsCount: reflection.microActions.length }
        });

        ragContext += `\n[Context: Generated and saved official daily summary "${createdEntry.title}" with primary mood "${reflection.moodAnalysis.primaryMood}" and ${reflection.microActions.length} micro-actions.]\n`;
      }
    }

    // 2. Check if user asks about past feelings, memories, or specific topics (pgvector RAG)
    if (lower.includes('past') || lower.includes('earlier') || lower.includes('stress') || lower.includes('remember') || lower.includes('when did') || lower.includes('recall') || lower.includes('feel about')) {
      const searchResult = await PgVectorMCPToolbox.semanticSearch(userId, lastUserMsg, 3);
      toolsUsed.push({
        name: 'pgvector_semantic_rag',
        description: `Queried Cloud SQL pgvector semantic embeddings for "${lastUserMsg}". Found ${searchResult.data.matchesCount} relevant memory matches.`,
        data: searchResult.data.results
      });

      if (searchResult.data.results.length > 0) {
        ragContext += `\n[Relevant Past Memories from pgvector RAG]:\n` +
          searchResult.data.results.map((r: any) => `- "${r.title}" (${r.primaryMood}): ${r.snippet}`).join('\n');
      }
    }

    // 3. Check if user asks about analytics, trends, streaks, or metrics (BigQuery MCP)
    if (lower.includes('trend') || lower.includes('analytics') || lower.includes('streak') || lower.includes('metric') || lower.includes('how often') || lower.includes('average mood') || lower.includes('statistics')) {
      const bqResult = await BigQueryMCPToolbox.executeAnalyticsQuery(userId, 30);
      toolsUsed.push({
        name: 'bigquery_analytics_mcp',
        description: `Executed BigQuery SQL aggregation: Average stress score ${bqResult.data.averageStressIndex}/10, Average valence ${bqResult.data.averageEmotionalValence}.`,
        data: bqResult.data
      });

      analyticsContext += `\n[BigQuery Analytics (Past 30 Days)]: Total entries: ${bqResult.data.totalEntries}, Average Stress: ${bqResult.data.averageStressIndex}/10, Average Valence: ${bqResult.data.averageEmotionalValence}, Top Topics: ${bqResult.data.topTags.map((t: any) => t.tag).join(', ')}.`;
    }

    // Prepare system instructions for Gemini 3.7
    const systemPrompt = `You are "Nova", the empathetic, articulate, and intelligent Live Virtual Voice Assistant for ReflectLogixAI.
Your purpose:
1. Greet the user warmly by name (${userProfile.displayName || 'friend'}), speaking with natural conversational cadence, warmth, and supportive wisdom (like Gemini Live).
2. You have deep knowledge of ReflectLogixAI: It is a privacy-first personal journal with 5 life areas (Work, Health, Relationships, Growth, Creativity), Socratic cognitive reframing, 3 daily micro-actions, and consistency streaks.
3. You have access to real-time tools: Cloud SQL pgvector semantic RAG, BigQuery analytics, GraphRAG, and Google ADK subagent mesh (Mood Classifier, Reflection Coach, Action Planner, Localization).
4. If contextual memories or analytics are provided below, weave them seamlessly into your conversational response without sounding like a robotic database dump.
5. Keep your spoken responses concise, engaging, and empathetic (2-4 sentences max per conversational turn unless summarizing).
6. Language: Respond naturally in ${preferredLanguage}.

${ragContext}
${analyticsContext}
${subagentContext}`;

    try {
      const gemini = getGeminiClient();
      const promptText = `${systemPrompt}\n\nUser: ${lastUserMsg}\nNova:`;

      const response = await gemini.models.generateContent({
        model: GEMINI_MODELS.DEFAULT_ORCHESTRATOR,
        contents: promptText,
        config: {
          temperature: 0.7,
          maxOutputTokens: 600,
        }
      });

      const responseText = response.text?.trim() || `I'm here with you, ${userProfile.displayName || 'friend'}. How can I support your reflections today?`;

      return {
        message: responseText,
        toolsUsed,
        createdEntry
      };
    } catch (err: any) {
      console.error('[LiveAssistant] Gemini execution error:', err);
      const fallbackMsg = `Hello ${userProfile.displayName || 'friend'}! I'm your ReflectLogixAI companion. I'm connected to your journal memories and ready to reflect, recall past themes, or summarize your day. What's on your mind?`;
      return {
        message: fallbackMsg,
        toolsUsed,
        createdEntry
      };
    }
  }

  /**
   * Generates a consolidated daily summary entry on demand
   */
  public static async generateDailySummary(userId: string, preferredLanguage = 'English'): Promise<JournalEntry> {
    const journals = dbStore.getJournals(userId);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayJournals = journals.filter(j => j.createdAt >= todayStart.getTime());

    const combined = todayJournals.length > 0
      ? todayJournals.map(j => `• ${j.title}: ${j.content}`).join('\n\n')
      : 'Reflected on daily mindfulness, personal growth, and focused priorities.';
    const wordCount = combined.split(/\s+/).length;

    const tempEntry: JournalEntry = {
      id: `temp_${Date.now()}`,
      userId,
      title: `Daily Summary: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      content: `Consolidated daily reflection:\n\n${combined}`,
      language: preferredLanguage,
      wordCount,
      tokenCountEstimated: Math.ceil(wordCount * 1.35),
      tags: ['DailySummary', 'Mindfulness', 'AICompanion'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const { reflection } = await ADKOrchestrationEngine.executeJournalWorkflow(
      userId,
      tempEntry,
      preferredLanguage,
      true
    );

    const savedEntry = dbStore.createJournal(userId, {
      title: tempEntry.title,
      content: tempEntry.content,
      language: tempEntry.language,
      tags: tempEntry.tags,
      wordCount: tempEntry.wordCount,
      tokenCountEstimated: tempEntry.tokenCountEstimated,
      reflection
    });

    GraphRAGMCPToolbox.expandGraphFromJournal(userId, savedEntry);

    return savedEntry;
  }
}
