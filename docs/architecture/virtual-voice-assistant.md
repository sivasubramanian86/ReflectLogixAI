# ReflectLogixAI - Live 3D Virtual Voice Assistant (Nova)

![ReflectLogixAI Live 3D Virtual Assistant](../assets/virtual_assistant_avatar.jpg)

## 1. Architectural Overview

The **Live 3D Virtual Voice Assistant ("Nova")** provides an empathetic, conversational interface to ReflectLogixAI. Inspired by **Gemini Live**, it merges real-time speech recognition, natural text-to-speech synthesis, dynamic 3D holographic particle canvas visualization, and Google Vertex AI Gemini 3.7 Flash with automated MCP tool routing.

### Mermaid Flowchart: Virtual Assistant Runtime

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant Canvas as 3D Particle Visualizer
    participant Voice as Web Speech API (STT & TTS)
    participant Gateway as Cloud Run Express Gateway
    participant Assistant as Live Assistant Service
    participant Gemini as Vertex AI Gemini 3.7 Flash
    participant MCP as MCP Tool Router (RAG / BigQuery)
    participant DB as Cloud Firestore

    User->>Voice: Speaks query / reflection
    Voice->>Canvas: Audio level triggers reactive particle pulse
    Voice->>Gateway: POST /api/assistant/chat (Transcript)
    Gateway->>Assistant: processConversation(userId, messages)

    alt User queries past memories
        Assistant->>MCP: PgVectorMCPToolbox.semanticSearch()
        MCP-->>Assistant: Retrieved journal context
    else User queries analytics / trends
        Assistant->>MCP: BigQueryMCPToolbox.executeAnalyticsQuery()
        MCP-->>Assistant: Aggregated mood & stress metrics
    else User requests daily summary
        Assistant->>MCP: ADKOrchestrationEngine.executeJournalWorkflow()
        MCP->>DB: Upsert consolidated daily summary entry
        DB-->>Assistant: Created JournalEntry object
    end

    Assistant->>Gemini: Synthesize empathetic voice response with MCP context
    Gemini-->>Assistant: Conversational response text
    Assistant-->>Gateway: Response Payload + Tool Metadata
    Gateway-->>Voice: JSON Response
    Voice->>Canvas: Audio waveform pulse + holographic glow
    Voice->>User: Spoken voice synthesis (TTS) + glassmorphic transcript
```

---

## 2. Core Capabilities & Integration

### A. 3D Holographic Particle Visualizer ([VoiceVisualizer3D.tsx](file:///d:/Siva/Books/CAREER/HACKATHON/Gen_AI_APAC_2026/ReflectLogixAI/apps/web/src/components/VoiceVisualizer3D.tsx))
- **Particle System**: 65 orbiting 3D particles with real-time perspective projection ($Z$-depth scaling).
- **Audio-Reactive Deformation**: Orbit radius, pulse velocity, and glow rings modulate dynamically in response to speech synthesis amplitude and microphone input.
- **Holographic Scanline & Aura**: Cyan, violet, and magenta lighting rings around the stylish AI avatar portrait.

### B. Live Voice & Speech Engine ([LiveVoiceAssistantModal.tsx](file:///d:/Siva/Books/CAREER/HACKATHON/Gen_AI_APAC_2026/ReflectLogixAI/apps/web/src/components/LiveVoiceAssistantModal.tsx))
- **Zero-Latency Speech Recognition**: Native `webkitSpeechRecognition` with continuous or tap-to-talk modes.
- **Natural Voice Synthesis**: Native `SpeechSynthesisUtterance` configured with warm pitch, rate modulation, and language support (English, Tamil, Hindi, French, Spanish, German, Japanese).
- **Interruption Support**: Immediate audio pause and cancellation on user speech or manual tap.

### C. Agentic RAG & MCP Invocation ([assistant.ts](file:///d:/Siva/Books/CAREER/HACKATHON/Gen_AI_APAC_2026/ReflectLogixAI/apps/api/src/server/assistant.ts))
- **Cloud SQL pgvector RAG**: Automatically queried when users ask about past reflections, specific life areas, or previous emotional states.
- **BigQuery Analytical Tool**: Summarizes 30-day stress scores, emotional valence, and top recurring topic tags.
- **ADK Subagent Mesh & Daily Summarizer**: Synthesizes the day's multiple journal fragments into an official daily summary with Socratic cognitive reframing and 3 SMART micro-actions.
