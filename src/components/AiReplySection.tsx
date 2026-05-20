'use client';

import { useState } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AIReply } from '@/types';

interface AiReplySectionProps {
  reviewId: string;
  replies: AIReply[];
  reviewStatus: string;
  onApproveSuccess: () => void;
  onGenerateSuccess: () => void;
}

const toneConfig = {
  standard: {
    label: '📋 Standard',
    description: 'Professional & polite',
    badgeClass: 'tone-standard',
  },
  friendly: {
    label: '💙 Friendly',
    description: 'Warm & personal',
    badgeClass: 'tone-friendly',
  },
  resolution: {
    label: '🔧 Resolution',
    description: 'Empathetic & solution-oriented',
    badgeClass: 'tone-resolution',
  },
};

export default function AiReplySection({
  reviewId,
  replies,
  reviewStatus,
  onApproveSuccess,
  onGenerateSuccess,
}: AiReplySectionProps) {
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(
    replies.find((r) => r.is_approved)?.id || null
  );
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/reviews/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: reviewId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('AI replies generated!');
        onGenerateSuccess();
      } else {
        toast.error(data.error || 'Failed to generate replies');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReplyId) {
      toast.error('Please select a reply to approve');
      return;
    }

    setApproving(true);
    try {
      const res = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_id: reviewId, reply_id: selectedReplyId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Reply approved! Review marked as resolved.');
        onApproveSuccess();
      } else {
        toast.error(data.error || 'Failed to approve reply');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setApproving(false);
    }
  };

  // No replies yet — show Generate button
  if (replies.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-surface-800">
        <button
          className="btn-primary w-full justify-center"
          onClick={handleGenerate}
          disabled={generating}
          id={`generate-ai-btn-${reviewId}`}
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating AI Replies...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate AI Replies
            </>
          )}
        </button>
      </div>
    );
  }

  // Has replies — show them
  const approvedReply = replies.find((r) => r.is_approved);
  const isResolved = reviewStatus === 'resolved';

  return (
    <div className="mt-4 pt-4 border-t border-surface-800">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-surface-300 flex items-center gap-2">
          <Sparkles size={14} className="text-primary-400" />
          AI Suggestions
        </h4>
        {!isResolved && (
          <button
            className="text-xs text-surface-500 hover:text-primary-400 transition-colors"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Regenerating...' : '↻ Regenerate'}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {replies.map((reply, index) => {
          const tone = toneConfig[reply.tone as keyof typeof toneConfig];
          const isSelected = selectedReplyId === reply.id;
          const isApproved = reply.is_approved;

          return (
            <div
              key={reply.id}
              className={`
                relative rounded-xl p-3 cursor-pointer transition-all duration-200
                animate-fade-in
                ${
                  isApproved
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : isSelected
                    ? 'bg-primary-500/10 border border-primary-500/30'
                    : 'bg-surface-800/50 border border-surface-700/50 hover:border-surface-600'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => !isResolved && setSelectedReplyId(reply.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                {/* Radio indicator */}
                {!isResolved && (
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-surface-500'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                )}
                {isApproved && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <span className={`badge text-xs ${tone?.badgeClass || ''}`}>
                  {tone?.label || reply.tone}
                </span>
                <span className="text-xs text-surface-500">{tone?.description}</span>
              </div>
              <p className="text-sm text-surface-200 leading-relaxed pl-6">
                {reply.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Approve button */}
      {!isResolved && (
        <div className="mt-3 flex gap-2">
          <button
            className="btn-success flex-1 justify-center"
            onClick={handleApprove}
            disabled={!selectedReplyId || approving}
            id={`approve-btn-${reviewId}`}
          >
            {approving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check size={16} />
                Approve Selected Reply
              </>
            )}
          </button>
        </div>
      )}

      {isResolved && approvedReply && (
        <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1.5">
          <Check size={14} />
          Approved reply: {toneConfig[approvedReply.tone as keyof typeof toneConfig]?.label}
        </div>
      )}
    </div>
  );
}
