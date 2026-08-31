import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Play,
  Square,
  RefreshCw,
  Sliders,
  Send,
  MessageSquare,
  Shield,
  HelpCircle,
  Flame,
  FileText,
  User,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../i18n';

interface TranscriptItem {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVoiceEntry: (title: string, transcript: string) => Promise<void>;
}

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onSaveVoiceEntry,
}) => {
  const { t, currentLanguage } = useI18n();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [coachTone, setCoachTone] = useState<'socratic' | 'empathetic' | 'action-oriented' | 'strategic'>('socratic');
  const [statusMessage, setStatusMessage] = useState(t.voice.idle);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [currentInterim, setCurrentInterim] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio Context & Visualizer references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentInterim]);

  // Speech Recognition setup
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Speech recognition is not supported in this browser. You can type or use fallback.');
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
        setIsListening(true);
        setStatusMessage(t.voice.listening);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setCurrentInterim(interim);
        }

        if (final.trim()) {
          const userText = final.trim();
          setCurrentInterim('');
          handleUserUtterance(userText);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        if (err.error === 'not-allowed') {
          setStatusMessage(t.voice.micPermissionError);
          stopSession();
        }
      };

      recognition.onend = () => {
        if (isSessionActive && !isMuted) {
          try {
            recognition.start();
          } catch (e) {}
        } else {
          setIsListening(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  };

  // Handle user speech input -> Gemini Socratic response
  const handleUserUtterance = async (text: string) => {
    if (!text.trim()) return;

    const userItem: TranscriptItem = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTranscript((prev) => [...prev, userItem]);
    setIsProcessing(true);
    setStatusMessage((t.voice as any)?.synthesizing || 'Reflecting with coach...');

    try {
      const response = await fetch('/api/chat/socratic-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          tone: coachTone,
          language: currentLanguage,
          history: transcript.slice(-4).map((tr) => ({ role: tr.sender, text: tr.text })),
        }),
      });

      let coachReply = '';
      if (response.ok) {
        const data = await response.json();
        coachReply = data.reply || data.question || "What underlying values or assumptions might be influencing how you see this situation?";
      } else {
        const fallbacks: Record<string, string[]> = {
          socratic: [
            "What assumption might be guiding that conclusion, and what happens if you look at it from the opposite perspective?",
            "When you reflect on that experience, what was truly within your locus of control?",
            "What is the most constructive question you could ask yourself about this situation right now?",
          ],
          empathetic: [
            "I hear how much energy and thought that required from you. What helped you stay resilient through it?",
            "It sounds like a meaningful learning moment. How are you taking care of yourself amidst this?",
          ],
          'action-oriented': [
            "What is one concrete 15-minute micro-action you can take within the next 24 hours to create forward momentum?",
            "If you were to break this challenge into the single highest-leverage first step, what would it be?",
          ],
          strategic: [
            "If you look at this through a 6-month horizon, how will this decision alter your core priorities?",
            "What second-order consequences are you currently keeping in mind?",
          ],
        };

        const list = fallbacks[coachTone] || fallbacks.socratic;
        coachReply = list[Math.floor(Math.random() * list.length)];
      }

      const coachItem: TranscriptItem = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: coachReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTranscript((prev) => [...prev, coachItem]);
      speakResponse(coachReply);
    } catch (err) {
      console.error('Coach speech dispatch error:', err);
      const fallbackReply = "That gives a lot of clarity. When you consider your long-term vision, what step feels most genuine to take next?";
      const coachItem: TranscriptItem = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setTranscript((prev) => [...prev, coachItem]);
      speakResponse(fallbackReply);
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-To-Speech Output
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langCodeMap: Record<string, string> = {
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

    utterance.lang = langCodeMap[currentLanguage] || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setStatusMessage(t.voice.speaking);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusMessage(t.voice.listening);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setStatusMessage(t.voice.listening);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Audio Visualizer Waveform Loop
  const startAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      drawWaveform();
    } catch (e) {
      console.warn('Audio Visualizer could not attach media stream:', e);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.6;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
        gradient.addColorStop(0.5, 'rgba(251, 191, 36, 0.8)');
        gradient.addColorStop(1, 'rgba(252, 211, 77, 1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    render();
  };

  const startSession = () => {
    setIsSessionActive(true);
    setStatusMessage(t.voice.connecting);
    startSpeechRecognition();
    startAudioVisualizer();

    if (transcript.length === 0) {
      setTimeout(() => {
        const welcomeGreetings: Record<string, string> = {
          en: "Welcome to your Live Voice reflection session. I am your Gemini Socratic Coach. What is on your mind today?",
          hi: "आपकी लाइव वॉइस रिफ्लेक्शन में स्वागत है। मैं आपका जेमिनी सोक्रेटिक कोच हूँ। आज आपके मन में क्या विचार हैं?",
          ta: "உங்கள் குரல் வழி சுயபரிசீலனைக்கு வரவேற்கிறோம். நான் உங்கள் ஜெமினி சாக்ரடீஸ் வழிகாட்டி. இன்று உங்கள் மனதில் என்ன உள்ளது?",
          te: "మీ వాయిస్ ఆత్మపరిశీలన సెషన్‌కు స్వాగతం. నేను మీ జెమిని సోక్రటిక్ కోచ్. ఈ రోజు మీ మనస్సులో ఏముంది?",
          es: "Bienvenido a tu sesión de reflexión por voz. Soy tu coach socrático Gemini. ¿Qué tienes en mente hoy?",
          fr: "Bienvenue dans votre session de réflexion vocale. Je suis votre coach socratique Gemini. Qu'avez-vous en tête aujourd'hui ?",
          de: "Willkommen zu deiner reflexiven Sprachsitzung. Ich bin dein Gemini-Coach. Was bewegt dich heute?",
          ja: "音声リフレクションセッションへようこそ。Geminiソクラテスコーチです。今日、心に残っていることは何ですか？",
          zh: "欢迎进入语音反思空间。我是您的 Gemini 苏格拉底教练。今天您想聊聊什么？",
          ar: "مرحباً بك في جلسة التأمل الصوتي. أنا مدربك السقراطي في جيميني. ما الذي يشغل تفكيرك اليوم؟",
        };
        const greeting = welcomeGreetings[currentLanguage] || welcomeGreetings.en;
        const initialCoachItem: TranscriptItem = {
          id: Date.now().toString(),
          sender: 'coach',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTranscript([initialCoachItem]);
        speakResponse(greeting);
      }, 500);
    }
  };

  const stopSession = () => {
    setIsSessionActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setStatusMessage(t.voice.idle);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((trk) => trk.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSaveToJournal = async () => {
    if (transcript.length === 0) return;

    const userUtterances = transcript.filter((item) => item.sender === 'user').map((item) => item.text);
    const title = userUtterances[0]
      ? `Voice Reflection: ${userUtterances[0].slice(0, 45)}...`
      : `Gemini Voice Reflection – ${new Date().toLocaleDateString()}`;

    const formattedContent = transcript
      .map((item) => `**${item.sender === 'user' ? t.voice.userSaid : t.voice.coachSaid} (${item.timestamp}):**\n${item.text}\n`)
      .join('\n\n');

    await onSaveVoiceEntry(title, formattedContent);
    stopSession();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-3xl h-[88vh] max-h-[780px] glass-panel rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800/80 bg-stone-950/80">
          <div className="flex items-center space-x-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles className="h-5 w-5" />
              {isSessionActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-base font-bold text-stone-100">
                  {t.voice.title}
                </h2>
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-500/20">
                  {isSessionActive ? statusMessage : 'Ready'}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {t.voice.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                stopSession();
                onClose();
              }}
              className="rounded-xl border border-stone-800 bg-stone-900/80 p-2 text-stone-400 hover:border-stone-700 hover:text-stone-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Coach Personality & Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-stone-950/60 border-b border-stone-800/80 text-xs">
          <div className="flex items-center space-x-2">
            <Sliders className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-stone-400 font-mono text-[11px]">{(t.voice as any)?.toneSelect || 'Tone'}:</span>
            <div className="flex items-center space-x-1 rounded-xl bg-stone-900/80 p-1 border border-stone-800">
              {(['socratic', 'empathetic', 'action-oriented', 'strategic'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setCoachTone(tone)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    coachTone === tone
                      ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isSessionActive ? (
              <button
                onClick={startSession}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 font-semibold text-stone-950 shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{t.voice.startSession}</span>
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-1.5 font-semibold text-stone-100 shadow-md hover:from-rose-400 hover:to-rose-500 transition-all active:scale-95"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>{t.voice.stopSession}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Visualizer Canvas */}
        <div className="relative h-24 bg-gradient-to-b from-stone-950 via-stone-900/40 to-stone-950 flex items-center justify-center border-b border-stone-800/80 px-6">
          <canvas
            ref={canvasRef}
            width={600}
            height={90}
            className="w-full h-full max-w-xl opacity-90"
          />

          {!isSessionActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm">
              <p className="text-xs text-stone-400 flex items-center space-x-2">
                <Mic className="h-4 w-4 text-amber-400" />
                <span>Click <strong>Start Session</strong> to speak directly with Gemini Live</span>
              </p>
            </div>
          )}

          {isSessionActive && isSpeaking && (
            <div className="absolute top-2 right-4 flex items-center space-x-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] text-amber-300 font-mono">
              <Volume2 className="h-3 w-3 animate-pulse" />
              <span>{t.voice.speaking}</span>
            </div>
          )}

          {isSessionActive && isListening && !isSpeaking && (
            <div className="absolute top-2 right-4 flex items-center space-x-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] text-emerald-300 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{t.voice.listening}</span>
            </div>
          )}
        </div>

        {/* Conversation Transcript Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-950/40">
          {transcript.map((item) => (
            <div
              key={item.id}
              className={`flex items-start space-x-3 ${
                item.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {item.sender === 'coach' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <BrainCircuit className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                  item.sender === 'user'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-stone-100 rounded-tr-none'
                    : 'glass-panel-subtle text-stone-200 rounded-tl-none border border-stone-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-mono text-stone-400">
                  <span className="font-semibold text-amber-400/90">
                    {item.sender === 'user' ? t.voice.userSaid : t.voice.coachSaid}
                  </span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="font-sans whitespace-pre-wrap">{item.text}</p>
              </div>

              {item.sender === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-stone-800 border border-stone-700 text-stone-300">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {currentInterim && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-stone-900/60 border border-stone-700/60 p-3 text-xs italic text-stone-400">
                <span className="animate-pulse">{currentInterim}...</span>
              </div>
            </div>
          )}

          <div ref={transcriptEndRef} />
        </div>

        {/* Bottom Input & Conversion Strip */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Quick text input fallback */}
          <div className="flex-1 flex items-center space-x-2 w-full">
            <input
              type="text"
              placeholder="Or type to respond to coach..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualInput.trim()) {
                  handleUserUtterance(manualInput);
                  setManualInput('');
                }
              }}
              className="flex-1 rounded-xl glass-input px-3.5 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (manualInput.trim()) {
                  handleUserUtterance(manualInput);
                  setManualInput('');
                }
              }}
              disabled={!manualInput.trim() || isProcessing}
              className="rounded-xl border border-stone-800 bg-stone-900/90 p-2 text-amber-400 hover:border-amber-500/40 disabled:opacity-40 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action: Save Dialogue to Journal Entry */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSaveToJournal}
              disabled={transcript.length === 0}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-stone-950 shadow-md hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <FileText className="h-3.5 w-3.5 text-stone-950" />
              <span>{(t.voice as any)?.convertToJournal || 'Convert to Journal Entry'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
