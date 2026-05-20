'use client';

import { ReviewStatus } from '@/types';

interface StatusBadgeProps {
  status: ReviewStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${status === 'pending' ? 'badge-pending' : 'badge-resolved'}`}>
      <span className="inline-flex items-center gap-1.5">
        <span
          className={`pulse-dot ${
            status === 'pending' ? 'bg-yellow-400' : 'bg-emerald-400'
          }`}
        />
        {status === 'pending' ? 'Pending' : 'Resolved'}
      </span>
    </span>
  );
}
