// ============================================================
// AI-Powered ORM Dashboard — Type Definitions
// ============================================================

/** Trạng thái review */
export type ReviewStatus = 'pending' | 'resolved';

/** Tone của câu trả lời AI */
export type ReplyTone = 'standard' | 'friendly' | 'resolution';

/** Review từ Google Maps, lưu trong database */
export interface Review {
  id: string;
  place_id: string;
  place_name: string | null;
  author_name: string;
  author_photo_url: string | null;
  rating: number; // 1-5
  review_text: string;
  review_time: string; // ISO timestamp
  status: ReviewStatus;
  approved_reply_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  ai_replies?: AIReply[];
}

/** Câu trả lời do AI sinh ra */
export interface AIReply {
  id: string;
  review_id: string;
  tone: ReplyTone;
  content: string;
  is_approved: boolean;
  created_at: string;
}

/** Payload gửi lên khi fetch reviews */
export interface FetchReviewsPayload {
  place_id: string;
}

/** Payload gửi lên khi generate AI replies */
export interface GenerateAIPayload {
  review_id: string;
}

/** Payload gửi lên khi approve reply */
export interface ApproveReplyPayload {
  review_id: string;
  reply_id: string;
}

/** Response chuẩn của API */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** AI generate output (3 replies) */
export interface AIGenerateOutput {
  standard: string;
  friendly: string;
  resolution: string;
}
