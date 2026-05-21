'use client';

import { User, MapPin } from 'lucide-react';
import type { Review } from '@/types';
import StatusBadge from './StatusBadge';
import StarRating from './StarRating';
import AiReplySection from './AiReplySection';

interface ReviewCardProps {
  review: Review;
  onDataChange: () => void;
}

export default function ReviewCard({ review, onDataChange }: ReviewCardProps) {
  const formattedTime = review.review_time
    ? new Date(review.review_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <div className="glass-card p-4 sm:p-5 animate-slide-up" id={`review-card-${review.id}`}>
      {/* Header: Author info + Status */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Author avatar */}
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
        <StatusBadge status={review.status} />
      </div>

      {/* Place name */}
      {review.place_name && (
        <p className="text-xs text-primary-400 mb-2 flex items-center gap-1">
          <MapPin size={12} />
          {review.place_name}
        </p>
      )}

      {/* Review text */}
      <p className="text-sm text-surface-300 leading-relaxed">{review.review_text}</p>

      {/* AI Replies section */}
      <AiReplySection
        reviewId={review.id}
        replies={review.ai_replies || []}
        reviewStatus={review.status}
        onApproveSuccess={onDataChange}
        onGenerateSuccess={onDataChange}
      />
    </div>
  );
}
