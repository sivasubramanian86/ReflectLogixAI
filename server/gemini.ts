import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('[Gemini] GEMINI_API_KEY environment variable is not set. Using fallback simulation mode if key is unavailable.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export const GEMINI_MODELS = {
  DEFAULT_ORCHESTRATOR: 'gemini-3.7-flash',
  FAST_ANALYTICS: 'gemini-3.7-flash',
  DEEP_REFLECTION: 'gemini-3.7-flash',
  AUDIO_TRANSCRIBE: 'gemini-3.5-transcribe',
};
