import Script from 'next/script';

export const HyrosScript = () => {
  if (process.env.NODE_ENV === 'development') return null;

  return (
    <Script id="hyros" strategy="afterInteractive">
      {`var head = document.head;
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://t.supertlapka.cz/v1/lst/universal-script?ph=c4437e57193f26c82c04548003a14b838b19a59437bd53cae026c97c4b717c6b&tag=!clicked&spa=true&ref_url=" + encodeURI(document.URL) ;
head.appendChild(script);`}
    </Script>
  );
};
