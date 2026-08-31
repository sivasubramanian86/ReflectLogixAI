import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  Clock,
  Coins,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitBranch,
  Layers,
  Activity,
  Zap
} from 'lucide-react';
import { ADKWorkflowExecution, ADKAgentTraceStep } from '../types';

interface AgentWorkflowInspectorProps {
  execution: ADKWorkflowExecution | null;
}

export const AgentWorkflowInspector: React.FC<AgentWorkflowInspectorProps> = ({ execution }) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  if (!execution) {
    return (
      <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-5 text-center text-xs text-stone-400">
        <Activity className="mx-auto h-6 w-6 text-stone-600 mb-2" />
        <p>No active ADK agent execution trace loaded. Submit a reflection or select an entry to view the multi-agent pipeline DAG.</p>
      </div>
    );
  }

  const toggleStep = (stepId: string) => {
    setExpandedStepId(prev => (prev === stepId ? null : stepId));
  };

  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-xl space-y-4">
      
      {/* Header & Meta telemetry */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-sm font-semibold text-stone-200">
                ADK Multi-Agent Execution Pipeline
              </h3>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                {execution.status.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono">
              DAG: {execution.workflowName}
            </p>
          </div>
        </div>

        {/* Telemetry Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 rounded-lg bg-stone-950 px-2.5 py-1 text-stone-300 border border-stone-800">
            <Clock className="h-3 w-3 text-amber-400" />
            <span>{execution.totalDurationMs}ms</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded-lg bg-stone-950 px-2.5 py-1 text-stone-300 border border-stone-800">
            <Zap className="h-3 w-3 text-cyan-400" />
            <span>{execution.totalTokens} tokens</span>
          </div>

          <div className="flex items-center space-x-1.5 rounded-lg bg-stone-950 px-2.5 py-1 text-stone-300 border border-stone-800">
            <Coins className="h-3 w-3 text-emerald-400" />
            <span>${execution.estimatedCostUsd.toFixed(5)}</span>
          </div>
        </div>
      </div>

      {/* Pipeline Steps Interactive List */}
      <div className="space-y-2">
        {execution.steps.map((step, idx) => {
          const isExpanded = expandedStepId === step.stepId;
          const isParallel = ['summarizer_reflection', 'mood_classifier'].includes(step.agentType);

          return (
            <div
              key={step.stepId}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'border-amber-500/40 bg-stone-950/80 shadow-md'
                  : 'border-stone-800/80 bg-stone-950/40 hover:border-stone-700'
              }`}
            >
              {/* Step Summary Row */}
              <button
                type="button"
                onClick={() => toggleStep(step.stepId)}
                className="flex w-full items-center justify-between p-3 text-left focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-[11px] font-mono text-amber-400 border border-stone-700">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-stone-200">
                        {step.agentName}
                      </span>
                      {isParallel && (
                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono text-indigo-300 border border-indigo-500/20">
                          Parallel Branch
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 truncate max-w-md">
                      {step.outputSnippet || step.inputSnippet}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right font-mono text-[11px] text-stone-400 hidden sm:block">
                    <span>{step.durationMs}ms</span>
                    <span className="mx-1.5 text-stone-600">•</span>
                    <span className="text-amber-500/80">{step.tokensConsumed.total} tok</span>
                  </div>

                  <div className="flex h-5 w-5 items-center justify-center rounded text-stone-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </button>

              {/* Step Expanded Deep Dive (Reasoning Trace & Tools) */}
              {isExpanded && (
                <div className="border-t border-stone-800/80 px-4 py-3 space-y-3 bg-stone-950 text-xs">
                  
                  {/* Reasoning Trace */}
                  {step.reasoningTrace && (
                    <div>
                      <div className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider mb-1">
                        Metacognitive Reasoning Trace:
                      </div>
                      <p className="text-stone-300 leading-relaxed bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80 font-sans">
                        {step.reasoningTrace}
                      </p>
                    </div>
                  )}

                  {/* Tools Invoked */}
                  {step.toolsInvoked && step.toolsInvoked.length > 0 && (
                    <div>
                      <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
                        Specialized Tools Invoked:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {step.toolsInvoked.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded-md bg-stone-800 px-2 py-0.5 font-mono text-[10px] text-stone-300 border border-stone-700"
                          >
                            ⚙️ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Token breakdown */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-900">
                    <span>Input Tokens: {step.tokensConsumed.input}</span>
                    <span>Output Tokens: {step.tokensConsumed.output}</span>
                    <span>Confidence: {((step.confidenceScore || 0.95) * 100).toFixed(0)}%</span>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
