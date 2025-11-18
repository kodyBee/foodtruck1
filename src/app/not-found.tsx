'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-yellow-500 text-9xl font-bold mb-4">404</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Looks like this page took a wrong turn. Let&apos;s get you back on track.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/menu"
            className="px-8 py-3 bg-white/5 backdrop-blur-sm border-2 border-yellow-500 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
