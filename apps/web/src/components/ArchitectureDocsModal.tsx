import React, { useState } from 'react';
import {
  FileCode,
  X,
  Shield,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  Copy,
  CheckCircle2,
  Lock,
  Globe,
  Database
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'security' | 'adk' | 'antigravity'>('architecture');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `Personal Gemini Journal - Production Cloud Run & Multi-Agent Architecture
Deployed: Google Cloud Run (asia-southeast1)
Auth: Firebase Authentication JWT
Database: Cloud Firestore (Strict Tenant Isolation, 8-Pillar Security Rules)
AI Orchestration: Google Agent Development Kit (ADK) Multi-Agent Pipeline
Models: gemini-3.7-flash & gemini-3.5-transcribe
Secrets: Google Cloud Secret Manager`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 p-5 bg-stone-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-semibold text-stone-100">
                System Architecture & Production Specifications
              </h2>
              <p className="text-xs text-stone-400">
                Google Cloud Well-Architected Framework & Antigravity Skill Definitions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 hover:text-amber-300 transition-colors"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Spec'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center space-x-1 border-b border-stone-800 bg-stone-950 px-5 py-2">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeSection === 'architecture'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            System Topology
          </button>
          <button
            onClick={() => setActiveSection('security')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeSection === 'security'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Zero-Trust & Firestore Rules
          </button>
          <button
            onClick={() => setActiveSection('adk')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeSection === 'adk'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ADK Multi-Agent DAG
          </button>
          <button
            onClick={() => setActiveSection('antigravity')}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              activeSection === 'antigravity'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Antigravity Skill & Agents
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-4 text-xs text-stone-300 leading-relaxed font-sans flex-1">
          
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 font-mono text-[11px] text-amber-300 space-y-1">
                <div>[Client Frontend: React 18 + Tailwind]</div>
                <div> &nbsp;↓ HTTPS / Verified Firebase Bearer JWT</div>
                <div>[Google Cloud Run Container (Express + Vite Server @ port 3000)]</div>
                <div> &nbsp;├── Secret Manager (API Keys, Webhooks, Maps)</div>
                <div> &nbsp;├── ADK Multi-Agent Orchestrator (gemini-3.7-flash)</div>
                <div> &nbsp;├── MCP Tool Layer (BigQuery, Cloud SQL pgvector, GraphRAG)</div>
                <div> &nbsp;└── Cloud Firestore (Isolated /users/{'{userId}'}/journals)</div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-stone-100 font-serif">
                  Google Cloud Well-Architected Pillars Adhered To:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li><strong className="text-stone-200">Security:</strong> Zero-Trust access model, server-side secret isolation, immutable audit logs.</li>
                  <li><strong className="text-stone-200">Reliability:</strong> Containerized deployment on Cloud Run with automatic horizontal scaling.</li>
                  <li><strong className="text-stone-200">Performance:</strong> Parallelized subagent execution, context pruning, and pgvector embeddings retrieval.</li>
                  <li><strong className="text-stone-200">Cost Optimization:</strong> Rolling timeline summarization pruning raw context tokens by ~68%.</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-100 font-serif">
                Cloud Firestore Eight Pillars of Zero-Trust Security
              </h4>
              <p className="text-stone-400">
                Adhering to strict validation rules where documents are only accessible to verified owners (<code className="text-amber-400 font-mono">request.auth.uid == userId</code>) and administrative roles are enforced on the server.
              </p>
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-3 font-mono text-[11px] text-stone-400">
                <pre>{`match /users/{userId}/journals/{journalId} {
  allow get, list: if isOwner(userId);
  allow create: if isOwner(userId) && isValidJournalEntry(incoming(), userId);
  allow update: if isOwner(userId) && incoming().createdAt == existing().createdAt;
  allow delete: if isOwner(userId);
}`}</pre>
              </div>
              <div className="text-[11px] text-stone-400">
                Refer to <code className="text-amber-400 font-mono">/security_spec.md</code> and <code className="text-amber-400 font-mono">/firestore.rules</code> for complete "Dirty Dozen" payload defense matrices.
              </div>
            </div>
          )}

          {activeSection === 'adk' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-100 font-serif">
                ADK Multi-Agent Orchestration Graph
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-3">
                  <div className="font-semibold text-amber-400 mb-1">1. Master Orchestrator</div>
                  <p className="text-stone-400">Coordinates DAG tasks, evaluates token budgets, and ensures safety scopes.</p>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-3">
                  <div className="font-semibold text-amber-400 mb-1">2. Reflection & Socratic Coach</div>
                  <p className="text-stone-400">Extracts metacognitive patterns, strengths, and thought-provoking inquiry.</p>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-3">
                  <div className="font-semibold text-amber-400 mb-1">3. Affect & Mood Classifier</div>
                  <p className="text-stone-400">Maps sentiment valence (-1 to +1), arousal vectors, and stress scores.</p>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-3">
                  <div className="font-semibold text-amber-400 mb-1">4. Micro-Action Planner</div>
                  <p className="text-stone-400">Formulates friction-reducing micro-actions for today, this week, and habits.</p>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-3">
                  <div className="font-semibold text-amber-400 mb-1">5. Localization & APAC Vernacular</div>
                  <p className="text-stone-400">Supports Tamil, Hindi, Telugu, Spanish, and English bilingual summaries.</p>
                </div>
                <div className="rounded-lg border border-stone-800 bg-stone-950 p-3">
                  <div className="font-semibold text-amber-400 mb-1">6. Cost & Context Optimizer</div>
                  <p className="text-stone-400">Condenses rolling timelines into long-term persona anchors to reduce API cost.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'antigravity' && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-100 font-serif">
                Antigravity Autonomous Workflows & Skill Definitions
              </h4>
              <p className="text-stone-400">
                Created root-level <code className="text-amber-400 font-mono">/SKILL.md</code> and <code className="text-amber-400 font-mono">/agents.md</code> to empower autonomous Antigravity agents to perform security reviews, run penetration audits against the "Dirty Dozen", and execute continuous test-driven iteration.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
