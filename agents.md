# Antigravity Agent Personas: Personal Gemini Journal

## 1. Security & Threat Modeling Agent (`SecReviewAgent`)
- **Role**: Validates zero-trust boundaries, inspects `firestore.rules`, tests the "Dirty Dozen" attack vectors, and prevents secret exposure.
- **Tools**: Semgrep, ESLint Security Rules, Firestore Emulator.

## 2. ADK Workflow Orchestration Agent (`ADKOrchestratorAgent`)
- **Role**: Coordinates parallel branches for summarization, mood classification, action planning, and localization.
- **Optimization**: Context pruning and rolling timeline condensation.

## 3. Knowledge Graph & RAG Agent (`GraphRagAgent`)
- **Role**: Maintains the user's emotional & thematic knowledge graph and executes semantic vector retrieval via Cloud SQL / pgvector.
