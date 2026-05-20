import OpenAI from 'openai';

/**
 * Create OpenAI client — only when API key is available
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set. Please configure your .env.local file.');
  }
  return new OpenAI({ apiKey });
}

/**
 * Prompt template để AI sinh 3 câu trả lời với 3 tone khác nhau.
 * - standard: chuyên nghiệp, lịch sự
 * - friendly: thân thiện, ấm áp
 * - resolution: xin lỗi + đề xuất giải pháp (cho review tiêu cực)
 */
export function buildReplyPrompt(reviewText: string, rating: number, authorName: string): string {
  return `You are a professional hotel/restaurant reputation manager. A customer left a review and you need to write reply suggestions.

Customer Name: ${authorName}
Rating: ${rating}/5 stars
Review: "${reviewText}"

Generate exactly 3 reply suggestions with different tones. Each reply should be 2-4 sentences, professional, and address the specific points in the review.

IMPORTANT: Respond in the SAME LANGUAGE as the review. If the review is in Vietnamese, reply in Vietnamese. If in English, reply in English.

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "standard": "A professional and polite reply...",
  "friendly": "A warm, personal, and enthusiastic reply...",
  "resolution": "An empathetic reply acknowledging concerns and offering solutions..."
}`;
}
