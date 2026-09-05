export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  
  // Navigation
  nav: {
    journal: string;
    reflectionCoach?: string;
    multimodal?: string;
    healthSync?: string;
    lifestyleFlashcards?: string;
    lifePlanner?: string;
    agenticRag: string;
    knowledgeGraph: string;
    analytics: string;
    about?: string;
    faq?: string;
    settings?: string;
    admin: string;
    architecture: string;
    notifications: string;
    liveVoice: string;
    language: string;
    roleUser: string;
    roleAdmin: string;
    dailyCheckin?: string;
    newReflection?: string;
  };

  multimodal?: {
    title: string;
    subtitle: string;
    gcsBucket: string;
    analyzeBtn: string;
    analyzing: string;
    stickyNote: string;
    handwrittenNote: string;
    voiceNote: string;
    videoLog: string;
  };

  // Timeline / Left Pane
  timeline: {
    title: string;
    searchPlaceholder: string;
    allTime: string;
    today: string;
    thisWeek: string;
    thisMonth: string;
    allMoods: string;
    allTags: string;
    newEntry: string;
    noEntriesFound: string;
    noEntriesMatch: string;
    words: string;
    actions: string;
    todayGroup: string;
    yesterdayGroup: string;
    thisWeekGroup: string;
    earlierGroup: string;
  };

  // Journal Editor
  editor: {
    writeReflection: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    languageLabel: string;
    tagsLabel: string;
    addTagPlaceholder: string;
    autoAnalyze: string;
    autoAnalyzeDesc: string;
    sensitiveEntry: string;
    sensitiveDesc: string;
    detoxMode: string;
    detoxDesc: string;
    liveVoiceBtn: string;
    recordVoiceBtn: string;
    recording: string;
    saveAndAnalyze: string;
    saving: string;
    cancel: string;
    wordCount: string;
    tokenEst: string;
    readingTime: string;
  };

  // Reflection Card
  reflection: {
    title: string;
    agentOrchestrated: string;
    summary: string;
    socraticTitle: string;
    strengthsTitle: string;
    reframingTitle: string;
    microActionsTitle: string;
    actionProgress: string;
    valence: string;
    arousal: string;
    stressScore: string;
    chatWithCoach: string;
    chatPlaceholder: string;
    send: string;
    coachResponding: string;
    noActionsYet: string;
    markDone: string;
    markUndone: string;
  };

  // Live Voice Assistant
  voice: {
    title: string;
    subtitle: string;
    startSession: string;
    stopSession: string;
    listening: string;
    speaking: string;
    connecting: string;
    idle: string;
    transcriptPlaceholder: string;
    userSaid: string;
    coachSaid: string;
    saveToJournal: string;
    voiceTone: string;
    toneEmpathetic: string;
    toneSocratic: string;
    toneUplifting: string;
    toneCalm: string;
    soundWave: string;
    clearTranscript: string;
    micPermissionError: string;
  };

  // Right Insights Pane
  insights: {
    title: string;
    affectCurve: string;
    moodTrends: string;
    activeStreak: string;
    streakDays: string;
    totalReflections: string;
    avgStress: string;
    positivityRatio: string;
    adkTraces: string;
    viewExecutionDAG: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    close: string;
    refresh: string;
    delete: string;
    deleteConfirm: string;
    edit: string;
    save: string;
    copy: string;
    copied: string;
  };
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}
