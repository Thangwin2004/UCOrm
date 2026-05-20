import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { fetchGoogleReviews } from '@/lib/google-places';
import type { FetchReviewsPayload, ApiResponse, Review } from '@/types';

/**
 * POST /api/reviews/fetch
 * Fetch reviews từ Google Places API (hoặc sample data) và lưu vào DB
 * Body: { place_id: string }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FetchReviewsPayload;
    const { place_id } = body;

    if (!place_id || typeof place_id !== 'string' || place_id.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Place ID is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // 1. Fetch reviews từ Google Places API (hoặc sample data)
    const placeDetails = await fetchGoogleReviews(place_id.trim());

    if (!placeDetails.reviews || placeDetails.reviews.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No reviews found for this Place ID' } as ApiResponse,
        { status: 404 }
      );
    }

    // 2. Lưu reviews vào database
    const supabase = getSupabaseAdmin();

    const reviewsToInsert = placeDetails.reviews.map((review) => ({
      place_id: place_id.trim(),
      place_name: placeDetails.displayName,
      author_name: review.authorName,
      author_photo_url: review.authorPhotoUrl,
      rating: review.rating,
      review_text: review.text,
      review_time: review.publishTime,
      status: 'pending' as const,
    }));

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewsToInsert)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
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
    console.error('POST /api/reviews/fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
