import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getOpenAIClient, buildReplyPrompt } from '@/lib/openai';
import { generateWithGemini } from '@/lib/gemini';
import type { GenerateAIPayload, ApiResponse, AIReply, AIGenerateOutput } from '@/types';

/**
 * Simple Vietnamese language detection
 */
function isVietnameseText(text: string): boolean {
  const vnChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  const vnWords = /\b(tốt|đẹp|phòng|nhân viên|ks|khách sạn|dịch vụ|ăn|ngon|phục vụ|tuyệt vời|ok|giá|ở)\b/i;
  return vnChars.test(text) || vnWords.test(text);
}

/**
 * Generate premium mock replies if no API keys are available or APIs fail
 */
function generateMockReplies(reviewText: string, rating: number, authorName: string): AIGenerateOutput {
  const isVn = isVietnameseText(reviewText);

  if (isVn) {
    if (rating >= 4) {
      return {
        standard: `Cảm ơn anh/chị ${authorName} đã dành thời gian đánh giá ${rating} sao cho chúng tôi. Chúng tôi rất vui mừng khi anh/chị đã có một trải nghiệm hài lòng tại đây. Hy vọng sẽ được chào đón anh/chị quay lại trong thời gian sớm nhất!`,
        friendly: `Cảm ơn ${authorName} rất nhiều vì review siêu dễ thương! Đội ngũ nhân viên đọc xong ai cũng vui hết nấc. Lần sau ghé lại nhớ nhắn tụi mình để được tiếp đón chu đáo hơn nữa nhé!`,
        resolution: `Cảm ơn anh/chị ${authorName} đã góp ý. Dù anh/chị đã hài lòng, chúng tôi vẫn không ngừng nỗ lực nâng cao chất lượng hơn nữa để mang đến trải nghiệm tuyệt hảo nhất cho lần ghé thăm tiếp theo.`
      };
    } else {
      return {
        standard: `Kính chào anh/chị ${authorName}. Chúng tôi chân thành xin lỗi vì trải nghiệm chưa trọn vẹn của anh/chị tại cơ sở. Ý kiến đóng góp của anh/chị về dịch vụ đã được chuyển tới ban quản lý để kịp thời chấn chỉnh và khắc phục chất lượng. Rất mong có cơ hội được đón tiếp lại để sửa chữa thiếu sót.`,
        friendly: `Chào ${authorName}, tụi mình rất tiếc khi nghe chia sẻ của bạn về trải nghiệm chưa được ưng ý lần này. Đừng giận tụi mình nhé! Tụi mình đã ghi nhận và đang sửa đổi ngay lập tức. Hy vọng bạn sẽ cho tụi mình cơ hội chuộc lỗi ở lần ghé sau nha!`,
        resolution: `Kính gửi anh/chị ${authorName}, chúng tôi vô cùng cáo lỗi vì sự bất tiện mà anh/chị gặp phải. Chúng tôi muốn liên hệ trực tiếp với anh/chị để gửi lời xin lỗi chân thành cùng một ưu đãi bù đắp cho lần tới. Mong anh/chị có thể lượng thứ.`
      };
    }
  } else {
    if (rating >= 4) {
      return {
        standard: `Dear ${authorName}, thank you so much for taking the time to share your positive experience and giving us a ${rating}-star rating! We are thrilled to hear you enjoyed your stay with us. We look forward to welcoming you back soon.`,
        friendly: `Hi ${authorName}! Thanks a million for the wonderful review! Your feedback made our team's day. We can't wait to have you back with us for another fantastic time!`,
        resolution: `Dear ${authorName}, thank you for your review. While we are glad you had a great overall experience, we will continue to fine-tune our service to ensure your next visit is absolutely perfect.`
      };
    } else {
      return {
        standard: `Dear ${authorName}, thank you for your feedback. We sincerely apologize that your recent experience did not meet your expectations. We have shared your comments with our management team to address these issues and improve our service. We hope to have the opportunity to regain your trust.`,
        friendly: `Hi ${authorName}, we are truly sorry to hear that things weren't quite right during your visit. We hate to disappoint our guests! We are working hard to fix the issues you mentioned. We'd love another chance to show you the top-notch hospitality we are known for.`,
        resolution: `Dear ${authorName}, please accept our sincerest apologies for the inconvenience caused. We would appreciate the opportunity to discuss this further with you to offer a complimentary upgrade or discount on your next visit. Please contact our guest relations manager directly.`
      };
    }
  }
}

/**
 * Thử generate bằng OpenAI trước, nếu lỗi thì fallback sang Gemini, cuối cùng fallback sang mock generator
 */
async function generateAIResponse(
  prompt: string,
  reviewText: string,
  rating: number,
  authorName: string
): Promise<{ text: string; provider: string }> {
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
    }
  }

  // 3. Cuối cùng, fallback sang mock generator để demo LUÔN LUÔN hoạt động mượt mà
  console.log('⚠️ Both AI models failed or keys not set. Generating premium mock replies as fallback.');
  const mockOutput = generateMockReplies(reviewText, rating, authorName);
  return {
    text: JSON.stringify(mockOutput),
    provider: 'local-mock',
  };
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
    const { text: responseText, provider } = await generateAIResponse(
      prompt,
      review.review_text,
      review.rating,
      review.author_name
    );

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
