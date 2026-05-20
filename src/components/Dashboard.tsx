'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquareText,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import type { Review, ReviewStatus } from '@/types';
import PlaceIdInput from './PlaceIdInput';
import ReviewCard from './ReviewCard';

type FilterTab = 'all' | ReviewStatus;

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      const res = await fetch(`/api/reviews${params}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Stats
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const resolvedCount = reviews.filter((r) => r.status === 'resolved').length;

  const filters: { key: FilterTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'all', label: 'All', icon: <MessageSquareText size={14} />, count: totalReviews },
    { key: 'pending', label: 'Pending', icon: <Clock size={14} />, count: pendingCount },
    { key: 'resolved', label: 'Resolved', icon: <CheckCircle2 size={14} />, count: resolvedCount },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center glow-primary">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">AI-Powered ORM</h1>
              <p className="text-xs text-surface-500">Review Management Dashboard</p>
            </div>
          </div>
          <button
            className="btn-ghost text-xs"
            onClick={fetchReviews}
            id="refresh-btn"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
              <MessageSquareText size={22} className="text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">{totalReviews}</p>
              <p className="text-xs text-surface-500">Total Reviews</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/15 flex items-center justify-center">
              <Clock size={22} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">{pendingCount}</p>
              <p className="text-xs text-surface-500">Pending</p>
            </div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-100">{resolvedCount}</p>
              <p className="text-xs text-surface-500">Resolved</p>
            </div>
          </div>
        </div>

        {/* Place ID Input */}
        <PlaceIdInput onFetchSuccess={fetchReviews} />

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  activeFilter === filter.key
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 border border-transparent'
                }
              `}
              onClick={() => setActiveFilter(filter.key)}
              id={`filter-${filter.key}`}
            >
              {filter.icon}
              {filter.label}
              {filter.count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === filter.key
                      ? 'bg-primary-500/30 text-primary-200'
                      : 'bg-surface-800 text-surface-500'
                  }`}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Review list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="shimmer w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <div className="shimmer w-32 h-4" />
                    <div className="shimmer w-20 h-3" />
                  </div>
                </div>
                <div className="shimmer w-full h-16" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Inbox size={48} className="mx-auto text-surface-600 mb-4" />
            <h3 className="text-lg font-semibold text-surface-300 mb-2">No reviews yet</h3>
            <p className="text-sm text-surface-500">
              Enter a Google Maps Place ID above and click &quot;Fetch Reviews&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onDataChange={fetchReviews} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-surface-600">
          AI-Powered ORM Dashboard · Built with Next.js, Supabase & OpenAI
        </div>
      </footer>
    </div>
  );
}
