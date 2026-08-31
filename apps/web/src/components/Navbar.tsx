import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Cpu,
  Globe,
  Bell,
  Sliders,
  FileCode,
  Sparkles,
  Mic,
  Languages,
  ChevronDown,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { useI18n } from '../i18n';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: 'journal' | 'history_rag' | 'knowledge_graph' | 'analytics' | 'admin';
  setActiveTab: (tab: 'journal' | 'history_rag' | 'knowledge_graph' | 'analytics' | 'admin') => void;
  onOpenNotifications: () => void;
  onOpenArchitectureDocs: () => void;
  onOpenLiveVoice: () => void;
  onSwitchRole: (role: 'user' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenArchitectureDocs,
  onOpenLiveVoice,
  onSwitchRole,
}) => {
  const { t, currentLanguage, setLanguage, supportedLanguages } = useI18n();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const selectedLangObj = supportedLanguages.find((l) => l.code === currentLanguage) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-800/80 bg-stone-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-lg font-bold tracking-tight text-stone-100">
                {t.appName}
              </h1>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                Cloud Run • ADK V3
              </span>
            </div>
            <p className="hidden text-[11px] text-stone-400 sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-stone-900/60 p-1 border border-stone-800/80 backdrop-blur-md">
          <button
            id="nav-journal-tab"
            onClick={() => setActiveTab('journal')}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'journal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t.nav.journal}</span>
          </button>

          <button
            id="nav-rag-tab"
            onClick={() => setActiveTab('history_rag')}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'history_rag'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{t.nav.agenticRag}</span>
          </button>

          <button
            id="nav-graph-tab"
            onClick={() => setActiveTab('knowledge_graph')}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'knowledge_graph'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{t.nav.knowledgeGraph}</span>
          </button>

          <button
            id="nav-analytics-tab"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{t.nav.analytics}</span>
          </button>

          {user?.role === 'admin' && (
            <button
              id="nav-admin-tab"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                  : 'text-rose-400 hover:text-rose-200 hover:bg-rose-950/30'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{t.nav.admin}</span>
            </button>
          )}
        </nav>

        {/* Right: Language Selector, Voice, Notifications & Account */}
        <div className="flex items-center space-x-2">
          
          {/* Gemini Live Voice Assistant Quick Trigger */}
          <button
            id="nav-live-voice-btn"
            onClick={onOpenLiveVoice}
            title={t.voice.title}
            className="flex items-center space-x-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-3 py-1.5 text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:from-amber-500/30 hover:to-amber-600/20 hover:border-amber-400 transition-all active:scale-95"
          >
            <Mic className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{t.nav.liveVoice}</span>
          </button>

          {/* Dynamic Language Selector Dropdown */}
          <div className="relative">
            <button
              id="nav-language-selector"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center space-x-1.5 rounded-xl border border-stone-800 bg-stone-900/80 px-2.5 py-1.5 text-xs font-medium text-stone-200 hover:border-amber-500/40 hover:text-amber-300 transition-all"
              title="Change Interface Language"
            >
              <span className="text-sm">{selectedLangObj.flag}</span>
              <span className="hidden sm:inline font-sans">{selectedLangObj.nativeName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-64 glass-panel-elevated rounded-xl border border-stone-700/80 shadow-2xl p-1.5 max-h-96 overflow-y-auto">
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-800">
                    Indian & Global Languages
                  </div>

                  {/* Section: Indian Languages */}
                  <div className="px-2 pt-2 pb-1 text-[10px] font-semibold text-amber-400/90">
                    Indian Languages (భారతీయ భాషలు)
                  </div>
                  {supportedLanguages
                    .filter((l) => l.region === 'India')
                    .map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-amber-500/20 text-amber-300 font-medium'
                            : 'text-stone-300 hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-stone-400">({lang.name})</span>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </button>
                    ))}

                  {/* Section: Global Languages */}
                  <div className="px-2 pt-2.5 pb-1 text-[10px] font-semibold text-amber-400/90 border-t border-stone-800/80 mt-1">
                    Global Languages
                  </div>
                  {supportedLanguages
                    .filter((l) => l.region === 'Global')
                    .map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-amber-500/20 text-amber-300 font-medium'
                            : 'text-stone-300 hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-stone-400">({lang.name})</span>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>

          {/* Architecture Blueprint Modal */}
          <button
            id="nav-arch-btn"
            onClick={onOpenArchitectureDocs}
            title="System Architecture Blueprint"
            className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-stone-800 bg-stone-900/80 px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
          >
            <FileCode className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.nav.architecture}</span>
          </button>

          {/* Notifications */}
          <button
            id="nav-notifications-btn"
            onClick={onOpenNotifications}
            title={t.nav.notifications}
            className="rounded-xl border border-stone-800 bg-stone-900/80 p-2 text-stone-300 hover:border-stone-700 hover:text-amber-300 transition-colors"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* User Role Switcher */}
          <div className="flex items-center space-x-1.5 border-l border-stone-800/80 pl-2">
            <button
              id="role-switch-btn"
              onClick={() => onSwitchRole(user?.role === 'admin' ? 'user' : 'admin')}
              title={user?.role === 'admin' ? 'Switch to User mode' : 'Switch to Admin mode'}
              className="flex items-center space-x-1.5 rounded-xl bg-stone-900/90 border border-stone-800 px-2.5 py-1.5 text-xs text-stone-300 hover:border-stone-700 transition-all"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {user?.displayName ? user.displayName.charAt(0) : 'K'}
              </div>
              <span className="text-[11px] font-medium hidden sm:inline">
                {user?.role === 'admin' ? t.nav.roleAdmin : t.nav.roleUser}
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-stone-800/60 bg-stone-950/90 px-2 py-1.5 overflow-x-auto space-x-1">
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs ${
            activeTab === 'journal' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          <BookOpen className="h-3 w-3" />
          <span>{t.nav.journal}</span>
        </button>
        <button
          onClick={() => setActiveTab('history_rag')}
          className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs ${
            activeTab === 'history_rag' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          <Cpu className="h-3 w-3" />
          <span>{t.nav.agenticRag}</span>
        </button>
        <button
          onClick={() => setActiveTab('knowledge_graph')}
          className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs ${
            activeTab === 'knowledge_graph' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          <Globe className="h-3 w-3" />
          <span>{t.nav.knowledgeGraph}</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs ${
            activeTab === 'analytics' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          <Sliders className="h-3 w-3" />
          <span>{t.nav.analytics}</span>
        </button>
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs ${
              activeTab === 'admin' ? 'bg-rose-500/20 text-rose-300' : 'text-rose-400'
            }`}
          >
            <ShieldCheck className="h-3 w-3" />
            <span>{t.nav.admin}</span>
          </button>
        )}
      </div>
    </header>
  );
};
