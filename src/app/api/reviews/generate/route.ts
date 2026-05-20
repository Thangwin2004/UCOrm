import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getOpenAIClient, buildReplyPrompt } from '@/lib/openai';
import { generateWithGemini } from '@/lib/gemini';
import type { GenerateAIPayload, ApiResponse, AIReply, AIGenerateOutput } from '@/types';

/**
 * Thử generate bằng OpenAI trước, nếu lỗi thì fallback sang Gemini
 */
async function generateAIResponse(prompt: string): Promise<{ text: string; provider: string }> {
  // 1. Thử OpenAI trước
  if (process.env.OPENAI_API_KEY) {
    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const text = completion.choices[0]?.message?.content;
      if (text) {
        console.log('✅ AI response generated via OpenAI');
        return { text, provider: 'openai' };
      }
    } catch (error) {
      console.warn('⚠️ OpenAI failed, falling back to Gemini:', (error as Error).message);
    }
  }

  // 2. Fallback sang Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const text = await generateWithGemini(prompt);
      console.log('✅ AI response generated via Gemini (fallback)');
      return { text, provider: 'gemini' };
    } catch (error) {
      console.error('❌ Gemini also failed:', (error as Error).message);
      throw error;
    }
  }

  throw new Error('No AI API key configured. Set OPENAI_API_KEY or GEMINI_API_KEY in .env.local');
}

/**
 * POST /api/reviews/generate
 * Gọi AI để sinh 3 câu trả lời cho một review
 * Thử OpenAI trước → fallback Gemini nếu lỗi
 * Body: { review_id: string }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateAIPayload;
    const { review_id } = body;

    if (!review_id) {
      return NextResponse.json(
        { success: false, error: 'review_id is required' } as ApiResponse,
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Lấy review từ DB
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', review_id)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // 2. Xóa AI replies cũ nếu có (cho phép re-generate)
    await supabase
      .from('ai_replies')
      .delete()
      .eq('review_id', review_id);

    // 3. Gọi AI (OpenAI → Gemini fallback)
    const prompt = buildReplyPrompt(review.review_text, review.rating, review.author_name);
    const { text: responseText, provider } = await generateAIResponse(prompt);

    // 4. Parse AI response
    let aiOutput: AIGenerateOutput;
    try {
      // Clean response — remove markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      aiOutput = JSON.parse(cleanedText) as AIGenerateOutput;
    } catch {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' } as ApiResponse,
        { status: 500 }
      );
    }

    // 5. Lưu 3 replies vào database
    const repliesToInsert = [
      { review_id, tone: 'standard' as const, content: aiOutput.standard },
      { review_id, tone: 'friendly' as const, content: aiOutput.friendly },
      { review_id, tone: 'resolution' as const, content: aiOutput.resolution },
    ];

    const { data: replies, error: insertError } = await supabase
      .from('ai_replies')
      .insert(repliesToInsert)
      .select();

    if (insertError) {
      console.error('Insert AI replies error:', insertError);
      return NextResponse.json(
        { success: false, error: insertError.message } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: replies as AIReply[],
      provider, // trả về thêm thông tin dùng AI nào
    });
  } catch (error) {
    console.error('POST /api/reviews/generate error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message } as ApiResponse,
      { status: 500 }
    );
  }
}
