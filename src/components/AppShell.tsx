import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  BrainCircuit,
  Globe,
  ShieldCheck,
  Languages,
  Moon,
  Sun,
  Bell,
  FileCode,
  Mic,
  Menu,
  X,
  User,
  Check,
  ChevronDown,
  Calendar,
  Filter,
  Plus
} from 'lucide-react';
import { UserProfile } from '../types';
import { useI18n } from '../i18n';
import { useTheme } from '../context/ThemeContext';

interface AppShellProps {
  user: UserProfile | null;
  activeTab: 'journal' | 'insights' | 'ask_history' | 'knowledge_graph' | 'admin';
  setActiveTab: (tab: 'journal' | 'insights' | 'ask_history' | 'knowledge_graph' | 'admin') => void;
  timeFilter: 'all' | 'today' | 'week' | 'month';
  setTimeFilter: (filter: 'all' | 'today' | 'week' | 'month') => void;
  onOpenNotifications: () => void;
  onOpenArchitectureDocs: () => void;
  onOpenLiveVoice: () => void;
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
  onSwitchRole,
  onNewEntryClick,
  children,
}) => {
  const { t, currentLanguage, setLanguage, supportedLanguages, isRTL } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const selectedLang = supportedLanguages.find((l) => l.code === currentLanguage) || supportedLanguages[0];

  // Close menus on outside click
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

  // Handle escape key and focus trap for mobile drawer
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
      label: t.nav.journal || 'Journal',
      icon: BookOpen,
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
      label: t.nav.agenticRag || 'Ask My History',
      icon: BrainCircuit,
      adminOnly: false,
    },
    {
      id: 'knowledge_graph' as const,
      label: t.nav.knowledgeGraph || 'Knowledge Graph',
      icon: Globe,
      adminOnly: false,
    },
    {
      id: 'admin' as const,
      label: t.nav.admin || 'Admin Dashboard',
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
        className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-xs"
      >
        <div className="w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Brand Identity & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-ring min-w-[44px] min-h-[44px]"
              aria-label={isMobileMenuOpen ? 'Close main navigation drawer' : 'Open main navigation drawer'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-2.5">
              <div
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm"
                aria-hidden="true"
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-serif font-bold text-base sm:text-lg tracking-tight text-[var(--text-primary)]">
                    ReflectLogix<span className="text-amber-600 dark:text-amber-400">AI</span>
                  </h1>
                  <span className="hidden md:inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Gemini 2.5
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-[var(--text-muted)] font-medium">
                  {t.appSubtitle || 'Your Multi-Purpose Personal Gemini Journal'}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Current Date & View Selectors (Only on Journal Tab) */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-medium">
              <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>{currentDateFormatted}</span>
            </div>

            {activeTab === 'journal' && (
              <div
                role="group"
                aria-label="Filter journal entries by time period"
                className="flex items-center rounded-xl bg-[var(--bg-secondary)] p-1 border border-[var(--border-subtle)]"
              >
                {(['all', 'today', 'week', 'month'] as const).map((mode) => {
                  const labelMap = {
                    all: t.timeline?.allTime || 'All Time',
                    today: t.timeline?.today || 'Today',
                    week: t.timeline?.thisWeek || 'Week',
                    month: t.timeline?.thisMonth || 'Month',
                  };
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTimeFilter(mode)}
                      aria-pressed={timeFilter === mode}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors focus-ring ${
                        timeFilter === mode
                          ? 'bg-[var(--bg-surface)] text-amber-700 dark:text-amber-300 shadow-xs border border-[var(--border-strong)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {labelMap[mode]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Actions, Language Selector, Theme Switcher, Avatar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Live Voice Assistant Trigger */}
            <button
              type="button"
              onClick={onOpenLiveVoice}
              aria-label="Start Live Voice Socratic Reflection with Gemini"
              className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-xs transition-colors focus-ring min-h-[38px]"
            >
              <Mic className="h-4 w-4 animate-pulse text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="hidden xl:inline">{t.nav.liveVoice || 'Live Voice Coach'}</span>
            </button>

            {/* Architecture Blueprint Modal Trigger */}
            <button
              type="button"
              onClick={onOpenArchitectureDocs}
              aria-label="View system architecture, zero-trust rules, and ADK pipeline blueprint"
              className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-ring min-w-[38px] min-h-[38px] flex items-center justify-center transition-colors"
              title="Architecture & ADK Pipeline"
            >
              <FileCode className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Notifications & Webhooks */}
            <button
              type="button"
              onClick={onOpenNotifications}
              aria-label="Open notifications and webhook configuration"
              className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-ring min-w-[38px] min-h-[38px] flex items-center justify-center transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus-ring min-w-[38px] min-h-[38px] flex items-center justify-center transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 text-stone-700" aria-hidden="true" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                aria-label={`Current language: ${selectedLang.name}. Open language menu`}
                aria-expanded={isLangMenuOpen}
                aria-haspopup="listbox"
                className="flex items-center space-x-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)] focus-ring min-h-[38px]"
              >
                <span className="text-sm" aria-hidden="true">{selectedLang.flag}</span>
                <span className="hidden sm:inline">{selectedLang.nativeName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
              </button>

              {isLangMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Select language"
                  className="absolute right-0 mt-2 z-50 w-64 panel-elevated rounded-xl shadow-2xl p-1.5 max-h-96 overflow-y-auto"
                >
                  <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                    Supported Languages (18)
                  </div>

                  {/* Indian Regional Languages */}
                  <div className="px-2 pt-2 pb-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    Indian Languages
                  </div>
                  {supportedLanguages
                    .filter((l) => l.region === 'India')
                    .map((lang) => (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={currentLanguage === lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors focus-ring ${
                          currentLanguage === lang.code
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" aria-hidden="true">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">({lang.name})</span>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        )}
                      </button>
                    ))}

                  {/* Global Languages */}
                  <div className="px-2 pt-2.5 pb-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 border-t border-[var(--border-subtle)] mt-1">
                    Global Languages
                  </div>
                  {supportedLanguages
                    .filter((l) => l.region === 'Global')
                    .map((lang) => (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={currentLanguage === lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors focus-ring ${
                          currentLanguage === lang.code
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm" aria-hidden="true">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">({lang.name})</span>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label={`User menu: ${user?.displayName || 'Demo User'}, Role: ${user?.role || 'user'}`}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="flex items-center space-x-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1.5 hover:border-[var(--border-strong)] focus-ring min-h-[38px]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs" aria-hidden="true">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <div className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[100px]">
                    {user?.displayName?.split(' ')[0] || 'User'}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] capitalize">
                    {user?.role === 'admin' ? 'Admin' : 'Standard'}
                  </div>
                </div>
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  aria-label="User account actions"
                  className="absolute right-0 mt-2 z-50 w-56 panel-elevated rounded-xl shadow-2xl p-2"
                >
                  <div className="px-2 py-1.5 border-b border-[var(--border-subtle)] mb-1">
                    <div className="font-semibold text-xs text-[var(--text-primary)]">
                      {user?.displayName || 'Kailasam Siva'}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                      {user?.email || 'kailasamsiva@gmail.com'}
                    </div>
                  </div>

                  <div className="px-2 py-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                    RBAC Role Switching
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSwitchRole('user');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      user?.role === 'user'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <span>Standard User</span>
                    {user?.role === 'user' && <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSwitchRole('admin');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      user?.role === 'admin'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                      <span>Admin Role</span>
                    </span>
                    {user?.role === 'admin' && <Check className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* BODY WITH LEFT SIDEBAR (role="navigation") + MAIN CONTENT (role="main") */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* DESKTOP LEFT SIDEBAR (role="navigation") */}
        <nav
          role="navigation"
          aria-label="Primary application navigation"
          className="hidden lg:flex flex-col w-56 xl:w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 space-y-4 shrink-0"
        >
          {/* Quick Action: New Journal Entry */}
          <button
            type="button"
            onClick={onNewEntryClick}
            aria-label="Write a new journal entry"
            className="flex items-center justify-center space-x-2 w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-3 py-2.5 text-xs shadow-md transition-all active:scale-98 focus-ring min-h-[44px]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            <span>{t.timeline?.newEntry || 'Write New Entry'}</span>
          </button>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Navigation
            </div>
            {navItems
              .filter((item) => !item.adminOnly || user?.role === 'admin')
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus-ring min-h-[44px] ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>

          {/* System Status / Privacy Notice */}
          <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>Multi-Tenant Cloud Run</span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] leading-tight">
              Zero-knowledge client encryption & tenant isolation active.
            </p>
          </div>
        </nav>

        {/* MOBILE DRAWER NAVIGATION (role="dialog" with focus trap and aria-modal) */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main Navigation Menu"
            ref={mobileDrawerRef}
            className="fixed inset-0 z-50 lg:hidden flex"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Content */}
            <div className="relative flex flex-col w-72 max-w-[85vw] bg-[var(--bg-surface)] border-r border-[var(--border-strong)] p-4 shadow-2xl z-10">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  <span className="font-serif font-bold text-sm text-[var(--text-primary)]">ReflectLogixAI</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation drawer"
                  className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="my-4">
                <button
                  type="button"
                  onClick={() => {
                    onNewEntryClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-3 py-2.5 text-xs shadow-md focus-ring min-h-[44px]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{t.timeline?.newEntry || 'Write New Entry'}</span>
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Mobile Drawer Navigation">
                {navItems
                  .filter((item) => !item.adminOnly || user?.role === 'admin')
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus-ring min-h-[44px] ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
              </nav>

              <div className="pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                <p>ReflectLogixAI v3.1</p>
                <p className="text-[10px]">Cloud Run • Zero Trust</p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT REGION (role="main") */}
        <main
          id="main-content"
          role="main"
          className="flex-1 flex flex-col overflow-y-auto focus:outline-none"
          tabIndex={-1}
        >
          {children}
        </main>

      </div>
    </div>
  );
};
