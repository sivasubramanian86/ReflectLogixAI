import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import { JournalChatMessage, JournalEntry } from '../types';
import { useI18n } from '../i18n';

interface ConversationThreadProps {
  journal: JournalEntry;
  onUpdateJournal: (updated: JournalEntry) => void;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  journal,
  onUpdateJournal,
}) => {
  const { t, currentLanguage } = useI18n();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation: JournalChatMessage[] = journal.conversation || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation, isSending]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const userText = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      const res = await fetch(`/api/journals/${journal.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, language: currentLanguage }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.journal) {
          onUpdateJournal(data.journal);
        }
      }
    } catch (err) {
      console.error('Failed to send message to coach:', err);
    } finally {
      setIsSending(false);
    }
  };

  const sampleQuestions = currentLanguage === 'ta'
    ? [
        'இன்றைய எனது முக்கிய நுண்ணிய செயலை எவ்வாறு தொடங்குவது?',
        'இந்த சூழல் எனக்கு ஏன் மன அழுத்தத்தை ஏற்படுத்தியது?',
        'மனதை அமைதியாக வைக்க உதவும் நேர்மறை சிந்தனை எது?'
      ]
    : currentLanguage === 'hi'
    ? [
        'आज के मुख्य कार्य को मैं कैसे शुरू करूँ?',
        'इस स्थिति ने मुझे तनाव क्यों दिया?',
        'मन को शांत रखने के लिए क्या सकारात्मक दृष्टिकोण हो सकता है?'
      ]
    : [
        'How can I break down my top micro-action today?',
        'Why did this situation trigger stress for me?',
        'What cognitive reframe can help me stay calm and centered?'
      ];

  return (
    <section
      role="log"
      aria-label="Conversation with Gemini Socratic Coach"
      className="panel-elevated rounded-2xl p-4 sm:p-5 space-y-4 border border-[var(--border-subtle)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          >
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              {(t.reflection as any)?.dialogueTitle || 'Empathetic Reflection Chat'}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[var(--text-muted)]">
              Multi-turn Socratic inquiry exploring themes, emotions, and mindful decisions
            </p>
          </div>
        </div>
        <span className="rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2.5 py-0.5 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
          Gemini 2.5
        </span>
      </div>

      {/* Message History Container */}
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label="Chat messages history list"
        className="space-y-3 max-h-[300px] overflow-y-auto pr-1 focus-ring rounded-lg p-1"
      >
        {conversation.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-secondary)]/50 p-4 text-center space-y-2">
            <Bot className="h-6 w-6 text-amber-600 dark:text-amber-400 mx-auto" aria-hidden="true" />
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              Continue your reflection journey. Ask questions, explore nuances, or request practical micro-strategies from your Coach.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(q)}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)] hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-500/40 transition-colors text-left focus-ring"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversation.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs"
                    aria-hidden="true"
                  >
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-amber-500/20 border border-amber-500/30 text-[var(--text-primary)] rounded-tr-none font-medium'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-none'
                  }`}
                >
                  <div className="font-bold text-[10px] text-[var(--text-muted)] mb-1">
                    {isUser ? 'You' : 'ReflectLogix Coach'}
                  </div>
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className="mt-1 text-[9px] font-mono text-[var(--text-muted)] text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isUser && (
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs"
                    aria-hidden="true"
                  >
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Live status region announced to screen readers when streaming */}
        {isSending && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400 pl-1"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            <span className="font-mono text-[11px]">ReflectLogix Coach is contemplating...</span>
          </div>
        )}
      </div>

      {/* Input Form with accessible label and keyboard activation */}
      <form onSubmit={handleSendMessage} className="space-y-2">
        <label htmlFor="coach-chat-input" className="sr-only">
          Ask follow-up reflection question to Gemini Coach
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="coach-chat-input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask follow-up reflection question..."
            disabled={isSending}
            className="flex-1 rounded-xl glass-input px-3 py-2 text-xs placeholder:text-[var(--text-muted)] focus-ring"
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            aria-label="Send message to reflection coach"
            className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-ring"
          >
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
};
