'use client';

import { useState } from 'react';
import { User, MapPin, Expand } from 'lucide-react';
import type { Review } from '@/types';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';
import AiReplySection from './AiReplySection';
import ReviewModal from './ReviewModal';

interface ReviewCardProps {
  review: Review;
  onDataChange: () => void;
}

export default function ReviewCard({ review, onDataChange }: ReviewCardProps) {
  const [showModal, setShowModal] = useState(false);

  const formattedTime = review.review_time
    ? new Date(review.review_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  // Truncate long review text for card view
  const maxLen = 200;
  const isLongReview = review.review_text.length > maxLen;
  const displayText = isLongReview
    ? review.review_text.slice(0, maxLen) + '...'
    : review.review_text;

  return (
    <>
      <div className="glass-card p-4 sm:p-5 animate-slide-up" id={`review-card-${review.id}`}>
        {/* Header: Author info + Status */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              {review.author_photo_url ? (
                <img
                  src={review.author_photo_url}
                  alt={review.author_name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-surface-100 text-sm truncate">{review.author_name}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <StarRating rating={review.rating} size={13} />
                <span className="text-[11px] text-surface-500">· {formattedTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={review.status} />
            <button
              onClick={() => setShowModal(true)}
              className="w-7 h-7 rounded-lg bg-surface-800/50 hover:bg-surface-700 flex items-center justify-center transition-colors"
              title="View details"
            >
              <Expand size={13} className="text-surface-400" />
            </button>
          </div>
        </div>

        {/* Place name */}
        {review.place_name && (
          <p className="text-xs text-primary-400 mb-2 flex items-center gap-1">
            <MapPin size={12} />
            {review.place_name}
          </p>
        )}

        {/* Review text */}
        <p className="text-sm text-surface-300 leading-relaxed">
          {displayText}
          {isLongReview && (
            <button
              onClick={() => setShowModal(true)}
              className="text-primary-400 hover:text-primary-300 ml-1 text-xs font-medium"
            >
              Read more
            </button>
          )}
        </p>

        {/* AI Replies section */}
        <AiReplySection
          reviewId={review.id}
          replies={review.ai_replies || []}
          reviewStatus={review.status}
          onApproveSuccess={onDataChange}
          onGenerateSuccess={onDataChange}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <ReviewModal
          review={review}
          onClose={() => setShowModal(false)}
          onDataChange={onDataChange}
        />
      )}
    </>
  );
}
