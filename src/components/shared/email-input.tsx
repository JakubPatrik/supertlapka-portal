'use client';

import { Input } from '@/components/ui/input';
import { EMAIL_SUGGESTED_DOMAINS } from '@/config/email.config';
import { Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface EmailInputProps {
  onSubmit?: (email: string) => void;
  initialValue?: string;
  disabled?: boolean;
}

export interface EmailInputHandle {
  submit: () => void;
}

export const EmailInput = forwardRef<EmailInputHandle, EmailInputProps>(function EmailInput(
  { initialValue, onSubmit, disabled },
  ref,
) {
  const t = useTranslations();

  const [email, setEmail] = useState(initialValue ?? '');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const suggestEmails = (val: string): string[] => {
    const [host, domain] = val.split('@');
    if (!host) return [];
    if (domain) return [val];
    return EMAIL_SUGGESTED_DOMAINS.map((d) => `${host}@${d}`);
  };

  const emailSuggestions = suggestEmails(email);
  const showEmailSuggestions = focused && emailSuggestions.length > 1;

  const handleFieldBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 300);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setError(t('email_error_empty'));
      return;
    }
    if (!isValid) {
      setError(t('email_error_invalid'));
      return;
    }
    onSubmit?.(email.trim());
  };

  useImperativeHandle(ref, () => ({ submit: handleSubmit }));

  useEffect(() => {
    import('@/lib/analytics').then((analytics) => {
      analytics.trackCustomEvent('email_screen_view');
    });
  }, []);

  return (
    <>
      <div className="relative">
        <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id="email"
          type="email"
          required
          value={email}
          className="h-12 pl-9 text-base"
          onChange={(e) => {
            setEmail(e.target?.value ?? '');
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          onFocus={() => {
            clearTimeout(blurTimer.current ?? undefined);
            setFocused(true);
          }}
          onBlur={handleFieldBlur}
          placeholder={t('email_placeholder')}
          disabled={disabled}
          autoComplete="email"
        />
        {showEmailSuggestions && (
          <div className="bg-background absolute top-14 right-0 left-0 z-50 rounded-sm shadow-md">
            <ul className="max-h-52 w-full space-y-4 overflow-auto p-3">
              {emailSuggestions.map((e) => (
                <li key={e} className="cursor-pointer text-sm" role="button" onClick={() => setEmail(e)}>
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <motion.p
          className="text-destructive mt-1 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </>
  );
});
