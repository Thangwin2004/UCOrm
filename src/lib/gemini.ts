import { GoogleGenAI } from '@google/genai';

/**
 * Create Gemini client
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Please configure your .env.local file.');
  }
  return new GoogleGenAI({ apiKey });
}

/** Helper: delay */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate AI replies using Gemini API with retry logic
 * Retries up to 3 times with exponential backoff on rate limit errors
 */
export async function generateWithGemini(prompt: string): Promise<string> {
  const client = getGeminiClient();
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Gemini did not return a response');
      }
      return text;
    } catch (error) {
      const errMsg = (error as Error).message || '';
      const isRateLimit = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota');

      if (isRateLimit && attempt < maxRetries - 1) {
        const waitTime = (attempt + 1) * 20; // 20s, 40s, 60s
        console.warn(`⚠️ Gemini rate limited, retrying in ${waitTime}s (attempt ${attempt + 1}/${maxRetries})`);
        await delay(waitTime * 1000);
        continue;
      }
      throw error;
    }
  }

  throw new Error('Gemini: max retries exceeded');
}
