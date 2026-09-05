import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Sparkles,
  Cloud,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Zap,
  ArrowRight,
  Upload,
  Copy,
  Check,
  Cpu,
  Layers,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useI18n, getLanguageBCP47 } from '../i18n';
import { JournalEntry } from '../types';

export interface MultiModalSample {
  id: string;
  type: 'sticky_note' | 'handwritten_note' | 'voice_note' | 'video_log';
  category: string;
  title: string;
  previewUrl: string;
  mimeType: string;
  gcsUri: string;
  kmsKeyId: string;
  extractedSnippet: string;
  geminiCapability: string;
  suggestedTags: string[];
  recommendedAction: string;
}

export const DEFAULT_MULTIMODAL_SAMPLES: MultiModalSample[] = [
  {
    id: 'sample_voice_01',
    type: 'voice_note',
    category: 'Voice Notes & Action Items',
    title: 'Important Meeting Reminder & Action Prep',
    previewUrl: '/assets/sample_voice_note.wav',
    mimeType: 'audio/wav',
    gcsUri: 'gs://reflectlogix-media-genai-apac/voice-notes/meeting_reminder_11am.wav',
    kmsKeyId: 'projects/genai-apac-2026/locations/asia-south1/keyRings/reflectlogix-ring/cryptoKeys/media-key',
    extractedSnippet: 'Voice Note (1:02): Remind me about the upcoming APAC Cloud Architecture Review meeting at 11:00 AM. Prepare the zero-trust KMS diagram, verify ADK multi-agent benchmarks, and check our 10,480 steps daily health goal before the call.',
    geminiCapability: 'Gemini 2.5 Live Audio & Emotional Prosody Analysis',
    suggestedTags: ['VoiceNote', 'MeetingReminder', '11AMMeeting', 'Architecture'],
    recommendedAction: 'Add calendar reminder and prepare ADK zero-trust review slides'
  },
  {
    id: 'sample_sticky_01',
    type: 'sticky_note',
    category: 'Sticky Notes & Idea Memos',
    title: 'ADK Agent Flow & Zero-Trust Blueprint',
    previewUrl: '/assets/sample_sticky_note.jpg',
    mimeType: 'image/jpeg',
    gcsUri: 'gs://reflectlogix-media-genai-apac/sticky-notes/sticky_arch_001.jpg',
    kmsKeyId: 'projects/genai-apac-2026/locations/asia-south1/keyRings/reflectlogix-ring/cryptoKeys/media-key',
    extractedSnippet: 'ReflectLogixAI ADK Agent Flow -> Grounding with pgvector -> Restorative sleep by 9pm',
    geminiCapability: 'Gemini 2.5 Flash Vision OCR & Schema Extraction',
    suggestedTags: ['StickyNote', 'Architecture', 'ADK', 'DeepWork'],
    recommendedAction: 'Extract architecture design and add to active sprint plan'
  },
  {
    id: 'sample_handwritten_01',
    type: 'handwritten_note',
    category: 'Handwritten Notes & Whiteboard Scans',
    title: 'Morning Nature Walk & Longevity Insight',
    previewUrl: '/assets/sample_handwritten_note.jpg',
    mimeType: 'image/jpeg',
    gcsUri: 'gs://reflectlogix-media-genai-apac/handwritten/nature_walk_journal_scan.jpg',
    kmsKeyId: 'projects/genai-apac-2026/locations/asia-south1/keyRings/reflectlogix-ring/cryptoKeys/media-key',
    extractedSnippet: 'Morning clarity walk in nature: 10,480 steps completed. Breathing in gratitude, releasing context-switching fatigue. Key insight: Slow down to speed up.',
    geminiCapability: 'Gemini 2.5 Vision Cursive Handwriting Recognition',
    suggestedTags: ['Handwritten', '10kSteps', 'Gratitude', 'Mindset'],
    recommendedAction: 'Synthesize biological recovery and socratic reframing'
  },
  {
    id: 'sample_video_01',
    type: 'video_log',
    category: 'Video Reflection Logs & Mindful Vlogs',
    title: 'Sunset Lakefront Mindful Vlog',
    previewUrl: '/assets/sample_video_thumbnail.jpg',
    mimeType: 'video/mp4',
    gcsUri: 'gs://reflectlogix-media-genai-apac/video-logs/sunset_mindful_vlog_3year_horizons.mp4',
    kmsKeyId: 'projects/genai-apac-2026/locations/asia-south1/keyRings/reflectlogix-ring/cryptoKeys/media-key',
    extractedSnippet: 'Sunset reflection on 3-Year Life Horizons, open-source AI frameworks, and maintaining a 94/100 Peace Score.',
    geminiCapability: 'Gemini 2.5 Multimodal Video & Scene Understanding',
    suggestedTags: ['VideoLog', 'SunsetReflection', 'LifeHorizons', 'PeaceScore'],
    recommendedAction: 'Track temporal mood progression and life goal milestones'
  }
];

