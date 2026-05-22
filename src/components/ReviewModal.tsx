'use client';

import { useEffect, useRef } from 'react';
import { X, User, MapPin, Calendar } from 'lucide-react';
import type { Review } from '@/types';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';
import AiReplySection from './AiReplySection';

interface ReviewModalProps {
  review: Review;
  onClose: () => void;
  onDataChange: () => void;
}

export default function ReviewModal({ review, onClose, onDataChange }: ReviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const formattedTime = review.review_time
    ? new Date(review.review_time).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={handleOverlayClick}
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
    >
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up border-primary-500/20">
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 sm:p-6 pb-4 border-b border-surface-800 bg-surface-950/90 backdrop-blur-xl rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                {review.author_photo_url ? (
                  <img
                    src={review.author_photo_url}
                    alt={review.author_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User size={22} className="text-white" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-surface-100 truncate">
                  {review.author_name}
                </h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <StarRating rating={review.rating} size={16} />
                  <StatusBadge status={review.status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X size={16} className="text-surface-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-surface-500 flex-wrap">
            {review.place_name && (
              <span className="flex items-center gap-1 text-primary-400">
                <MapPin size={12} />
                {review.place_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedTime}
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-800 text-surface-400">
              {review.rating}/5 stars
            </span>
          </div>

          {/* Review text */}
          <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
            <p className="text-sm sm:text-base text-surface-200 leading-relaxed whitespace-pre-wrap">
              {review.review_text}
            </p>
          </div>

          {/* AI Replies */}
          <AiReplySection
            reviewId={review.id}
            replies={review.ai_replies || []}
            reviewStatus={review.status}
            onApproveSuccess={() => { onDataChange(); onClose(); }}
            onGenerateSuccess={onDataChange}
          />
        </div>
      </div>
    </div>
  );
}
