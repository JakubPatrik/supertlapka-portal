import FathomAnalytics from '@/components/scripts/FathomAnalytics';
import MetaPixel from '@/components/scripts/MetaPixel';
import { Toaster } from '@/components/ui/sonner';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Baloo_Bhai_2, DynaPuff } from 'next/font/google';
import React from 'react';
import './globals.css';

const balooBhai2 = Baloo_Bhai_2({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-baloo',
  weight: ['400', '500', '600', '700', '800'],
});

const dynaPuff = DynaPuff({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dynapuff',
  weight: ['400', '500', '600', '700'],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t('layout_title'),
    description: t('layout_description'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${balooBhai2.variable} ${dynaPuff.variable}`}>
      <body className="font-baloo antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
        <MetaPixel />
        {/* TODO: enable later */}
        {/* <HyrosScript /> */}
        <FathomAnalytics />
        <VercelAnalytics />
      </body>
    </html>
  );
}
