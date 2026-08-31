# ReflectLogixAI System Architecture

## Overview
ReflectLogixAI couples **Google Gemini 3.7 / 2.5 Flash**, **Google Agent Development Kit (ADK)**, and **Cloud Firestore** in a containerized **Google Cloud Run** topology.

```
+-------------------------------------------------------------------------------+
|                             CLIENT / BROWSER                                  |
|  [3-Pane React Canvas] <---> [Firebase Auth Token] <---> [Audio/Voice WebRTC] |
+-------------------------------------------------------------------------------+
                                      |  (HTTPS Port 3000)
                                      v
+-------------------------------------------------------------------------------+
|                       GOOGLE CLOUD RUN (apps/api + web)                       |
|                                                                               |
|  +--------------------+   +---------------------+   +---------------------+   |
|  | Express Router     |-->| Auth Middleware     |-->| ADK Orchestrator    |   |
|  | (REST API Endpoints)   | (Token Validation)  |   | (DAG Engine)        |   |
|  +--------------------+   +---------------------+   +---------------------+   |
|                                                                |              |
|                                                                v              |
|                                                     +---------------------+   |
|                                                     | Subagent Pipeline   |   |
|                                                     | - Reflection Coach  |   |
|                                                     | - Mood Classifier   |   |
|                                                     | - Action Planner    |   |
|                                                     | - Localization      |   |
|                                                     | - Context Optimizer |   |
|                                                     +---------------------+   |
+-------------------------------------------------------------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
|  CLOUD FIRESTORE  |     |  GEMINI 3.7 FLASH |     |  SECRET MANAGER   |
| (Tenant Isolated) |     |  (@google/genai)  |     |  (API Keys & IAM) |
+-------------------+     +-------------------+     +-------------------+
```

## Subagent DAG Orchestration
1. **Context Optimizer**: Evaluates token window, compresses previous session state, and queries vector stores.
2. **Mood Classifier**: Quantifies valence (-1.0 to +1.0), arousal, stress score (1-10), and emotional markers.
3. **Reflection Coach**: Applies Socratic questioning, cognitive reframing, and strengths identification.
4. **Action Planner**: Synthesizes 3 prioritized, achievable micro-actions with clear time horizons.
5. **Localization Agent**: Synthesizes bilingual reflections and respects cultural nuances.
