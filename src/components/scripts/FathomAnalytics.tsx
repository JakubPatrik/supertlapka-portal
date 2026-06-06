'use client';

import { load, trackPageview } from 'fathom-client';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect } from 'react';

const FATHOM_ID = process.env.NEXT_PUBLIC_FATHOM_ID;

function FathomComponent() {
  const pathname = usePathname();

  useEffect(() => {
    if (!FATHOM_ID) return;
    load(FATHOM_ID, { auto: false });
  }, []);

  useEffect(() => {
    if (!pathname) return;

    trackPageview({
      url: pathname,
      referrer: document.referrer,
    });
  }, [pathname]);

  return null;
}

const FathomAnalytics = () => {
  if (process.env.NODE_ENV === 'development') return null;

  return (
    <Suspense fallback={null}>
      <FathomComponent />
    </Suspense>
  );
};

export default FathomAnalytics;
