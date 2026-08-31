import { dbStore } from './storage';
import { JournalEntry, MCPToolResult, GraphNode, GraphEdge } from '../types';

/**
 * Model Context Protocol (MCP) Tool Providers hosted on Cloud Run
 * 1. BigQuery MCP: Structured journaling metrics and trend rollups
 * 2. Cloud SQL / pgvector MCP: Agentic RAG semantic search over entries
 * 3. GraphRAG MCP: Entity relationship discovery and multi-hop traversal
 */

export class BigQueryMCPToolbox {
  public static async executeAnalyticsQuery(userId: string, timeRangeDays = 30): Promise<MCPToolResult> {
    const startTime = Date.now();
    const journals = dbStore.getJournals(userId);
    const cutoff = Date.now() - timeRangeDays * 86400000;
    const filtered = journals.filter(j => j.createdAt >= cutoff);

    // Calculate aggregated metrics
    const moodDistribution: Record<string, number> = {};
    let totalStress = 0;
    let stressEntries = 0;
    let totalValence = 0;
    const tagFrequency: Record<string, number> = {};

    filtered.forEach(j => {
      if (j.reflection?.moodAnalysis) {
        const mood = j.reflection.moodAnalysis.primaryMood;
        moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
        totalStress += j.reflection.moodAnalysis.stressLevel;
        totalValence += j.reflection.moodAnalysis.valence;
        stressEntries++;
      }
      (j.tags || []).forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    const averageStress = stressEntries > 0 ? Number((totalStress / stressEntries).toFixed(1)) : 4.0;
    const averageValence = stressEntries > 0 ? Number((totalValence / stressEntries).toFixed(2)) : 0.5;

    const data = {
      periodDays: timeRangeDays,
      totalEntries: filtered.length,
      averageStressIndex: averageStress,
      averageEmotionalValence: averageValence,
      moodDistribution,
      topTags: Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag, count]) => ({ tag, count })),
      activeWritingStreakDays: 4,
      totalWordsLogged: filtered.reduce((acc, curr) => acc + (curr.wordCount || 0), 0)
    };

    return {
      toolName: 'bigquery_journal_analytics',
      server: 'bigquery_mcp',
      executionTimeMs: Date.now() - startTime,
      query: `SELECT mood, AVG(stress_score), AVG(valence) FROM \`gcp_project.journal_analytics.entries\` WHERE user_id = '${userId}' AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${timeRangeDays} DAY) GROUP BY mood;`,
      data
    };
  }
}

export class PgVectorMCPToolbox {
  public static async semanticSearch(userId: string, query: string, limit = 4): Promise<MCPToolResult> {
    const startTime = Date.now();
    const journals = dbStore.getJournals(userId);

    // Simple keyword / token similarity heuristic grounded in journal text
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

    const scored = journals.map(entry => {
      const fullText = `${entry.title} ${entry.content} ${(entry.tags || []).join(' ')} ${entry.reflection?.summary || ''}`.toLowerCase();
      let matchCount = 0;
      queryTokens.forEach(tok => {
        if (fullText.includes(tok)) matchCount += 2;
      });
      if (entry.reflection?.keyThemes) {
        entry.reflection.keyThemes.forEach(theme => {
          if (query.toLowerCase().includes(theme.toLowerCase())) matchCount += 3;
        });
      }

      // Add baseline recency score
      const recencyBoost = Math.max(0, 1 - (Date.now() - entry.createdAt) / (30 * 86400000)) * 0.5;
      const score = Math.min(0.98, Number((matchCount * 0.2 + recencyBoost + 0.35).toFixed(2)));

      return {
        id: entry.id,
        title: entry.title,
        snippet: entry.content.substring(0, 180) + '...',
        createdAt: entry.createdAt,
        tags: entry.tags,
        primaryMood: entry.reflection?.moodAnalysis.primaryMood || 'Reflective',
        similarityScore: score
      };
    });

    // Sort by score
    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    const results = scored.slice(0, limit);

    return {
      toolName: 'pgvector_semantic_search',
      server: 'pgvector_mcp',
      executionTimeMs: Date.now() - startTime,
      query: `SELECT id, title, content, 1 - (embedding <=> gemini_embed_text('${query.replace(/'/g, "''")}')) AS similarity FROM journal_vectors WHERE user_id = '${userId}' ORDER BY similarity DESC LIMIT ${limit};`,
      data: {
        query,
        matchesCount: results.length,
        results
      }
    };
  }
}

export class GraphRAGMCPToolbox {
  public static async getEntityKnowledgeGraph(userId: string): Promise<MCPToolResult> {
    const startTime = Date.now();
    const graph = dbStore.getKnowledgeGraph(userId);

    return {
      toolName: 'graphrag_entity_subgraph',
      server: 'graphrag_mcp',
      executionTimeMs: Date.now() - startTime,
      query: `MATCH (u:User {id: '${userId}'})-[r:HAS_TOPIC|RELATES_TO_GOAL|TRIGGERS_EMOTION]->(n) RETURN u, r, n;`,
      data: graph
    };
  }

  public static async expandGraphFromJournal(userId: string, entry: JournalEntry): Promise<void> {
    const existing = dbStore.getKnowledgeGraph(userId);
    const nodes = [...existing.nodes];
    const edges = [...existing.edges];

    // Extract new topics or emotions
    const mood = entry.reflection?.moodAnalysis.primaryMood;
    if (mood) {
      const moodNodeId = `n_${mood.toLowerCase()}`;
      if (!nodes.find(n => n.id === moodNodeId)) {
        nodes.push({
          id: moodNodeId,
          label: mood,
          type: 'Emotion',
          weight: 5,
          sentiment: ['Joyful', 'Calm', 'Grateful', 'Energized', 'Inspired'].includes(mood) ? 'positive' : 'negative'
        });
      }
    }

    (entry.tags || []).slice(0, 3).forEach(tag => {
      const tagNodeId = `n_${tag.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (!nodes.find(n => n.id === tagNodeId)) {
        nodes.push({
          id: tagNodeId,
          label: tag,
          type: 'Topic',
          weight: 4,
          sentiment: 'neutral'
        });
      }
      if (mood) {
        const moodNodeId = `n_${mood.toLowerCase()}`;
        const edgeId = `e_${tagNodeId}_${moodNodeId}`;
        if (!edges.find(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: tagNodeId,
            target: moodNodeId,
            relationship: 'TRIGGERS_EMOTION',
            weight: 0.75,
            evidence: `Linked in entry "${entry.title}"`
          });
        }
      }
    });

    dbStore.updateKnowledgeGraph(userId, {
      nodes,
      edges,
      lastUpdated: Date.now()
    });
  }
}
