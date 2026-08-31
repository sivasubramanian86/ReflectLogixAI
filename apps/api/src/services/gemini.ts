import { GoogleGenAI } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export const GEMINI_MODELS = {
  DEFAULT_ORCHESTRATOR: 'gemini-3.7-flash',
  FAST_TRANSCRIBER: 'gemini-2.5-flash',
  LONG_CONTEXT_REASONER: 'gemini-2.5-pro'
} as const;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY || 'dummy-key';
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}
