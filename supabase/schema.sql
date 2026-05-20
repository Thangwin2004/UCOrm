-- ============================================================
-- AI-Powered ORM Dashboard — Database Schema
-- Run this SQL in Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 1. Bảng lưu reviews từ Google Maps
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT NOT NULL,
    place_name TEXT,
    author_name TEXT NOT NULL,
    author_photo_url TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    approved_reply_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng lưu câu trả lời AI
CREATE TABLE IF NOT EXISTS ai_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    tone TEXT NOT NULL CHECK (tone IN ('standard', 'friendly', 'resolution')),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Foreign key cho approved_reply_id (thêm sau khi cả 2 bảng đã tạo)
ALTER TABLE reviews
    ADD CONSTRAINT fk_approved_reply
    FOREIGN KEY (approved_reply_id)
    REFERENCES ai_replies(id)
    ON DELETE SET NULL;

-- 4. Indexes cho performance
CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_ai_replies_review_id ON ai_replies(review_id);

-- 5. Enable Row Level Security (RLS) - cho phép public access (demo)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_replies ENABLE ROW LEVEL SECURITY;

-- Policies cho phép tất cả operations (vì đây là demo/PoC)
CREATE POLICY "Allow all operations on reviews" ON reviews
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on ai_replies" ON ai_replies
    FOR ALL USING (true) WITH CHECK (true);
