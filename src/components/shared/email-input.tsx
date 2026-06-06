'use client';

import { Input } from '@/components/ui/input';
import { EMAIL_SUGGESTED_DOMAINS } from '@/config/email.config';
import * as analytics from '@/lib/analytics';
import { identifyUser } from '@/lib/services/posthog.service';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface EmailInputProps {
  onSubmit: (email: string) => Promise<void>;
}

export function EmailInput({ onSubmit }: EmailInputProps) {
  const t = useTranslations();

  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const suggestEmails = (value: string): string[] => {
    const [host, domain] = value.split('@');
    if (!host) return [];

    // user already typed some domain
    if (domain) return [value];
    return EMAIL_SUGGESTED_DOMAINS.map((d) => `${host}@${d}`);
  };

  const emailSuggestions = suggestEmails(email);
  const showEmailSuggestions = focused && emailSuggestions.length > 1;
  const isValid = validateEmail(email);

  const handleFieldBlur = () => {
    // delay to allow suggestion click to register before hiding the list
    blurTimer.current = setTimeout(() => setFocused(false), 300);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError(t('email_error_empty'));
      return;
    }

    if (!isValid) {
      setError(t('email_error_invalid'));
      return;
    }

    identifyUser(email);
    analytics.trackEvent('Lead');

    try {
      setIsSaving(true);
      await onSubmit(email.trim());
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      setError(message ?? 'Unexpected error ocurred');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    analytics.trackCustomEvent('email_screen_view');
  }, []);

  return (
    <>
      {/* Email input */}
      <motion.div
        className="relative mb-3 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          id="email"
          type="email"
          required
          value={email}
          className="h-12 text-base"
          onChange={(e) => {
            const val = e.target?.value ?? '';
            setEmail(val);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid) handleSubmit();
          }}
          onFocus={() => {
            clearTimeout(blurTimer.current ?? undefined);
            setFocused(true);
          }}
          onBlur={handleFieldBlur}
          placeholder={t('email_placeholder')}
          disabled={isSaving}
          autoComplete="email"
        />
        {showEmailSuggestions && emailSuggestions.length > 1 && (
          <div className="bg-background absolute top-16 right-4 left-4 z-100 rounded-sm shadow-sm">
            <ul className="max-h-52 w-full space-y-4 overflow-auto p-3">
              {emailSuggestions.map((e) => (
                <li key={e} className="cursor-pointer" role="button" onClick={() => setEmail(e)}>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && (
          <motion.p
            className="mt-1 text-xs text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Privacy notice */}
      <motion.div
        className="mx-auto mt-4 flex w-full max-w-[500px] items-start gap-3 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Image
          src="/icons/privacy_icon.svg"
          alt=""
          width={24}
          height={24}
          className="size-5 shrink-0 text-[#9E9E9E] opacity-50"
        />
        <p className="text-muted-foreground/80 text-xs leading-relaxed">{t('email_privacy')}</p>
      </motion.div>
    </>
  );
}
