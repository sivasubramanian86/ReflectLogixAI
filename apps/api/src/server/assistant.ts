import { getGeminiClient, GEMINI_MODELS } from './gemini';
import { dbStore } from './storage';
import { BigQueryMCPToolbox, PgVectorMCPToolbox, GraphRAGMCPToolbox } from './mcp-tools';
import { ADKOrchestrationEngine } from './adk-agents';
import { LLMSecurityGuardrail } from './security';
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

export function getMultilingualFallbackGreeting(displayName: string, lang: string): string {
  const l = (lang || '').toLowerCase();
  if (l.includes('tamil') || l === 'ta') {
    return `வணக்கம் ${displayName}! நான் உங்கள் நோவா (Nova) 3D AI துணைவன். உங்கள் சிந்தனைகளைப் பகிருங்கள், அல்லது கடந்த நினைவுகளைத் தேடலாம்.`;
  }
  if (l.includes('hindi') || l === 'hi') {
    return `नमस्ते ${displayName}! मैं आपका नोवा (Nova) 3D एआई साथी हूँ। अपने विचार साझा करें या पिछले स्मरणों को खोजें।`;
  }
  if (l.includes('telugu') || l === 'te') {
    return `నమస్కారం ${displayName}! నేను మీ నోవా (Nova) 3D AI సహచరుడిని. మీ ఆలోచనలను పంచుకోండి లేదా మునుపటి జ్ఞాపకాలను అన్వేషించండి.`;
  }
  if (l.includes('kannada') || l === 'kn') {
    return `ನಮಸ್ಕಾರ ${displayName}! ನಾನು ನಿಮ್ಮ ನೋವಾ (Nova) 3D AI ಸಹವರ್ತಿ. ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಅಥವಾ ನೆನಪುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.`;
  }
  if (l.includes('malayalam') || l === 'ml') {
    return `നമസ്കാരം ${displayName}! ഞാൻ നിങ്ങളുടെ നോവ (Nova) 3D AI കൂട്ടുകാരനാണ്. നിങ്ങളുടെ ചിന്തകൾ പങ്കിടുക.`;
  }
  if (l.includes('bengali') || l === 'bn') {
    return `নমস্কার ${displayName}! আমি আপনার নোভা (Nova) 3D এআই সঙ্গী। আপনার চিন্তাভাবনা শেয়ার করুন।`;
  }
  if (l.includes('marathi') || l === 'mr') {
    return `नमस्कार ${displayName}! मी तुमचा नोव्हा (Nova) 3D AI सोबती आहे. आपले विचार शेअर करा.`;
  }
  if (l.includes('gujarati') || l === 'gu') {
    return `નમસ્તે ${displayName}! હું તમારો નોવા (Nova) 3D AI સાથી છું. તમારા વિચારો શેર કરો.`;
  }
  if (l.includes('punjabi') || l === 'pa') {
    return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${displayName}! ਮੈਂ ਤੁਹਾਡਾ ਨੋਵਾ (Nova) 3D AI ਸਾਥੀ ਹਾਂ। ਆਪਣੇ ਵਿਚਾਰ ਸਾਂਝੇ ਕਰੋ।`;
  }
  if (l.includes('spanish') || l === 'es') {
    return `¡Hola ${displayName}! Soy Nova, tu compañero 3D de IA en ReflectLogixAI. ¿En qué estás pensando hoy?`;
  }
  if (l.includes('french') || l === 'fr') {
    return `Bonjour ${displayName} ! Je suis Nova, votre compagnon 3D IA ReflectLogixAI. Que souhaitez-vous partager aujourd'hui ?`;
  }
  if (l.includes('german') || l === 'de') {
    return `Hallo ${displayName}! Ich bin Nova, dein 3D-KI-Begleiter bei ReflectLogixAI. Was liegt dir heute auf dem Herzen?`;
  }
  if (l.includes('japanese') || l === 'ja') {
    return `こんにちは ${displayName}さん！ReflectLogixAIのNova 3Dです。今日の振り返りや考えを教えてください。`;
  }
  if (l.includes('chinese') || l.includes('mandarin') || l === 'zh') {
    return `你好 ${displayName}！我是 ReflectLogixAI 的 Nova 3D 智能伴侣。今天有什么想法想记录或回顾吗？`;
  }
  if (l.includes('arabic') || l === 'ar') {
    return `مرحباً ${displayName}! أنا نوفا، رفيقك الذكي ثلاثي الأبعاد في ReflectLogixAI. كيف يمكنني مساعدتك اليوم؟`;
  }
  if (l.includes('portuguese') || l === 'pt') {
    return `Olá ${displayName}! Sou Nova, seu companheiro 3D de IA no ReflectLogixAI. O que você gostaria de refletir hoje?`;
  }
  if (l.includes('russian') || l === 'ru') {
    return `Здравствуйте, ${displayName}! Я Нова, ваш 3D ИИ-спутник в ReflectLogixAI. Чем хотите поделиться сегодня?`;
  }
  return `Hello ${displayName}! I'm your ReflectLogixAI Nova 3D companion. I'm connected to your journal memories and ready to reflect, recall past themes, or summarize your day. What's on your mind?`;
}

/**
 * Live Virtual Assistant Service powered by Gemini 2.5 Flash
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
    const rawUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';

    // OWASP LLM01 & LLM02 Security Guardrail Scan
    const securityScan = LLMSecurityGuardrail.scanAndSanitize(rawUserMsg);
    const lastUserMsg = securityScan.sanitizedText;

    const toolsUsed: Array<{ name: string; description: string; data?: any }> = [];

    if (!securityScan.isSafe || securityScan.piiMaskedCount > 0) {
      toolsUsed.push({
        name: 'security_guardrail_sanitizer',
        description: `Applied OWASP LLM Guardrails: Neutralized ${securityScan.violations.length} injection vector(s), masked ${securityScan.piiMaskedCount} sensitive PII item(s).`,
        data: { violations: securityScan.violations, piiMaskedCount: securityScan.piiMaskedCount }
      });
      dbStore.logAudit(
        userId,
        'SECURITY_GUARDRAIL_INTERVENTION',
        'assistant/chat',
        securityScan.isSafe ? 'SUCCESS' : 'DENIED',
        `Sanitized input. Violations: ${securityScan.violations.join(', ')}`
      );
    }

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
      const fallbackMsg = getMultilingualFallbackGreeting(userProfile.displayName || 'friend', preferredLanguage);
      return {
        message: fallbackMsg,
        toolsUsed,
        createdEntry
      };
    }
  }

  public static getFallbackGreeting(displayName: string, preferredLanguage = 'English'): string {
    return getMultilingualFallbackGreeting(displayName, preferredLanguage);
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
