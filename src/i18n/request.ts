import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const APP_LOCALES = ['cs', 'sk'] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export default getRequestConfig(async () => {
  const jar = await cookies();
  const raw = jar.get('NEXT_LOCALE')?.value;
  const locale: AppLocale = (APP_LOCALES as readonly string[]).includes(raw ?? '')
    ? (raw as AppLocale)
    : 'cs';
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
