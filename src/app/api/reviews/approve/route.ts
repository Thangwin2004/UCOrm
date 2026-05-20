import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { ApproveReplyPayload, ApiResponse } from '@/types';

/**
 * POST /api/reviews/approve
 * Duyệt 1 câu trả lời AI → đổi trạng thái review sang "resolved"
 * Body: { review_id: string, reply_id: string }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApproveReplyPayload;
    const { review_id, reply_id } = body;

    if (!review_id || !reply_id) {
      return NextResponse.json(
        { success: false, error: 'review_id and reply_id are required' } as ApiResponse,
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Verify reply exists and belongs to this review
    const { data: reply, error: replyError } = await supabase
      .from('ai_replies')
      .select('*')
      .eq('id', reply_id)
      .eq('review_id', review_id)
      .single();

    if (replyError || !reply) {
      return NextResponse.json(
        { success: false, error: 'Reply not found for this review' } as ApiResponse,
        { status: 404 }
      );
    }

    // 2. Reset all replies for this review to not approved
    await supabase
      .from('ai_replies')
      .update({ is_approved: false })
      .eq('review_id', review_id);

    // 3. Mark selected reply as approved
    const { error: approveError } = await supabase
      .from('ai_replies')
      .update({ is_approved: true })
      .eq('id', reply_id);

    if (approveError) {
      return NextResponse.json(
        { success: false, error: approveError.message } as ApiResponse,
        { status: 500 }
      );
    }

    // 4. Update review status to "resolved" and set approved_reply_id
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({
        status: 'resolved',
        approved_reply_id: reply_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', review_id)
      .select(`
        *,
        ai_replies!ai_replies_review_id_fkey (*)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedReview,
    } as ApiResponse);
  } catch (error) {
    console.error('POST /api/reviews/approve error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
