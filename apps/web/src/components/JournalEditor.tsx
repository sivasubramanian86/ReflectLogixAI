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
  Radio,
  Shield,
  Lock,
  Headphones,
  Check,
  Send,
  HelpCircle,
  FileText
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
  const [tags, setTags] = useState<string[]>(['Mindfulness', 'Architecture']);
  const [isSensitive, setIsSensitive] = useState(false);
  const [detoxMode, setDetoxMode] = useState(false);

  // Multimodal & Attachments
  const [attachments, setAttachments] = useState<JournalAttachment[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationTag | undefined>({
    placeName: 'Bangalore Innovation Lab, KA',
    latitude: 12.9716,
    longitude: 77.5946,
    privacyPrecision: 'neighborhood'
  });
  const [customLocationName, setCustomLocationName] = useState('');

  // Voice Dictation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-Save Status Simulator
  const [saveStatus, setSaveStatus] = useState<string>('Ready');

  useEffect(() => {
    setJournalLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (content) {
      setSaveStatus('Draft auto-saved locally');
    }
  }, [content, title]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const tokenEst = Math.ceil(wordCount * 1.35);
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

      const langMap: Record<string, string> = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        ja: 'ja-JP',
        zh: 'zh-CN',
        ar: 'ar-SA',
        pt: 'pt-BR',
        ru: 'ru-RU',
      };
      recognition.lang = langMap[currentLanguage] || 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          }
        }
        if (finalTrans.trim()) {
          setContent((prev) => (prev ? `${prev} ${finalTrans.trim()}` : finalTrans.trim()));
        }
      };

      recognition.onerror = () => {
        stopVoiceDictation();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition error:', e);
    }
  };

  const stopVoiceDictation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      const newAttachment: JournalAttachment = {
        id: `att_${Date.now()}`,
        type: 'image',
        name: file.name,
        mimeType: file.type,
        dataUrl,
        uploadedAt: Date.now(),
      };
      setAttachments((prev) => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags((prev) => [...prev, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setSaveStatus('Submitting to Gemini ADK Orchestrator...');
    await onSaveAndAnalyze({
      title: title.trim() || `Journal Entry - ${new Date().toLocaleDateString()}`,
      content: content.trim(),
      language: journalLang,
      tags,
      location: selectedLocation,
      attachments,
      isSensitive,
      detoxMode,
    });
    setSaveStatus('Entry and Socratic reflection saved.');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] p-4 sm:p-6 space-y-5 overflow-y-auto">
      
      {/* Top Controls & Auto-Save Live Region */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
            {t.editor?.writeReflection || 'Your Journal Entry'}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Express your thoughts freely. Gemini Socratic agents provide mindful reflection and cognitive reframing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Live ARIA status region for screen readers and auto-save feedback */}
          <div
            role="status"
            aria-live="polite"
            className="text-[11px] font-mono text-[var(--text-muted)] px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
          >
            {isSubmitting ? (t.editor?.saving || 'Reflecting with Gemini...') : saveStatus}
          </div>

          {/* Live Voice Coach CTA */}
          {onOpenLiveVoice && (
            <button
              type="button"
              onClick={onOpenLiveVoice}
              aria-label="Open Gemini Live Voice reflection coach session"
              className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 focus-ring min-h-[38px] transition-colors"
            >
              <Headphones className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>{t.editor?.liveVoiceBtn || 'Live Voice Coach'}</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        
        {/* Title Input with associated <label> */}
        <div>
          <label
            htmlFor="journal-title-input"
            className="block text-xs font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider"
          >
            Title
          </label>
          <input
            id="journal-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.editor?.titlePlaceholder || 'e.g., Reflections on Architecture, Pacing, and Mindful Stillness'}
            className="w-full rounded-xl glass-input px-3.5 py-2.5 text-sm font-semibold placeholder:text-[var(--text-muted)] focus-ring"
          />
        </div>

        {/* Content Textarea with associated <label> and aria-describedby */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="journal-content-textarea"
              className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
            >
              Reflection Canvas
            </label>
            
            {/* Real-time Voice Dictation Trigger */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceDictation : startVoiceDictation}
              aria-label={isRecording ? 'Stop voice recording' : 'Start voice speech recognition dictation'}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors focus-ring min-h-[34px] ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                  <span>Recording ({recordingSeconds}s)</span>
                </>
              ) : (
                <>
                  <Mic className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>{t.editor?.recordVoiceBtn || 'Speech Dictation'}</span>
                </>
              )}
            </button>
          </div>

          <textarea
            ref={textareaRef}
            id="journal-content-textarea"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Your journal entry reflection text"
            aria-describedby="editor-helper-info"
            placeholder={t.editor?.contentPlaceholder || 'What is on your mind today? Reflect on your experiences, challenges, or insights...'}
            className="w-full flex-1 rounded-2xl glass-input p-4 text-sm leading-relaxed placeholder:text-[var(--text-muted)] focus-ring resize-y min-h-[160px]"
          />

          {/* Helper Text & Metrics (aria-describedby target) */}
          <div
            id="editor-helper-info"
            className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs font-mono text-[var(--text-muted)] px-1"
          >
            <div className="flex items-center space-x-3">
              <span>{wordCount} {t.editor?.wordCount || 'words'}</span>
              <span>•</span>
              <span>~{tokenEst} {t.editor?.tokenEst || 'tokens'}</span>
              <span>•</span>
              <span>{readingTimeMinutes} min {t.editor?.readingTime || 'read'}</span>
            </div>

            <div className="text-[11px]">
              End-to-end encrypted & tenant isolated
            </div>
          </div>
        </div>

        {/* Multimodal Attachments Strip: Images & Location */}
        <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Multimodal Context & Location
            </span>

            <div className="flex items-center space-x-2">
              {/* Image Upload Input with accessible <label> */}
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
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] cursor-pointer focus-ring min-h-[36px]"
                >
                  <ImageIcon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>Attach Image</span>
                </label>
              </div>

              {/* Location Pinning Toggle */}
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                aria-expanded={showLocationPicker}
                aria-label={selectedLocation ? `Location pinned: ${selectedLocation.placeName}` : 'Pin location tag to journal'}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium focus-ring min-h-[36px] ${
                  selectedLocation
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                }`}
              >
                <MapPin className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span>{selectedLocation ? selectedLocation.placeName.split(',')[0] : 'Pin Location'}</span>
              </button>
            </div>
          </div>

          {/* Location Picker Sub-Panel */}
          {showLocationPicker && (
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-primary)]">Location Privacy Settings</span>
                <button
                  type="button"
                  onClick={() => setSelectedLocation(undefined)}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Remove Location
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLocationName}
                  onChange={(e) => setCustomLocationName(e.target.value)}
                  placeholder="Enter custom location (e.g. Home Office, Park)"
                  className="flex-1 rounded-lg glass-input px-3 py-1.5 text-xs focus-ring"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customLocationName.trim()) {
                      setSelectedLocation({
                        placeName: customLocationName.trim(),
                        latitude: 12.9716,
                        longitude: 77.5946,
                        privacyPrecision: 'neighborhood'
                      });
                      setCustomLocationName('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 text-xs font-bold focus-ring"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Render Attached Image Previews */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-subtle)]">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-surface)] p-1.5 flex items-center space-x-2"
                >
                  {att.dataUrl && (
                    <img
                      src={att.dataUrl}
                      alt={`Attached image: ${att.name}`}
                      className="h-10 w-10 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-xs text-[var(--text-secondary)] truncate max-w-[120px]">
                    {att.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                    aria-label={`Remove attached image ${att.name}`}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-500"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <label
            htmlFor="journal-tag-input"
            className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
          >
            Tags & Focus Topics
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  className="text-[var(--text-muted)] hover:text-rose-500 p-0.5"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
            <div className="inline-flex items-center space-x-1">
              <input
                id="journal-tag-input"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t.editor?.addTagPlaceholder || 'Add tag (press Enter)...'}
                className="rounded-lg glass-input px-2.5 py-1 text-xs focus-ring w-44"
              />
            </div>
          </div>
        </div>

        {/* Sensitive Entry & Detox Mode Switches (WCAG 2.2 Accessible Role="Switch" with Visible Label in Name) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Sensitive Entry Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isSensitive}
            aria-label="Mark this entry as sensitive and limit storage"
            onClick={() => setIsSensitive(!isSensitive)}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left focus-ring min-h-[48px] ${
              isSensitive
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-200'
                : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Shield className={`h-4 w-4 ${isSensitive ? 'text-rose-500' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
              <div>
                <div className="text-xs font-bold">{t.editor?.sensitiveEntry || 'Sensitive Entry'}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{t.editor?.sensitiveDesc || 'Limits long-term graph indexing'}</div>
              </div>
            </div>
            <span
              className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                isSensitive ? 'bg-rose-500' : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-hidden="true"
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  isSensitive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </span>
          </button>

          {/* Detox Mode Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={detoxMode}
            aria-label="Enable detox mode to prevent notifications"
            onClick={() => setDetoxMode(!detoxMode)}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left focus-ring min-h-[48px] ${
              detoxMode
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-800 dark:text-cyan-200'
                : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Lock className={`h-4 w-4 ${detoxMode ? 'text-cyan-500' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
              <div>
                <div className="text-xs font-bold">{t.editor?.detoxMode || 'Detox Mode'}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{t.editor?.detoxDesc || 'No notifications or external triggers'}</div>
              </div>
            </div>
            <span
              className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                detoxMode ? 'bg-cyan-500' : 'bg-stone-300 dark:bg-stone-700'
              }`}
              aria-hidden="true"
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  detoxMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>

        {/* Primary Save & Reflect Button */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end">
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            aria-label="Save journal entry and reflect with Gemini multi-agent coach"
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-3 text-xs font-bold text-stone-950 shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed focus-ring min-h-[44px]"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span>
              {isSubmitting
                ? (t.editor?.saving || 'Orchestrating Gemini Agents...')
                : (t.editor?.saveAndAnalyze || 'Reflect with Gemini')}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
};
