import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

/**
 * Initializes and returns Google GenAI client configured for Vertex AI
 * or Developer API Key based on environment settings.
 *
 * Project: genai-apac-2026-491004
 * Region:  asia-southeast1 / us-central1
 */
export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const useVertexAI = process.env.USE_VERTEX_AI === 'true' || Boolean(process.env.GOOGLE_CLOUD_PROJECT);
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'genai-apac-2026-491004';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'asia-southeast1';
    const apiKey = process.env.GEMINI_API_KEY;

    if (useVertexAI) {
      console.log(`[Vertex AI] Initializing Vertex AI on GCP Project: ${projectId}, Location: ${location}`);
      aiClient = new GoogleGenAI({
        vertexai: true,
        project: projectId,
        location: location,
        httpOptions: {
          headers: {
            'User-Agent': 'ReflectLogixAI-VertexAI/3.1.0',
          },
        },
      });
    } else {
      console.log('[Gemini Developer API] Initializing with Gemini API key.');
      aiClient = new GoogleGenAI({
        apiKey: apiKey || 'dummy-key',
        httpOptions: {
          headers: {
            'User-Agent': 'ReflectLogixAI-Dev/3.1.0',
          },
        },
      });
    }
  }
  return aiClient;
}

export const GEMINI_MODELS = {
  DEFAULT_ORCHESTRATOR: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
  FAST_ANALYTICS: 'gemini-3.7-flash',
  DEEP_REFLECTION: 'gemini-3.7-flash',
  AUDIO_TRANSCRIBE: 'gemini-3.5-transcribe',
};
