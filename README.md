# ReflectLogixAI – Your Multi-Purpose Personal Gemini Journal

ReflectLogixAI is an enterprise-grade, user-authenticated, multi-agent journaling & reflection coach engineered for **Google Cloud Run**, **Google Gemini 3.7 / 2.5 Flash**, **Firebase Authentication**, **Cloud Firestore Zero-Trust isolation**, and **Agent Development Kit (ADK)** orchestration.

---

## 🏛️ Project Architecture & Repository Structure

```
reflectlogixai/
├── apps/
│   ├── web/                      # React frontend (AI Studio Build Mode output, refined)
│   │   ├── src/
│   │   │   ├── components/       # UI components (layout, panels, charts, forms)
│   │   │   ├── pages/            # Route-level pages (Journal, Insights, Admin)
│   │   │   ├── hooks/            # Custom hooks (auth, language, journaling state)
│   │   │   ├── services/         # API clients (calls to apps/api and agents)
│   │   │   ├── styles/           # CSS/Tailwind/theme config
│   │   │   └── tests/            # Frontend unit & integration tests (Vitest/RTL)
│   │   ├── public/               # Static assets (icons, logos)
│   │   └── package.json
│   └── api/                      # Express backend on port 3000
│       ├── src/
│       │   ├── routes/           # HTTP routes (journal, insights, admin, notifications)
│       │   ├── middleware/       # Auth (Firebase), RBAC, audit logging, error handling
│       │   ├── services/         # Firestore, Secret Manager, Maps, Slack/Discord, MCP clients
│       │   ├── config/           # Env config, model selection, rate limits
│       │   ├── models/           # Data models / DTOs
│       │   └── tests/            # Backend unit & integration tests (Jest/Vitest)
│       ├── Dockerfile
│       └── package.json
├── agents/                       # ADK multi-agent orchestration (Python)
│   ├── orchestrator/             # Main workflow/DAG definitions
│   ├── subagents/
│   │   ├── reflection_coach/     # Socratic reflection coach agent
│   │   ├── mood_classifier/      # Valence, arousal, stress & primary emotion classifier
│   │   ├── planner/              # Micro-action planner and goal decomposition
│   │   ├── localization/         # Cultural nuance & multilingual translation
│   │   └── context_optimizer/    # Token window compression & semantic cache
│   ├── mcp_tools/                # BigQuery, Cloud SQL/pgvector, GraphRAG/Neo4j MCP clients
│   ├── tests/                    # Pytest suites for workflows & tools
│   └── requirements.txt
├── infra/
│   ├── firestore.rules           # Zero-trust Firestore security rules
│   ├── firebase-blueprint.json   # Firebase/Firestore blueprint
│   ├── security_spec.md          # Dirty Dozen + Zero-Trust attack matrix
│   └── cloudrun/
│       ├── api-service.yaml      # Cloud Run service config for apps/api
│       └── agents-service.yaml   # Cloud Run service config for agents/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                # Lint, tests, gitleaks, SAST
│   │   └── deploy-cloudrun.yml   # Cloud Run deployment pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   ├── architecture/             # System diagrams, agent graphs, data flows
│   ├── api-contracts/            # OpenAPI / endpoint docs
│   └── ux/                       # UI wireframes, UX flows
├── SKILL.md                      # Antigravity skills mirroring AI Studio directives
├── agents.md                     # Antigravity agent personas (security reviewer, test runner)
├── README.md                     # Main project documentation
├── LICENSE                       # MIT License
├── SECURITY.md                   # Security policy and reporting process
├── CONTRIBUTING.md               # Contribution & dev setup guidelines
├── CODE_OF_CONDUCT.md            # Community behavior expectations
├── SUPPORT.md                    # How to get help / open issues
├── package.json                  # Root scripts & workspaces
└── .gitignore
```

---

## ⚡ Quick Start & Development

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is specified.

### 3. Run Dev Server
```bash
npm run dev
```
The application boots Express and Vite unified on port **3000** (`http://localhost:3000`).

---

## 🔒 Security & Zero-Trust Tenancy
ReflectLogixAI guarantees that journal reflections are strictly scoped to authenticated user IDs using Cloud Firestore security rules with `request.auth.uid == userId`.
- **Sensitive Mode**: Excludes reflections from long-term trends and exports.
- **Detox Mode**: Performs zero-retention analysis with PII scrub and ephemeral memory discard.
