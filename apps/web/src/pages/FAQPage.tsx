import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles, Mic, Lock, HeartHandshake } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is my reflection data private and secure?",
      a: "Yes, completely. ReflectLogixAI is built with strict privacy-first isolation. Your entries are isolated to your authenticated account and are never shared or used to train public models. You can also toggle 'Sensitive Entry' or 'Detox Mode' for ephemeral sessions.",
      icon: ShieldCheck
    },
    {
      q: "What does the Reflection Coach do?",
      a: "The Reflection Coach reads your journal entry with empathy and generates gentle, curious questions to help you understand your thoughts. It also highlights your positive cognitive strengths and suggests 2-3 manageable micro-actions.",
      icon: Sparkles
    },
    {
      q: "How do Life Areas and tags work?",
      a: "Life Areas group your reflections into core human priorities: Work, Health, Relationships, Growth, and Creativity. Tagging your entries helps you see where your energy is focused and maintain healthy balance across your journey.",
      icon: HeartHandshake
    },
    {
      q: "Can I record voice reflections instead of typing?",
      a: "Yes! Click the 'Voice Note' button anywhere in the app to speak your mind freely. ReflectLogixAI transcribes your thoughts faithfully while capturing emotional nuance.",
      icon: Mic
    },
    {
      q: "What is Sensitive Entry Mode & Digital Detox?",
      a: "When you mark an entry as 'Sensitive', external notification alerts are suppressed. 'Detox Mode' allows you to reflect freely without saving anything to persistent storage, giving you a safe temporary sanctuary.",
      icon: Lock
    },
    {
      q: "Can I journal in my native language?",
      a: "Yes! ReflectLogixAI supports 18+ regional and international languages with bilingual reflections and cultural idiom preservation.",
      icon: HelpCircle
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <HelpCircle className="h-4 w-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          FAQ & Help Center
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)]">
          Everything you need to know about your personal reflection space.
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3.5" role="region" aria-label="FAQ Accordion">
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
                className="w-full flex items-center justify-between p-5 text-left text-base sm:text-lg font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 focus-ring min-h-[52px]"
              >
                <div className="flex items-center space-x-3.5 pr-4">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-5 pb-5 pt-1 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]"
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
