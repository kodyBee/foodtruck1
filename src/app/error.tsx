'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-400 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-white/5 backdrop-blur-sm border-2 border-yellow-500 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
