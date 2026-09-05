import React, { useState, useEffect, useRef } from 'react';
import { VoiceVisualizer3D } from './VoiceVisualizer3D';
import { apiRequest } from '../services/apiClient';
import { JournalEntry } from '../types';
import {
  Mic,
  MicOff,
  Sparkles,
  Database,
  Calendar,
  Layers,
  Send,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Brain,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface HomeCompanionHeroProps {
  userName?: string;
  preferredLanguage?: string;
  onJournalCreated?: (entry: JournalEntry) => void;
  onOpenFullModal?: () => void;
}

export const HomeCompanionHero: React.FC<HomeCompanionHeroProps> = ({
  userName = 'Siva',
  preferredLanguage = 'English',
  onJournalCreated,
  onOpenFullModal
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputText, setInputText] = useState('');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [liveResponse, setLiveResponse] = useState<string>(
    `Hello ${userName}! I'm Nova, your Live 3D AI Journal Companion. Speak to me to reflect, search past memories with pgvector RAG, or generate today's daily summary.`
  );
  const [toolsUsed, setToolsUsed] = useState<Array<{ name: string; description: string }>>([]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis || null;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = preferredLanguage === 'Tamil' ? 'ta-IN' : preferredLanguage === 'Hindi' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
          if (event.results[0].isFinal) {
            handleSend(transcript);
          }
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [preferredLanguage]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      interval = setInterval(() => setAudioLevel(Math.random() * 0.7 + 0.3), 100);
    } else if (isListening) {
      interval = setInterval(() => setAudioLevel(Math.random() * 0.4 + 0.1), 150);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  const speak = (text: string) => {
    if (isMuted || !synthRef.current) return;
    synthRef.current.cancel();

    const clean = text.replace(/[#*_`]/g, '').replace(/\n+/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = preferredLanguage === 'Tamil' ? 'ta-IN' : preferredLanguage === 'Hindi' ? 'hi-IN' : 'en-US';

    const voices = synthRef.current.getVoices();
    const targetLang = utterance.lang.toLowerCase();
    const naturalVoice = voices.find(v => 
      (v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0])) &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Jenny') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputText;
    if (!text.trim() || isLoading) return;

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setInputText('');
    setIsLoading(true);

    const qLower = text.toLowerCase();
    if (qLower.includes('summary') || qLower.includes('summarize')) {
      setActiveTool('Synthesizing Daily Summary via ADK Subagent Mesh...');
    } else if (qLower.includes('past') || qLower.includes('stress') || qLower.includes('remember')) {
      setActiveTool('Searching Cloud SQL pgvector Semantic RAG...');
    } else if (qLower.includes('trend') || qLower.includes('metric') || qLower.includes('analytics')) {
      setActiveTool('Running BigQuery Analytical Metrics...');
    } else {
      setActiveTool('Consulting Gemini 3.7 Empathetic Intelligence...');
    }

    try {
      const res = await apiRequest<{
        message: string;
        toolsUsed: Array<{ name: string; description: string; data?: any }>;
        createdEntry?: JournalEntry;
      }>('/api/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ role: 'user', content: text.trim() }],
          preferredLanguage
        })
      });

      setLiveResponse(res.message);
      setToolsUsed(res.toolsUsed || []);
      speak(res.message);

      if (res.createdEntry && onJournalCreated) {
        onJournalCreated(res.createdEntry);
      }
    } catch (err: any) {
      setLiveResponse(`I had a temporary connection issue: ${err.message}. How else can I assist?`);
    } finally {
      setIsLoading(false);
      setActiveTool(null);
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setActiveTool('Synthesizing today\'s moments into an official summary...');
    try {
      const res = await apiRequest<{ success: boolean; journal: JournalEntry }>('/api/assistant/daily-summary', {
        method: 'POST',
        body: JSON.stringify({ preferredLanguage })
      });

      if (res.success && res.journal) {
        if (onJournalCreated) onJournalCreated(res.journal);
        const msg = `Daily summary saved: "${res.journal.title}" with primary mood "${res.journal.reflection?.moodAnalysis.primaryMood || 'Reflective'}" and ${res.journal.reflection?.microActions.length || 3} micro-actions.`;
        setLiveResponse(msg);
        setToolsUsed([
          { name: 'adk_agent_mesh', description: 'Created consolidated reflection entry in Cloud Firestore.' }
        ]);
        speak(msg);
      }
    } catch (err: any) {
      alert(`Summary failed: ${err.message}`);
    } finally {
      setIsLoading(false);
      setActiveTool(null);
    }
  };

  return (
    <div className="mb-6 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl overflow-hidden bg-gradient-to-r from-slate-900/90 via-purple-950/40 to-slate-900/90 text-slate-100 transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-300 bg-clip-text text-transparent flex items-center gap-2">
              <span>Nova • 3D Live Voice Assistant</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Gemini 3.7 Live
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              if (synthRef.current) synthRef.current.cancel();
              setIsSpeaking(false);
              setIsMuted(!isMuted);
            }}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white"
            title={isExpanded ? 'Collapse Assistant' : 'Expand Assistant'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Assistant Stage */}
      {isExpanded && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* 3D Hologram Avatar Stage (Left Column) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center">
            <VoiceVisualizer3D
              isSpeaking={isSpeaking}
              isListening={isListening}
              audioLevel={audioLevel}
              avatarSrc="/assets/avatar.jpg"
              assistantName="Nova"
            />
          </div>

          {/* Interactive Speech & Live RAG Stream (Right Column) */}
          <div className="md:col-span-8 flex flex-col space-y-3.5">
            {/* Live Response Bubble */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md shadow-inner text-sm leading-relaxed text-slate-200 min-h-[90px] flex flex-col justify-between">
              <p className="whitespace-pre-line font-medium text-slate-100">{liveResponse}</p>

              {/* Real-time Tool Badges */}
              {toolsUsed.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {toolsUsed.map((tool, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>{tool.name}: {tool.description}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Active Loading indicator */}
              {isLoading && (
                <div className="mt-2 flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                  <Layers className="w-3.5 h-3.5 animate-spin" />
                  <span>{activeTool || 'Nova is reflecting...'}</span>
                </div>
              )}
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" /> Quick Ask:
              </span>
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 border border-purple-500/30 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3 h-3 text-purple-400" />
                <span>✨ Today's Summary</span>
              </button>

              <button
                type="button"
                onClick={() => handleSend('How has my mood and stress been trending?')}
                disabled={isLoading}
                className="px-3 py-1 rounded-full text-xs bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1"
              >
                <Database className="w-3 h-3 text-cyan-400" />
                <span>📊 Mood Trends</span>
              </button>

              <button
                type="button"
                onClick={() => handleSend('Recall what I wrote about mindfulness and calm')}
                disabled={isLoading}
                className="px-3 py-1 rounded-full text-xs bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1"
              >
                <Brain className="w-3 h-3 text-emerald-400" />
                <span>🧠 Past Memories</span>
              </button>
            </div>

            {/* Input / Live Voice Controls */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? 'Listening to your voice...' : 'Talk with Nova or type a reflection prompt...'}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />

              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl font-semibold flex items-center justify-center shadow-lg transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak to Nova'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-md"
                title="Send Prompt"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
