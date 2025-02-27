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
    // Log the error to an error reporting service
    console.error('Admin section error:', error);
  }, [error]);

  return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong!</h2>
        <p className="text-red-600 mb-4">
          {error.message || 'An unexpected error occurred in the admin section.'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
