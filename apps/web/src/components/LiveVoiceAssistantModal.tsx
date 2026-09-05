import React, { useState, useEffect, useRef } from 'react';
import { VoiceVisualizer3D } from './VoiceVisualizer3D';
import { apiRequest } from '../services/apiClient';
import { JournalEntry } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Database,
  Layers,
  CheckCircle2,
  X,
  Send,
  Calendar,
  Compass
} from 'lucide-react';

interface LiveVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJournalCreated?: (entry: JournalEntry) => void;
  preferredLanguage?: string;
  userName?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolsUsed?: Array<{
    name: string;
    description: string;
    data?: any;
  }>;
}

export const LiveVoiceAssistantModal: React.FC<LiveVoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onJournalCreated,
  preferredLanguage,
  userName = 'Siva'
}) => {
  const { currentLanguage, t } = useI18n();
  const activeLang = currentLanguage || 'en';
  const bcp47Lang = getLanguageBCP47(activeLang);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Speech Synthesis & Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis || null;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = bcp47Lang;

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputText(transcript);
          if (event.results[0].isFinal) {
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('[SpeechRecognition] Error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [bcp47Lang]);

  // Initial Warm Welcome Greeting on Modal Open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = getNovaGreeting(userName, activeLang);
      
      const welcomeMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: welcomeText,
        timestamp: Date.now()
      };
      setMessages([welcomeMsg]);
      speakText(welcomeText);
    }
  }, [isOpen, activeLang, userName]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Audio level simulation during speech
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

  const speakText = (text: string) => {
    if (isMuted || !synthRef.current) return;

    synthRef.current.cancel();

    // Clean markdown symbols for natural TTS speech
    const cleanSpeech = text
      .replace(/[#*_`]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = bcp47Lang;

    // Pick a natural voice matching language if available
    const voices = synthRef.current.getVoices();
    const targetLang = bcp47Lang.toLowerCase();
    const naturalVoice = voices.find(v => 
      (v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0])) &&
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Valluvar') || v.name.includes('Lekha'))
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
      alert('Speech recognition is not supported in this browser. You can type your question below.');
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
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: query.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Dynamic UI preview of tools based on query intent
    const qLower = query.toLowerCase();
    if (qLower.includes('summary') || qLower.includes('summarize')) {
      setActiveTool('Executing ADK Multi-Agent Mesh & Daily Synthesis...');
    } else if (qLower.includes('past') || qLower.includes('stress') || qLower.includes('remember')) {
      setActiveTool('Querying pgvector Semantic RAG Memory...');
    } else if (qLower.includes('trend') || qLower.includes('analytics') || qLower.includes('metric')) {
      setActiveTool('Running BigQuery Analytical Aggregation...');
    } else {
      setActiveTool('Consulting Gemini 3.7 Empathetic Intelligence...');
    }

    try {
      const response = await apiRequest<{
        message: string;
        toolsUsed: Array<{ name: string; description: string; data?: any }>;
        createdEntry?: JournalEntry;
      }>('/api/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          preferredLanguage
        })
      });

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
        toolsUsed: response.toolsUsed
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(response.message);

      if (response.createdEntry && onJournalCreated) {
        onJournalCreated(response.createdEntry);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: 'assistant',
        content: `I ran into a temporary hiccup connecting to the reflection engine: ${err.message}. How else can I assist?`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setActiveTool(null);
    }
  };

  const handleGenerateDailySummaryDirect = async () => {
    setIsLoading(true);
    setActiveTool('Synthesizing today\'s moments with ADK Orchestrator...');
    try {
      const response = await apiRequest<{ success: boolean; journal: JournalEntry }>('/api/assistant/daily-summary', {
        method: 'POST',
        body: JSON.stringify({ preferredLanguage })
      });

      if (response.success && response.journal) {
        if (onJournalCreated) onJournalCreated(response.journal);

        const confirmationText = `I have consolidated and saved your daily summary: "${response.journal.title}". It features your primary mood (${response.journal.reflection?.moodAnalysis.primaryMood || 'Reflective'}) and ${response.journal.reflection?.microActions.length || 3} tailored micro-actions.`;
        
        const summaryMsg: ChatMessage = {
          id: `msg_${Date.now()}_sum`,
          role: 'assistant',
          content: confirmationText,
          timestamp: Date.now(),
          toolsUsed: [
            {
              name: 'adk_agent_mesh',
              description: 'Created consolidated reflection entry and saved directly to Cloud Firestore.'
            }
          ]
        };
        setMessages(prev => [...prev, summaryMsg]);
        speakText(confirmationText);
      }
    } catch (err: any) {
      alert(`Failed to generate summary: ${err.message}`);
    } finally {
      setIsLoading(false);
      setActiveTool(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-slate-900/90 border border-slate-700/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Glassmorphic Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
                Nova • Live Voice Companion
              </h2>
              <p className="text-xs text-slate-400">
                Agentic RAG • BigQuery Analytics • ADK Multi-Agent Mesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute / Unmute Toggle */}
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
                setIsMuted(!isMuted);
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'Unmute Voice Assistant' : 'Mute Voice Assistant'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                if (recognitionRef.current && isListening) recognitionRef.current.stop();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
          {/* Left Pane: 3D Hologram & Active Visualizer (45% Width) */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-800/80 p-6 flex flex-col items-center justify-between bg-gradient-to-b from-slate-900/60 via-purple-950/20 to-slate-950/60">
            {/* 3D Reactive Holographic Visualizer */}
            <div className="w-full flex-1 flex items-center justify-center">
              <VoiceVisualizer3D
                isSpeaking={isSpeaking}
                isListening={isListening}
                audioLevel={audioLevel}
                avatarSrc="/assets/avatar.jpg"
                assistantName="Nova"
              />
            </div>

            {/* Active Real-Time Tool Invocation Indicator */}
            {activeTool && (
              <div className="w-full mb-3 px-3 py-2 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-xs text-cyan-300 animate-pulse">
                <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{activeTool}</span>
              </div>
            )}

            {/* Voice Control Action Capsule */}
            <div className="w-full flex flex-col items-center gap-3">
              <button
                onClick={toggleListening}
                className={`w-full py-3.5 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2.5 shadow-xl transition-all ${
                  isListening
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/30 scale-[1.02] animate-pulse'
                    : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-cyan-500/25 hover:opacity-95 hover:scale-[1.01]'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>Listening (Tap to Send)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Speak to Nova (Live Voice)</span>
                  </>
                )}
              </button>

              {/* Instant Daily Summary Action */}
              <button
                onClick={handleGenerateDailySummaryDirect}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Generate Today's Daily Summary</span>
              </button>
            </div>
          </div>

          {/* Right Pane: Live Conversational Stream (55% Width) */}
          <div className="md:col-span-7 flex flex-col h-full bg-slate-950/40">
            {/* Quick Suggestion Prompt Chips */}
            <div className="p-4 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Suggestions:
              </span>
              {[
                'Summarize my reflections today',
                'How is my mood trending this week?',
                'Recall my thoughts on mindfulness',
                'Give me 3 micro-actions for focus'
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="px-3 py-1 rounded-full text-xs bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white whitespace-nowrap transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>

                    {/* Tool Invocation Badges */}
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/50 space-y-1.5">
                        {msg.toolsUsed.map((tool, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-1.5 text-[11px] text-cyan-300/90 bg-cyan-950/30 px-2.5 py-1.5 rounded-lg border border-cyan-800/30"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-cyan-200">{tool.name}: </span>
                              <span>{tool.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-800/40 rounded-2xl w-fit border border-slate-700/40 animate-pulse">
                  <Layers className="w-4 h-4 text-purple-400 animate-spin" />
                  <span>Nova is reflecting with Vertex AI & MCP Memory...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Text Input Bar */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? 'Listening to your voice...' : 'Ask Nova about past memories, trends, or reflections...'}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold rounded-2xl transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
