'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-surface-950 to-[#0a0f1e] text-surface-100">
      <div className="glass-card max-w-md w-full p-8 text-center border-red-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
            <AlertTriangle size={32} />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-surface-50">
              Something went wrong
            </h1>
            <p className="text-sm text-surface-400">
              An unexpected error occurred in the ORM dashboard. We've logged this issue.
            </p>
          </div>

          {/* Error detail */}
          <div className="p-3 bg-surface-900/50 rounded-xl border border-surface-800 text-left">
            <p className="text-[11px] font-mono text-red-300 break-all leading-tight">
              {error.message || 'Unknown error'}
            </p>
            {error.digest && (
              <p className="text-[9px] font-mono text-surface-500 mt-1">
                ID: {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="btn-primary flex-1 justify-center whitespace-nowrap bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 focus:ring-red-500/50"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              Try again
            </button>
            <a
              href="/"
              className="btn-ghost flex-1 justify-center border-surface-800 hover:bg-surface-800/80 text-surface-300 hover:text-white"
            >
              <Home size={14} />
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
