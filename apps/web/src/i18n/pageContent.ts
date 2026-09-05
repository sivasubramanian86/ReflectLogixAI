/**
 * Comprehensive Localized Page Content for ReflectLogixAI
 * Supports 18 Languages: en, ta, hi, te, kn, ml, bn, mr, gu, pa, es, fr, de, ja, zh, ar, pt, ru
 */

export interface LocalizedFAQ {
  q: string;
  a: string;
}

export interface LocalizedAbout {
  welcomeTitle: string;
  welcomeDesc: string;
  principles: {
    socraticTitle: string;
    socraticDesc: string;
    mediaTitle: string;
    mediaDesc: string;
    healthTitle: string;
    healthDesc: string;
    privacyTitle: string;
    privacyDesc: string;
  };
  multilingualTitle: string;
  multilingualDesc: string;
}

export interface LocalizedDeepReflections {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  searchingBtn: string;
  examplePromptsTitle: string;
  examplePrompts: string[];
  resultsTitle: string;
  matchSuffix: string;
  sampleResults: Array<{
    title: string;
    snippet: string;
    tags: string[];
    date: string;
  }>;
}

export interface LocalizedSampleJournal {
  id: string;
  title: string;
  content: string;
  summary: string;
  socraticQuestions: string[];
  reframeSuggestions: string[];
  cognitiveStrengths: string[];
  keyThemes: string[];
  microActions: Array<{
    title: string;
    description: string;
  }>;
}

