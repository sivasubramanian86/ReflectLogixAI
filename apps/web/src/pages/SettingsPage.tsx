import React, { useState } from 'react';
import { Settings, Globe, Moon, Sun, Bell, Shield, Heart, Save, Check } from 'lucide-react';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { UserProfile } from '../types';

interface SettingsPageProps {
  user: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onOpenNotifications: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateProfile,
  onOpenNotifications,
}) => {
  const { currentLanguage, setLanguage, supportedLanguages } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Reflective Journaler');
  const [bilingualOutput, setBilingualOutput] = useState(user?.bilingualOutput ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      displayName,
      bilingualOutput,
      preferredLanguage: supportedLanguages.find(l => l.code === currentLanguage)?.name || 'English'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <Settings className="h-4 w-4" />
          <span>Preferences & Space Configuration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Settings & Preferences
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)]">
          Customize your reflection sanctuary, language, theme, and privacy preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Personal Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="display-name" className="text-sm font-semibold text-[var(--text-secondary)]">
                Display Name
              </label>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input focus-ring text-base"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-secondary)]">
                Account Role
              </label>
              <div className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-secondary)] flex items-center justify-between">
                <span>{user?.role === 'admin' ? 'Workspace Admin' : 'Personal Journaler'}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold uppercase">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Output Preferences */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center space-x-2.5">
            <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Language & Internationalization</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="language-select" className="text-sm font-semibold text-[var(--text-secondary)]">
                Preferred Reflection Language
              </label>
              <select
                id="language-select"
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl glass-input focus-ring text-base"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] mt-auto">
              <div className="space-y-0.5 pr-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Bilingual Reflection Output</span>
                <p className="text-xs text-[var(--text-muted)]">Show translation side-by-side with original text</p>
              </div>
              <input
                type="checkbox"
                checked={bilingualOutput}
                onChange={(e) => setBilingualOutput(e.target.checked)}
                className="h-5 w-5 rounded-md accent-teal-600 focus-ring"
                aria-label="Toggle bilingual reflection output"
              />
            </div>
          </div>
        </div>

        {/* Theme & Aesthetics */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-amber-400" />
              ) : (
                <Sun className="h-5 w-5 text-amber-600" />
              )}
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Appearance & Color Theme</h2>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] text-sm font-medium text-[var(--text-primary)] focus-ring flex items-center space-x-2"
            >
              <span>Switch to {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>
        </div>

        {/* Notification Integration */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Bell className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Notification Channels</h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">Configure optional Slack, Discord, or email check-in alerts</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenNotifications}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium focus-ring"
            >
              Manage Alerts
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {savedSuccess && (
            <div className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400 text-sm font-semibold animate-in fade-in">
              <Check className="h-4 w-4" />
              <span>Preferences saved successfully!</span>
            </div>
          )}
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-sm focus-ring"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
