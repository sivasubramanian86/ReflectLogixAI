---
name: "reflectlogixai-production-guidelines"
description: >
  App-specific engineering standards, zero-trust security rules, ADK multi-agent orchestration,
  WCAG 2.2 AA accessibility, and TDD practices for ReflectLogixAI on Google Cloud Run.
---

# ReflectLogixAI Engineering & Architecture Skill

## 1. Zero-Trust Security & Data Isolation
1. **Never Trust Client UID**: All protected REST endpoints require server-side token validation (`requireAuth`). The client `userId` is strictly anchored from the verified token.
2. **Strict Firestore Tenant Isolation**: Subcollections reside in `/users/{userId}/journals/{journalId}` where Firestore rules enforce `request.auth.uid == userId`.
3. **Secret Manager Isolation**: Secret keys (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, Webhook URLs) must never touch client bundles. All external integrations access secrets server-side via Google Cloud Secret Manager.
4. **Data Minimization & PII Sanitization**: Outbound webhook dispatches (Slack/Discord) and telemetry logs must sanitize text and omit raw private journal prose. Only high-level summaries and mood categories are dispatched upon explicit opt-in.
5. **SSRF Mitigation**: Webhook URLs must be HTTPS and validated against internal IP ranges (`127.0.0.1`, `169.254.169.254`, `10.*`, `192.168.*`).
6. **Immutable Audit Logs**: Administrative mutations, role switches, and feature flag changes record append-only audit events with masked IP addresses (`192.168.***.***`).

---

## 2. ADK Multi-Agent Orchestration Architecture
- **Master Orchestrator (`ADKWorkflowEngine`)**: Coordinates DAG execution across parallel and sequential branches with hard token budgets and latency bounds.
- **Context Optimizer Subagent**: Compresses rolling conversational and historical timeline context to reduce prompt tokens by ~68%.
- **Mood & Affect Classifier**: Quantifies continuous affect coordinates (Valence: -1.0 to +1.0, Arousal: 0.0 to 1.0) and discrete stress intensity (1-10) using Russell's Circumplex model.
- **Reflection Coach Subagent**: Formulates empathetic, Socratic inquiry questions, identifies cognitive strengths, and generates reframing suggestions.
- **Micro-Action Planner Subagent**: Synthesizes 2-3 SMART behavioral micro-steps categorized into wellness, productivity, rest, and habits.
- **Localization Subagent**: Supports 18+ languages across APAC and global locales, synthesizing localized vernacular summaries and bilingual anchors.
- **MCP Tool Interoperability**:
  - `BigQueryMCPToolbox`: Longitudinal emotional trend analytics.
  - `PgVectorMCPToolbox`: Cosine similarity vector search over journal history for "Ask My History" Agentic RAG.
  - `GraphRAGMCPToolbox`: Subgraph traversal connecting people, places, goals, and emotional triggers.

---

## 3. UI/UX & WCAG 2.2 AA Accessibility
- **Semantic HTML First**: Landmark hierarchy (`<header role="banner">`, `<nav role="navigation">`, `<main id="main-content" role="main">`, `<aside>`, `<footer>`).
- **Accessible ARIA Attributes**: Explicit `aria-label`, `aria-expanded`, `aria-controls`, `aria-pressed`, and `role="region"`.
- **Live Regions**: Dynamic updates (voice transcription waveform, agent trace logs) utilize `aria-live="polite"` and `role="status"`.
- **Keyboard Navigation & Focus Management**:
  - Full keyboard accessibility ($Tab$, $Enter$, $Space$, $Escape$).
  - Modals and drawers implement modal focus traps and Escape key dismissal.
  - Visible focus rings with high-contrast amber outlines (`focus-visible:ring-2`).
- **Contrast & Responsive Design**:
  - WCAG 2.2 AA compliant contrast ratio ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text and UI components).
  - Interactive touch targets minimum $44 \times 44\text{px}$.

---

## 4. Quality Engineering & DevEx Gates
- **Test-Driven Development (TDD)**:
  - Frontend components tested with Vitest.
  - Backend routes, auth middleware, and tenant scoping tested with Vitest.
  - Python ADK multi-agent DAG, subagents, and MCP clients tested with Pytest.
- **Continuous Integration (CI) Gates**:
  - TypeScript compilation check (`tsc --noEmit`).
  - Vitest test suite (`npm test`).
  - Python test suite (`python -m pytest agents/tests/`).
  - Gitleaks automated secret scanning and SAST vulnerability analysis.
- **Continuous Deployment (CD)**:
  - Gated Cloud Run deployment via GitHub Actions OIDC Workload Identity Federation.
