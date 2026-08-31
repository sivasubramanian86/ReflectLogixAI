---
name: "personal-gemini-journal-security"
description: >
  App-specific guidelines, zero-trust security rules, ADK orchestration patterns,
  and MCP tool integration for Personal Gemini Journal on Google Cloud Run.
---

# Personal Gemini Journal Skill

## Security Principles
1. **Never trust client UID**: Always verify Firebase Authentication tokens server-side.
2. **Strict Firestore Tenant Isolation**: Restrict subcollections to `/users/{userId}/journals/*` where `request.auth.uid == userId`.
3. **Secret Manager Isolation**: Secret keys (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, Webhook URLs) must never touch client code.
4. **Data Minimization**: Never include raw sensitive journal content in external webhooks or telemetry logs.

## ADK Multi-Agent Orchestration Flow
- **Orchestrator**: Master coordinator managing state and token budgeting.
- **Summarization Subagent**: Extracts thematic cores, cognitive strengths, and Socratic reflection questions.
- **Mood Classifier**: Detects valence, arousal, stress index, and emotional tags.
- **Action Planner**: Generates realistic micro-actions and SMART habits.
- **Multi-Lingual Subagent**: Detects APAC languages (Tamil, Hindi, Telugu, etc.) and provides bilingual adaptations.
- **Context Optimizer**: Compacts rolling timeline summaries to minimize token costs.
