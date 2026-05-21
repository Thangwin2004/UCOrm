import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

const SAMPLE_REVIEWS = [
  {
    place_id: 'demo_hotel_saigon',
    place_name: 'Grand Saigon Hotel',
    author_name: 'Nguyen Van An',
    author_photo_url: null,
    rating: 5,
    review_text:
      'Khach san rat tuyet voi! Phong sach se, nhan vien than thien va chuyen nghiep. View tu phong nhin ra song Sai Gon rat dep. Chac chan se quay lai lan sau.',
    review_time: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'pending' as const,
  },
  {
    place_id: 'demo_hotel_saigon',
    place_name: 'Grand Saigon Hotel',
    author_name: 'Tran Thi Mai',
    author_photo_url: null,
    rating: 4,
    review_text:
      'Vi tri dep, gan trung tam. Bua sang da dang va ngon. Tuy nhien phong hoi nho so voi gia tien. Wifi kha cham vao buoi toi.',
    review_time: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: 'pending' as const,
  },
  {
    place_id: 'demo_hotel_saigon',
    place_name: 'Grand Saigon Hotel',
    author_name: 'David Smith',
    author_photo_url: null,
    rating: 2,
    review_text:
      'Disappointing experience. The room was not clean when we arrived, and it took over an hour for housekeeping to come. The air conditioning was broken and maintenance never showed up. Would not recommend.',
    review_time: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'pending' as const,
  },
  {
    place_id: 'demo_hotel_saigon',
    place_name: 'Grand Saigon Hotel',
    author_name: 'Le Hoang Phuc',
    author_photo_url: null,
    rating: 5,
    review_text:
      'Dich vu spa tuyet voi, nhan vien le tan rat nhiet tinh giup do dat tour. Ho boi tren san thuong view thanh pho cuc ky an tuong. 10/10!',
    review_time: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'pending' as const,
  },
  {
    place_id: 'demo_hotel_saigon',
    place_name: 'Grand Saigon Hotel',
    author_name: 'Pham Minh Tuan',
    author_photo_url: null,
    rating: 3,
    review_text:
      'Khach san on nhung khong co gi dac biet. Gia hoi cao so voi chat luong. Do an o nha hang khach san kha dat ma khong ngon lam. Phong thi ok.',
    review_time: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'pending' as const,
  },
];

/**
 * POST /api/seed
 * Nap sample data vao database de demo
 * Optional body: { clear: true } de xoa data cu truoc khi nap
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const shouldClear = (body as { clear?: boolean }).clear === true;

    const supabase = getSupabaseAdmin();

    // Xoa data cu neu can
    if (shouldClear) {
      await supabase.from('ai_replies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    // Insert sample reviews
    const { data, error } = await supabase
      .from('reviews')
      .insert(SAMPLE_REVIEWS)
      .select();

    if (error) {
      console.error('Seed error:', error);
      return NextResponse.json(
        { success: false, error: error.message } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Seeded ${data.length} sample reviews${shouldClear ? ' (cleared old data)' : ''}`,
    });
  } catch (error) {
    console.error('POST /api/seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiResponse,
      { status: 500 }
    );
  }
}
