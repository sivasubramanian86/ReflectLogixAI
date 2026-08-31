import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Activity,
  Server,
  Key,
  Users,
  Database,
  Lock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SystemHealthMetrics, AuditLogEntry } from '../types';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemHealthMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingFlag, setIsUpdatingFlag] = useState<boolean>(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [resMetrics, resLogs] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/audit-logs')
      ]);

      if (resMetrics.ok && resLogs.ok) {
        const dataMetrics = await resMetrics.json();
        const dataLogs = await resLogs.json();
        setMetrics(dataMetrics.metrics);
        setAuditLogs(dataLogs.logs);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFlag = async (flagName: string, currentValue: boolean) => {
    setIsUpdatingFlag(true);
    try {
      const res = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [flagName]: !currentValue })
      });
      if (res.ok) {
        const data = await res.json();
        if (metrics) {
          setMetrics({
            ...metrics,
            featureFlags: data.featureFlags
          });
        }
      }
    } catch (err) {
      console.error('Failed to update feature flag:', err);
    } finally {
      setIsUpdatingFlag(false);
    }
  };

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-stone-900/90 p-5 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-sm font-semibold text-stone-100">
                Google Cloud Run & RBAC Admin Portal
              </h3>
              <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-mono text-rose-300">
                ROLE: ADMIN (kailasamsiva@gmail.com)
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-mono">
              Infrastructure Telemetry, Audit Logs & Secret Manager Verification
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center space-x-1.5 rounded-lg border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 hover:text-stone-100 hover:border-stone-700 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Cloud Run & System Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 space-y-1">
          <div className="text-[10px] font-mono text-stone-400">Cloud Run Region</div>
          <div className="text-xs font-semibold text-stone-200 font-mono">
            {metrics?.cloudRunRegion || 'asia-southeast1'}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Active Container</span>
          </div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 space-y-1">
          <div className="text-[10px] font-mono text-stone-400">Gemini Orchestrator</div>
          <div className="text-xs font-semibold text-amber-400 font-mono">
            {metrics?.geminiModel || 'gemini-3.7-flash'}
          </div>
          <div className="text-[10px] text-stone-500">Latency: {metrics?.averageLatencyMs}ms</div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 space-y-1">
          <div className="text-[10px] font-mono text-stone-400">Total Entries Stored</div>
          <div className="text-sm font-bold text-stone-100 font-mono">
            {metrics?.totalJournalEntries || 2}
          </div>
          <div className="text-[10px] text-stone-500">Firestore isolated</div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-3 space-y-1">
          <div className="text-[10px] font-mono text-stone-400">Uptime & Success Rate</div>
          <div className="text-xs font-semibold text-emerald-400 font-mono">
            {metrics?.apiSuccessRate || 99.8}%
          </div>
          <div className="text-[10px] text-stone-500">Up {metrics?.uptimeSeconds || 120}s</div>
        </div>
      </div>

      {/* Feature Flags Toggle Panel */}
      {metrics?.featureFlags && (
        <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-200">
              System Feature Flags & Safety Gates
            </div>
            <span className="text-[10px] font-mono text-stone-500">Live Config</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(metrics.featureFlags).map(([flag, val]) => (
              <div
                key={flag}
                onClick={() => handleToggleFlag(flag, Boolean(val))}
                className={`flex items-center justify-between rounded-lg border p-2.5 cursor-pointer transition-colors ${
                  val
                    ? 'border-amber-500/30 bg-amber-500/10'
                    : 'border-stone-800 bg-stone-900/50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-stone-200">{flag}</div>
                  <div className="text-[10px] font-mono text-stone-400">
                    {val ? 'ENABLED' : 'DISABLED'}
                  </div>
                </div>
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    val ? 'border-amber-400 bg-amber-400' : 'border-stone-600'
                  }`}
                >
                  {val && <CheckCircle2 className="h-3 w-3 text-stone-950" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Audit Log Stream */}
      <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-stone-200">
              Append-Only Security & Access Audit Trail
            </span>
          </div>
          <span className="text-[10px] font-mono text-stone-500">
            {auditLogs.length} events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead>
              <tr className="border-b border-stone-800 text-stone-500">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Resource</th>
                <th className="pb-2">IP (Masked)</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-900 text-stone-300">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-900/40">
                  <td className="py-2 text-stone-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 font-semibold text-amber-400">{log.action}</td>
                  <td className="py-2 text-stone-400">{log.resource}</td>
                  <td className="py-2 text-stone-500">{log.ipAddressMasked}</td>
                  <td className="py-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-2 text-stone-400 max-w-xs truncate font-sans text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
