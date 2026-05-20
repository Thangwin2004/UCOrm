import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Review, ApiResponse } from '@/types';

/**
 * GET /api/reviews
 * Lấy danh sách tất cả reviews, kèm theo AI replies
 * Query params: ?status=pending|resolved (optional filter)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('reviews')
      .select(`
        *,
        ai_replies!ai_replies_review_id_fkey (*)
      `)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status && (status === 'pending' || status === 'resolved')) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data as Review[],
    } as ApiResponse<Review[]>);
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