interface MultiModalMediaHubProps {
  onJournalCreated?: (entry: JournalEntry) => void;
  onNavigateToTimeline?: () => void;
}

export const MultiModalMediaHub: React.FC<MultiModalMediaHubProps> = ({
  onJournalCreated,
  onNavigateToTimeline,
}) => {
  const { currentLanguage, t } = useI18n();
  const [samples, setSamples] = useState<MultiModalSample[]>(DEFAULT_MULTIMODAL_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<MultiModalSample | null>(DEFAULT_MULTIMODAL_SAMPLES[0]);
  const [customText, setCustomText] = useState(DEFAULT_MULTIMODAL_SAMPLES[0].extractedSnippet);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [copiedGcs, setCopiedGcs] = useState(false);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Sticky Note Custom Color
  const [stickyColor, setStickyColor] = useState<'yellow' | 'teal' | 'rose' | 'lavender'>('yellow');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis || null;
    }
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await fetch('/api/multimodal/samples');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.samples && Array.isArray(data.samples) && data.samples.length > 0) {
          setSamples(data.samples);
          setSelectedSample(data.samples[0]);
          setCustomText(data.samples[0].extractedSnippet);
        }
      }
    } catch (err) {
      console.warn('Using built-in multimodal samples fallback:', err);
    }
  };

  const handleSelectSample = (sample: MultiModalSample) => {
    setSelectedSample(sample);
    setCustomText(sample.extractedSnippet);
    setAnalysisResult(null);
    if (isPlayingAudio && synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  };

  const toggleAudioPlay = () => {
    if (!synthRef.current) return;

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      synthRef.current.cancel();
      const textToSpeak = customText || selectedSample?.extractedSnippet || 'Voice Note: Remind me about an upcoming meeting at 11 am.';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = getLanguageBCP47(currentLanguage || 'en');

      const voices = synthRef.current.getVoices();
      const targetLang = utterance.lang.toLowerCase();
      const naturalVoice = voices.find(v => 
        (v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0])) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Jenny') || v.name.includes('Samantha') || v.name.includes('Valluvar') || v.name.includes('Lekha'))
      ) || voices.find(v => v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      synthRef.current.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyGcs = (uri: string) => {
    navigator.clipboard.writeText(uri);
    setCopiedGcs(true);
    setTimeout(() => setCopiedGcs(false), 2000);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!selectedSample) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/multimodal/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: selectedSample.type,
          mediaTitle: selectedSample.title,
          mediaUrl: selectedSample.previewUrl,
          gcsUri: selectedSample.gcsUri,
          rawText: customText || selectedSample.extractedSnippet,
          language: currentLanguage === 'ta' ? 'Tamil' : currentLanguage === 'hi' ? 'Hindi' : 'English',
          autoSave: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        if (data.journal && onJournalCreated) {
          onJournalCreated(data.journal);
        }
      }
    } catch (err) {
      console.error('Multimodal analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStickyBg = (col: string) => {
    switch (col) {
      case 'teal':
        return 'bg-teal-900/30 border-teal-500/50 text-teal-100';
      case 'rose':
        return 'bg-rose-900/30 border-rose-500/50 text-rose-100';
      case 'lavender':
        return 'bg-purple-900/30 border-purple-500/50 text-purple-100';
      default:
        return 'bg-amber-950/40 border-amber-500/50 text-amber-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-surface)] p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-bold">
                <Layers className="h-3.5 w-3.5" />
                <span>Google Cloud Storage & Multi-Modal Studio</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Zero-Trust KMS Envelope Encryption</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Multi-Modal Reflection Studio
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Capture thoughts seamlessly across physical and digital modalities — <strong>Sticky Notes</strong>, <strong>Handwritten Journal Scans</strong>, <strong>Spoken Voice Notes</strong>, and <strong>Mindful Video Logs</strong>. Synthesized with Gemini 2.5 Flash Multimodal Vision & Audio.
            </p>
          </div>

          {/* GCS Bucket Badge */}
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 shrink-0">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 dark:text-teal-400">
              <Cloud className="h-4 w-4" />
              <span>GCS Storage Target</span>
            </div>
            <code className="block text-xs font-mono text-[var(--text-primary)] bg-[var(--bg-surface)] px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] truncate max-w-[280px]">
              gs://reflectlogix-media-genai-apac/
            </code>
            <p className="text-[11px] text-[var(--text-muted)]">
              Region: asia-south1 • KMS Envelope Key Active
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Interactive Sample Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Select Demo Multi-Modal Media Sample
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-medium">
            1-Click Interactive Demo Assets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {samples.map((sample) => {
            const isSelected = selectedSample?.id === sample.id;
            const Icon =
              sample.type === 'sticky_note'
                ? FileText
                : sample.type === 'handwritten_note'
                ? ImageIcon
                : sample.type === 'voice_note'
                ? Mic
                : Video;

            return (
              <div
                key={sample.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectSample(sample)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSample(sample);
                  }
                }}
                className={`group rounded-2xl p-4 glass-card border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-500 bg-teal-500/10 shadow-md ring-2 ring-teal-500/40'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]/60'
                }`}
              >
                <div className="space-y-3">
                  {/* Thumbnail Preview */}
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-950/80 border border-[var(--border-subtle)] flex items-center justify-center">
                    {sample.type === 'voice_note' ? (
                      <div className="flex flex-col items-center justify-center space-y-2 text-teal-400">
                        <Mic className="h-10 w-10 animate-pulse" />
                        <span className="text-[11px] font-mono tracking-widest uppercase">44.1kHz WAV • 432Hz</span>
                      </div>
                    ) : (
                      <img
                        src={sample.previewUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1">
                      <Icon className="h-3 w-3 text-teal-400" />
                      <span>{sample.category.split('&')[0]}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-md">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1 leading-relaxed">
                      {sample.extractedSnippet}
                    </p>
                  </div>
                </div>

                {/* Tags & Capability */}
                <div className="pt-3 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="font-semibold text-teal-600 dark:text-teal-400 truncate max-w-[150px]">
                    {sample.geminiCapability.split(' ')[0]} {sample.geminiCapability.split(' ')[1]}
                  </span>
                  <span className="text-xs">Select →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Studio Workspace */}
      {selectedSample && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Media Preview & Player (7 Cols) */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  {selectedSample.type === 'sticky_note' ? (
                    <FileText className="h-4 w-4" />
                  ) : selectedSample.type === 'handwritten_note' ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : selectedSample.type === 'voice_note' ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {selectedSample.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    MIME: {selectedSample.mimeType} • Modality: {selectedSample.type.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* GCS Copy Button */}
              <button
                type="button"
                onClick={() => handleCopyGcs(selectedSample.gcsUri)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] font-medium border border-[var(--border-subtle)] focus-ring transition-colors"
                title="Copy Google Cloud Storage URI"
              >
                {copiedGcs ? <Check className="h-3.5 w-3.5 text-teal-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedGcs ? 'Copied URI' : 'GCS URI'}</span>
              </button>
            </div>

            {/* Media Presentation Display */}
            {selectedSample.type === 'voice_note' ? (
              <div className="rounded-2xl p-6 bg-slate-950 border border-teal-500/30 flex flex-col items-center justify-center space-y-4 shadow-inner">
                <div className="h-16 w-16 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                  <Mic className={`h-8 w-8 ${isPlayingAudio ? 'animate-bounce text-emerald-400' : ''}`} />
                </div>

                <div className="w-full text-center space-y-1">
                  <p className="text-sm font-bold text-white">432Hz Ambient Spoken Reflection Note</p>
                  <p className="text-xs text-slate-400">Recorded with 44.1kHz High-Fidelity Acoustic Prosody</p>
                </div>

                {/* Simulated Audio Waveform */}
                <div className="w-full flex items-center justify-center space-x-1 h-12 px-4">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isPlayingAudio
                          ? 'bg-gradient-to-t from-teal-500 to-emerald-400 animate-pulse'
                          : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlayingAudio
                          ? `${Math.sin(i * 0.4) * 20 + 24}px`
                          : `${(i % 5) * 6 + 10}px`,
                      }}
                    />
                  ))}
                </div>

                {/* Play/Pause Control */}
                <button
                  type="button"
                  onClick={toggleAudioPlay}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isPlayingAudio ? 'Pause Voice Note' : 'Play Voice Note Audio'}</span>
                </button>
              </div>
            ) : selectedSample.type === 'video_log' ? (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] aspect-video bg-slate-950 flex items-center justify-center group">
                <img
                  src={selectedSample.previewUrl}
                  alt={selectedSample.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-teal-600/90 hover:bg-teal-500 text-white flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 cursor-pointer">
                    <Play className="h-6 w-6 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/70 text-[11px] text-white font-mono flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span>01:24 • 4K UHD • Gemini Video Ingestion</span>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-slate-950/60 max-h-[360px] flex items-center justify-center">
                <img
                  src={selectedSample.previewUrl}
                  alt={selectedSample.title}
                  className="w-full h-full object-contain max-h-[360px]"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] text-white font-medium flex items-center space-x-1.5 border border-white/10">
                  <Sparkles className="h-3 w-3 text-teal-400" />
                  <span>{selectedSample.geminiCapability}</span>
                </div>
              </div>
            )}

            {/* Cloud Storage Attribution Bar */}
            <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                <Cloud className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="font-mono text-[11px]">{selectedSample.gcsUri}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold text-[10px]">
                KMS Encrypted
              </span>
            </div>
          </div>

          {/* Right Column: Ingestion Engine & Synthesis (5 Cols) */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Gemini 2.5 Ingestion & OCR
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                ADK Pipeline
              </span>
            </div>

            {/* Editable Extracted OCR / Context Box */}
            <div className="space-y-1.5">
              <label htmlFor="multimodal-text-editor" className="text-xs font-semibold text-[var(--text-secondary)]">
                Extracted Text / Spoken Transcript:
              </label>
              <textarea
                id="multimodal-text-editor"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={5}
                className="w-full rounded-2xl glass-input p-3.5 text-xs sm:text-sm font-sans leading-relaxed focus-ring resize-none"
                placeholder="Edit or add supplementary reflective notes..."
              />
            </div>

            {/* Sticky Color Switcher if Sticky Note is selected */}
            {selectedSample.type === 'sticky_note' && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Sticky Note Color Theme:
                </span>
                <div className="flex items-center space-x-2">
                  {(['yellow', 'teal', 'rose', 'lavender'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setStickyColor(col)}
                      className={`h-7 w-7 rounded-xl border-2 transition-transform ${
                        stickyColor === col ? 'scale-110 ring-2 ring-teal-500' : 'opacity-80'
                      } ${
                        col === 'yellow'
                          ? 'bg-amber-400 border-amber-600'
                          : col === 'teal'
                          ? 'bg-teal-400 border-teal-600'
                          : col === 'rose'
                          ? 'bg-rose-400 border-rose-600'
                          : 'bg-purple-400 border-purple-600'
                      }`}
                      aria-label={`Select ${col} sticky note`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ingestion Action Button */}
            <button
              type="button"
              onClick={handleAnalyzeWithGemini}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-60 focus-ring"
            >
              {isAnalyzing ? (
                <>
                  <Cpu className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Multimodal Reflection...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Analyze with Gemini 2.5 Multimodal</span>
                </>
              )}
            </button>

            {/* Analysis Result Display */}
            {analysisResult && (
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-300 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Reflection Synthesized & Saved to Timeline!</span>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-secondary)] space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">
                    {analysisResult.journal?.title}
                  </p>
                  <p className="line-clamp-2">
                    {analysisResult.journal?.reflection?.summary || 'Multi-agent reflection synthesized.'}
                  </p>
                </div>

                {onNavigateToTimeline && (
                  <button
                    type="button"
                    onClick={onNavigateToTimeline}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>View in Reflections Timeline</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
