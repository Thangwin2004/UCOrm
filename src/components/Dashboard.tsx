'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquareText,
  Clock,
  CheckCircle2,
  LayoutDashboard,
  RefreshCw,
  Inbox,
  Database,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Review, ReviewStatus } from '@/types';
import PlaceIdInput from './PlaceIdInput';
import ReviewCard from './ReviewCard';

type FilterTab = 'all' | ReviewStatus;

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [seeding, setSeeding] = useState(false);

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

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clear: true }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Sample data loaded!');
        fetchReviews();
      } else {
        toast.error(data.error || 'Failed to seed data');
      }
    } catch {
      toast.error('Failed to seed data');
    } finally {
      setSeeding(false);
    }
  };

  // Stats — always compute from all reviews (not filtered)
  const allReviews = reviews;
  const totalReviews = allReviews.length;
  const pendingCount = allReviews.filter((r) => r.status === 'pending').length;
  const resolvedCount = allReviews.filter((r) => r.status === 'resolved').length;
  const avgRating =
    totalReviews > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

  const filters: { key: FilterTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'all', label: 'All Reviews', icon: <MessageSquareText size={14} />, count: totalReviews },
    { key: 'pending', label: 'Pending', icon: <Clock size={14} />, count: pendingCount },
    { key: 'resolved', label: 'Resolved', icon: <CheckCircle2 size={14} />, count: resolvedCount },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center glow-primary">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold gradient-text">AI-Powered ORM</h1>
              <p className="text-[11px] sm:text-xs text-surface-500 hidden sm:block">
                Review Management Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost text-xs"
              onClick={handleSeedData}
              disabled={seeding}
              id="seed-data-btn"
              title="Load sample data for demo"
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
              <span className="hidden sm:inline">{seeding ? 'Loading...' : 'Demo Data'}</span>
            </button>
            <button
              className="btn-ghost text-xs"
              onClick={fetchReviews}
              id="refresh-btn"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
              <MessageSquareText size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-surface-100">{totalReviews}</p>
              <p className="text-[11px] sm:text-xs text-surface-500">Total Reviews</p>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-surface-100">{pendingCount}</p>
              <p className="text-[11px] sm:text-xs text-surface-500">Pending</p>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-surface-100">{resolvedCount}</p>
              <p className="text-[11px] sm:text-xs text-surface-500">Resolved</p>
            </div>
          </div>
          <div className="glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-xl">⭐</span>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-surface-100">{avgRating}</p>
              <p className="text-[11px] sm:text-xs text-surface-500">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Place ID Input */}
        <PlaceIdInput onFetchSuccess={fetchReviews} />

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`
                flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap
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
              <div key={i} className="glass-card p-5 space-y-3" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="shimmer w-10 h-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="shimmer w-32 h-4" />
                    <div className="shimmer w-20 h-3" />
                  </div>
                  <div className="shimmer w-20 h-6 rounded-full" />
                </div>
                <div className="shimmer w-full h-16" />
                <div className="shimmer w-40 h-9 rounded-xl" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-card p-8 sm:p-12 text-center">
            <Inbox size={48} className="mx-auto text-surface-600 mb-4" />
            <h3 className="text-lg font-semibold text-surface-300 mb-2">No reviews yet</h3>
            <p className="text-sm text-surface-500 mb-6 max-w-md mx-auto">
              Enter a Google Maps Place ID above and click &quot;Fetch Reviews&quot; to get started,
              or load sample data for a quick demo.
            </p>
            <button
              className="btn-primary mx-auto"
              onClick={handleSeedData}
              disabled={seeding}
            >
              {seeding ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Database size={16} />
                  Load Sample Data
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div key={review.id} style={{ animationDelay: `${idx * 80}ms` }}>
                <ReviewCard review={review} onDataChange={fetchReviews} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800/50 mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-surface-600">
          <span>AI-Powered ORM Dashboard &copy; {new Date().getFullYear()}</span>
          <span>Built with Next.js &middot; Supabase &middot; OpenAI &middot; Gemini</span>
        </div>
      </footer>
    </div>
  );
}
