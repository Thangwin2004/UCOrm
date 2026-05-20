/**
 * Google Places API (New) helper
 * Fetches reviews for a given Place ID
 */

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativePublishTimeDescription: string;
  publishTime: string;
}

export interface PlaceDetails {
  displayName: string;
  reviews: GoogleReview[];
}

/**
 * Fetch reviews from Google Places API (New)
 * Falls back to sample data if API key is not configured
 */
export async function fetchGoogleReviews(placeId: string): Promise<PlaceDetails> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  // Nếu chưa có API key → dùng sample data
  if (!apiKey) {
    console.warn('GOOGLE_PLACES_API_KEY not set — using sample data');
    return generateSampleData(placeId);
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,reviews&languageCode=vi`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'displayName,reviews',
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Google Places API error:', errorBody);
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    const reviews: GoogleReview[] = (data.reviews || []).slice(0, 5).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => ({
        authorName: r.authorAttribution?.displayName || 'Anonymous',
        authorPhotoUrl: r.authorAttribution?.photoUri || null,
        rating: r.rating || 0,
        text: r.text?.text || r.originalText?.text || '',
        relativePublishTimeDescription: r.relativePublishTimeDescription || '',
        publishTime: r.publishTime || new Date().toISOString(),
      })
    );

    return {
      displayName: data.displayName?.text || 'Unknown Place',
      reviews,
    };
  } catch (error) {
    console.error('Error fetching from Google Places:', error);
    // Fallback to sample data on error
    return generateSampleData(placeId);
  }
}

/** Sinh sample data khi không có Google API key */
function generateSampleData(placeId: string): PlaceDetails {
  const sampleReviews: GoogleReview[] = [
    {
      authorName: 'Nguyễn Văn An',
      authorPhotoUrl: null,
      rating: 5,
      text: 'Khách sạn rất tuyệt vời! Phòng sạch sẽ, nhân viên thân thiện và chuyên nghiệp. View từ phòng nhìn ra biển rất đẹp. Chắc chắn sẽ quay lại lần sau.',
      relativePublishTimeDescription: '2 tuần trước',
      publishTime: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      authorName: 'Trần Thị Mai',
      authorPhotoUrl: null,
      rating: 4,
      text: 'Vị trí đẹp, gần trung tâm. Bữa sáng đa dạng và ngon. Tuy nhiên phòng hơi nhỏ so với giá tiền. Wifi khá chậm vào buổi tối.',
      relativePublishTimeDescription: '1 tuần trước',
      publishTime: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      authorName: 'David Smith',
      authorPhotoUrl: null,
      rating: 2,
      text: 'Disappointing experience. The room was not clean when we arrived, and it took over an hour for housekeeping to come. The air conditioning was broken and maintenance never showed up. Would not recommend.',
      relativePublishTimeDescription: '3 days ago',
      publishTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      authorName: 'Lê Hoàng Phúc',
      authorPhotoUrl: null,
      rating: 5,
      text: 'Dịch vụ spa tuyệt vời, nhân viên lễ tân rất nhiệt tình giúp đỡ đặt tour. Hồ bơi trên sân thượng view thành phố cực kỳ ấn tượng. 10/10!',
      relativePublishTimeDescription: '5 ngày trước',
      publishTime: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      authorName: 'Phạm Minh Tuấn',
      authorPhotoUrl: null,
      rating: 3,
      text: 'Khách sạn ổn nhưng không có gì đặc biệt. Giá hơi cao so với chất lượng. Đồ ăn ở nhà hàng khách sạn khá đắt mà không ngon lắm. Phòng thì ok.',
      relativePublishTimeDescription: '1 ngày trước',
      publishTime: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  return {
    displayName: `Sample Hotel (${placeId.slice(0, 8)}...)`,
    reviews: sampleReviews,
  };
}
