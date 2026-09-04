# ReflectLogixAI - System Architecture

![ReflectLogixAI Enterprise Architecture](../assets/architecture_overview.jpg)

## 1. High-Level Architecture Overview

ReflectLogixAI is an enterprise-grade, privacy-first personal journal companion built on **Google Cloud Platform (GCP)**. It integrates **Google Vertex AI Gemini 3.7 & 2.5 Flash**, **Google Agent Development Kit (ADK)**, and **Cloud Firestore** inside a containerized **Google Cloud Run** topology.

### Mermaid Topology Diagram

```mermaid
flowchart TB
    subgraph ClientLayer["1. Client Layer (React 19 + Vite)"]
        UI["Glassmorphic Web App<br/>(TailwindCSS + Motion)"]
        Voice["Audio WebRTC Waveform<br/>(Live Voice Capture)"]
        Geo["Location Check-in<br/>(Google Maps Geocoding)"]
    end

    subgraph SecurityBoundary["Security & Identity"]
        FirebaseAuth["Firebase Auth / Identity Platform<br/>(Bearer JWT Verification)"]
        SecMan["Google Cloud Secret Manager<br/>(Least-Privilege Secret Ingestion)"]
    end

    subgraph CloudRun["2. Google Cloud Run (Container Service)"]
        direction TB
        ExpressRouter["Express API Router<br/>(Node.js / TypeScript)"]
        AuthMiddleware["Tenant Isolation Middleware<br/>(Server-Anchored UserId)"]
        ADKEngine["ADK Agent Orchestrator<br/>(DAG Pipeline Controller)"]

        subgraph AgentMesh["Agent Mesh (5 Subagents)"]
            CtxOpt["Context Optimizer<br/>(Token Window Caching)"]
            Mood["Mood Classifier<br/>(Valence & Stress 1-10)"]
            Reflect["Reflection Coach<br/>(Socratic Reframing)"]
            Action["Action Planner<br/>(3 Prioritized Micro-Actions)"]
            Loc["Localization Agent<br/>(Bilingual Synthesis)"]
        end
    end

    subgraph CoreAIEngine["3. Core AI Engine"]
        Gemini37["Vertex AI: Gemini 3.7 Flash<br/>(Primary Reasoning & Socratic Coach)"]
        GeminiFlash["Vertex AI: Gemini 2.5 Flash<br/>(Rapid Sentiment & Subagent Classification)"]
    end

    subgraph StorageDataLayer["4. Storage & Memory Layer"]
        Firestore["Cloud Firestore (Native)<br/>(Tenant-Isolated Documents & Journals)"]
        BQ["BigQuery Analytics<br/>(Aggregated Insights & Longitudinal Trends)"]
        VectorDB["Cloud SQL / pgvector<br/>(Semantic Graph & Agentic Memory)"]
    end

    %% Flow Connections
    UI -->|HTTPS Request| ExpressRouter
    Voice -->|Audio Base64| ExpressRouter
    Geo -->|Coordinates| ExpressRouter

    FirebaseAuth -.->|Token Verification| AuthMiddleware
    SecMan -.->|Inject Env Secrets| ExpressRouter

    ExpressRouter --> AuthMiddleware
    AuthMiddleware --> ADKEngine

    ADKEngine --> CtxOpt
    CtxOpt --> Mood
    CtxOpt --> Loc
    Mood --> Reflect
    Loc --> Reflect
    Reflect --> Action

    AgentMesh <-->|ADC IAM Auth| CoreAIEngine
    ADKEngine <-->|Tenant Queries| Firestore
    ADKEngine -.->|Analytics Sync| BQ
    ADKEngine -.->|RAG Memory| VectorDB

    classDef client fill:#0ea5e9,stroke:#0284c7,stroke-width:2px,color:#fff;
    classDef cloudrun fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff;
    classDef ai fill:#a855f7,stroke:#9333ea,stroke-width:2px,color:#fff;
    classDef data fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff;
    classDef sec fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;

    class UI,Voice,Geo client;
    class ExpressRouter,AuthMiddleware,ADKEngine,CtxOpt,Mood,Reflect,Action,Loc cloudrun;
    class Gemini37,GeminiFlash ai;
    class Firestore,BQ,VectorDB data;
    class FirebaseAuth,SecMan sec;
```

---

## 2. Key Architectural Pillars

### Pillar 1: Zero-Trust Tenant Isolation
- Every journal entry, mood classification, and reflection is strictly stored under `/users/{userId}/journals/{journalId}` in Cloud Firestore.
- Server-side middleware validates the caller's identity via Firebase ID Token (or local evaluator anchor `user_siva_001`), preventing any cross-tenant data leakage.

### Pillar 2: Google Vertex AI Native Integration
- Powered by `@google/genai` with `vertexai: true` using Application Default Credentials (ADC).
- Eliminates manual API key rotation in production and enforces GCP IAM role-based invocation.

### Pillar 3: Cloud Run Serverless Scalability
- Zero-to-N automatic horizontal scaling with containerized Docker images deployed in `asia-southeast1`.
- Built-in health checks (`/health`), memory limits, and automated CI/CD deployment via GitHub Actions.
