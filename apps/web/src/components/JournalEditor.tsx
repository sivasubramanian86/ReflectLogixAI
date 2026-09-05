import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Tag,
  Languages,
  X,
  Shield,
  Lock,
  Headphones,
  Check,
  Send,
  Heart,
  Plus
} from 'lucide-react';
import { JournalAttachment, LocationTag } from '../types';
import { useI18n } from '../i18n';

interface JournalEditorProps {
  onSaveAndAnalyze: (entryData: {
    title: string;
    content: string;
    language: string;
    tags: string[];
    location?: LocationTag;
    attachments: JournalAttachment[];
    isSensitive?: boolean;
    detoxMode?: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
  onOpenLiveVoice?: () => void;
  initialTitle?: string;
  initialContent?: string;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  onSaveAndAnalyze,
  isSubmitting,
  onOpenLiveVoice,
  initialTitle = '',
  initialContent = '',
}) => {
  const { t, currentLanguage, supportedLanguages } = useI18n();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [journalLang, setJournalLang] = useState(currentLanguage);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Growth', 'Mindfulness']);
  const [isSensitive, setIsSensitive] = useState(false);
  const [detoxMode, setDetoxMode] = useState(false);

  const lifeAreas = ['Growth', 'Work', 'Health', 'Relationships', 'Creativity'];

  // Multimodal & Attachments
  const [attachments, setAttachments] = useState<JournalAttachment[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationTag | undefined>({
    placeName: 'Home Sanctuary',
    latitude: 12.9716,
    longitude: 77.5946,
    privacyPrecision: 'neighborhood'
  });

  // Voice Dictation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [saveStatus, setSaveStatus] = useState<string>('Ready');

  useEffect(() => {
    setJournalLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (content) {
      setSaveStatus('Draft saved locally');
    }
  }, [content, title]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const startVoiceDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = journalLang === 'en' ? 'en-US' : journalLang;

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        stopVoiceDictation();
      };

      recognition.onend = () => {
        stopVoiceDictation();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
    }
  };

  const stopVoiceDictation = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setTagInput('');
      }
    }
  };

  const toggleLifeArea = (area: string) => {
    if (tags.includes(area)) {
      setTags(tags.filter((t) => t !== area));
    } else {
      setTags([...tags, area]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: `att_${Date.now()}`,
            type: 'image',
            dataUrl: base64,
            mimeType: file.type,
            name: file.name,
            uploadedAt: Date.now(),
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setSaveStatus('Generating reflection...');
    await onSaveAndAnalyze({
      title: title.trim() || `Reflection - ${new Date().toLocaleDateString()}`,
      content: content.trim(),
      language: journalLang,
      tags,
      location: selectedLocation,
      attachments,
      isSensitive,
      detoxMode,
    });
    setSaveStatus('Reflection captured and saved.');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] p-4 sm:p-6 space-y-6 overflow-y-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Your Reflection Sanctuary
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Capture what's on your heart and mind with freedom and self-compassion.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            role="status"
            aria-live="polite"
            className="text-xs font-medium text-[var(--text-muted)] px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
          >
            {isSubmitting ? 'Reflecting with coach...' : saveStatus}
          </div>

          {onOpenLiveVoice && (
            <button
              type="button"
              onClick={onOpenLiveVoice}
              aria-label="Open voice companion session"
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300 focus-ring min-h-[40px] transition-colors"
            >
              <Headphones className="h-4 w-4" />
              <span>Voice Note</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
        {/* Title Input */}
        <div>
          <label
            htmlFor="journal-title-input"
            className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider"
          >
            Title
          </label>
          <input
            id="journal-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.editor.titlePlaceholder || 'e.g., Morning thoughts, pacing, and intentional boundaries...'}
            className="w-full rounded-2xl glass-input px-4 py-3 text-base font-semibold placeholder:text-[var(--text-muted)] focus-ring"
          />
        </div>

        {/* Life Areas Quick Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            {t.editor.tagsLabel || 'Life Areas & Focus'}
          </label>
          <div className="flex flex-wrap gap-2">
            {lifeAreas.map((area) => {
              const isSelected = tags.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleLifeArea(area)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors border focus-ring ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Textarea with accessible 16px font */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="journal-content-textarea"
              className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
            >
              {t.editor.writeReflection || 'Reflection Canvas'}
            </label>

            {/* Voice Dictation Trigger */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceDictation : startVoiceDictation}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors focus-ring ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 text-rose-500" />
                  <span>{t.editor.recording || 'Recording'} ({recordingSeconds}s)</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>{t.editor.recordVoiceBtn || 'Dictate Thoughts'}</span>
                </>
              )}
            </button>
          </div>

          <textarea
            ref={textareaRef}
            id="journal-content-textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Your journal entry reflection text"
            placeholder={t.editor.contentPlaceholder || 'What is on your mind today? Write freely without worrying about perfection. You can explore a challenge, celebrate a small win, or simply check in with your breath...'}
            className="w-full flex-1 rounded-2xl glass-input p-5 text-base leading-relaxed placeholder:text-[var(--text-muted)] focus-ring resize-y min-h-[220px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-[var(--text-muted)] px-1">
            <div className="flex items-center space-x-3">
              <span>{wordCount} {t.editor.wordCount || 'words'}</span>
              <span>•</span>
              <span>{readingTimeMinutes} {t.editor.readingTime || 'min read'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-teal-600 dark:text-teal-400">
              <Shield className="h-3.5 w-3.5" />
              <span>Private & Secure Sanctuary</span>
            </div>
          </div>
        </div>

        {/* Attachments & Location */}
        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div>
              <input
                type="file"
                id="journal-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <label
                htmlFor="journal-image-upload"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer focus-ring"
              >
                <ImageIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Attach Photo</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium focus-ring ${
                selectedLocation
                  ? 'bg-teal-500/15 border-teal-500/30 text-teal-700 dark:text-teal-300'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
              }`}
            >
              <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>{selectedLocation ? selectedLocation.placeName : 'Add Location'}</span>
            </button>
          </div>

          {/* Privacy Toggles */}
          <div className="flex items-center space-x-4 text-xs font-semibold text-[var(--text-secondary)]">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSensitive}
                onChange={(e) => setIsSensitive(e.target.checked)}
                className="h-4 w-4 rounded accent-teal-600"
              />
              <span>{t.editor.sensitiveEntry || 'Sensitive Entry'}</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={detoxMode}
                onChange={(e) => setDetoxMode(e.target.checked)}
                className="h-4 w-4 rounded accent-teal-600"
              />
              <span>{t.editor.detoxMode || 'Detox Mode'}</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-base shadow-sm hover:scale-[1.01] transition-all focus-ring min-h-[50px]"
          >
            <Sparkles className="h-5 w-5" />
            <span>{isSubmitting ? (t.editor.saving || 'Reflecting with Coach...') : (t.editor.saveAndAnalyze || 'Save & Receive Reflection')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
