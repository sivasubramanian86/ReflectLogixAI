# ReflectLogixAI - User Experience & Interaction Flow

![ReflectLogixAI Personal Journal User Flow](../assets/user_flow_diagram.jpg)

## 1. End-to-End User Experience Lifecycle

ReflectLogixAI transforms raw daily thoughts into deep cognitive reflections and micro-habits through a 5-stage sequential lifecycle.

### Mermaid Flowchart: 5-Stage Interaction Cycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Journal User
    participant Web as Web Client (React 19)
    participant API as Cloud Run (Express Gateway)
    participant ADK as Multi-Agent Orchestrator
    participant Gemini as Vertex AI (Gemini 3.7 / 2.5)
    participant DB as Cloud Firestore

    %% Stage 1: Journal Capture
    Note over User,Web: Stage 1: Journal Capture
    User->>Web: Voice Recording / Text Input / Location Check-in
    Web->>API: POST /api/reflections (Audio / Text + Metadata)

    %% Stage 2: Agent Processing
    Note over API,Gemini: Stage 2: Multi-Agent AI Processing
    API->>ADK: Dispatch Journal Context
    ADK->>Gemini: 1. Context Optimizer (Compress & Recall Memory)
    ADK->>Gemini: 2. Mood Classifier (Valence, Arousal, Stress Score)
    ADK->>Gemini: 3. Localization Agent (Bilingual Detection)
    Gemini-->>ADK: Sentiment & Context Payload

    %% Stage 3: Socratic Reflection
    Note over ADK,Gemini: Stage 3: Socratic Reflection & Growth
    ADK->>Gemini: 4. Reflection Coach (Socratic Questions & Cognitive Reframing)
    Gemini-->>ADK: Empathetic Insights & Deep Reflections

    %% Stage 4: Actionable Habits
    Note over ADK,DB: Stage 4: Actionable Habits
    ADK->>Gemini: 5. Action Planner (3 Prioritized Micro-Actions)
    Gemini-->>ADK: Micro-Action Checklist
    ADK->>DB: Upsert Journal & Streak Data (/users/{uid}/journals)
    ADK-->>API: Unified Reflection Payload
    API-->>Web: JSON Response (200 OK)

    %% Stage 5: Deep Life Insights
    Note over Web,User: Stage 5: Deep Life Insights
    Web->>User: Display Glassmorphic Card (Mood, Reframing, 3 Actions, Streak +1)
```

---

## 2. The 5 Interaction Stages Explained

### Stage 1: Journal Capture
- **Multimodal Capture**: Users express thoughts via voice recording (live WebRTC audio stream converted to text) or typed markdown text.
- **Contextual Anchors**: Optional location tagging (via Google Maps geocoding) and life area tagging (**Work**, **Health**, **Relationships**, **Growth**, **Creativity**).

### Stage 2: Multi-Agent Processing
- Context Optimizer prunes token history and retrieves relevant historical entries.
- Mood Classifier quantifies valence (-1.0 to +1.0), stress score (1-10), and emotional triggers.
- Localization Agent auto-detects language (Tamil, Hindi, Spanish, French, German, Japanese, English) and prepares bilingual bridges.

### Stage 3: Socratic Reflection & Growth
- Reflection Coach applies empathetic inquiry and cognitive reframing, helping users challenge negative cognitive distortions into constructive perspectives.

### Stage 4: Actionable Habits & Micro-Actions
- Action Planner generates exactly 3 concrete, realistic micro-steps achievable within 24–48 hours.
- Consistency engine increments daily streak counters and tracks long-term habit adherence.

### Stage 5: Deep Life Insights
- The web companion surfaces longitudinal emotional trajectories, personal growth heatmaps, and recurring topic clusters without exposing technical database complexities.
