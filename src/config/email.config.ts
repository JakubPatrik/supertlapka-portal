import type { AppLocale } from '@/i18n/request';

/**
 * These domains show the suggested email variations
 * as user types into the email field, localized per market.
 */
export const EMAIL_SUGGESTED_DOMAINS: Record<AppLocale, string[]> = {
  cs: ['gmail.com', 'seznam.cz', 'email.cz', 'centrum.cz'],
  sk: ['gmail.com', 'azet.sk', 'centrum.sk', 'zoznam.sk'],
};
