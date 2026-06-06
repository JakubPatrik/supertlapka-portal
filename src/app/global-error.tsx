'use client';

import { trackException } from '@/lib/analytics';
import { Figtree, Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const STRINGS = {
  cs: {
    heading: 'Kritická chyba systému',
    description:
      'Omlouváme se, ale došlo k neočekávané chybě, která vyžaduje restartování aplikace.',
    button: 'Restartovat aplikaci',
  },
  sk: {
    heading: 'Kritická chyba systému',
    description:
      'Ospravedlňujeme sa, ale došlo k neočakávanej chybe, ktorá vyžaduje reštartovanie aplikácie.',
    button: 'Reštartovať aplikáciu',
  },
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700'],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale] = useState<'cs' | 'sk'>(() => {
    if (typeof document === 'undefined') return 'cs';
    const match = document.cookie.match(/(?:^|;)\s*NEXT_LOCALE=([^;]+)/);
    return match?.[1] === 'sk' ? 'sk' : 'cs';
  });

  useEffect(() => {
    trackException(error, {
      digest: error.digest,
      component: 'GlobalRootErrorBoundary',
    });
    console.error('Root error boundary caught:', error);
  }, [error]);

  const s = STRINGS[locale];

  return (
    <html lang="cs" className={`${inter.variable} ${figtree.variable}`}>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="max-w-md rounded-2xl border p-8 shadow-sm">
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

            <h1 className="text-foreground mb-2 text-2xl font-bold">{s.heading}</h1>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">{s.description}</p>

            <button
              onClick={() => reset()}
              className="bg-primary text-primary-foreground w-full rounded-xl py-4 font-bold transition-all active:scale-[0.98]"
            >
              {s.button}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
