'use client';

import { useState } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface PlaceIdInputProps {
  onFetchSuccess: () => void;
}

export default function PlaceIdInput({ onFetchSuccess }: PlaceIdInputProps) {
  const [placeId, setPlaceId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!placeId.trim()) {
      toast.error('Please enter a Place ID');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ place_id: placeId.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Fetched ${data.data.length} reviews successfully!`);
        setPlaceId('');
        onFetchSuccess();
      } else {
        toast.error(data.error || 'Failed to fetch reviews');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <MapPin size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-100">Fetch Reviews</h2>
          <p className="text-sm text-surface-400">Enter a Google Maps Place ID to fetch reviews</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            disabled={loading}
            id="place-id-input"
          />
        </div>
        <button
          className="btn-primary whitespace-nowrap"
          onClick={handleFetch}
          disabled={loading || !placeId.trim()}
          id="fetch-reviews-btn"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Search size={16} />
              Fetch Reviews
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-surface-500 mt-3">
        💡 Find Place IDs at{' '}
        <a
          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 underline"
        >
          Google Place ID Finder
        </a>
        {' '}· If no Google API key is set, sample data will be used.
      </p>
    </div>
  );
}
