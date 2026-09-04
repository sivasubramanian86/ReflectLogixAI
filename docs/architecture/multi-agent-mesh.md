# ReflectLogixAI - Google ADK Multi-Agent Orchestration Mesh

![ReflectLogixAI Multi-Agent Architecture](../assets/agent_mesh_architecture.jpg)

## 1. Multi-Agent Mesh Design

ReflectLogixAI deploys a specialized multi-agent mesh inspired by the **Google Agent Development Kit (ADK)**. Rather than relying on a single monolithic LLM prompt, responsibility is decomposed across five focused subagents orchestrated in a directed acyclic graph (DAG).

### Mermaid DAG: Multi-Agent Pipeline

```mermaid
graph TD
    Input([Raw Journal Context: Text / Audio / Metadata]) --> CtxOpt[1. Context Optimizer Agent]
    
    subgraph ParallelEvaluation["Parallel Stage 1"]
        CtxOpt --> MoodClassifier[2. Mood Classifier Agent]
        CtxOpt --> LocalizationAgent[3. Localization Agent]
    end

    subgraph SequentialSynthesis["Sequential Synthesis Stage 2 & 3"]
        MoodClassifier --> ReflectionCoach[4. Reflection Coach Agent]
        LocalizationAgent --> ReflectionCoach
        ReflectionCoach --> ActionPlanner[5. Action Planner Agent]
    end

    ActionPlanner --> Output([Unified Reflection Output & Firestore Persistence])

    classDef input fill:#0284c7,stroke:#0369a1,stroke-width:2px,color:#fff;
    classDef agent fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#fff;
    classDef output fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;

    class Input input;
    class CtxOpt,MoodClassifier,LocalizationAgent,ReflectionCoach,ActionPlanner agent;
    class Output output;
```

---

## 2. Subagent Roles & Responsibilities

| Subagent | Core Responsibility | Input Parameters | Output Schema |
|---|---|---|---|
| **Context Optimizer** | Evaluates active token budget, retrieves historical semantic memory, and minimizes redundant context. | Raw entry, user past entries, user long-term profile | Compressed context window, retrieved memory anchors |
| **Mood Classifier** | Evaluates emotional tone, valence (-1.0 to +1.0), stress score (1 to 10), and emotional triggers. | Current entry content | `{ valence, arousal, stressScore, primaryMood, triggers }` |
| **Localization Agent** | Detects input language, preserves cultural nuance, and generates bilingual summaries. | Content, user preferred language | `{ detectedLanguage, originalSummary, englishSummary, keyPhrases }` |
| **Reflection Coach** | Applies Socratic inquiry, cognitive reframing of negative distortions, and highlights personal strengths. | Content, mood output, compressed history | `{ deepReflection, reframedPerspective, socraticQuestions }` |
| **Action Planner** | Converts reflections into exactly 3 prioritized, achievable micro-actions for personal growth. | Deep reflection, cognitive goals | `{ microActions: [{ id, action, priority, timeframe }] }` |
