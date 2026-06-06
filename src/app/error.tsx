'use client';

import { trackException } from '@/lib/analytics';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to PostHog
    trackException(error, {
      digest: error.digest,
      component: 'GlobalErrorBoundary',
    });
    console.error('Client-side error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-md">
        {/* Simple error illustration or icon can be added here */}
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-foreground mb-2 text-2xl font-bold">Něco se pokazilo</h1>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">
          Omlouváme se, ale při načítání stránky došlo k chybě. Naši technici již byli upozorněni.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground w-full rounded-xl py-4 font-bold transition-all active:scale-[0.98]"
          >
            Zkusit znovu
          </button>

          <Link
            href="/"
            className="bg-muted text-foreground w-full rounded-xl py-4 font-semibold transition-all hover:bg-[#efefef]"
          >
            Zpět na úvod
          </Link>
        </div>
      </div>
    </div>
  );
}
