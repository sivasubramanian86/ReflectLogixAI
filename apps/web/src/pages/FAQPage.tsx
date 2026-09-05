import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles, Mic, Lock, HeartHandshake, Brain, Layers, Watch } from 'lucide-react';
import { useI18n } from '../i18n';

export const FAQPage: React.FC = () => {
  const { t, currentLanguage } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the Socratic Reflection Coach work?",
      a: "The Reflection Coach utilizes Google Gemini 3.7 / 2.5 Flash and the Google Agent Development Kit (ADK) to perform cognitive reframing. Rather than giving unsolicited advice, it poses deep Socratic questions, validates your cognitive strengths, and synthesizes 15-minute actionable micro-steps.",
      icon: Brain
    },
    {
      q: "How does the Media Studio process multi-modal inputs?",
      a: "You can upload sticky notes, handwritten notebook scans, 1-minute voice memos, or video logs. Everything is stored securely in Google Cloud Storage (gs://reflectlogix-media-genai-apac/) and analyzed by Gemini 2.5 Multi-Modal OCR and audio transcription to automatically produce reflective journal entries.",
      icon: Layers
    },
    {
      q: "Is my reflection and health data private and secure?",
      a: "Yes, completely. ReflectLogixAI enforces zero-trust tenant isolation with Cloud Firestore security rules (request.auth.uid == userId). Your data is never shared with third parties or used to train foundation models. You can also enable Detox Mode for ephemeral sessions with zero data retention.",
      icon: ShieldCheck
    },
    {
      q: "How does Smart Health & Wearables synchronization work?",
      a: "ReflectLogixAI integrates with Google Health Connect, Apple Health, Samsung Health, and Garmin. It correlates physiological metrics (Resting Heart Rate, HRV, REM/Deep sleep stages, daily steps) with subjective journal emotional valence to identify burnout triggers early.",
      icon: Watch
    },
    {
      q: "How do I interact with Nova Live 3D Voice Assistant?",
      a: "Click the floating Nova assistant orb in the bottom-right corner or the Live Voice button. Nova features dynamic 18-language voice synthesis, real-time waveform visualization, and hands-free spoken journaling.",
      icon: Mic
    },
    {
      q: "Can I journal in languages other than English?",
      a: "Yes! ReflectLogixAI supports 18 languages: English, Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, and Chinese.",
      icon: Sparkles
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden space-y-2">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold relative z-10">
          <HelpCircle className="h-4 w-4" />
          <span>{t.nav?.faq || 'FAQ & Help Center'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] relative z-10">
          {t.nav?.faq || 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] relative z-10">
          Everything you need to know about your personal reflection companion, multi-modal ingestion, and zero-trust security.
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3" role="region" aria-label="FAQ Accordion">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-white/40 dark:border-white/10 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 focus-ring min-h-[50px] cursor-pointer"
              >
                <div className="flex items-center space-x-3 pr-4">
                  <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]"
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
