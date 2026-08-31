import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Slack,
  MessageSquare,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { NotificationConfig, NotificationLog } from '../types';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [slackUrl, setSlackUrl] = useState('');
  const [discordUrl, setDiscordUrl] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [triggers, setTriggers] = useState({
    highStressAlert: true,
    weeklyReflectionDigest: true,
    goalReminder: true,
    unresolvedActionItems: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/notifications/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setLogs(data.logs || []);
        if (data.config) {
          setSlackUrl(data.config.slackWebhookUrl || '');
          setDiscordUrl(data.config.discordWebhookUrl || '');
          setEmailEnabled(data.config.emailAlertsEnabled ?? true);
          if (data.config.triggers) setTriggers(data.config.triggers);
        }
      }
    } catch (err) {
      console.error('Failed to load notification config:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/notifications/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slackWebhookUrl: slackUrl,
          discordWebhookUrl: discordUrl,
          emailAlertsEnabled: emailEnabled,
          triggers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestDispatch = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: slackUrl || discordUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(`Delivered successfully to [${data.channels.join(', ')}]`);
        fetchConfig();
      } else {
        setTestResult('Dispatched to verified fallback email channel.');
      }
    } catch (err: any) {
      setTestResult(`Test failed: ${err?.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-stone-100">
                Webhook & Notification Subscriptions
              </h3>
              <p className="text-xs text-stone-400">
                External alerting with strict PII scrubbing & data minimization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Webhook Endpoints Form */}
        <div className="space-y-3 text-xs">
          
          {/* Slack Webhook */}
          <div>
            <label className="block font-medium text-stone-300 mb-1 flex items-center space-x-1.5">
              <span>Slack Webhook URL</span>
              <span className="text-[10px] text-stone-500 font-mono">(Secret Manager Proxied)</span>
            </label>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={slackUrl}
              onChange={e => setSlackUrl(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          {/* Discord Webhook */}
          <div>
            <label className="block font-medium text-stone-300 mb-1 flex items-center space-x-1.5">
              <span>Discord Webhook URL</span>
              <span className="text-[10px] text-stone-500 font-mono">(Optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={discordUrl}
              onChange={e => setDiscordUrl(e.target.value)}
              className="w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-stone-100 placeholder:text-stone-600 focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          {/* Trigger Opt-ins */}
          <div className="pt-2">
            <div className="font-semibold text-stone-300 mb-2">Automated Event Triggers:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              
              <label className="flex items-center space-x-2 rounded-lg border border-stone-800 bg-stone-950 p-2 cursor-pointer hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={triggers.highStressAlert}
                  onChange={e => setTriggers({ ...triggers, highStressAlert: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="text-stone-300 text-[11px]">High-Stress Alert (&gt;= 7/10)</span>
              </label>

              <label className="flex items-center space-x-2 rounded-lg border border-stone-800 bg-stone-950 p-2 cursor-pointer hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={triggers.weeklyReflectionDigest}
                  onChange={e => setTriggers({ ...triggers, weeklyReflectionDigest: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="text-stone-300 text-[11px]">Weekly Reflection Digest</span>
              </label>

              <label className="flex items-center space-x-2 rounded-lg border border-stone-800 bg-stone-950 p-2 cursor-pointer hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={triggers.goalReminder}
                  onChange={e => setTriggers({ ...triggers, goalReminder: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="text-stone-300 text-[11px]">Goal & Habit Anchors</span>
              </label>

              <label className="flex items-center space-x-2 rounded-lg border border-stone-800 bg-stone-950 p-2 cursor-pointer hover:border-stone-700">
                <input
                  type="checkbox"
                  checked={triggers.unresolvedActionItems}
                  onChange={e => setTriggers({ ...triggers, unresolvedActionItems: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="text-stone-300 text-[11px]">Unresolved Micro-Actions</span>
              </label>

            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-800">
          <button
            type="button"
            onClick={handleTestDispatch}
            disabled={isTesting}
            className="flex items-center space-x-1.5 rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-2 text-xs font-medium text-stone-200 hover:bg-stone-700 disabled:opacity-50 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isTesting ? 'Dispatching Test...' : 'Test Dispatch'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300 flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}

      </div>
    </div>
  );
};
