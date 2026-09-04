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
    const apiKey = process.env.GEMINI_API_KEY;
    const isExplicitDevKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey !== 'dummy-key' && apiKey.length > 20;
    const useVertexAI = process.env.USE_VERTEX_AI === 'true' || !isExplicitDevKey;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'genai-apac-2026-491004';
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

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
        apiKey: apiKey,
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
  DEFAULT_ORCHESTRATOR: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  FAST_ANALYTICS: 'gemini-2.5-flash',
  DEEP_REFLECTION: 'gemini-2.5-flash',
  AUDIO_TRANSCRIBE: 'gemini-2.5-flash',
};
