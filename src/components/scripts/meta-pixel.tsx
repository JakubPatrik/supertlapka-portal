'use client';

import * as pixel from '@/lib/fpixel';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { Suspense, useEffect, useState } from 'react';

const MetaPixelComponent = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;
    pixel.pageview();
  }, [pathname, loaded]);

  return (
    <Script id="pixel" strategy="afterInteractive" onLoad={() => setLoaded(true)}>
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixel.FB_PIXEL_ID}');
fbq('track', 'PageView');`}
    </Script>
  );
};

const MetaPixel = () => {
  if (process.env.NODE_ENV === 'development') return null;

  return (
    <Suspense fallback={null}>
      <MetaPixelComponent />
    </Suspense>
  );
};

export default MetaPixel;