export const LOCALIZED_PAGE_DATA: Record<string, {
  faqs: LocalizedFAQ[];
  about: LocalizedAbout;
  rag: LocalizedDeepReflections;
  sampleJournals: Record<string, LocalizedSampleJournal>;
}> = {
  en: {
    faqs: [
      {
        q: "How does the Socratic Reflection Coach work?",
        a: "The Reflection Coach utilizes Google Gemini 3.7 / 2.5 Flash and Google ADK to perform cognitive reframing. Rather than giving unsolicited advice, it poses deep Socratic questions, validates your cognitive strengths, and synthesizes 15-minute actionable micro-steps."
      },
      {
        q: "How does the Media Studio process multi-modal inputs?",
        a: "You can upload sticky notes, handwritten notebook scans, 1-minute voice memos, or video logs. Everything is stored securely in Google Cloud Storage (gs://reflectlogix-media-genai-apac/) and analyzed by Gemini 2.5 Multi-Modal OCR and audio transcription to automatically produce reflective journal entries."
      },
      {
        q: "Is my reflection and health data private and secure?",
        a: "Yes, completely. ReflectLogixAI enforces zero-trust tenant isolation with Cloud Firestore security rules (request.auth.uid == userId) and Cloud KMS envelope encryption. Your data is never shared with third parties or used to train foundation models. You can also enable Detox Mode for ephemeral sessions with zero data retention."
      },
      {
        q: "How does Smart Health & Wearables synchronization work?",
        a: "ReflectLogixAI integrates with Google Health Connect, Apple Health, Samsung Health, and Garmin. It correlates physiological metrics (Resting Heart Rate, HRV, REM/Deep sleep stages, daily steps) with subjective journal emotional valence to identify burnout triggers early."
      },
      {
        q: "How do I interact with Nova Live 3D Voice Assistant?",
        a: "Click the floating Nova assistant orb in the bottom-right corner or the Live Voice button. Nova features dynamic 18-language voice synthesis, real-time waveform visualization, and hands-free spoken journaling."
      },
      {
        q: "Can I journal in languages other than English?",
        a: "Yes! ReflectLogixAI supports 18 languages: English, Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, and Chinese."
      }
    ],
    about: {
      welcomeTitle: "Welcome to ReflectLogixAI",
      welcomeDesc: "Your Multi-Purpose Personal Gemini Journal & Socratic Life Companion — a calm, zero-trust sanctuary designed to help you pause, reflect with clarity, and navigate life with self-compassion and actionable momentum.",
      principles: {
        socraticTitle: "Socratic Reflection Coaching",
        socraticDesc: "Multi-agent cognitive reframing powered by Gemini 3.7 & 2.5 Flash, identifying cognitive distortions and synthesizing 15-minute high-impact micro-actions.",
        mediaTitle: "Multi-Modal Media Studio",
        mediaDesc: "Seamlessly capture Sticky Notes, Handwritten journal scans, 1-Minute voice memos, and video reflection logs stored securely in Google Cloud Storage.",
        healthTitle: "Smart Wearable Biometrics",
        healthDesc: "Correlate daily journal valence with resting heart rate, HRV, deep sleep stages, and step counts via Health Connect, Samsung Health, Apple HealthKit, and Garmin.",
        privacyTitle: "Zero-Trust Privacy & Cloud Run",
        privacyDesc: "User-isolated Firestore security rules, Google Cloud Secret Manager vaulting, and ephemeral Detox Mode ensure total personal data sovereignty."
      },
      multilingualTitle: "18-Language Internationalization",
      multilingualDesc: "ReflectLogixAI provides native conversational and reflective capabilities across Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, Chinese, and English."
    },
    rag: {
      title: "Deep Reflections • Semantic Memory RAG",
      subtitle: "Query your historical reflections via Cloud SQL pgvector cosine similarity to surface past breakthroughs and emotional insights.",
      searchPlaceholder: "Search thoughts, tags, themes or questions...",
      searchBtn: "Search History",
      searchingBtn: "Searching Memories...",
      examplePromptsTitle: "Example Inquiry Prompts",
      examplePrompts: [
        "What moments brought me the most calm and clarity recently?",
        "How did I handle stress or burnout during busy weeks?",
        "What goals or personal habits did I celebrate achieving?",
        "What are the recurring themes in my thoughts about growth?"
      ],
      resultsTitle: "Retrieved Memory Results",
      matchSuffix: "match",
      sampleResults: [
        {
          title: "Reflections on Sustainable Pacing",
          snippet: "Taking intentional morning pauses transformed how I handled high workload demands with calm focus.",
          tags: ["Mindfulness", "Work", "Calm"],
          date: "Yesterday"
        },
        {
          title: "Evening Walk & Cognitive Rest",
          snippet: "Disconnecting from screens after dinner brought immediate mental relief and restorative sleep.",
          tags: ["Health", "Rest", "Habits"],
          date: "3 days ago"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "Dawn Reflections on Systems Architecture and Deep Work",
        content: `Today began with crisp morning stillness. I spent the first hour sketching the ADK agent orchestration graph for the new Cloud Run deployment.
Taking thirty seconds to pause, breathe, and ground myself before jumping into complex distributed systems logic made a world of difference.
Goal for this evening: disconnect completely by 9 PM to preserve restorative sleep cycles.`,
        summary: "Balanced morning combining systems architecture design with mindful pacing and an explicit sleep hygiene boundary.",
        socraticQuestions: [
          "What physical cues tell you your bandwidth is fragmenting before it impacts your mood?",
          "How can you replicate this calm dawn environment on high-intensity sprint days?"
        ],
        reframeSuggestions: ["Acknowledge that strategic pauses accelerate system velocity rather than slowing you down."],
        cognitiveStrengths: ["High metacognitive awareness", "Proactive boundary setting for recovery"],
        keyThemes: ["Mindful Resilience", "Architecture Pacing", "Sleep Hygiene"],
        microActions: [
          { title: "9:00 PM Screen Shutdown", description: "Transition devices to charging station away from bedside." },
          { title: "Morning 5-Min Breathwork", description: "Perform 4-7-8 grounding breaths before checking email inbox." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "10,480 Steps Morning Clarity Walk in Nature",
        content: `Completed a brisk 10,480 steps walk through the park at sunrise.
Breathing in fresh air, noticing the bird calls, and feeling gratitude for good health.
Key realization: Slowing down intentionally actually speeds up long-term architectural clarity.`,
        summary: "Energizing sunrise walk with 10k steps and a pivotal mindset reframe on sustainable velocity.",
        socraticQuestions: [
          "How does physical movement change the way you approach complex engineering roadblocks?",
          "What is one small way to protect this morning walking ritual every single day?"
        ],
        reframeSuggestions: ["Anchor this post-walk mental clarity as your creative springboard for architecture."],
        cognitiveStrengths: ["Physical-mental integration", "Appreciation for restorative habits"],
        keyThemes: ["Physical Vitality", "Morning Clarity", "10k Steps"],
        microActions: [
          { title: "Hydrate & Electrolytes", description: "Drink 500ml water with electrolytes after morning walk." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "Important Meeting Reminder: APAC Cloud Architecture Review at 11:00 AM",
        content: `Voice Note Reflection: Remind me about the upcoming APAC Cloud Architecture Review meeting at 11:00 AM today with the engineering leads.
Key agenda points to highlight: zero-trust Cloud KMS envelope encryption, ADK multi-agent orchestration concurrency, and keeping our 94/100 team peace index score steady.`,
        summary: "Proactive preparation for 11:00 AM APAC Cloud Architecture Review with focus on zero-trust KMS and multi-agent concurrency.",
        socraticQuestions: [
          "What key outcome will make the 11 AM architecture review a resounding success?",
          "How can you ensure the team leaves the meeting feeling energized rather than drained?"
        ],
        reframeSuggestions: ["Lead the architecture review with calm confidence — your zero-trust design is rock-solid."],
        cognitiveStrengths: ["Proactive agenda setting", "Holistic view of engineering excellence and team well-being"],
        keyThemes: ["Cloud Architecture", "Zero-Trust Security", "Leadership Alignment"],
        microActions: [
          { title: "Review KMS Architecture Slides", description: "Double-check Cloud KMS key rotation policy before 11 AM." }
        ]
      }
    }
  },

  kn: {
    faqs: [
      {
        q: "ಸಾಕ್ರೆಟಿಕ್ ಆತ್ಮಾವಲೋಕನ ಕೋಚ್ (Socratic Coach) ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?",
        a: "ರಿಫ್ಲೆಕ್ಷನ್ ಕೋಚ್ ಗೂಗಲ್ ಜೆಮಿನಿ 3.7 / 2.5 ಫ್ಲ್ಯಾಶ್ ಮತ್ತು ಗೂಗಲ್ ADK ಬಳಸಿ ಜ್ಞಾನಾತ್ಮಕ ಮರುರೂಪಿಸುವಿಕೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ. ಇದು ಅನಗತ್ಯ ಸಲಹೆ ನೀಡುವ ಬದಲು ಆಳವಾದ ಸಾಕ್ರೆಟಿಕ್ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ನಿಮ್ಮ ಶಕ್ತಿಗಳನ್ನು ಗುರುತಿಸಿ, 15 ನಿಮಿಷಗಳ ಕಾರ್ಯಸಾಧ್ಯ ಮೈಕ್ರೋ-ಕ್ರಮಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ."
      },
      {
        q: "ಮೀಡಿಯಾ ಸ್ಟುಡಿಯೋ ಬಹು-ಮಾದರಿ (Multi-Modal) ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಹೇಗೆ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತದೆ?",
        a: "ನೀವು ಸ್ಟಿಕ್ಕಿ ನೋಟ್‌ಗಳು, ಕೈಬರಹದ ಜರ್ನಲ್ ಸ್ಕ್ಯಾನ್‌ಗಳು, 1-ನಿಮಿಷದ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು ಅಥವಾ ವೀಡಿಯೊ ಲಾಗ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು. ಎಲ್ಲವೂ ಗೂಗಲ್ ಕ್ಲೌಡ್ ಸ್ಟೋರೇಜ್‌ನಲ್ಲಿ (gs://reflectlogix-media-genai-apac/) ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹವಾಗಿ ಜೆಮಿನಿ ಮೂಲಕ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಜರ್ನಲ್ ಆಗಿ ಪರಿವರ್ತನೆಗೊಳ್ಳುತ್ತದೆ."
      },
      {
        q: "ನನ್ನ ಜರ್ನಲ್ ಮತ್ತು ಆರೋಗ್ಯ ಡೇಟಾ ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ?",
        a: "ಹೌದು, ಸಂಪೂರ್ಣವಾಗಿ. ರಿಫ್ಲೆಕ್ಟ್‌ಲಾಜಿಕ್ಸ್ AI ಝೀರೋ-ಟ್ರಸ್ಟ್ ಫೈರ್‌ಸ್ಟೋರ್ ಭದ್ರತಾ ನಿಯಮಗಳು ಮತ್ತು ಕ್ಲೌಡ್ KMS ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಮೂಲಕ ಸಂಪೂರ್ಣ ಡೇಟಾ ಪ್ರತ್ಯೇಕತೆಯನ್ನು ಖಾತರಿಪಡಿಸುತ್ತದೆ. ಯಾವುದೇ ಮೂರನೇ ವ್ಯಕ್ತಿಗೆ ಡೇಟಾ ಹಂಚಿಕೆಯಾಗುವುದಿಲ್ಲ."
      },
      {
        q: "ಸ್ಮಾರ್ಟ್ ವಾಚ್ ಮತ್ತು ಹೆಲ್ತ್ ಟ್ರ್ಯಾಕರ್ ಸಿಂಕ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?",
        a: "ಗೂಗಲ್ ಹೆಲ್ತ್ ಕನೆಕ್ಟ್, ಸ್ಯಾಮ್‌ಸಂಗ್ ಹೆಲ್ತ್, ಆಪಲ್ ಹೆಲ್ತ್ ಮತ್ತು ಗಾರ್ಮಿನ್ ಸಾಧನಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿ ಹೃದಯ ಬಡಿತ, HRV, ನಿದ್ರೆಯ ಹಂತಗಳು ಮತ್ತು ದೈನಂದಿನ ಹೆಜ್ಜೆಗಳನ್ನು ಮಾನಸಿಕ ನೆಮ್ಮದಿಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸುತ್ತದೆ."
      },
      {
        q: "ನೋವಾ 3D ಲೈವ್ ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಜೊತೆ ಹೇಗೆ ಸಂವಹನ ನಡೆಸುವುದು?",
        a: "ಕೆಳಗಿನ ಬಲಭಾಗದಲ್ಲಿರುವ ನೋವಾ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡುವ ಮೂಲಕ ಕನ್ನಡದಲ್ಲಿ ನೈಜ-ಸಮಯದ ಧ್ವನಿ ಸಂಭಾಷಣೆಯನ್ನು ಆರಂಭಿಸಿ ಸುಲಭವಾಗಿ ಮಾತನಾಡುತ್ತಾ ಜರ್ನಲ್ ಬರೆಯಬಹುದು."
      },
      {
        q: "ನಾನು ಕನ್ನಡ ಮತ್ತು ಇತರ ಭಾಷೆಗಳಲ್ಲಿ ಬರೆಯಬಹುದೇ?",
        a: "ಖಂಡಿತ! ಕನ್ನಡ, ತಮಿಳು, ಹಿಂದಿ, ತೆಲುಗು, ಮಲಯಾಳಂ, ಬಂಗಾಳಿ, ಮರಾಠಿ ಮತ್ತು ಜಾಗತಿಕ 18+ ಭಾಷೆಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ಬೆಂಬಲ ಲಭ್ಯವಿದೆ."
      }
    ],
    about: {
      welcomeTitle: "ರಿಫ್ಲೆಕ್ಟ್‌ಲಾಜಿಕ್ಸ್ AI ಗೆ ಸುಸ್ವಾಗತ",
      welcomeDesc: "ಜೆಮಿನಿ ಮತ್ತು ಸಾಕ್ರೆಟಿಕ್ ಕೋಚ್‌ನೊಂದಿಗೆ ನಿಮ್ಮ ಬಹುಪಯೋಗಿ ವೈಯಕ್ತಿಕ ಜರ್ನಲ್ — ಮಾನಸಿಕ ಶಾಂತಿ, ಆತ್ಮಾವಲೋಕನ ಮತ್ತು ಸ್ಪಷ್ಟತೆಯೊಂದಿಗೆ ಬದುಕನ್ನು ರೂಪಿಸಿಕೊಳ್ಳಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಸುರಕ್ಷಿತ ತಾಣ.",
      principles: {
        socraticTitle: "ಸಾಕ್ರೆಟಿಕ್ ಆತ್ಮಾವಲೋಕನ ಕೋಚಿಂಗ್",
        socraticDesc: "ಜೆಮಿನಿ 3.7 ಚಾಲಿತ ಸಂವೇದನಾತ್ಮಕ ಸ್ಪಷ್ಟತೆ, ನಕಾರಾತ್ಮಕ ಆಲೋಚನೆಗಳ ಮರುರೂಪಿಸುವಿಕೆ ಮತ್ತು 15 ನಿಮಿಷಗಳ ಸೂಕ್ಷ್ಮ ಕ್ರಿಯೆಗಳು.",
        mediaTitle: "ಮಲ್ಟಿ-ಮೋಡಲ್ ಮೀಡಿಯಾ ಸ್ಟುಡಿಯೋ",
        mediaDesc: "ಕೈಬರಹದ ಟಿಪ್ಪಣಿಗಳು, ಧ್ವನಿ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ವೀಡಿಯೊ ಲಾಗ್‌ಗಳನ್ನು ಗೂಗಲ್ ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಸಂಗ್ರಹಿಸಿ ವಿಶ್ಲೇಷಿಸಿ.",
        healthTitle: "ಸ್ಮಾರ್ಟ್ ಬಯೋಮೆಟ್ರಿಕ್ ಆರೋಗ್ಯ ಸಿಂಕ್",
        healthDesc: "ಹೃದಯ ಬಡಿತ, HRV, ಗಾಢ ನಿದ್ರೆ ಮತ್ತು ದಿನದ ಹೆಜ್ಜೆಗಳನ್ನು ಮಾನಸಿಕ ಸಮತೋಲನದೊಂದಿಗೆ ಜೋಡಿಸುತ್ತದೆ.",
        privacyTitle: "ಝೀರೋ-ಟ್ರಸ್ಟ್ ಗೌಪ್ಯತೆ ಮತ್ತು ಭದ್ರತೆ",
        privacyDesc: "ಫೈರ್‌ಸ್ಟೋರ್ ಬಳಕೆದಾರ ಪ್ರತ್ಯೇಕತೆ ಮತ್ತು ಡಿಟಾಕ್ಸ್ ಮೋಡ್ ಮೂಲಕ ಸಂಪೂರ್ಣ ವೈಯಕ್ತಿಕ ಡೇಟಾ ರಕ್ಷಣೆ."
      },
      multilingualTitle: "18 ಭಾಷೆಗಳ ಅಂತರರಾಷ್ಟ್ರೀಯ ಬೆಂಬಲ",
      multilingualDesc: "ಕನ್ನಡ, ತಮಿಳು, ಹಿಂದಿ, ತೆಲುಗು, ಮಲಯಾಳಂ, ಬೆಂಗಾಲಿ, ಮರಾಠಿ, ಗುಜರಾತಿ, ಪಂಜಾಬಿ, ಅರೇಬಿಕ್, ಫ್ರೆಂಚ್, ಜರ್ಮನ್, ಸ್ಪ್ಯಾನಿಷ್, ಪೋರ್ಚುಗೀಸ್, ರಷ್ಯನ್, ಜಪಾನೀಸ್, ಚೈನೀಸ್ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗಳ ಬೆಂಬಲ."
    },
    rag: {
      title: "ಆಳವಾದ ಪ್ರತಿಬಿಂಬಗಳು • ನೆನಪಿನ ಶೋಧನೆ (RAG)",
      subtitle: "Cloud SQL pgvector ವೆಕ್ಟರ್ ಹುಡುಕಾಟದ ಮೂಲಕ ನಿಮ್ಮ ಹಿಂದಿನ ಜರ್ನಲ್‌ಗಳಿಂದ ಒಳನೋಟಗಳು ಮತ್ತು ಸ್ಪಷ್ಟತೆಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ.",
      searchPlaceholder: "ಆಲೋಚನೆಗಳು, ವಿಷಯಗಳು ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ...",
      searchBtn: "ಇತಿಹಾಸದಲ್ಲಿ ಹುಡುಕಿ",
      searchingBtn: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
      examplePromptsTitle: "ಉದಾಹರಣೆ ಪ್ರಶ್ನೆಗಳು",
      examplePrompts: [
        "ಇತ್ತೀಚೆಗೆ ನನಗೆ ಅತ್ಯಂತ ಶಾಂತಿ ಮತ್ತು ಸ್ಪಷ್ಟತೆ ನೀಡಿದ ಕ್ಷಣಗಳು ಯಾವುವು?",
        "ಕೆಲಸದ ಒತ್ತಡದ ಸಮಯದಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಂಯಮ ಕಾಪಾಡಿಕೊಂಡೆ?",
        "ನಾನು ಸಾಧಿಸಿದ ಮುಖ್ಯ ಅಭ್ಯಾಸಗಳು ಮತ್ತು ಗುರಿಗಳು ಯಾವುವು?",
        "ನನ್ನ ಬೆಳವಣಿಗೆಯ ಆಲೋಚನೆಗಳಲ್ಲಿ ಪುನರಾವರ್ತನೆಯಾಗುವ ವಿಷಯಗಳಾವುವು?"
      ],
      resultsTitle: "ಮರುಪಡೆಯಲಾದ ನೆನಪುಗಳು",
      matchSuffix: "ಹೊಂದಾಣಿಕೆ",
      sampleResults: [
        {
          title: "ಸ್ಥಿರ ವೇಗದ ಕುರಿತು ಅವಲೋಕನ",
          snippet: "ಬೆಳಗಿನ ಶಾಂತ ವಿರಾಮಗಳು ದಿನವಿಡೀ ಕೆಲಸದ ಒತ್ತಡವನ್ನು ಶಾಂತವಾಗಿ ನಿಭಾಯಿಸಲು ಸಹಾಯ ಮಾಡಿದವು.",
          tags: ["ನೆಮ್ಮದಿ", "ಕೆಲಸ", "ಏಕಾಗ್ರತೆ"],
          date: "ನಿನ್ನೆ"
        },
        {
          title: "ಸಂಜೆಯ ನಡಿಗೆ ಮತ್ತು ಮಾನಸಿಕ ವಿಶ್ರಾಂತಿ",
          snippet: "ರಾತ್ರಿಯ ಊಟದ ನಂತರ ಪರದೆಗಳಿಂದ ದೂರವಿದ್ದದ್ದು ಉತ್ತಮ ನಿದ್ರೆ ಮತ್ತು ಮಾನಸಿಕ ನಿರಾಳತೆಯನ್ನು ತಂದಿತು.",
          tags: ["ಆರೋಗ್ಯ", "ವಿಶ್ರಾಂತಿ", "ಅಭ್ಯಾಸ"],
          date: "3 ದಿನಗಳ ಹಿಂದೆ"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "ಶಾಂತ ಮುಂಜಾನೆ ಮತ್ತು ಸಿಸ್ಟಮ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಚಿಂತನೆ",
        content: `ಇಂದು ಬೆಳಿಗ್ಗೆ ಕ್ಲೌಡ್ ರನ್ ನಿಯೋಜನೆಗಾಗಿ ADK ಏಜೆಂಟ್ ವಿನ್ಯಾಸವನ್ನು ರಚಿಸಿದೆ.
ಸಂಕೀರ್ಣ ಸಿಸ್ಟಮ್ ತರ್ಕಕ್ಕೆ ಧುಮುಕುವ ಮುನ್ನ ಆಳವಾಗಿ ಉಸಿರಾಡಿ ಶಾಂತವಾಗಿರುವುದು ಅದ್ಭುತ ಬದಲಾವಣೆಯನ್ನು ತಂದಿತು.
ಇಂದಿನ ಗುರಿ: ಉತ್ತಮ ನಿದ್ರೆಗಾಗಿ ರಾತ್ರಿ 9 ಗಂಟೆಗೆ ಪರದೆಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಆಫ್ ಮಾಡುವುದು.`,
        summary: "ಸಿಸ್ಟಮ್ ವಿನ್ಯಾಸ ಮತ್ತು ಮೈಂಡ್‌ಫುಲ್‌ನೆಸ್‌ನ ಸಮತೋಲಿತ ಮುಂಜಾನೆ ಹಾಗೂ ನಿದ್ರೆಯ ಶಿಸ್ತು.",
        socraticQuestions: [
          "ಒತ್ತಡ ಹೆಚ್ಚಾಗುವ ಮುನ್ನ ನಿಮ್ಮ ದೇಹ ನೀಡುವ ಆರಂಭಿಕ ಎಚ್ಚರಿಕೆಯ ಸಂಕೇತಗಳು ಯಾವುವು?",
          "ಹೆಚ್ಚು ಒತ್ತಡದ ದಿನಗಳಲ್ಲೂ ಈ ಶಾಂತ ಮುಂಜಾನೆಯ ವಾತಾವರಣವನ್ನು ಹೇಗೆ ಪುನರಾವರ್ತಿಸಬಹುದು?"
        ],
        reframeSuggestions: ["ವ್ಯೂಹಾತ್ಮಕ ವಿರಾಮಗಳು ನಿಮ್ಮ ವೇಗವನ್ನು ಕುಗ್ಗಿಸದೆ, ದೀರ್ಘಕಾಲೀನ ಸ್ಪಷ್ಟತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ."],
        cognitiveStrengths: ["ಉನ್ನತ ಸ್ವಯಂ ಅರಿವು", "ಚೇತರಿಕೆಗೆ ಸ್ಪಷ್ಟ ಗಡಿಗಳ ರಚನೆ"],
        keyThemes: ["ಮಾನಸಿಕ ನೆಮ್ಮದಿ", "ಆರ್ಕಿಟೆಕ್ಚರ್", "ನಿದ್ರೆಯ ಶಿಸ್ತು"],
        microActions: [
          { title: "ರಾತ್ರಿ 9:00 ಗಂಟೆಗೆ ಸ್ಕ್ರೀನ್ ಸ್ಥಗಿತ", description: "ಫೋನ್ ಅನ್ನು ಮಲಗುವ ಕೋಣೆಯಿಂದ ದೂರ ಚಾರ್ಜಿಂಗ್ ಇರಿಸಿ." },
          { title: "ಮುಂಜಾನೆ 5 ನಿಮಿಷ ಪ್ರಾಣಾಯಾಮ", description: "ಇಮೇಲ್ ನೋಡುವ ಮುನ್ನ 4-7-8 ಆಳವಾದ ಉಸಿರಾಟ ಮಾಡಿ." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "ಪ್ರಕೃತಿಯಲ್ಲಿ 10,480 ಹೆಜ್ಜೆಗಳ ಮುಂಜಾನೆಯ ನಡಿಗೆ",
        content: `ಸೂರ್ಯೋದಯದ ಸಮಯದಲ್ಲಿ ಉದ್ಯಾನವನದಲ್ಲಿ 10,480 ಹೆಜ್ಜೆಗಳ ಲವಲವಿಕೆಯ ನಡಿಗೆ ಮುಗಿಸಿದೆ.
ತಾಜಾ ಗಾಳಿ, ಪಕ್ಷಿಗಳ ಧ್ವನಿ ಮತ್ತು ಉತ್ತಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಕೃತಜ್ಞತೆ ಮೂಡಿತು.
ಮುಖ್ಯ ಕಲಿಕೆ: ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ವೇಗ ಕಡಿಮೆ ಮಾಡುವುದು ದೀರ್ಘಾವಧಿಯ ಸ್ಪಷ್ಟತೆಯನ್ನು ತ್ವರಿತಗೊಳಿಸುತ್ತದೆ.`,
        summary: "10k ಹೆಜ್ಜೆಗಳ ನಡಿಗೆಯೊಂದಿಗೆ ಚೈತನ್ಯದಾಯಕ ಸೂರ್ಯೋದಯ ಮತ್ತು ಸುಸ್ಥಿರ ವೇಗದ ಸ್ಪಷ್ಟತೆ.",
        socraticQuestions: [
          "ದೈಹಿಕ ಚಲನೆಯು ಸಂಕೀರ್ಣ ಎಂಜಿನಿಯರಿಂಗ್ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸುವ ನಿಮ್ಮ ವಿಧಾನವನ್ನು ಹೇಗೆ ಬದಲಾಯಿಸುತ್ತದೆ?",
          "ಈ ಮುಂಜಾನೆಯ ನಡಿಗೆಯ ಅಭ್ಯಾಸವನ್ನು ಪ್ರತಿದಿನ ರಕ್ಷಿಸಿಕೊಳ್ಳಲು ಸುಲಭವಾದ ಮಾರ್ಗ ಯಾವುದು?"
        ],
        reframeSuggestions: ["ನಡಿಗೆಯಿಂದ ಸಿಕ್ಕ ಮಾನಸಿಕ ಸ್ಪಷ್ಟತೆಯನ್ನು ನಿಮ್ಮ ಸೃಜನಶೀಲ ಕೆಲಸದ ಬುನಾದಿಯನ್ನಾಗಿಸಿ."],
        cognitiveStrengths: ["ದೈಹಿಕ-ಮಾನಸಿಕ ಸಮತೋಲನ", "ವಿಶ್ರಾಂತಿದಾಯಕ ಅಭ್ಯಾಸಗಳ ಮೌಲ್ಯೀಕರಣ"],
        keyThemes: ["ದೈಹಿಕ ಶಕ್ತಿ", "ಮುಂಜಾನೆಯ ಸ್ಪಷ್ಟತೆ", "10k ಹೆಜ್ಜೆಗಳು"],
        microActions: [
          { title: "ಹೈಡ್ರೇಶನ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರೋಲೈಟ್ಸ್", description: "ನಡಿಗೆಯ ನಂತರ 500 ಮಿ.ಲೀ ನೀರು ಕುಡಿಯಿರಿ." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "ಪ್ರಮುಖ ಸಭೆ ನೆನಪಿಸುವಿಕೆ: ಬೆಳಿಗ್ಗೆ 11:00 ಗಂಟೆಗೆ ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಸಭೆ",
        content: `ಧ್ವನಿ ಟಿಪ್ಪಣಿ: ಇಂದು ಬೆಳಿಗ್ಗೆ 11:00 ಗಂಟೆಗೆ ಎಂಜಿನಿಯರಿಂಗ್ ಮುಖ್ಯಸ್ಥರೊಂದಿಗೆ ನಡೆಯುವ APAC ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಸಭೆಯನ್ನು ನೆನಪಿಸಿ.
ಮುಖ್ಯ ವಿಷಯಗಳು: ಝೀರೋ-ಟ್ರಸ್ಟ್ KMS ಎನ್‌ಕ್ರಿಪ್ಶನ್, ADK ಮಲ್ಟಿ-ಏಜೆಂಟ್ ಸಮನ್ವಯ ಮತ್ತು ತಂಡದ 94/100 ಶಾಂತಿ ಸೂಚ್ಯಂಕ ಕಾಯ್ದುಕೊಳ್ಳುವುದು.`,
        summary: "11 ಗಂಟೆಯ ಸಭೆಗೆ ಸಕ್ರಿಯ ತಯಾರಿ ಮತ್ತು ಝೀರೋ-ಟ್ರಸ್ಟ್ ಭದ್ರತಾ ಯೋಜನೆ.",
        socraticQuestions: [
          "ಈ 11 ಗಂಟೆಯ ಸಭೆಯನ್ನು ಯಶಸ್ವಿಗೊಳಿಸುವ ಪ್ರಮುಖ ಫಲಿತಾಂಶ ಯಾವುದು?",
          "ಸಭೆಯ ನಂತರ ತಂಡವು ಉತ್ಸಾಹಭರಿತವಾಗಿರುವಂತೆ ನೀವು ಹೇಗೆ ನೋಡಿಕೊಳ್ಳಬಹುದು?"
        ],
        reframeSuggestions: ["ಸಂಪೂರ್ಣ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮುನ್ನಡೆಸಿ — ನಿಮ್ಮ ಝೀರೋ-ಟ್ರಸ್ಟ್ ವಿನ್ಯಾಸ ಅತ್ಯಂತ ದೃಢವಾಗಿದೆ."],
        cognitiveStrengths: ["ಮುಂಚಿತ ಯೋಜನೆ", "ಎಂಜಿನಿಯರಿಂಗ್ ಶ್ರೇಷ್ಠತೆ ಮತ್ತು ತಂಡದ ಯೋಗಕ್ಷೇಮದ ಸಮನ್ವಯ"],
        keyThemes: ["ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಚರ್", "ಝೀರೋ-ಟ್ರಸ್ಟ್ ಭದ್ರತೆ", "ನಾಯಕತ್ವ"],
        microActions: [
          { title: "KMS ಸ್ಲೈಡ್‌ಗಳ ಪರಿಶೀಲನೆ", description: "11 ಗಂಟೆಗೆ ಮುಂಚಿತವಾಗಿ Cloud KMS ಕೀ ತಿರುಗುವಿಕೆ ನೀತಿಯನ್ನು ಪರೀಕ್ಷಿಸಿ." }
        ]
      }
    }
  },

  ml: {
    faqs: [
      {
        q: "സോക്രട്ടിക് റിഫ്ലെക്ഷൻ കോച്ച് (Socratic Coach) എങ്ങനെ പ്രവർത്തിക്കുന്നു?",
        a: "ഗൂഗിൾ ജെമിനി 3.7 / 2.5 ഫ്ലാഷും ഗൂഗിൾ ADK-യും ഉപയോഗിച്ച് നിങ്ങളുടെ ചിന്തകളെ വിശകലനം ചെയ്യുന്നു. അനാവശ്യ ഉപദേശങ്ങൾ നൽകുന്നതിനുപകരം ആഴത്തിലുള്ള സോക്രട്ടിക് ചോദ്യങ്ങൾ ചോദിക്കുകയും 15 മിനിറ്റിനുള്ളിൽ ചെയ്യാവുന്ന ലളിതമായ പ്രവർത്തനങ്ങൾ നിർദ്ദേശിക്കുകയും ചെയ്യുന്നു."
      },
      {
        q: "മീഡിയ സ്റ്റുഡിയോ മൾട്ടി-മോഡൽ ഇൻപുട്ടുകൾ എങ്ങനെ കൈകാര്യം ചെയ്യുന്നു?",
        a: "സ്റ്റിക്കി നോട്ടുകൾ, കൈപ്പടയിലെഴുതിയ കുറിപ്പുകൾ, വോയ്‌സ് നോട്ടുകൾ, വീഡിയോ ലോഗുകൾ എന്നിവ ഗൂഗിൾ ക്ലൗഡ് സ്റ്റോറേജിൽ (gs://reflectlogix-media-genai-apac/) സുരക്ഷിതമായി സൂക്ഷിക്കുകയും ജെമിനി വഴി ജേണലായി മാറ്റുകയും ചെയ്യുന്നു."
      },
      {
        q: "എന്റെ ജേണലുകളും ആരോഗ്യവിവരങ്ങളും സുരക്ഷിതമാണോ?",
        a: "അതെ, പൂർണ്ണമായും. സീറോ-ട്രസ്റ്റ് ഫയർസ്റ്റോർ സുരക്ഷാ നിയമങ്ങളും ക്ലൗഡ് KMS എൻക്രിപ്ഷനും വഴി നിങ്ങളുടെ വിവരങ്ങൾ നിങ്ങൾക്ക് മാത്രമായി സംരക്ഷിക്കപ്പെടുന്നു."
      },
      {
        q: "സ്മാർട്ട് വാച്ചും ഹെൽത്ത് ട്രാക്കറും എങ്ങനെ ബന്ധിപ്പിക്കുന്നു?",
        a: "ഗൂഗിൾ ഹെൽത്ത് കണക്ട്, സാംസങ് ഹെൽത്ത്, ആപ്പിൾ ഹെൽത്ത്, ഗാർമിൻ എന്നിവയുമായി ബന്ധിപ്പിച്ച് ഹൃദയമിടിപ്പ്, ഉറക്കത്തിന്റെ ഘട്ടങ്ങൾ, ദൈനംദിന ചുവടുകൾ എന്നിവ മനസ്സിന്റെ ശാന്തതയുമായി താരതമ്യം ചെയ്യുന്നു."
      },
      {
        q: "നോവ 3D ലൈവ് വോയ്‌സ് അസിസ്റ്റന്റുമായി എങ്ങനെ സംസാരിക്കാം?",
        a: "താഴെ വലതുവശത്തുള്ള നോവ ബട്ടൺ അമർത്തി മലയാളത്തിൽ സ്വാഭാവിക ശബ്ദത്തിൽ സംസാരിച്ച് ജേണൽ തയ്യാറാക്കാം."
      },
      {
        q: "മലയാളത്തിലും മറ്റ് ഭാഷകളിലും എനിക്ക് എഴുതാമോ?",
        a: "തീർച്ചയായും! മലയാളം, തമിഴ്, ഹിന്ദി, തെലുങ്ക്, കന്നഡ, ബംഗാളി, മറാഠി തുടങ്ങി 18-ലധികം ആഗോള ഭാഷകൾ പിന്തുണയ്ക്കുന്നു."
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI-ലേക്ക് സ്വാഗതം",
      welcomeDesc: "ജെമിനിയും സോക്രട്ടിക് കോച്ചും അടങ്ങിയ നിങ്ങളുടെ വ്യക്തിഗത ജേണൽ — മാനസിക സമാധാനവും ജീവിത വ്യക്തതയും ഉറപ്പാക്കുന്ന സുരക്ഷിത സങ്കേതം.",
      principles: {
        socraticTitle: "സോക്രട്ടിക് ചിന്താപരിശീലനം",
        socraticDesc: "ജെമിനി 3.7 വഴി ചിന്താക്കുഴപ്പങ്ങൾ പരിഹരിച്ച് 15 മിനിറ്റ് പ്രായോഗിക പ്രവർത്തനങ്ങൾ സൃഷ്ടിക്കുന്നു.",
        mediaTitle: "മൾട്ടി-മോഡൽ മീഡിയ സ്റ്റുഡിയോ",
        mediaDesc: "കൈപ്പടയിലെഴുതിയ കുറിപ്പുകളും ശബ്ദരേഖകളും വീഡിയോകളും ക്ലൗഡിൽ സൂക്ഷിക്കുക.",
        healthTitle: "സ്മാർട്ട് ബയോമെട്രിക് ആരോഗ്യം",
        healthDesc: "ഹൃദയമിടിപ്പ്, ഉറക്കം, ചുവടുകൾ എന്നിവ മനസ്സിന്റെ സമാധാനവുമായി ബന്ധിപ്പിക്കുന്നു.",
        privacyTitle: "സീറോ-ട്രസ്റ്റ് സ്വകാര്യതയും സുരക്ഷയും",
        privacyDesc: "ഫയർസ്റ്റോർ ഡാറ്റാ സംരക്ഷണവും ഡിറ്റോക്സ് മോഡും വഴി പൂർണ്ണ സുരക്ഷ."
      },
      multilingualTitle: "18 ഭാഷകളുടെ അന്താരാഷ്ട്ര പിന്തുണ",
      multilingualDesc: "മലയാളം, തമിഴ്, ഹിന്ദി, തെലുങ്ക്, കന്നഡ, ബംഗാളി, മറാഠി, ഗുജറാത്തി, പഞ്ചാബി, അറബിക്, ഫ്രഞ്ച്, ജർമ്മൻ, സ്പാനിഷ്, ഇംഗ്ലീഷ് തുടങ്ങിയവ."
    },
    rag: {
      title: "ആഴത്തിലുള്ള ചിന്തകൾ • ഓർമ്മകളുടെ തിരച്ചിൽ (RAG)",
      subtitle: "Cloud SQL pgvector വെക്റ്റർ തിരച്ചിൽ വഴി നിങ്ങളുടെ മുൻകാല ജേണലുകളിൽ നിന്ന് പുതിയ ഉൾക്കാഴ്ചകൾ കണ്ടെത്തുക.",
      searchPlaceholder: "ചിന്തകൾ, വിഷയങ്ങൾ അല്ലെങ്കിൽ ചോദ്യങ്ങൾ തിരയുക...",
      searchBtn: "ചരിത്രത്തിൽ തിരയുക",
      searchingBtn: "തിരയുന്നു...",
      examplePromptsTitle: "ഉദാഹരണ ചോദ്യങ്ങൾ",
      examplePrompts: [
        "അടുത്തിടെ എനിക്ക് ഏറ്റവും കൂടുതൽ സമാധാനം നൽകിയ നിമിഷങ്ങൾ ഏവ?",
        "ജോലിത്തിരക്കിനിടയിൽ ഞാൻ എങ്ങനെ ശാന്തത നിലനിർത്തി?",
        "ഞാൻ നേടിയ പ്രധാന ശീലങ്ങളും ലക്ഷ്യങ്ങളും ഏവ?",
        "എന്റെ വളർച്ചയെക്കുറിച്ചുള്ള ചിന്തകളിലെ പ്രധാന വിഷയങ്ങൾ ഏവ?"
      ],
      resultsTitle: "ലഭിച്ച ഓർമ്മകൾ",
      matchSuffix: "പൊരുത്തം",
      sampleResults: [
        {
          title: "സ്ഥിരതയുള്ള വേഗതയെക്കുറിച്ചുള്ള ചിന്ത",
          snippet: "പ്രഭാതത്തിലെ ശാന്തമായ നിമിഷങ്ങൾ ജോലിഭാരം എളുപ്പത്തിൽ കൈകാര്യം ചെയ്യാൻ സഹായിച്ചു.",
          tags: ["സമാധാനം", "ജോലി", "ശ്രദ്ധ"],
          date: "ഇന്നലെ"
        },
        {
          title: "സായാഹ്ന നടത്തവും മനസ്സിന്റെ വിശ്രമവും",
          snippet: "ഭക്ഷണത്തിനു ശേഷം സ്ക്രീനുകളിൽ നിന്ന് മാറിയത് നല്ല ഉറക്കവും ഉന്മേഷവും നൽകി.",
          tags: ["ആരോഗ്യം", "വിശ്രമം", "ശീലം"],
          date: "3 ദിവസം മുമ്പ്"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "ശാന്തമായ പ്രഭാതവും സിസ്റ്റം ആർക്കിടെക്ചർ ചിന്തകളും",
        content: `ഇന്ന് രാവിലെ ക്ലൗഡ് റൺ ഡിപ്ലോയ്മെന്റിനായുള്ള ADK ഏജന്റ് ഗ്രാഫ് രൂപകൽപ്പന ചെയ്തു.
സങ്കീർണ്ണമായ സാങ്കേതിക കാര്യങ്ങളിലേക്ക് കടക്കുന്നതിന് മുൻപ് ദീർഘമായി ശ്വാസമെടുത്ത് ശാന്തമായത് വലിയ മാറ്റമുണ്ടാക്കി.
ഇന്നത്തെ ലക്ഷ്യം: നല്ല ഉറക്കത്തിനായി രാത്രി 9 മണിക്ക് സ്ക്രീനുകൾ ഓഫ് ചെയ്യുക.`,
        summary: "സിസ്റ്റം ഡിസൈനും മനസ്സിന്റെ ഏകാഗ്രതയും ഉറക്കത്തിന്റെ ചിട്ടയും സമന്വയിപ്പിച്ച പ്രഭാതം.",
        socraticQuestions: [
          "മാനസിക സമ്മർദ്ദം കൂടുമ്പോൾ നിങ്ങളുടെ ശരീരം തരുന്ന ആദ്യ ലക്ഷണങ്ങൾ ഏവ?",
          "തിരക്കുള്ള ദിവസങ്ങളിലും ഈ ശാന്തമായ പ്രഭാത അന്തരീക്ഷം എങ്ങനെ നിലനിർത്താം?"
        ],
        reframeSuggestions: ["തന്ത്രപരമായ വിശ്രമം നിങ്ങളുടെ വേഗത കുറയ്ക്കുകയല്ല, മറിച്ച് ദീർഘകാല വ്യക്തത വർദ്ധിപ്പിക്കുകയാണ് ചെയ്യുന്നത്."],
        cognitiveStrengths: ["ഉയർന്ന സ്വയം അവബോധം", "വിശ്രമത്തിനായി വ്യക്തമായ അതിരുകൾ നിശ്ചയിക്കൽ"],
        keyThemes: ["മാനസിക സമാധാനം", "ആർക്കിടെക്ചർ", "ഉറക്ക ചിട്ട"],
        microActions: [
          { title: "രാത്രി 9:00 മണിക്ക് സ്ക്രീൻ ഓഫ്", description: "ഫോൺ കിടപ്പുമുറിക്ക് പുറത്ത് ചാർജ് ചെയ്യാൻ വെയ്ക്കുക." },
          { title: "രാവിലെ 5 മിനിറ്റ് ശ്വസനവ്യായാമം", description: "ഇമെയിൽ നോക്കുന്നതിന് മുൻപ് 4-7-8 ആഴത്തിലുള്ള ശ്വാസമെടുക്കുക." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "പ്രകൃതിയിൽ 10,480 ചുവടുകൾ പ്രഭാത നടത്തം",
        content: `സൂര്യോദയ സമയത്ത് പാർക്കിലൂടെ 10,480 ചുവടുകൾ നടന്നു.
ശുദ്ധവായുവും കിളികളുടെ ശബ്ദവും നല്ല ആരോഗ്യവും മനസ്സിന് വലിയ നന്ദി നൽകി.
പ്രധാന തിരിച്ചറിവ്: മനഃപൂർവം വേഗത കുറയ്ക്കുന്നത് ഭാവിയിലെ വ്യക്തത വേഗത്തിലാക്കുന്നു.`,
        summary: "10k ചുവടുകൾ നടത്തവും ഉന്മേഷകരമായ സൂര്യോദയവും നൽകിയ പുതിയ തിരിച്ചറിവ്.",
        socraticQuestions: [
          "ശാരീരിക വ്യായാമം സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾ പരിഹരിക്കാനുള്ള നിങ്ങളുടെ രീതിയെ എങ്ങനെ മാറ്റുന്നു?",
          "ഈ പ്രഭാത നടത്ത ശീലം എന്നും നിലനിർത്താൻ എന്ത് ചെറിയ മാറ്റം വരുത്താം?"
        ],
        reframeSuggestions: ["നടത്തത്തിലൂടെ ലഭിച്ച മാനസിക വ്യക്തത നിങ്ങളുടെ സൃഷ്ടിപരമായ ജോലികൾക്ക് ഉപയോഗിക്കുക."],
        cognitiveStrengths: ["ശരീരവും മനസ്സും തമ്മിലുള്ള സമന്വയം", "വിശ്രമ ശീലങ്ങളെ വിലമതിക്കൽ"],
        keyThemes: ["ശാരീരിക ഉന്മേഷം", "പ്രഭാത വ്യക്തത", "10k ചുവടുകൾ"],
        microActions: [
          { title: "വെള്ളവും ഇലക്ട്രോലൈറ്റും", description: "നടത്തത്തിന് ശേഷം 500 മില്ലി വെള്ളം കുടിക്കുക." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "പ്രധാന മീറ്റിംഗ്: രാവിലെ 11:00 മണിക്ക് ക്ലൗഡ് ആർക്കിടെക്ചർ റിവ്യൂ",
        content: `വോയ്‌സ് നോട്ട്: ഇന്ന് രാവിലെ 11:00 മണിക്ക് എഞ്ചിനീയറിംഗ് ലീഡുകളുമായുള്ള APAC ക്ലൗഡ് ആർക്കിടെക്ചർ റിവ്യൂ മീറ്റിംഗ് ഓർമ്മിപ്പിക്കുക.
പ്രധാന വിഷയങ്ങൾ: സീറോ-ട്രസ്റ്റ് KMS എൻക്രിപ്ഷൻ, ADK മൾട്ടി-ഏജന്റ് ഓർക്കസ്ട്രേഷൻ, ടീമിന്റെ 94/100 സമാധാന സ്കോർ നിലനിർത്തൽ.`,
        summary: "11 മണിയുടെ മീറ്റിംഗിനായുള്ള തയ്യാറെടുപ്പും സീറോ-ട്രസ്റ്റ് സുരക്ഷാ ആസൂത്രണവും.",
        socraticQuestions: [
          "ഈ 11 മണിയുടെ മീറ്റിംഗിനെ വൻ വിജയമാക്കുന്ന പ്രധാന ഫലം എന്താണ്?",
          "മീറ്റിംഗിന് ശേഷം ടീം കൂടുതൽ ഊർജ്ജസ്വലരാകാൻ നിങ്ങൾക്ക് എന്തുചെയ്യാൻ കഴിയും?"
        ],
        reframeSuggestions: ["പൂർണ്ണ ആത്മവിശ്വാസത്തോടെ നയിക്കുക — നിങ്ങളുടെ സീറോ-ട്രസ്റ്റ് ഡിസൈൻ വളരെ ശക്തമാണ്."],
        cognitiveStrengths: ["മുൻകൂട്ടിയുള്ള ആസൂത്രണം", "സാങ്കേതിക മികവും ടീമിന്റെ സന്തോഷവും സമന്വയിപ്പിക്കൽ"],
        keyThemes: ["ക്ലൗഡ് ആർക്കിടെക്ചർ", "സീറോ-ട്രസ്റ്റ് സുരക്ഷ", "നേതൃത്വം"],
        microActions: [
          { title: "KMS സ്ലൈഡുകൾ പരിശോധിക്കുക", description: "11 മണിക്ക് മുൻപ് Cloud KMS പോളിസി ഉറപ്പുവരുത്തുക." }
        ]
      }
    }
  },

  te: {
    faqs: [
      {
        q: "సాక్రటిక్ రిఫ్లెక్షన్ కోచ్ (Socratic Coach) ఎలా పనిచేస్తుంది?",
        a: "గూగుల్ జెమిని 3.7 / 2.5 ఫ్లాష్ మరియు గూగుల్ ADK ద్వారా ఆలోచనలను విశ్లేషించి, అయాచిత సలహాలు ఇవ్వకుండా లోతైన సాక్రటిక్ ప్రశ్నలు అడుగుతూ 15 నిమిషాల కార్యాచరణలను అందిస్తుంది."
      },
      {
        q: "మీడియా స్టూడియో మల్టీ-మోడల్ ఇన్‌పుట్‌లను ఎలా ప్రాసెస్ చేస్తుంది?",
        a: "స్టిక్కీ నోట్స్, చేతిరాత నోట్స్, వాయిస్ రికార్డింగ్‌లు మరియు వీడియోలను గూగుల్ క్లౌడ్ స్టోరేజ్ (GCS)లో సురక్షితంగా నిల్వ చేసి జెమిని ద్వారా జర్నల్‌గా మారుస్తుంది."
      },
      {
        q: "నా జర్నల్ మరియు ఆరోగ్య సమాచారం సురక్షితమేనా?",
        a: "అవును, పూర్తిగా. జీరో-ట్రస్ట్ ఫైర్‌స్టోర్ సెక్యూరిటీ రూల్స్ మరియు క్లౌడ్ KMS ఎన్‌క్రిప్షన్ ద్వారా మీ డేటా అత్యంత సురక్షితంగా ఉంటుంది."
      },
      {
        q: "స్మార్ట్ వాచ్ మరియు హెల్త్ సింక్ ఎలా పనిచేస్తుంది?",
        a: "గూగుల్ హెల్త్ కనెక్ట్, శామ్‌సంగ్ హెల్త్, ఆపిల్ హెల్త్ మరియు గార్మిన్ డివైజ్‌లతో అనుసంధానమై హృదయ స్పందన, నిద్ర మరియు నడకలను మానసిక ప్రశాంతతతో పోలుస్తుంది."
      },
      {
        q: "నోవా 3D లైవ్ వాయిస్ అసిస్టెంట్‌తో ఎలా మాట్లాడాలి?",
        a: "క్రింద కుడివైపున ఉన్న నోవా చిహ్నాన్ని క్లిక్ చేసి తెలుగులో నేరుగా మాట్లాడి మీ ఆలోచనలను నమోదు చేయవచ్చు."
      },
      {
        q: "నేను తెలుగు మరియు ఇతర భాషల్లో జర్నల్ రాయవచ్చా?",
        a: "తప్పకుండా! తెలుగు, తమిళం, హిందీ, కన్నడ, మలయాళం మరియు ప్రపంచవ్యాప్త 18+ భాషలకు పూర్తి మద్దతు ఉంది."
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI కి స్వాగతం",
      welcomeDesc: "జెమిని మరియు సాక్రటిక్ కోచ్‌తో మీ బహుళార్ధసాధక వ్యక్తిగత జర్నల్ — మానసిక ప్రశాంతత మరియు జీవిత స్పష్టతను అందించే సురక్షిత వేదిక.",
      principles: {
        socraticTitle: "సాక్రటిక్ ఆలోచనా శిక్షణ",
        socraticDesc: "జెమిని 3.7 ద్వారా ప్రతికూల ఆలోచనలను తొలగించి 15 నిమిషాల స్పష్టమైన మైక్రో-చర్యలను రూపొందిస్తుంది.",
        mediaTitle: "మల్టీ-మోడల్ మీడియా స్టూడియో",
        mediaDesc: "చేతిరాత కాగితాలు, వాయిస్ నోట్స్ మరియు వీడియోలను క్లౌడ్‌లో సులభంగా భద్రపరుస్తుంది.",
        healthTitle: "స్మార్ట్ బయోమెట్రిక్ ఆరోగ్యం",
        healthDesc: "హృదయ స్పందన, HRV, గాఢ నిద్ర మరియు అడుగులను మానసిక శాంతితో అనుసంధానిస్తుంది.",
        privacyTitle: "జీరో-ట్రస్ట్ గోప్యత మరియు భద్రత",
        privacyDesc: "ఫైర్‌స్టోర్ డేటా రక్షణ మరియు డిటాక్స్ మోడ్ ద్వారా సంపూర్ణ డేటా భద్రత."
      },
      multilingualTitle: "18 భాషల అంతర్జాతీయ మద్దతు",
      multilingualDesc: "తెలుగు, తమిళం, హిందీ, కన్నడ, మలయాళం, బెంగాలీ, మరాఠీ, గుజరాతీ, పంజాబీ, అరబిక్, ఫ్రెంచ్, జర్మన్, స్పానిష్, ఇంగ్లీష్ మొదలైనవి."
    },
    rag: {
      title: "లోతైన ఆలోచనలు • జ్ఞాపకాల అన్వేషణ (RAG)",
      subtitle: "Cloud SQL pgvector వెక్టర్ శోధన ద్వారా మీ గత జర్నల్స్ నుండి కొత్త పరిష్కారాలు మరియు స్పష్టతను పొందండి.",
      searchPlaceholder: "ఆలోచనలు, అంశాలు లేదా ప్రశ్నలను శోధించండి...",
      searchBtn: "చరిత్రలో వెతకండి",
      searchingBtn: "వెతుకుతోంది...",
      examplePromptsTitle: "ఉదాహరణ ప్రశ్నలు",
      examplePrompts: [
        "ఇటీవల నాకు అత్యంత ప్రశాంతతను మరియు స్పష్టతను ఇచ్చిన క్షణాలు ఏవి?",
        "పని ఒత్తిడి సమయంలో నేను ప్రశాంతతను ఎలా కాపాడుకున్నాను?",
        "నేను సాధించిన ముఖ్యమైన అలవాట్లు మరియు లక్ష్యాలు ఏవి?",
        "నా ఎదుగుదల ఆలోచనలలో పునరావృతమయ్యే అంశాలు ఏవి?"
      ],
      resultsTitle: "లభించిన జ్ఞాపకాలు",
      matchSuffix: "సరిపోలిక",
      sampleResults: [
        {
          title: "నిలకడైన వేగంపై ఆలోచన",
          snippet: "ఉదయపు ప్రశాంత విరామాలు రోజంతా పనిభారాన్ని ప్రశాంతంగా నిర్వహించడానికి సహాయపడ్డాయి.",
          tags: ["ప్రశాంతత", "పని", "ఏకాగ్రత"],
          date: "నిన్న"
        },
        {
          title: "సాయంత్రపు నడక & మానసిక విశ్రాంతి",
          snippet: "భోజనం తర్వాత స్క్రీన్‌ల నుండి దూరంగా ఉండటం మంచి నిద్ర మరియు ఉపశమనాన్ని ఇచ్చింది.",
          tags: ["ఆరోగ్యం", "విశ్రాంతి", "అలవాట్లు"],
          date: "3 రోజుల క్రితం"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "ప్రశాంత ఉదయం మరియు సిస్టమ్ ఆర్కిటెక్చర్ ఆలోచనలు",
        content: `ఈ రోజు ఉదయం క్లౌడ్ రన్ డిప్లాయ్‌మెంట్ కోసం ADK ఏజెంట్ ఆర్కెస్ట్రేషన్ గ్రాఫ్‌ను రూపొందించాను.
సంక్లిష్టమైన సిస్టమ్ లాజిక్‌లోకి వెళ్లే ముందు కాసేపు ప్రశాంతంగా ఊపిరి తీసుకోవడం గొప్ప మార్పును తెచ్చింది.
నేటి లక్ష్యం: మంచి నిద్ర కోసం రాత్రి 9 గంటలకే స్క్రీన్‌లను ఆపివేయడం.`,
        summary: "సిస్టమ్ డిజైన్ మరియు మైండ్‌ఫుల్‌నెస్‌ల సమతుల్య ఉదయం మరియు నిద్ర క్రమశిక్షణ.",
        socraticQuestions: [
          "ఒత్తిడి పెరిగే ముందు మీ శరీరం ఇచ్చే ప్రారంభ హెచ్చరిక సంకేతాలు ఏవి?",
          "ఎక్కువ పని ఉన్న రోజుల్లో కూడా ఈ ప్రశాంత ఉదయపు వాతావరణాన్ని ఎలా పునరావృతం చేయవచ్చు?"
        ],
        reframeSuggestions: ["వ్యూహాత్మక విరామాలు మీ వేగాన్ని తగ్గించవు, దీర్ಘకాలిక స్పష్టతను పెంచుతాయి."],
        cognitiveStrengths: ["ఉన్నత స్వీయ అవగాహన", "విశ్రాంతి కోసం స్పష్టమైన సరిహద్దుల ఏర్పాటు"],
        keyThemes: ["మానసిక ప్రశాంతత", "ఆర్కిటెక్చర్", "నిద్ర క్రమశిక్షణ"],
        microActions: [
          { title: "రాత్రి 9:00 గంటలకు స్క్రీన్ ఆఫ్", description: "ఫోన్‌ను బెడ్‌రూమ్‌కు దూరంగా ఛార్జింగ్‌లో ఉంచండి." },
          { title: "ఉదయం 5 నిమిషాల ప్రాణాయామం", description: "ఈమెయిల్ చూసే ముందు 4-7-8 దీర్ఘ శ్వాస తీసుకోండి." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "ప్రకృతిలో 10,480 అడుగుల ఉదయపు నడక",
        content: `సూర్యోదయ సమయంలో పార్కులో 10,480 అడుగుల ఉత్సాహభరితమైన నడకను పూర్తి చేశాను.
స్వచ్ఛమైన గాలి, పక్షుల కిలకిలారావాలు మరియు మంచి ఆరోగ్యానికి కృతజ్ఞత కలిగింది.
ముఖ్య గ్రహింపు: ఉద్దేశపూర్వకంగా వేగాన్ని తగ్గించడం భవిష్యత్ స్పష్టతను వేగవంతం చేస్తుంది.`,
        summary: "10k అడుగుల నడకతో శక్తివంతమైన సూర్యోదయం మరియు నిలకడైన వేగంపై స్పష్టత.",
        socraticQuestions: [
          "శారీరక కదలిక సంక్లిష్ట ఇంజనీరింగ్ సమస్యలను పరిష్కరించే మీ విధానాన్ని ఎలా మారుస్తుంది?",
          "ఈ ఉదయపు నడక అలవాటును ప్రతిరోజూ కాపాడుకోవడానికి సులభమైన మార్గం ఏమిటి?"
        ],
        reframeSuggestions: ["నడక ద్వారా లభించిన మానసిక స్పష్టతను మీ సృజనాత్మక పనులకు పునాదిగా చేసుకోండి."],
        cognitiveStrengths: ["శారీరక-మానసిక సమతుల్యత", "విశ్రాంతి అలవాట్లను గౌరవించడం"],
        keyThemes: ["శారీరక ఆరోగ్యం", "ఉదయపు స్పష్టత", "10k అడుగులు"],
        microActions: [
          { title: "హైడ్రేషన్ & ఎలక్ట్రోలైట్స్", description: "నడక తర్వాత 500 మి.లీ నీరు త్రాగండి." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "ముఖ్యమైన సమావేశం: ఉదయం 11:00 గంటలకు క్లౌడ్ ఆర్కిటెక్చర్ సమీక్ష",
        content: `వాయిస్ నోట్: ఈ రోజు ఉదయం 11:00 గంటలకు ఇంజనీరింగ్ లీడ్స్‌తో APAC క్లౌడ్ ఆర్కిటెక్చర్ రివ్యూ మీటింగ్‌ను గుర్తు చేయండి.
ముఖ్య అంశాలు: జీరో-ట్రస్ట్ KMS ఎన్‌క్రిప్షన్, ADK మల్టీ-ఏజెంట్ కాన్‌కరెన్సీ మరియు టీమ్ 94/100 శాంతి స్కోరును నిలబెట్టడం.`,
        summary: "11 గంటల సమావేశానికి ముందస్తు సన్నద్ధత మరియు జీరో-ట్రస్ట్ భద్రతా ప్రణాళిక.",
        socraticQuestions: [
          "ఈ 11 గంటల సమావేశాన్ని విజయవంతం చేసే ప్రధాన ఫలితం ఏమిటి?",
          "సమావేశం తర్వాత బృందం మరింత ఉత్సాహంగా ఉండేలా మీరు ఎలా చూసుకోవచ్చు?"
        ],
        reframeSuggestions: ["పూర్తి ఆత్మవిశ్వాసంతో నడిపించండి — మీ జీరో-ట్రస్ట్ డిజైన్ అత్యంత పటిష్టమైనది."],
        cognitiveStrengths: ["ముందస్తు ప్రణాళిక", "ఇంజనీరింగ్ శ్రేష్ఠత మరియు టీమ్ శ్రేయస్సుల సమన్వయం"],
        keyThemes: ["క్లౌడ్ ఆర్కిటెక్చర్", "జీరో-ట్రస్ట్ భద్రత", "నాయకత్వం"],
        microActions: [
          { title: "KMS స్లైడ్‌ల సమీక్ష", description: "11 గంటలకు ముందే Cloud KMS పాలసీలను తనిఖీ చేయండి." }
        ]
      }
    }
  },

  ta: {
    faqs: [
      {
        q: "சாக்ரடிக் சுய சிந்தனை பயிற்சியாளர் (Socratic Coach) எவ்வாறு செயல்படுகிறது?",
        a: "ஜெமினி 3.7 / 2.5 ஃப்ளாஷ் மற்றும் கூகுள் ஏஜென்ட் டெவலப்மென்ட் கிட் (ADK) ஆகியவற்றைப் பயன்படுத்தி மன அழுத்தங்களை ஆழமான சாக்ரடிக் கேள்விகளாக மாற்றி, 15 நிமிட நடைமுறை செயல்முறைகளை உருவாக்குகிறது."
      },
      {
        q: "மீடியா ஸ்டுடியோ பல்வேறு உள்ளீடுகளை எவ்வாறு கையாள்கிறது?",
        a: "ஸ்டிக்கி நோட்ஸ், கையால் எழுதப்பட்ட குறிப்புகள், குரல் பதிவுகள் மற்றும் வீடியோக்களை கூகுள் கிளவுட் ஸ்டோரேஜில் (GCS) சேமித்து, ஜெமினி மல்டி-மோடல் மூலம் தானாகவே நாட்குறிப்பாக மாற்றுகிறது."
      },
      {
        q: "எனது பதிவுகள் மற்றும் உடல்நலத் தகவல்கள் பாதுகாப்பானவையா?",
        a: "ஆம், முற்றிலும். ஜீரோ-டிரஸ்ட் கிளஸ்டர் பாதுகாப்பு விதிகள் மூலம் உங்கள் கணக்கிற்கு மட்டுமே தனிமைப்படுத்தப்படுகிறது. உங்கள் தகவல்கள் பொது மாடல்களுக்குப் பயன்படுத்தப்படாது."
      },
      {
        q: "ஸ்மார்ட் வாட்ச் மற்றும் ஹெல்த் டிராக்கர் எவ்வாறு இணைகிறது?",
        a: "கூகுள் ஹெல்த் கனெக்ட், சாம்சங் ஹெல்த், ஆப்பிள் ஹெல்த் மற்றும் கார்மின் சாதனங்களுடன் இணைந்து இதயத் துடிப்பு, HRV மற்றும் தூக்க நிலைகளை மன நலத்துடன் ஒப்பிடுகிறது."
      },
      {
        q: "நோவா (Nova) 3D லைவ் வாய்ஸ் உதவியாளருடன் எவ்வாறு பேசுவது?",
        a: "கீழ் வலது மூலையில் உள்ள நோவா உருண்டையை அழுத்துவதன் மூலம் தமிழில் நிகழ்நேர குரல் உரையாடலைத் தொடங்கி சிந்தனைகளைப் பதிவு செய்யலாம்."
      },
      {
        q: "பிற மொழிகளில் நான் எழுதலாமா?",
        a: "ஆம்! தமிழ், இந்தி, தெலுங்கு, கன்னடம், மலையாளம் மற்றும் உலகளாவிய 18+ மொழிகளை ரெஃப்ளெக்ட்லாஜிக்ஸ் ஆதரிக்கிறது."
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI-க்கு நல்வரவு",
      welcomeDesc: "ஜெமினி மற்றும் சாக்ரடிக் பயிற்சியாளருடன் கூடிய உங்களின் பல்நோக்கு தனிப்பட்ட நாட்குறிப்பு — மன அமைதியுடன் சிந்திக்கவும், வாழ்க்கையை நல்வழியில் வழிநடத்தவும் அமைக்கப்பட்ட பாதுகாப்பான தளம்.",
      principles: {
        socraticTitle: "சாக்ரடிக் சிந்தனைப் பயிற்சி",
        socraticDesc: "ஜெமினி 3.7 மூலம் சிந்தனைத் தடைகளை நீக்கி, சுய இரக்கத்தையும் 15 நிமிட நுண்ணிய செயல்களையும் உருவாக்குகிறது.",
        mediaTitle: "பல்வகை ஊடக ஸ்டுடியோ",
        mediaDesc: "கையால் எழுதப்பட்ட தாள்கள், குரல் குறிப்புகள் மற்றும் வீடியோக்களை கூகுள் கிளவுட் ஸ்டோரேஜில் எளிதாகச் சேமிக்கிறது.",
        healthTitle: "ஸ்மார்ட் பயோமெட்ரிக் ஆரோக்கியம்",
        healthDesc: "இதயத் துடிப்பு, HRV, ஆழ்ந்த தூக்கம் மற்றும் நடைப் படிகளை மன அமைதியுடன் தொடர்புபடுத்துகிறது.",
        privacyTitle: "ஜீரோ-டிரஸ்ட் முழுத் தனிமைப் பாதுகாப்பு",
        privacyDesc: "ஃபயர்ஸ்டோர் பயனர் தனிமைப்படுத்தல், சீக்ரெட் மேனேஜர் மற்றும் டெடாக்ஸ் பயன்முறை மூலம் முழுப் பாதுகாப்பு."
      },
      multilingualTitle: "18 மொழிகள் சர்வதேச ஆதரவு",
      multilingualDesc: "தமிழ், இந்தி, தெலுங்கு, கன்னடம், மலையாளம், பெங்காலி, மராத்தி, குஜராத்தி, பஞ்சாபி, அரபு, பிரெஞ்சு, ஜெர்மன், ஸ்பானிஷ், போர்த்துகீசியம், ரஷியன், ஜப்பானிய, சீன மற்றும் ஆங்கில மொழிகளை ஆதரிக்கிறது."
    },
    rag: {
      title: "ஆழ்ந்த சிந்தனைகள் • நினைவகத் தேடல் (RAG)",
      subtitle: "Cloud SQL pgvector வெக்டர் தேடல் மூலம் உங்கள் முந்தைய நாட்குறிப்புகளிலிருந்து ஞானத்தையும் தீர்வுகளையும் கண்டறியுங்கள்.",
      searchPlaceholder: "சிந்தனைகள், தலைப்புகள் அல்லது கேள்விகளைத் தேடுங்கள்...",
      searchBtn: "நினைவகத்தில் தேடு",
      searchingBtn: "தேடுகிறது...",
      examplePromptsTitle: "உதாரண வினவல்கள்",
      examplePrompts: [
        "சமீபத்தில் எனக்கு அதிக மன அமைதியைத் தந்த தருணங்கள் எவை?",
        "அதிக பணிச்சுமையின் போது மன அழுத்தத்தை எவ்வாறு சமாளித்தேன்?",
        "நான் சாதித்த நல்ல பழக்கங்கள் மற்றும் இலக்குகள் என்ன?",
        "என் வளர்ச்சியில் மீண்டும் மீண்டும் வரும் முக்கிய சிந்தனைகள் எவை?"
      ],
      resultsTitle: "மீட்டெடுக்கப்பட்ட நினைவுகள்",
      matchSuffix: "பொருத்தம்",
      sampleResults: [
        {
          title: "நிலையான வேகம் பற்றிய சிந்தனை",
          snippet: "காலையில் அமைதியான இடைவெளிகளை எடுத்தது அதிக பணிச்சுமையை அமைதியுடன் கையாள உதவியது.",
          tags: ["மனஅமைதி", "வேலை", "கவனம்"],
          date: "நேற்று"
        },
        {
          title: "மாலை நடைபயிற்சி & மன ஓய்வு",
          snippet: "இரவு உணவுக்குப் பிறகு திரைகளிலிருந்து விலகியது சிறந்த தூக்கத்தையும் மன நிம்மதியையும் தந்தது.",
          tags: ["உடல்நலம்", "ஓய்வு", "பழக்கம்"],
          date: "3 நாட்களுக்கு முன்"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "அமைதியான விடியல் மற்றும் கணினி கட்டமைப்பு சிந்தனைகள்",
        content: `இன்று காலை புதிய கிளவுட் ரன் வரிசைப்படுத்தலுக்கான ADK ஏஜென்ட் வரைபடத்தை வடிவமைத்தேன்.
சிக்கலான விநியோகிக்கப்பட்ட கணினி தருக்கங்களில் மூழ்குவதற்கு முன், சிறிது நேரம் மூச்சை கவனித்து அமைதியாக இருந்தது பெரும் மாற்றத்தை ஏற்படுத்தியது.
இன்றைய இலக்கு: ஆழ்ந்த தூக்கத்தைப் பாதுகாக்க இரவு 9 மணிக்குள் திரைகளை அணைப்பது.`,
        summary: "கணினி வடிவமைப்புடன் கூடிய அமைதியான காலை நேரம் மற்றும் தூக்கத்தைப் பாதுகாக்கும் நல்ல பழக்கம்.",
        socraticQuestions: [
          "உங்கள் ஆற்றல் குறைவதை முன்கூட்டியே உணர்த்தும் உடல் அறிகுறிகள் எவை?",
          "அதிக வேலை உள்ள நாட்களிலும் இந்த அமைதியான விடியல் சூழலை எவ்வாறு உருவாக்குவது?"
        ],
        reframeSuggestions: ["திட்டமிட்ட இடைவெளிகள் உங்கள் வேகத்தைக் குறைக்காமல், நீண்டகால செயல்திறனை அதிகரிக்கும்."],
        cognitiveStrengths: ["உயர் சுய விழிப்புணர்வு", "ஆற்றல் மீட்பிற்கான தெளிவான எல்லைகள்"],
        keyThemes: ["மன அமைதி", "கணினி கட்டமைப்பு", "தூக்க ஒழுங்கு"],
        microActions: [
          { title: "இரவு 9:00 மணி திரை நிறுத்தம்", description: "மொபைல் சாதனங்களை படுக்கையறையிலிருந்து தள்ளி சார்ஜிங் பகுதிக்கு மாற்றவும்." },
          { title: "காலை 5 நிமிட மூச்சுப் பயிற்சி", description: "மின்னஞ்சல் பார்க்கும் முன் 4-7-8 ஆழமான மூச்சுப் பயிற்சி செய்யவும்." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "இயற்கையில் 10,480 படிகள் காலை நடைப்பயிற்சி",
        content: `சூரிய உதயத்தின் போது பூங்காவில் 10,480 படிகள் விறுவிறுப்பான நடைப்பயிற்சியை முடித்தேன்.
புதிய காற்றை சுவாசித்து, பறவைகளின் ஒலியைக் கேட்டு, நல்ல ஆரோக்கியத்திற்காக நன்றி உணர்ந்தேன்.
முக்கிய உணர்தல்: வேண்டுமென்றே வேகத்தைக் குறைப்பது நீண்டகால தெளிவை விரைவுபடுத்துகிறது.`,
        summary: "10,480 படிகள் நடைபயிற்சியுடன் புத்துணர்ச்சியூட்டும் சூரிய உதயம் மற்றும் நிலையான வேகம் பற்றிய தெளிவு.",
        socraticQuestions: [
          "உடற்பயிற்சி உங்கள் சிக்கலான பொறியியல் சவால்களை அணுகும் முறையை எவ்வாறு மாற்றுகிறது?",
          "இந்த காலை நடைப்பயிற்சி பழக்கத்தை தினமும் பாதுகாக்க ஒரு எளிய வழி என்ன?"
        ],
        reframeSuggestions: ["நடைப்பயிற்சி தரும் மனத்தெளிவை உங்கள் படைப்பாற்றலின் அடித்தளமாகப் பயன்படுத்துங்கள்."],
        cognitiveStrengths: ["உடல்-மன ஒருங்கிணைப்பு", "ஓய்வு தரும் பழக்கங்களை மதித்தல்"],
        keyThemes: ["உடல் நலம்", "காலைத் தெளிவு", "10k படிகள்"],
        microActions: [
          { title: "நீர்ச்சத்து & எலக்ட்ரோலைட்ஸ்", description: "நடைப்பயிற்சிக்குப் பிறகு 500 மி.லி தண்ணீர் குடிக்கவும்." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "முக்கிய கூட்ட நினைவூட்டல்: காலை 11:00 மணிக்கு கிளவுட் ஆர்க்கிடெக்சர் மீட்டிங்",
        content: `குரல் குறிப்பு: இன்று காலை 11:00 மணிக்கு பொறியியல் தலைவர்களுடன் நடைபெறவுள்ள APAC கிளவுட் ஆர்க்கிடெக்சர் மதிப்பாய்வுக் கூட்டத்தை நினைவூட்டவும்.
முக்கியக் குறிப்புகள்: ஜீரோ-டிரஸ்ட் Cloud KMS குறியாக்கம், ADK மல்டி-ஏஜென்ட் ஒருங்கிணைப்பு, மற்றும் அணியின் 94/100 அமைதி குறியீட்டைப் பராமரித்தல்.`,
        summary: "காலை 11:00 மணி கிளவுட் மதிப்பாய்வுக் கூட்டத்திற்கான முன் தயாரிப்பு மற்றும் ஜீரோ-டிரஸ்ட் பாதுகாப்பு திட்டமிடல்.",
        socraticQuestions: [
          "இந்த 11 மணி கூட்டத்தை வெற்றிகரமானதாக மாற்றும் முக்கிய முடிவு எது?",
          "கூட்டத்திற்குப் பின் அணியினர் சோர்வடையாமல் புத்துணர்ச்சி பெற நீங்கள் என்ன செய்யலாம்?"
        ],
        reframeSuggestions: ["முழு தன்னம்பிக்கையுடன் வழிநடத்துங்கள் — உங்கள் ஜீரோ-டிரஸ்ட் கட்டமைப்பு மிகவும் உறுதியானது."],
        cognitiveStrengths: ["முன்முயற்சி திட்டமிடல்", "பொறியியல் சிறப்பையும் அணியின் நல்வாழ்வையும் இணைத்தல்"],
        keyThemes: ["கிளவுட் கட்டமைப்பு", "ஜீரோ-டிரஸ்ட் பாதுகாப்பு", "தலைமைத்துவம்"],
        microActions: [
          { title: "KMS ஸ்லைடுகளை மதிப்பாய்வு செய்", description: "11 மணிக்கு முன் Cloud KMS சுழற்சி கொள்கையை உறுதிப்படுத்தவும்." }
        ]
      }
    }
  },

  hi: {
    faqs: [
      {
        q: "सुकराती रिफ्लेक्शन कोच (Socratic Coach) कैसे काम करता है?",
        a: "यह गूगल जेमिनी 3.7 और ADK का उपयोग करके विचारों का संज्ञानात्मक पुनर्गठन करता है और 15 मिनट के व्यावहारिक माइक्रो-एक्शन बनाता है।"
      },
      {
        q: "मीडिया स्टूडियो मल्टी-मॉडल इनपुट कैसे प्रोसेस करता है?",
        a: "स्टिक नोट्स, हस्तलिखित पन्ने, वॉयस नोट्स और वीडियो गूगल क्लाउड स्टोरेज में सुरक्षित रूप से सेव होकर जेमिनी द्वारा विश्लेषित होते हैं।"
      },
      {
        q: "क्या मेरी डायरी और स्वास्थ्य डेटा सुरक्षित है?",
        a: "हाँ, पूरी तरह। जीरो-ट्रस्ट फायरस्टोर सुरक्षा नियमों के साथ आपका डेटा केवल आपके लिए पृथक रहता है।"
      },
      {
        q: "स्मार्ट वॉच और हेल्थ कनेक्ट कैसे काम करता है?",
        a: "गूगल हेल्थ, सैमसंग हेल्थ और ऐप्पल हेल्थ के साथ सिंक करके हृदय गति, नींद और कदमों को मानसिक शांति से जोड़ता है।"
      },
      {
        q: "नोवा 3D लाइव वॉयस असिस्टेंट से कैसे बात करें?",
        a: "नीचे दाईं ओर नोवा बटन पर क्लिक करें और हिंदी में स्वाभाविक आवाज से संवाद करें।"
      },
      {
        q: "क्या मैं अन्य भाषाओं में जर्नल लिख सकता हूँ?",
        a: "हाँ! हिंदी, तमिल, तेलुगु, कन्नड़, मराठी, बंगाली और 18+ वैश्विक भाषाओं का पूर्ण समर्थन उपलब्ध है।"
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI में आपका स्वागत है",
      welcomeDesc: "जेमिनी और सुकराती कोच के साथ आपकी बहुउद्देश्यीय व्यक्तिगत डायरी — मानसिक शांति और जीवन की स्पष्टता का सुरक्षित स्थान।",
      principles: {
        socraticTitle: "सुकराती चिंतन और कोचिंग",
        socraticDesc: "जेमिनी 3.7 द्वारा संचालित संज्ञानात्मक स्पष्टता और 15 मिनट के व्यावहारिक कदम।",
        mediaTitle: "मल्टी-मॉडल मीडिया स्टूडियो",
        mediaDesc: "हस्तलिखित नोट्स, आवाज और वीडियो को क्लाउड स्टोरेज में आसानी से रिकॉर्ड करें।",
        healthTitle: "स्मार्ट वियरेबल्स बायोमेट्रिक्स",
        healthDesc: "हृदय गति, HRV और नींद के चरणों को मानसिक स्वास्थ्य से जोड़ें।",
        privacyTitle: "जीरो-ट्रस्ट गोपनीयता और सुरक्षा",
        privacyDesc: "क्लाउड रन और फायरस्टोर आइसोलेशन द्वारा पूर्ण डेटा संप्रभुता।"
      },
      multilingualTitle: "18 भाषाओं में पूर्ण समर्थन",
      multilingualDesc: "हिंदी, तमिल, तेलुगु, कन्नड़, बंगाली, मराठी, गुजराती, पंजाबी, फ्रेंच, जर्मन, जापानी आदि।"
    },
    rag: {
      title: "गहन चिंतन • स्मृति खोज (Semantic RAG)",
      subtitle: "Cloud SQL pgvector द्वारा अपने पिछले जर्नल्स से अंतर्दृष्टि और समाधान खोजें।",
      searchPlaceholder: "विचार, विषय या प्रश्न खोजें...",
      searchBtn: "इतिहास में खोजें",
      searchingBtn: "खोज जारी है...",
      examplePromptsTitle: "उदाहरण प्रश्न",
      examplePrompts: [
        "हाल ही में किन पलों ने मुझे सबसे अधिक शांति और स्पष्टता दी?",
        "व्यस्त दिनों में मैंने तनाव को कैसे संभाला?",
        "मैंने किन अच्छी आदतों और लक्ष्यों को हासिल किया?",
        "मेरे विकास से जुड़े मुख्य विषय कौन से हैं?"
      ],
      resultsTitle: "प्राप्त स्मृतियाँ",
      matchSuffix: "समानता",
      sampleResults: [
        {
          title: "स्थिर गति पर चिंतन",
          snippet: "सुबह के शांत पलों ने दिनभर के तनाव को सहजता से संभालने में मदद की।",
          tags: ["शांति", "काम", "एकाग्रता"],
          date: "कल"
        },
        {
          title: "शाम की सैर और मानसिक विश्राम",
          snippet: "स्क्रीन से दूरी बनाने से अच्छी नींद और मानसिक सुकून मिला।",
          tags: ["स्वास्थ्य", "विश्राम", "आदतें"],
          date: "3 दिन पहले"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "शांत सुबह और सिस्टम आर्किटेक्चर चिंतन",
        content: `आज सुबह क्लाउड रन डिप्लॉयमेंट के लिए ADK एजेंट ग्राफ तैयार किया।
जटिल सिस्टम लॉजिक शुरू करने से पहले गहरी सांस लेकर शांत होना बहुत मददगार साबित हुआ।
शाम का लक्ष्य: रात 9 बजे तक स्क्रीन बंद करना ताकि गहरी नींद मिल सके।`,
        summary: "सिस्टम डिजाइन और माइंडफुलनेस का संतुलित संगम तथा नींद का अनुशासन।",
        socraticQuestions: [
          "तनाव बढ़ने से पहले आपके शरीर के कौन से संकेत आपको सतर्क करते हैं?",
          "व्यस्त दिनों में भी आप इस शांत सुबह के वातावरण को कैसे बनाए रख सकते हैं?"
        ],
        reframeSuggestions: ["रणनीतिक विराम आपकी गति को कम नहीं करते, बल्कि दीर्घकालिक स्पष्टता बढ़ाते हैं।"],
        cognitiveStrengths: ["उत्कृष्ट आत्म-जागरूकता", "रिकवरी के लिए सक्रिय सीमाएं"],
        keyThemes: ["मानसिक शांति", "आर्किटेक्चर", "नींद का अनुशासन"],
        microActions: [
          { title: "रात 9:00 बजे स्क्रीन बंद", description: "फोन को बिस्तर से दूर चार्जिंग पर रखें।" },
          { title: "सुबह 5 मिनट प्राणायाम", description: "ईमेल देखने से पहले 4-7-8 गहरी सांस लें।" }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "प्रकृति में 10,480 कदम सुबह की सैर",
        content: `सूर्योदय के समय पार्क में 10,480 कदमों की ताज़ा सैर पूरी की।
ताज़ी हवा, पक्षियों की चहचहाहट और अच्छे स्वास्थ्य के लिए आभार महसूस हुआ।
मुख्य सीख: जानबूझकर गति धीमी करना दीर्घकालिक स्पष्टता को तेज़ करता है।`,
        summary: "10k कदमों की सैर के साथ ऊर्जावान सूर्योदय और सतत गति की स्पष्टता।",
        socraticQuestions: [
          "शारीरिक गतिशीलता आपकी जटिल समस्याओं को हल करने के तरीके को कैसे बदलती है?",
          "इस सुबह की सैर की आदत को हर दिन सुरक्षित रखने का एक आसान तरीका क्या है?"
        ],
        reframeSuggestions: ["सैर से मिली मानसिक स्पष्टता को अपने रचनात्मक कार्य का आधार बनाएं।"],
        cognitiveStrengths: ["शारीरिक-मानसिक संतुलन", "विश्रामकारी आदतों का सम्मान"],
        keyThemes: ["शारीरिक स्वास्थ्य", "सुबह की स्पष्टता", "10k कदम"],
        microActions: [
          { title: "हाइड्रेशन और इलेक्ट्रोलाइट्स", description: "सैर के बाद 500 मिली पानी पिएं।" }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "महत्वपूर्ण बैठक: सुबह 11:00 बजे क्लाउड आर्किटेक्चर समीक्षा",
        content: `वॉयस नोट: आज सुबह 11:00 बजे इंजीनियरिंग लीड्स के साथ APAC क्लाउड आर्किटेक्चर समीक्षा बैठक याद दिलाएं।
मुख्य बिंदु: जीरो-ट्रस्ट KMS एन्क्रिप्शन, ADK मल्टी-एजेंट समवर्ती निष्पादन, और टीम के 94/100 शांति स्कोर को बनाए रखना।`,
        summary: "11 बजे की बैठक की सक्रिय तैयारी और जीरो-ट्रस्ट सुरक्षा योजना।",
        socraticQuestions: [
          "इस 11 बजे की बैठक को सफल बनाने वाला सबसे महत्वपूर्ण परिणाम क्या होगा?",
          "आप कैसे सुनिश्चित करेंगे कि टीम बैठक के बाद ऊर्जावान महसूस करे?"
        ],
        reframeSuggestions: ["पूरे आत्मविश्वास से नेतृत्व करें — आपकी जीरो-ट्रस्ट डिजाइन अत्यंत मजबूत है।"],
        cognitiveStrengths: ["सक्रिय योजना", "उत्कृष्ट इंजीनियरिंग और टीम कल्याण का समन्वय"],
        keyThemes: ["क्लाउड आर्किटेक्चर", "जीरो-ट्रस्ट सुरक्षा", "नेतृत्व"],
        microActions: [
          { title: "KMS स्लाइड्स की समीक्षा", description: "11 बजे से पहले Cloud KMS नीतियों की जांच करें।" }
        ]
      }
    }
  },

  bn: {
    faqs: [
      {
        q: "সক্রেটিক রিফ্লেকশন কোচ (Socratic Coach) কীভাবে কাজ করে?",
        a: "এটি গুগল জেমিনি ৩.৭ এবং ADK ব্যবহার করে মনস্তাত্ত্বিক স্পষ্টতা তৈরি করে এবং ১৫ মিনিটের বাস্তবমুখী পদক্ষেপ সাজায়।"
      },
      {
        q: "মিডিয়া স্টুডিও কীভাবে মাল্টি-মোডাল ইনপুট প্রসেস করে?",
        a: "হাতের লেখা নোট, ভয়েস নোট এবং ভিডিও গুগল ক্লাউড স্টোরেজে সুরক্ষিতভাবে সংরক্ষিত হয়ে জেমিনির মাধ্যমে জার্নালে রূপান্তরিত হয়।"
      },
      {
        q: "আমার জার্নাল ও স্বাস্থ্য ডেটা কি নিরাপদ?",
        a: "হ্যাঁ, সম্পূর্ণভাবে। জিরো-ট্রাস্ট সিকিউরিটি ও ক্লাউড KMS এনক্রিপশনের মাধ্যমে আপনার ডেটা একান্ত গোপন রাখা হয়।"
      },
      {
        q: "স্মার্ট ওয়াচ ও হেলথ ট্র্যাকার কীভাবে সংযুক্ত হয়?",
        a: "গুগল হেলথ, অ্যাপল হেলথ ও স্যামসাং হেলথের সাথে সিঙ্ক করে হার্ট রেট ও ঘুমের তথ্যকে মানসিক প্রশান্তির সাথে সমন্বয় করে।"
      },
      {
        q: "নোভা ৩ডি লাইভ ভয়েস অ্যাসিস্ট্যান্টের সাথে কীভাবে কথা বলব?",
        a: "নিচের নোভা বোতামে ক্লিক করে বাংলায় স্বাচ্ছন্দ্যে কথা বলে সরাসরি জার্নাল তৈরি করুন।"
      },
      {
        q: "আমি কি অন্যান্য ভাষায় জার্নাল লিখতে পারি?",
        a: "হ্যাঁ! বাংলা, হিন্দি, তামিল, তেলুগু, কন্নড় সহ ১৮+ ভাষায় পূর্ণ সহায়তা রয়েছে।"
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI-তে স্বাগতম",
      welcomeDesc: "জেমিনি এবং সক্রেটিক কোচের সাথে আপনার ব্যক্তিগত জার্নাল — মানসিক শান্তি ও জীবন স্পষ্টতার নিরাপদ আশ্রয়।",
      principles: {
        socraticTitle: "সক্রেটিক আত্মচিন্তন কোচিং",
        socraticDesc: "জেমিনি ৩.৭ দ্বারা চালিত চিন্তার স্পষ্টতা ও ১৫ মিনিটের কার্যকর পদক্ষেপ।",
        mediaTitle: "মাল্টি-মোডাল মিডিয়া স্টুডিও",
        mediaDesc: "হাতের লেখা নোট ও ভয়েস রেকর্ড সহজে ক্লাউডে সংরক্ষণ করুন।",
        healthTitle: "স্মার্ট বায়োমেট্রিক হেলথ সিঙ্ক",
        healthDesc: "হার্ট রেট, ঘুম ও পদক্ষেপকে মানসিক ভারসাম্যের সাথে সংযুক্ত করে।",
        privacyTitle: "জিরো-ট্রাস্ট গোপনীয়তা ও সুরক্ষা",
        privacyDesc: "ফায়ারস্টোর ও ক্লাউড রান দ্বারা সম্পূর্ণ ব্যক্তিগত ডেটা সুরক্ষা।"
      },
      multilingualTitle: "১৮টি ভাষার আন্তর্জাতিক সমর্থন",
      multilingualDesc: "বাংলা, হিন্দি, তামিল, তেলুগু, কন্নড়, মালায়ালম, মারাঠি, ইংরেজি ইত্যাদি।"
    },
    rag: {
      title: "গভীর ভাবনা • স্মৃতির অনুসন্ধান (Semantic RAG)",
      subtitle: "Cloud SQL pgvector দিয়ে আপনার অতীতের জার্নাল থেকে নতুন অন্তর্দৃষ্টি ও সমাধান খুঁজুন।",
      searchPlaceholder: "চিন্তা, বিষয় বা প্রশ্ন খুঁজুন...",
      searchBtn: "ইতিহাসে খুঁজুন",
      searchingBtn: "অনুসন্ধান চলছে...",
      examplePromptsTitle: "উদাহরণ অনুসন্ধান",
      examplePrompts: [
        "সম্প্রতি কোন মুহূর্তগুলো আমাকে সবচেয়ে বেশি শান্তি দিয়েছিল?",
        "কাজের চাপের সময় আমি কীভাবে নিজেকে শান্ত রেখেছিলাম?",
        "আমি কী কী ভালো অভ্যাস অর্জন করেছি?",
        "আমার চিন্তাভাবনার মূল বিষয়গুলো কী?"
      ],
      resultsTitle: "পুনরুদ্ধার করা স্মৃতি",
      matchSuffix: "মিল",
      sampleResults: [
        {
          title: "ধীরগতির কার্যকারিতার উপর ভাবনা",
          snippet: "সকালের শান্ত মুহূর্তগুলো দিনের চাপ সামলাতে অনেক সাহায্য করেছিল।",
          tags: ["শান্তি", "কাজ", "মনোযোগ"],
          date: "গতকাল"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "শান্ত সকাল ও সিস্টেম আর্কিটেকচার ভাবনা",
        content: `আজ সকালে ক্লাউড রান ডিপ্লয়মেন্টের জন্য ADK এজেন্ট গ্রাফ তৈরি করলাম। শান্তভাবে দীর্ঘশ্বাস নিয়ে কাজ শুরু করায় অনেক একাগ্রতা অনুভব করলাম।`,
        summary: "সিস্টেম ডিজাইন ও একাগ্রতার সুষম সকাল।",
        socraticQuestions: [
          "চাপ বাড়ার আগে আপনার শরীরের কোন লক্ষণগুলো আপনাকে সতর্ক করে?",
          "ব্যস্ত দিনেও এই শান্ত সকালের পরিবেশ কীভাবে বজায় রাখা যায়?"
        ],
        reframeSuggestions: ["পরিকল্পিত বিরতি গতি কমায় না, বরং দীর্ঘমেয়াদী স্পষ্টতা বাড়ায়।"],
        cognitiveStrengths: ["উচ্চ আত্ম-সচেতনতা", "বিশ্রামের সীমানা নির্ধারণ"],
        keyThemes: ["মানসিক শান্তি", "আর্কিটেকচার", "ঘুমের নিয়ম"],
        microActions: [
          { title: "রাত ৯:০০ টায় স্ক্রিন অফ", description: "ফোন শোবার ঘরের বাইরে চার্জে রাখুন।" }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "প্রকৃতিতে ১০,৪৮০ কদম প্রাতঃভ্রমণ",
        content: `সূর্যোদয়ের সময় পার্কে ১০,৪৮০ কদম হাঁটলাম। বিশুদ্ধ বাতাস ও পাখির ডাকে মন ভরে গেল।`,
        summary: "১০k কদম হাঁটার সাথে সতেজ সূর্যোদয়।",
        socraticQuestions: ["শারীরিক গতিশীলতা কীভাবে আপনার সমস্যা সমাধানের ধরন বদলে দেয়?"],
        reframeSuggestions: ["হাঁটার স্পষ্টতাকে আপনার কাজের ভিত্তি বানান।"],
        cognitiveStrengths: ["শারীরিক-মানসিক ভারসাম্য"],
        keyThemes: ["শারীরিক স্বাস্থ্য", "১০k কদম"],
        microActions: [
          { title: "জল পান করুন", description: "হাঁটার পর ৫০০ মিলি জল পান করুন।" }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "গুরুত্বপূর্ণ মিটিং: সকাল ১১:০০ টায় ক্লাউড আর্কিটেকচার রিভিউ",
        content: `ভয়েস নোট: আজ সকাল ১১:০০ টায় APAC ক্লাউড আর্কিটেকচার রিভিউ মিটিং মনে করিয়ে দিন।`,
        summary: "১১ টার মিটিংয়ের পূর্ব প্রস্তুতি ও জিরো-ট্রাস্ট সুরক্ষা।",
        socraticQuestions: ["এই মিটিং সফল করার প্রধান লক্ষ্য কী?"],
        reframeSuggestions: ["আত্মবিশ্বাসের সাথে নেতৃত্ব দিন।"],
        cognitiveStrengths: ["সক্রিয় পরিকল্পনা"],
        keyThemes: ["ক্লাউড আর্কিটেকচার", "জিরো-ট্রাস্ট"],
        microActions: [
          { title: "KMS স্লাইড রিভিউ", description: "১১ টার আগে নীতিগুলো পরীক্ষা করুন।" }
        ]
      }
    }
  },

  mr: {
    faqs: [
      {
        q: "सॉक्रेటిक रिफ्लेक्शन कोच (Socratic Coach) कसे कार्य करतो?",
        a: "गुगल जेमिनी ३.७ आणि ADK चा वापर करून विचारांचे पुनर्गठन करतो आणि १५ मिनिटांच्या कृती योजना तयार करतो."
      },
      {
        q: "मीडिया स्टुडिओ विविध इनपुट्स कसे प्रोसेस करतो?",
        a: "हस्तलिखित नोट्स, व्हॉइस नोट्स आणि व्हिडिओ क्लाउड स्टोरेजमध्ये सुरक्षित ठेवून जेमिनीद्वारे जर्नलमध्ये रूपांतरित केले जातात."
      },
      {
        q: "माझा डेटा सुरक्षित आहे का?",
        a: "होय, झिरो-ट्रस्ट फायरस्टोर आणि क्लाउड KMS द्वारे तुमचा डेटा पूर्णपणे सुरक्षित आणि गोपनीय राहतो."
      },
      {
        q: "स्मार्ट वॉच सिंक कसे कार्य करते?",
        a: "गुगल हेल्थ आणि ॲपल हेल्थशी सिंक करून हृदय गती, झोप आणि पावले मानसिक शांततेशी जोडतो."
      },
      {
        q: "नोव्हा ३D व्हॉइस असिस्टंटशी कसे बोलावे?",
        a: "नोव्हा आयकॉनवर क्लिक करून मराठीत थेट बोलून जर्नल तयार करा."
      },
      {
        q: "मी मराठीत लिहू शकतो का?",
        a: "होय! मराठी, हिंदी, तमिळ, कन्नड, तेलगू सह १८+ भाषांना पूर्ण पाठिंबा आहे."
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI मध्ये आपले स्वागत आहे",
      welcomeDesc: "जेमिनी आणि सॉक्रेटिस कोचसह आपले वैयक्तिक जर्नल — मानसिक शांतता आणि स्पष्टतेचे सुरक्षित ठिकाण.",
      principles: {
        socraticTitle: "सॉक्रेटीक मार्गदर्शन",
        socraticDesc: "जेमिनी ३.७ द्वारे विचारांची स्पष्टता आणि १५ मिनिटांच्या कृती.",
        mediaTitle: "मल्टी-मॉडल मीडिया स्टुडिओ",
        mediaDesc: "हस्तलिखित नोट्स आणि आवाज क्लाउडमध्ये जतन करा.",
        healthTitle: "स्मार्ट बायोमेट्रिक आरोग्य",
        healthDesc: "हृदय गती आणि झोप मानसिक आरोग्याशी जोडा.",
        privacyTitle: "झिरो-ट्रस्ट गोपनीयता",
        privacyDesc: "क्लाउड रन आणि फायरस्टोरद्वारे डेटाचे पूर्ण रक्षण."
      },
      multilingualTitle: "१८ आंतरराष्ट्रीय भाषांना पाठिंबा",
      multilingualDesc: "मराठी, हिंदी, तमिळ, तेलगू, कन्नड, मल्याळम, बंगाली, इंग्रजी इत्यादी."
    },
    rag: {
      title: "खोल विचार • स्मृती शोध (Semantic RAG)",
      subtitle: "Cloud SQL pgvector द्वारे आपल्या जुन्या जर्नलमधून नवीन उपाय आणि स्पष्टता शोधा.",
      searchPlaceholder: "विचार, विषय किंवा प्रश्न शोधा...",
      searchBtn: "इतिहासात शोधा",
      searchingBtn: "शोधत आहे...",
      examplePromptsTitle: "उदाहरण प्रश्न",
      examplePrompts: [
        "नुकतेच मला कोणत्या क्षणांनी सर्वाधिक शांतता दिली?",
        "कामाच्या तणावात मी स्वतःला कसे शांत ठेवले?"
      ],
      resultsTitle: "मिळालेल्या आठवणी",
      matchSuffix: "जुळणी",
      sampleResults: [
        {
          title: "संतुलित गतीवर विचार",
          snippet: "सकाळच्या शांत क्षणांनी दिवसाचा तणाव हाताळण्यास मदत केली.",
          tags: ["शांतता", "काम", "एकाग्रता"],
          date: "काल"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "शांत सकाळ आणि सिस्टम आर्किटेक्चर विचार",
        content: `आज सकाळी क्लाउड रन डिप्लॉयमेंटसाठी ADK एजंट आलेख तयार केला. शांतपणे श्वास घेऊन सुरुवात केल्याने खूप फायदा झाला.`,
        summary: "सिस्टम डिझाईन आणि एकाग्रतेची शांत सकाळ.",
        socraticQuestions: ["तणाव वाढण्यापूर्वी तुमचे शरीर कोणते संकेत देते?"],
        reframeSuggestions: ["विराम घेणे गती कमी करत नाही, तर दीर्घकालीन स्पष्टता वाढवते."],
        cognitiveStrengths: ["उत्कृष्ट आत्म-जागरूकता"],
        keyThemes: ["मानसिक शांतता", "आर्किटेक्चर"],
        microActions: [
          { title: "रात्री ९:०० वाजता स्क्रीन बंद", description: "फोन बेडरूमबाहेर चार्जिंगला ठेवा." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "निसर्गात १०,४८० पावले सकाळची फेरी",
        content: `सूर्योदयाच्या वेळी १०,४८० पावले चाललो. ताजी हवा आणि शांततेने मन प्रसन्न झाले.`,
        summary: "१०k पावले चालण्यासोबत ताजी सकाळ.",
        socraticQuestions: ["शारीरिक हालचाल तुमची विचारसरणी कशी बदलते?"],
        reframeSuggestions: ["सकाळच्या स्पष्टतेला कामाचा पाया बनवा."],
        cognitiveStrengths: ["शारीरिक-मानसिक संतुलन"],
        keyThemes: ["आरोग्य", "१०k पावले"],
        microActions: [
          { title: "पाणी प्या", description: "फेरीनंतर ५०० मिली पाणी प्या." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "महत्त्वाची बैठक: सकाळी ११:०० वाजता आर्किटेक्चर रिव्ह्यू",
        content: `व्हॉइस नोट: आज सकाळी ११:०० वाजता APAC क्लाउड आर्किटेक्चर रिव्ह्यू बैठक आठवण करा.`,
        summary: "११ च्या बैठकीची तयारी आणि झिरो-ट्रस्ट सुरक्षा.",
        socraticQuestions: ["ही बैठक यशस्वी करण्याचा मुख्य मार्ग कोणता?"],
        reframeSuggestions: ["आत्मविश्वासाने नेतृत्व करा."],
        cognitiveStrengths: ["सक्रिय नियोजन"],
        keyThemes: ["क्लाउड आर्किटेक्चर", "सुरक्षा"],
        microActions: [
          { title: "KMS स्लाईड्स तपासा", description: "११ पूर्वी धोरणे तपासा." }
        ]
      }
    }
  },

  es: {
    faqs: [
      {
        q: "¿Cómo funciona el Coach de Reflexión Socrática?",
        a: "Utiliza Google Gemini 3.7 y ADK para realizar reestructuración cognitiva, planteando preguntas socráticas profundas y sintetizando micro-acciones prácticas de 15 minutos."
      },
      {
        q: "¿Cómo procesa el Media Studio las entradas multimodales?",
        a: "Puedes subir notas adhesivas, notas manuscritas, notas de voz de 1 minuto y registros de video, procesados de forma segura en Google Cloud Storage y analizados con Gemini."
      },
      {
        q: "¿Están seguros mis datos?",
        a: "Sí, totalmente. Aislamiento estricto de inquilinos con Cloud Firestore y Cloud KMS garantizan total privacidad."
      },
      {
        q: "¿Cómo se conecta con relojes inteligentes y salud?",
        a: "Se sincroniza con Google Health Connect, Apple Health y Garmin para correlacionar frecuencia cardíaca, sueño y pasos con el bienestar emocional."
      },
      {
        q: "¿Cómo interactúo con el Asistente de Voz Nova 3D?",
        a: "Haz clic en el orbe flotante de Nova para iniciar una conversación por voz fluida y registrar reflexiones sin usar las manos."
      },
      {
        q: "¿Puedo escribir en varios idiomas?",
        a: "¡Sí! Soporta 18 idiomas globales e indios con traducción y análisis contextual nativo."
      }
    ],
    about: {
      welcomeTitle: "Bienvenido a ReflectLogixAI",
      welcomeDesc: "Tu diario personal y compañero socrático impulsado por Gemini — un santuario sereno de confianza cero.",
      principles: {
        socraticTitle: "Entrenamiento Socrático",
        socraticDesc: "Reencuadre cognitivo y micro-acciones de 15 minutos con Gemini 3.7.",
        mediaTitle: "Estudio Multimodal",
        mediaDesc: "Guarda notas manuscritas, voz y video en Google Cloud Storage.",
        healthTitle: "Biometría y Salud Inteligente",
        healthDesc: "Correlaciona frecuencia cardíaca, sueño y pasos con tu claridad mental.",
        privacyTitle: "Privacidad Zero-Trust",
        privacyDesc: "Seguridad completa en Firestore y Cloud Run con cifrado KMS."
      },
      multilingualTitle: "Internacionalización en 18 Idiomas",
      multilingualDesc: "Soporte nativo para español, inglés, francés, alemán, japonés, hindi, tamil, etc."
    },
    rag: {
      title: "Reflexiones Profundas • Memoria Semántica (RAG)",
      subtitle: "Busca en tus reflexiones históricas mediante similitud de vectores con Cloud SQL pgvector.",
      searchPlaceholder: "Buscar pensamientos, temas o preguntas...",
      searchBtn: "Buscar en Historial",
      searchingBtn: "Buscando...",
      examplePromptsTitle: "Preguntas de Ejemplo",
      examplePrompts: [
        "¿Qué momentos me dieron más calma y claridad recientemente?",
        "¿Cómo manejé el estrés en semanas intensas?"
      ],
      resultsTitle: "Memorias Recuperadas",
      matchSuffix: "coincidencia",
      sampleResults: [
        {
          title: "Reflexiones sobre el Ritmo Sostenible",
          snippet: "Las pausas matutinas transformaron mi manejo del estrés laboral.",
          tags: ["Calma", "Trabajo", "Claridad"],
          date: "Ayer"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "Reflexiones del Amanecer y Arquitectura de Sistemas",
        content: `Comencé el día diseñando el grafo de orquestación de agentes ADK en Cloud Run. Tomar una pausa consciente antes de programar marcó una gran diferencia.`,
        summary: "Mañana equilibrada combinando diseño de sistemas y calma mental.",
        socraticQuestions: ["¿Qué señales físicas te indican fatiga antes de que afecte tu estado de ánimo?"],
        reframeSuggestions: ["Las pausas estratégicas aumentan tu claridad a largo plazo."],
        cognitiveStrengths: ["Alta autoconciencia"],
        keyThemes: ["Paz Mental", "Arquitectura"],
        microActions: [
          { title: "Apagar pantallas a las 9:00 PM", description: "Cargar el teléfono fuera del dormitorio." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "Caminata de 10,480 Pasos al Amanecer",
        content: `Completé una caminata de 10,480 pasos en el parque. Sentí profunda gratitud por la salud.`,
        summary: "Caminata matutina revitalizante de 10k pasos.",
        socraticQuestions: ["¿Cómo cambia el movimiento físico tu enfoque hacia los problemas?"],
        reframeSuggestions: ["Usa la claridad de la caminata como base creativa."],
        cognitiveStrengths: ["Integración cuerpo-mente"],
        keyThemes: ["Vitalidad", "10k Pasos"],
        microActions: [
          { title: "Hidratación", description: "Beber 500ml de agua después de caminar." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "Reunión Importante: Revisión de Arquitectura Cloud a las 11:00 AM",
        content: `Nota de voz: Recordar la reunión de revisión de arquitectura con el equipo a las 11:00 AM.`,
        summary: "Preparación para la reunión de arquitectura Cloud y seguridad Zero-Trust.",
        socraticQuestions: ["¿Cuál es el resultado clave para que esta reunión sea un éxito?"],
        reframeSuggestions: ["Lidera con confianza; tu diseño es sólido."],
        cognitiveStrengths: ["Planificación proactiva"],
        keyThemes: ["Arquitectura Cloud", "Seguridad"],
        microActions: [
          { title: "Revisar diapositivas de KMS", description: "Verificar políticas antes de las 11 AM." }
        ]
      }
    }
  },

  fr: {
    faqs: [
      {
        q: "Comment fonctionne le Coach de Réflexion Socratique ?",
        a: "Il utilise Google Gemini 3.7 et Google ADK pour transformer les pensées en questions socratiques et micro-actions de 15 minutes."
      },
      {
        q: "Comment le Media Studio traite-t-il les fichiers ?",
        a: "Notes manuscrites, mémos vocaux et vidéos sont stockés en sécurité sur Google Cloud Storage et transcrits par Gemini."
      },
      {
        q: "Mes données sont-elles protégées ?",
        a: "Oui, isolation totale des données grâce aux règles Cloud Firestore et au chiffrement Cloud KMS."
      },
      {
        q: "Comment fonctionne la synchronisation santé ?",
        a: "Synchronisation avec Google Health, Apple Health et Garmin pour relier fréquence cardiaque et sommeil au bien-être."
      },
      {
        q: "Comment parler à l'Assistant Vocal Nova 3D ?",
        a: "Cliquez sur l'orbe Nova pour débuter une session vocale interactive et fluide."
      },
      {
        q: "Puis-je écrire en français et dans d'autres langues ?",
        a: "Oui, 18 langues internationales et indiennes sont pleinement supportées."
      }
    ],
    about: {
      welcomeTitle: "Bienvenue sur ReflectLogixAI",
      welcomeDesc: "Votre journal intime et compagnon socratique propulsé par Gemini — un sanctuaire de sérénité et de confiance zéro.",
      principles: {
        socraticTitle: "Coaching Socratique",
        socraticDesc: "Recadrage cognitif et micro-actions de 15 minutes avec Gemini 3.7.",
        mediaTitle: "Studio Média Multimodal",
        mediaDesc: "Stockez vos notes manuscrites et voix sur Google Cloud Storage.",
        healthTitle: "Biométrie & Santé Intelligente",
        healthDesc: "Reliez fréquence cardiaque, sommeil et pas à votre clarté mentale.",
        privacyTitle: "Confidentialité Zero-Trust",
        privacyDesc: "Sécurité robuste sur Firestore et Cloud Run avec chiffrement KMS."
      },
      multilingualTitle: "Support International de 18 Langues",
      multilingualDesc: "Français, anglais, allemand, espagnol, japonais, hindi, tamoul, etc."
    },
    rag: {
      title: "Réflexions Profondes • Mémoire Sémantique (RAG)",
      subtitle: "Interrogez vos journaux passés avec la recherche vectorielle Cloud SQL pgvector.",
      searchPlaceholder: "Rechercher des pensées, thèmes ou questions...",
      searchBtn: "Rechercher",
      searchingBtn: "Recherche en cours...",
      examplePromptsTitle: "Exemples de requêtes",
      examplePrompts: [
        "Quels moments m'ont apporté le plus de calme récemment ?",
        "Comment ai-je géré le stress lors des semaines chargées ?"
      ],
      resultsTitle: "Souvenirs Retrouvés",
      matchSuffix: "correspondance",
      sampleResults: [
        {
          title: "Réflexion sur le Rythme Soutenable",
          snippet: "Prendre une pause matinale a transformé ma façon de gérer la charge de travail.",
          tags: ["Calme", "Travail", "Clarté"],
          date: "Hier"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "Réflexions Matinales et Architecture Système",
        content: `J'ai commencé la journée en concevant l'orchestration des agents ADK sur Cloud Run. Prendre un moment de calme a fait toute la différence.`,
        summary: "Matinée équilibrée alliant conception système et pleine conscience.",
        socraticQuestions: ["Quels signaux physiques indiquent une fatigue naissante ?"],
        reframeSuggestions: ["Les pauses stratégiques renforcent votre clarté à long terme."],
        cognitiveStrengths: ["Grande conscience de soi"],
        keyThemes: ["Sérénité", "Architecture"],
        microActions: [
          { title: "Éteindre les écrans à 21h00", description: "Recharger les appareils hors de la chambre." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "Marche de 10 480 Pas dans la Nature",
        content: `Marche revigorante de 10 480 pas au lever du soleil dans le parc.`,
        summary: "Marche matinale énergisante de 10k pas.",
        socraticQuestions: ["Comment l'activité physique influence-t-elle votre créativité ?"],
        reframeSuggestions: ["Utilisez cette clarté matinale pour vos projets."],
        cognitiveStrengths: ["Harmonie corps-esprit"],
        keyThemes: ["Vitalité", "10k Pas"],
        microActions: [
          { title: "Hydratation", description: "Boire 500 ml d'eau après la marche." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "Rappel Réunion : Revue d'Architecture Cloud à 11h00",
        content: `Mémo vocal : Préparer la réunion d'architecture Cloud de 11h00 avec l'équipe technique.`,
        summary: "Préparation proactive et sécurité Zero-Trust.",
        socraticQuestions: ["Quel est l'objectif principal pour réussir cette réunion ?"],
        reframeSuggestions: ["Menez la réunion avec confiance ; votre architecture est solide."],
        cognitiveStrengths: ["Planification proactive"],
        keyThemes: ["Cloud Architecture", "Sécurité"],
        microActions: [
          { title: "Revoir les slides KMS", description: "Vérifier la politique des clés avant 11h." }
        ]
      }
    }
  },

  de: {
    faqs: [
      {
        q: "Wie funktioniert der sokratische Reflexions-Coach?",
        a: "Er nutzt Google Gemini 3.7 und Google ADK für kognitives Reframing und formuliert 15-minütige praktische Mikroschritte."
      },
      {
        q: "Wie verarbeitet das Media Studio Dateien?",
        a: "Handschriftliche Notizen, Sprachaufnahmen und Videos werden sicher auf Google Cloud Storage gespeichert und von Gemini analysiert."
      },
      {
        q: "Sind meine Daten privat und sicher?",
        a: "Ja, vollständige Isolation durch Cloud Firestore Sicherheitsregeln und Cloud KMS Verschlüsselung."
      },
      {
        q: "Wie funktioniert die Smartwatch- und Gesundheitssynchronisierung?",
        a: "Verbindet sich mit Google Health, Apple Health und Garmin zur Analyse von Herzfrequenz, Schlaf und Schritten."
      },
      {
        q: "Wie spreche ich mit dem Nova 3D Sprachassistenten?",
        a: "Klicken Sie auf den Nova-Button für eine flüssige Sprachinteraktion auf Deutsch."
      },
      {
        q: "Kann ich auf Deutsch und in anderen Sprachen schreiben?",
        a: "Ja, 18 Sprachen werden nahtlos unterstützt."
      }
    ],
    about: {
      welcomeTitle: "Willkommen bei ReflectLogixAI",
      welcomeDesc: "Ihr persönliches Journal und sokratischer Begleiter mit Gemini — ein sicherer Rückzugsort für innere Ruhe und Klarheit.",
      principles: {
        socraticTitle: "Sokratisches Coaching",
        socraticDesc: "Kognitives Reframing und 15-Minuten-Aktionen mit Gemini 3.7.",
        mediaTitle: "Multimodales Media Studio",
        mediaDesc: "Handschriftliche Notizen und Sprache sicher in der Cloud speichern.",
        healthTitle: "Smarte Biometrie & Gesundheit",
        healthDesc: "Herzfrequenz und Schlaf mit emotionalem Wohlbefinden verknüpfen.",
        privacyTitle: "Zero-Trust Datenschutz",
        privacyDesc: "Höchste Datensouveränität mit Firestore und Cloud Run."
      },
      multilingualTitle: "18-Sprachen Internationalisierung",
      multilingualDesc: "Deutsch, Englisch, Französisch, Spanisch, Japanisch, Hindi, Tamil usw."
    },
    rag: {
      title: "Tiefe Reflexionen • Semantisches Gedächtnis (RAG)",
      subtitle: "Durchsuchen Sie vergangene Einträge mit Cloud SQL pgvector Vektorsuche.",
      searchPlaceholder: "Gedanken, Themen oder Fragen suchen...",
      searchBtn: "Suchen",
      searchingBtn: "Suche läuft...",
      examplePromptsTitle: "Beispielfragen",
      examplePrompts: [
        "Welche Momente brachten mir zuletzt am meisten Ruhe?",
        "Wie habe ich stressige Phasen bewältigt?"
      ],
      resultsTitle: "Gefundene Erinnerungen",
      matchSuffix: "Übereinstimmung",
      sampleResults: [
        {
          title: "Gedanken zu nachhaltigem Tempo",
          snippet: "Morgendliche Pausen halfen mir, hohe Arbeitsbelastung mit Ruhe zu meistern.",
          tags: ["Ruhe", "Arbeit", "Klarheit"],
          date: "Gestern"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "Morgenruhe und Systemarchitektur",
        content: `Heute Morgen habe ich den ADK Agentengraphen für Cloud Run entworfen. Ein bewusster ruhiger Start machte den Unterschied.`,
        summary: "Ausgewogener Morgen mit Systemdesign und Achtsamkeit.",
        socraticQuestions: ["Welche Signale zeigen Ihnen Erschöpfung, bevor sie sich auf die Stimmung auswirkt?"],
        reframeSuggestions: ["Pausen verlangsamen Sie nicht, sondern stärken die langfristige Klarheit."],
        cognitiveStrengths: ["Hohe Selbstwahrnehmung"],
        keyThemes: ["Innere Ruhe", "Architektur"],
        microActions: [
          { title: "Bildschirme um 21:00 Uhr aus", description: "Geräte außerhalb des Schlafzimmers laden." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "10.480 Schritte Morgenspaziergang",
        content: `10.480 Schritte bei Sonnenaufgang im Park vollendet. Dankbarkeit für gute Gesundheit.`,
        summary: "Energetisierender Morgenspaziergang mit 10k Schritten.",
        socraticQuestions: ["Wie verändert Bewegung Ihre Problemlösungskompetenz?"],
        reframeSuggestions: ["Nutzen Sie die gewonnene Frische für Ihre Projekte."],
        cognitiveStrengths: ["Körper-Geist-Harmonie"],
        keyThemes: ["Vitalität", "10k Schritte"],
        microActions: [
          { title: "Flüssigkeit zuführen", description: "500ml Wasser nach dem Spaziergang trinken." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "Wichtiges Meeting: Cloud Architektur Review um 11:00 Uhr",
        content: `Sprachnotiz: Erinnerung an das APAC Architektur Review Meeting um 11:00 Uhr.`,
        summary: "Vorbereitung auf das Architektur-Review und Zero-Trust Sicherheit.",
        socraticQuestions: ["Was ist das wichtigste Ziel für dieses Meeting?"],
        reframeSuggestions: ["Führen Sie das Meeting mit Selbstvertrauen."],
        cognitiveStrengths: ["Proaktive Planung"],
        keyThemes: ["Cloud Architektur", "Sicherheit"],
        microActions: [
          { title: "KMS Folien prüfen", description: "Richtlinien vor 11:00 Uhr überprüfen." }
        ]
      }
    }
  },

  ja: {
    faqs: [
      {
        q: "ソクラテス式リフレクションコーチはどのように機能しますか？",
        a: "Google Gemini 3.7とGoogle ADKを活用し、深い問いかけを通じて認知の再構成を行い、15分で実行可能な行動ステップを導き出します。"
      },
      {
        q: "メディアスタジオはどのようにマルチモーダルデータを処理しますか？",
        a: "付箋、手書きメモ、1分間の音声メモ、動画ログをGoogle Cloud Storageに安全に保存し、Geminiで解析してジャーナル化します。"
      },
      {
        q: "私のデータは安全ですか？",
        a: "はい。ゼロトラストのCloud FirestoreセキュリティルールとCloud KMS暗号化により、完全なプライバシーが保証されます。"
      },
      {
        q: "スマートウォッチ連携はどのように機能しますか？",
        a: "Google Health Connect、Apple Health、Garmin等と同期し、心拍数、睡眠、歩数とメンタルヘルスを関連付けます。"
      },
      {
        q: "Nova 3Dライブ音声アシスタントの使い方は？",
        a: "右下のNovaアイコンをクリックすると、日本語でのリアルタイム音声対話でハンズフリーにジャーナルを記録できます。"
      },
      {
        q: "日本語や他の言語で記録できますか？",
        a: "はい！日本語、英語、ヒンディー語、タミル語を含む18のグローバル言語をサポートしています。"
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI へようこそ",
      welcomeDesc: "Geminiとソクラテスコーチを搭載した多目的パーソナルジャーナル — 心の平安と人生の明瞭さを育むゼロトラストの聖域です。",
      principles: {
        socraticTitle: "ソクラテス式コーチング",
        socraticDesc: "Gemini 3.7による認知的リフレーミングと15分のアクション生成。",
        mediaTitle: "マルチモーダルメディアスタジオ",
        mediaDesc: "手書きメモや音声をGoogle Cloud Storageに安全に保存。",
        healthTitle: "スマート生体ヘルスケア",
        healthDesc: "心拍数や睡眠と心の静けさを連動分析。",
        privacyTitle: "ゼロトラストプライバシー",
        privacyDesc: "FirestoreとCloud Runによる完全なデータ主権の保護。"
      },
      multilingualTitle: "18言語の国際化対応",
      multilingualDesc: "日本語、英語、フランス語、ドイツ語、スペイン語、ヒンディー語、タミル語等。"
    },
    rag: {
      title: "深層リフレクション • セマンティック記憶探索 (RAG)",
      subtitle: "Cloud SQL pgvectorのベクトル検索により、過去のジャーナルから新たな洞察と気づきを再発見します。",
      searchPlaceholder: "思考、テーマ、または質問を検索...",
      searchBtn: "履歴を検索",
      searchingBtn: "検索中...",
      examplePromptsTitle: "質問の例",
      examplePrompts: [
        "最近最も穏やかで明確な気持ちになれた瞬間は？",
        "忙しい時期のストレスにどのように対処しましたか？"
      ],
      resultsTitle: "検索された記憶",
      matchSuffix: "一致",
      sampleResults: [
        {
          title: "持続可能なペースについての考察",
          snippet: "朝の静かな休憩が、一日の仕事のプレッシャーを落ち着いて乗り切る助けになりました。",
          tags: ["静寂", "仕事", "明瞭さ"],
          date: "昨日"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "静かな夜明けとシステムアーキテクチャの考察",
        content: `今朝はCloud Run用のADKエージェントグラフを設計しました。作業前に深呼吸して落ち着いたことで、非常に高い集中力を発揮できました。`,
        summary: "システム設計とマインドフルネスが調和した朝の記録。",
        socraticQuestions: ["疲労がメンタルに影響を与える前に現れる身体のサインは何ですか？"],
        reframeSuggestions: ["戦略的な休息は速度を落とすのではなく、長期的な明瞭さを高めます。"],
        cognitiveStrengths: ["高い自己認識力"],
        keyThemes: ["心の平静", "アーキテクチャ"],
        microActions: [
          { title: "21:00に画面オフ", description: "就寝前にスマートフォンを寝室の外で充電する。" }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "自然の中での10,480歩の朝の散歩",
        content: `日の出とともに公園で10,480歩のウォーキングを完了しました。新鮮な空気に感謝の気持ちが湧きました。`,
        summary: "10k歩の散歩と爽快な日の出。",
        socraticQuestions: ["身体を動かすことは問題解決のアプローチをどう変えますか？"],
        reframeSuggestions: ["散歩で得た頭の冴えを創造的な仕事に活かしましょう。"],
        cognitiveStrengths: ["心身の調和"],
        keyThemes: ["活力", "10k歩"],
        microActions: [
          { title: "水分補給", description: "散歩後に500mlの水を飲む。" }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "重要な会議：午前11:00のクラウドアーキテクチャレビュー",
        content: `ボイスノート：午前11:00のAPACクラウドアーキテクチャレビュー会議のリマインド。`,
        summary: "11時の会議に向けた準備とゼロトラストセキュリティ。",
        socraticQuestions: ["この会議を大成功に導くための最も重要な成果は何ですか？"],
        reframeSuggestions: ["自信を持って進めてください。アーキテクチャは堅牢です。"],
        cognitiveStrengths: ["先を見越した計画"],
        keyThemes: ["クラウド設計", "セキュリティ"],
        microActions: [
          { title: "KMSスライドの確認", description: "11時までにポリシーを再確認する。" }
        ]
      }
    }
  },

  zh: {
    faqs: [
      {
        q: "苏格拉底式反思教练（Socratic Coach）如何工作？",
        a: "它利用 Google Gemini 3.7 和 Google ADK 进行认知重塑，提出深入的苏格拉底式提问，并制定15分钟可操作的微行动。"
      },
      {
        q: "媒体工作室如何处理多模态输入？",
        a: "您可以上传便利贴、手写笔记扫描件、1分钟语音备忘录或视频日志，安全存储在 Google Cloud Storage 并由 Gemini 进行智能分析。"
      },
      {
        q: "我的数据安全和隐私是否有保障？",
        a: "是的，完全安全。基于 Cloud Firestore 零信任规则和 Cloud KMS 加密，确保绝对的数据隐私。"
      },
      {
        q: "智能穿戴设备与健康同步如何运作？",
        a: "与 Google Health、Apple Health 和 Garmin 同步，将心率、睡眠阶段和步数与情绪状态相关联。"
      },
      {
        q: "如何与 Nova 3D 实时语音助手互动？",
        a: "点击右下角的 Nova 图标，即可使用中文进行自然的实时语音对话并记录反思。"
      },
      {
        q: "我可以使用中文及其他语言记录吗？",
        a: "当然可以！ReflectLogixAI 全面支持中文、英语、印地语、泰米尔语等18种语言。"
      }
    ],
    about: {
      welcomeTitle: "欢迎使用 ReflectLogixAI",
      welcomeDesc: "由 Gemini 和苏格拉底教练赋能的个人多功能日记 — 为内心宁静与人生明晰打造的零信任避风港。",
      principles: {
        socraticTitle: "苏格拉底式反思教练",
        socraticDesc: "由 Gemini 3.7 驱动的认知重构与15分钟微行动生成。",
        mediaTitle: "多模态媒体工作室",
        mediaDesc: "将手写笔记、语音和视频安全记录在云端。",
        healthTitle: "智能生物健康数据同步",
        healthDesc: "将心率、睡眠与日常情绪状态相连。",
        privacyTitle: "零信任隐私与安全",
        privacyDesc: "基于 Firestore 和 Cloud Run 的全方位个人数据主权保护。"
      },
      multilingualTitle: "18种语言国际化支持",
      multilingualDesc: "中文、英语、法语、德语、西班牙语、日语、印地语、泰米尔语等。"
    },
    rag: {
      title: "深度反思 • 语义记忆检索 (RAG)",
      subtitle: "通过 Cloud SQL pgvector 向量搜索，在历史日记中发现全新洞察与解决方案。",
      searchPlaceholder: "搜索想法、主题或问题...",
      searchBtn: "搜索历史",
      searchingBtn: "搜索中...",
      examplePromptsTitle: "示例提问",
      examplePrompts: [
        "最近哪些时刻带给我最多的平静与清晰？",
        "在忙碌的高压时期我是如何应对压力的？"
      ],
      resultsTitle: "检索到的记忆",
      matchSuffix: "匹配",
      sampleResults: [
        {
          title: "关于可持续节奏的思考",
          snippet: "清晨片刻的宁静帮助我以平和的心态应对全天的工作压力。",
          tags: ["宁静", "工作", "专注"],
          date: "昨天"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "晨曦中的宁静与系统架构思考",
        content: `今天清晨完成了 Cloud Run 的 ADK Agent 架构图。在进入复杂的系统逻辑之前，深呼吸平静心灵带来了极大的清晰度。`,
        summary: "结合系统架构设计与正念呼吸的平衡清晨。",
        socraticQuestions: ["在精力耗尽影响情绪之前，身体给出的早期信号是什么？"],
        reframeSuggestions: ["战略性暂停不会降低速度，反而会提升长期的系统明晰度。"],
        cognitiveStrengths: ["高度的自我觉察"],
        keyThemes: ["内心宁静", "架构设计"],
        microActions: [
          { title: "晚上 9:00 关闭屏幕", description: "将手机移至卧室外充电。" }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "大自然中 10,480 步晨间散步",
        content: `日出时分在公园完成了 10,480 步的晨间散步，感受到了清新的空气与健康的喜悦。`,
        summary: "10k 步散步与充满活力的日出。",
        socraticQuestions: ["身体运动如何改变您解决复杂工程问题的方式？"],
        reframeSuggestions: ["将散步带来的清晰头脑作为创造性工作的起点。"],
        cognitiveStrengths: ["身心合一"],
        keyThemes: ["身体活力", "10k 步"],
        microActions: [
          { title: "补充水分", description: "散步后饮用 500 毫升水。" }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "重要会议：上午 11:00 云架构评审",
        content: `语音备忘：提醒上午 11:00 与技术主管的 APAC 云架构评审会议。`,
        summary: "11 点架构评审的主动准备与零信任安全。",
        socraticQuestions: ["让这次会议取得圆满成功的关键成果是什么？"],
        reframeSuggestions: ["从容自信地主持会议，您的零信任架构非常坚固。"],
        cognitiveStrengths: ["前瞻性规划"],
        keyThemes: ["云架构", "零信任安全"],
        microActions: [
          { title: "复习 KMS 幻灯片", description: "11 点前确认密钥轮换策略。" }
        ]
      }
    }
  },

  ar: {
    faqs: [
      {
        q: "كيف يعمل مدرب التفكير السقراطي (Socratic Coach)؟",
        a: "يستخدم Google Gemini 3.7 و Google ADK لإعادة صياغة الأفكار وطرح أسئلة سقراطية عميقة وتحديد خطوات عملية مدتها 15 دقيقة."
      },
      {
        q: "كيف يعالج استوديو الوسائط المدخلات المتعددة؟",
        a: "يمكنك رفع الملاحظات الورقية والصوتية والفيديوهات، ليتم حفظها بأمان في Google Cloud Storage وتحليلها بواسطة Gemini."
      },
      {
        q: "هل بياناتي وصحتي في أمان وخصوصية؟",
        a: "نعم، عزل تام للبيانات بفضل قواعد Firestore وتشفير Cloud KMS."
      },
      {
        q: "كيف تعمل المزامنة مع الساعات الذكية؟",
        a: "تتكامل مع Google Health Connect و Apple Health لربط نبضات القلب والنوم بالسلام النفسي."
      },
      {
        q: "كيف أتحدث مع المساعد الصوتي Nova 3D؟",
        a: "اضغط على أيقونة Nova في الأسفل للتحدث بالصوت باللغة العربية وتدوين مذكراتك بسهولة."
      },
      {
        q: "هل يمكنني الكتابة بالعربية ولغات أخرى؟",
        a: "نعم! يدعم التطبيق 18 لغة عالمية وهندية بشكل كامل."
      }
    ],
    about: {
      welcomeTitle: "مرحبًا بك في ReflectLogixAI",
      welcomeDesc: "مذكراتك الشخصية ورفيقك السقراطي المدعوم بـ Gemini — ملاذ هادئ وآمن للسلام النفسي ووضوح الحياة.",
      principles: {
        socraticTitle: "التدريب السقراطي",
        socraticDesc: "إعادة الهيكلة المعرفية وخطوات عمل مدتها 15 دقيقة بواسطة Gemini 3.7.",
        mediaTitle: "استوديو الوسائط المتعددة",
        mediaDesc: "احفظ الملاحظات المكتوبة والصوتية بأمان على السحابة.",
        healthTitle: "القياسات الحيوية والصحة الذكية",
        healthDesc: "ربط معدل ضربات القلب والنوم والخطوات بالهدوء العقلي.",
        privacyTitle: "خصوصية وأمان Zero-Trust",
        privacyDesc: "حماية تامة للبيانات عبر Firestore و Cloud Run."
      },
      multilingualTitle: "دعم دولي لـ 18 لغة",
      multilingualDesc: "العربية، الإنجليزية، الفرنسية، الألمانية، الإسبانية، الهندية، التاميلية، إلخ."
    },
    rag: {
      title: "تأملات عميقة • استرجاع الذاكرة الدلالية (RAG)",
      subtitle: "ابحث في مذكراتك السابقة باستخدام بحث المتجهات Cloud SQL pgvector للعثور على حلول ورؤى جديدة.",
      searchPlaceholder: "ابحث عن أفكار، مواضيع أو أسئلة...",
      searchBtn: "بحث في السجل",
      searchingBtn: "جارٍ البحث...",
      examplePromptsTitle: "أمثلة للأسئلة",
      examplePrompts: [
        "ما هي اللحظات التي جلبت لي أكبر قدر من الهدوء مؤخرًا؟",
        "كيف تعاملت مع ضغوط العمل في الأيام المزدحمة؟"
      ],
      resultsTitle: "الذكريات المسترجعة",
      matchSuffix: "تطابق",
      sampleResults: [
        {
          title: "تأملات حول الإيقاع المستدام",
          snippet: "ساعدتني فترات الراحة الصباحية في التعامل مع ضغط العمل بهدوء.",
          tags: ["هدوء", "عمل", "وضوح"],
          date: "أمس"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "هدوء الفجر وتأملات في معمارية الأنظمة",
        content: `بدأت اليوم بتصميم مخطط وكلاء ADK لـ Cloud Run. أحدث أخذ دقيقة للتنفس والهدوء فرقًا كبيرًا قبل البدء.`,
        summary: "صباح متوازن يجمع بين التصميم المعماري والهدوء الذهني.",
        socraticQuestions: ["ما هي الإشارات الجسدية التي تنبهك بالإجهاد قبل أن يؤثر على مزاجك؟"],
        reframeSuggestions: ["فترات الراحة الاستراتيجية تزيد من وضوحك على المدى الطويل."],
        cognitiveStrengths: ["وعي ذاتي عالٍ"],
        keyThemes: ["سلام نفسي", "معمارية"],
        microActions: [
          { title: "إغلاق الشاشات في الساعة 9:00 مساءً", description: "شحن الهاتف خارج غرفة النوم." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "مشي 10,480 خطوة في أحضان الطبيعة",
        content: `أكملت مشي 10,480 خطوة في الحديقة عند شروق الشمس وشعرت بالامتنان للصحة والعافية.`,
        summary: "مشي صباحي منعش لمسافة 10 آلاف خطوة.",
        socraticQuestions: ["كيف تغير الحركة البدنية طريقتك في حل المشكلات؟"],
        reframeSuggestions: ["استخدم صفاء الذهن من المشي في أعمالك الإبداعية."],
        cognitiveStrengths: ["تناغم الجسد والعقل"],
        keyThemes: ["حيوية", "10k خطوة"],
        microActions: [
          { title: "شرب الماء", description: "شرب 500 مل من الماء بعد المشي." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "اجتماع مهم: مراجعة معمارية السحابة في الساعة 11:00 صباحًا",
        content: `ملاحظة صوتية: التذكير باجتماع مراجعة معمارية السحابة APAC في الساعة 11:00 صباحًا.`,
        summary: "التحضير لاجتماع مراجعة السحابة وأمان Zero-Trust.",
        socraticQuestions: ["ما هي النتيجة الرئيسية لجعل هذا الاجتماع ناجحًا؟"],
        reframeSuggestions: ["قُد الاجتماع بثقة تامة؛ تصميمك قوي ومتين."],
        cognitiveStrengths: ["تخطيط استباقي"],
        keyThemes: ["معمارية السحابة", "أمان"],
        microActions: [
          { title: "مراجعة شرائح KMS", description: "التحقق من سياسات التشفير قبل الساعة 11." }
        ]
      }
    }
  }
};

/**
 * Fallback generator for languages not explicitly defined above
 */
export function getLocalizedPageContent(langCode: string) {
  const code = (langCode || 'en').toLowerCase().split('-')[0];
  if (LOCALIZED_PAGE_DATA[code]) {
    return LOCALIZED_PAGE_DATA[code];
  }
  return LOCALIZED_PAGE_DATA.en;
}
