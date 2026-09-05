import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Compass,
  Globe,
  ShieldCheck,
  Languages,
  Moon,
  Sun,
  Bell,
  Mic,
  Menu,
  X,
  User,
  Check,
  ChevronDown,
  Calendar,
  Settings,
  Heart,
  HelpCircle,
  Plus
} from 'lucide-react';
import { UserProfile, NavigationTab } from '../types';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';

interface AppShellProps {
  user: UserProfile | null;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  timeFilter: 'all' | 'today' | 'week' | 'month';
  setTimeFilter: (filter: 'all' | 'today' | 'week' | 'month') => void;
  onOpenNotifications: () => void;
  onOpenArchitectureDocs: () => void;
  onOpenLiveVoice: () => void;
  onOpenArrivalModal: () => void;
  onSwitchRole: (role: 'user' | 'admin') => void;
  onNewEntryClick: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  user,
  activeTab,
  setActiveTab,
  timeFilter,
  setTimeFilter,
  onOpenNotifications,
  onOpenArchitectureDocs,
  onOpenLiveVoice,
  onOpenArrivalModal,
  onSwitchRole,
  onNewEntryClick,
  children,
}) => {
  const { t, currentLanguage, setLanguage, supportedLanguages } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const selectedLang = supportedLanguages.find((l) => l.code === currentLanguage) || supportedLanguages[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        setIsLangMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navItems = [
    {
      id: 'journal' as const,
      label: t.nav.journal || 'My Journal',
      icon: BookOpen,
      adminOnly: false,
    },
    {
      id: 'multimodal' as const,
      label: t.nav.multimodal || 'Multi-Modal Media Studio',
      icon: Sparkles,
      adminOnly: false,
    },
    {
      id: 'health_sync' as const,
      label: t.nav.healthSync || 'Health & Wearables',
      icon: Heart,
      adminOnly: false,
    },
    {
      id: 'lifestyle_flashcards' as const,
      label: t.nav.lifestyleFlashcards || 'Longevity Flashcards',
      icon: Sparkles,
      adminOnly: false,
    },
    {
      id: 'life_planner' as const,
      label: t.nav.lifePlanner || 'Life & Goals Planner',
      icon: Compass,
      adminOnly: false,
    },
    {
      id: 'insights' as const,
      label: t.nav.analytics || 'Insights & Trends',
      icon: TrendingUp,
      adminOnly: false,
    },
    {
      id: 'ask_history' as const,
      label: t.nav.agenticRag || 'Deep Reflections',
      icon: BookOpen,
      adminOnly: false,
    },
    {
      id: 'knowledge_graph' as const,
      label: t.nav.knowledgeGraph || 'Journey Map',
      icon: Globe,
      adminOnly: false,
    },
    {
      id: 'about' as const,
      label: t.nav.about || 'About ReflectLogixAI',
      icon: Heart,
      adminOnly: false,
    },
    {
      id: 'faq' as const,
      label: t.nav.faq || 'FAQ & Help',
      icon: HelpCircle,
      adminOnly: false,
    },
    {
      id: 'settings' as const,
      label: t.nav.settings || 'Settings',
      icon: Settings,
      adminOnly: false,
    },
    {
      id: 'admin' as const,
      label: t.nav.admin || 'Space Settings',
      icon: ShieldCheck,
      adminOnly: true,
    },
  ];

  const currentDateFormatted = new Date().toLocaleDateString(
    currentLanguage === 'en' ? 'en-US' : currentLanguage,
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* WCAG Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* TOP APP BAR (role="banner") */}
      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-xl shadow-xs"
      >
        <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-ring min-w-[44px] min-h-[44px]"
              aria-label={isMobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 shadow-xs"
                aria-hidden="true"
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg sm:text-xl tracking-tight text-[var(--text-primary)]">
                    ReflectLogix<span className="text-teal-600 dark:text-teal-400">AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300 border border-teal-500/20">
                    Clarity Companion
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-[var(--text-muted)] font-medium">
                  {t.appSubtitle || 'Your Personal Life Reflection & Mindful Haven'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Friendly View Switcher (Journal Tab) */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-medium">
              <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>{currentDateFormatted}</span>
            </div>

            {activeTab === 'journal' && (
              <div
                role="group"
                aria-label="Filter journal entries by time period"
                className="flex items-center rounded-xl bg-[var(--bg-secondary)] p-1 border border-[var(--border-subtle)]"
              >
                {(['all', 'today', 'week', 'month'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setTimeFilter(filterKey)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors focus-ring ${
                      timeFilter === filterKey
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {filterKey === 'all' && (t.timeline.allTime || 'All Entries')}
                    {filterKey === 'today' && (t.timeline.today || 'Today')}
                    {filterKey === 'week' && (t.timeline.thisWeek || 'This Week')}
                    {filterKey === 'month' && (t.timeline.thisMonth || 'This Month')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions, Language, Theme, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Daily Arrival Check-in Button */}
            <button
              type="button"
              onClick={onOpenArrivalModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-bold focus-ring min-h-[40px]"
              aria-label="Open daily check-in"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">{t.nav.dailyCheckin || 'Daily Check-in'}</span>
            </button>

            {/* Language Dropdown Menu */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-ring min-h-[40px]"
                aria-label={`Language selector. Current: ${selectedLang.name}`}
                aria-expanded={isLangMenuOpen}
              >
                <Languages className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="hidden md:inline">{selectedLang.name}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-white/40 dark:border-white/10 shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] mb-1">
                    {t.nav.language || 'Select Language'} (18+)
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-teal-600 text-white font-bold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <span>{lang.name} ({lang.nativeName})</span>
                      {currentLanguage === lang.code && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-ring min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Settings Quick Icon */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-ring min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Open Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* User Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 hover:border-[var(--border-strong)] focus-ring min-h-[40px]"
                aria-label="User profile menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="h-7 w-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
                </div>
                <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-white/40 dark:border-white/10 shadow-2xl p-2 z-50 space-y-1">
                  <div className="p-2.5 border-b border-[var(--border-subtle)]">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {user?.displayName || 'Siva'}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-teal-500/10 text-[10px] font-bold text-teal-700 dark:text-teal-300">
                      {user?.role === 'admin' ? (t.nav.roleAdmin || 'Admin View') : (t.nav.roleUser || 'User View')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSwitchRole(user?.role === 'admin' ? 'user' : 'admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  >
                    <span>Switch to {user?.role === 'admin' ? (t.nav.roleUser || 'User View') : (t.nav.roleAdmin || 'Admin View')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>{t.nav.settings || 'Settings'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BODY SHELL: SIDEBAR NAVIGATION + MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation (role="navigation") */}
        <nav
          role="navigation"
          aria-label="Main sidebar navigation"
          className="hidden lg:flex flex-col w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 backdrop-blur-md p-4 space-y-6 shrink-0"
        >
          {/* Quick New Reflection Button */}
          <button
            type="button"
            onClick={onNewEntryClick}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] focus-ring min-h-[46px]"
          >
            <Plus className="h-4 w-4" />
            <span>{t.timeline.newEntry || 'New Reflection'}</span>
          </button>

          {/* Navigation Links */}
          <ul role="list" className="space-y-1 flex-1">
            {navItems.map((item) => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all focus-ring ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sidebar Footer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
            <p className="font-semibold text-[var(--text-secondary)]">ReflectLogixAI v3.1</p>
            <p>Private & Secure Sanctuary</p>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-[var(--bg-surface)] p-5 space-y-5 border-r border-[var(--border-subtle)] shadow-2xl z-10">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <span className="font-bold text-base text-[var(--text-primary)]">Navigation</span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul role="list" className="space-y-1.5 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                  if (item.adminOnly && user?.role !== 'admin') return null;
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-teal-600 text-white font-bold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* MAIN APPLICATION CONTENT (role="main") */}
        <main id="main-content" role="main" className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>

      {/* Floating 3D Live Voice Assistant Trigger Pill */}
      <button
        type="button"
        onClick={onOpenLiveVoice}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-cyan-500/40 text-white shadow-2xl hover:shadow-cyan-500/30 backdrop-blur-xl transition-all hover:scale-105 group focus-ring cursor-pointer"
        aria-label="Open Nova Live 3D Voice Assistant"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-cyan-400 shadow-md">
          <img src="/assets/avatar.jpg" alt="Nova" className="w-full h-full object-cover" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-slate-900 animate-pulse" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-pink-200">
            Nova Live Assistant
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Talk & Synthesize</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
          <Mic className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
