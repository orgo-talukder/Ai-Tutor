import { GoogleGenAI, GenerateContentParameters, ThinkingLevel } from '@google/genai';
import { GeminiModelId, ThinkingLevelId } from '@/lib/types';

if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set.');
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const DEFAULT_MODEL: GeminiModelId = 'gemini-3.8-flash';

// Multi-tier resilient fallback cascade list
export const FALLBACK_CASCADE: GeminiModelId[] = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-pro-preview',
  'gemini-3.1-flash-preview',
  'gemini-2.5-flash',
];

// Track temporarily degraded or quota-exhausted models
const modelCooldowns: Record<string, number> = {};

export interface StreamParams extends Omit<GenerateContentParameters, 'model'> {
  requestedModel?: GeminiModelId;
  thinkingLevel?: ThinkingLevelId;
}

/**
 * Builds appropriate thinking configuration based on the model series.
 * Gemini 3 series uses thinkingLevel ('LOW' | 'MEDIUM' | 'HIGH').
 * Gemini 2.5 series uses thinkingBudget (token count or 0 for off).
 */
function buildThinkingConfig(model: string, level: ThinkingLevelId = 'medium') {
  const isGemini25 = model.includes('2.5');

  if (isGemini25) {
    switch (level) {
      case 'off':
        return { thinkingBudget: 0 };
      case 'low':
        return { thinkingBudget: 1024 };
      case 'high':
        return { thinkingBudget: 8192 };
      case 'medium':
      default:
        return { thinkingBudget: 4096 };
    }
  }

  // Gemini 3 series
  switch (level) {
    case 'off':
      return { thinkingLevel: ThinkingLevel.MINIMAL };
    case 'low':
      return { thinkingLevel: ThinkingLevel.LOW };
    case 'high':
      return { thinkingLevel: ThinkingLevel.HIGH };
    case 'medium':
    default:
      return { thinkingLevel: ThinkingLevel.MEDIUM };
  }
}

/**
 * Get ordered candidate models prioritizing requestedModel and healthy fallbacks.
 */
function getModelCandidates(requestedModel: GeminiModelId = DEFAULT_MODEL): GeminiModelId[] {
  const now = Date.now();
  const candidates: GeminiModelId[] = [];

  // Add requested model if not on cooldown
  if (!modelCooldowns[requestedModel] || now > modelCooldowns[requestedModel]) {
    candidates.push(requestedModel);
  }

  // Add remaining models from cascade
  for (const fallbackModel of FALLBACK_CASCADE) {
    if (!candidates.includes(fallbackModel)) {
      if (!modelCooldowns[fallbackModel] || now > modelCooldowns[fallbackModel]) {
        candidates.push(fallbackModel);
      }
    }
  }

  // If all models are on cooldown, ignore cooldowns and try all in cascade order
  if (candidates.length === 0) {
    return [requestedModel, ...FALLBACK_CASCADE.filter((m) => m !== requestedModel)];
  }

  return candidates;
}

/**
 * Resilient streaming helper supporting multi-tier model fallback cascade.
 */
export async function streamWithFallback(params: StreamParams) {
  const { requestedModel = DEFAULT_MODEL, thinkingLevel = 'medium', ...restParams } = params;
  const candidates = getModelCandidates(requestedModel);

  let lastError: unknown = null;

  for (const modelToTry of candidates) {
    const thinkingConfig = buildThinkingConfig(modelToTry, thinkingLevel);
    const customConfig = {
      ...restParams.config,
      thinkingConfig,
    };

    try {
      const result = await ai.models.generateContentStream({
        ...restParams,
        model: modelToTry,
        config: customConfig,
      });
      return result;
    } catch (error: unknown) {
      console.warn(`Model ${modelToTry} stream failed, attempting fallback candidate:`, error);
      // Place model on 5-minute cooldown when quota or rate limit is hit
      modelCooldowns[modelToTry] = Date.now() + 5 * 60_000;
      lastError = error;
    }
  }

  throw lastError || new Error('All AI models in fallback cascade failed.');
}

/**
 * Resilient content generation helper supporting multi-tier model fallback cascade.
 */
export async function generateContentWithFallback(params: StreamParams) {
  const { requestedModel = DEFAULT_MODEL, thinkingLevel = 'medium', ...restParams } = params;
  const candidates = getModelCandidates(requestedModel);

  let lastError: unknown = null;

  for (const modelToTry of candidates) {
    const thinkingConfig = buildThinkingConfig(modelToTry, thinkingLevel);
    const customConfig = {
      ...restParams.config,
      thinkingConfig,
    };

    try {
      const result = await ai.models.generateContent({
        ...restParams,
        model: modelToTry,
        config: customConfig,
      });
      return result;
    } catch (error: unknown) {
      console.warn(`Model ${modelToTry} call failed, attempting fallback candidate:`, error);
      modelCooldowns[modelToTry] = Date.now() + 5 * 60_000;
      lastError = error;
    }
  }

  throw lastError || new Error('All AI models in fallback cascade failed.');
}
