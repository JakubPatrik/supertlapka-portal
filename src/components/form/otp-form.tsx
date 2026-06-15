'use client';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { verifyOtp } from '@/lib/actions/auth';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EmailInput } from '../shared/email-input';

interface OtpFormProps {
  email: string;
}

export function OtpForm({ email }: OtpFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showResendHelper, setShowResendHelper] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowResendHelper(true), 30_000);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (token.length < 8) return;
    setError(null);
    setIsPending(true);
    try {
      await verifyOtp(email, token);
      router.push('/portal');
    } catch (err: unknown) {
      setError((err as Error).message ?? t('verify_otp_error'));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl">
          <Image src="/images/logo.png" alt="SuperTlapka" width={64} height={64} priority />
        </div>
        <h1 className="text-foreground text-3xl">Super Tlapka</h1>
        <p className="text-muted-foreground text-sm">{t('verify_subtitle_otp')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          {/* <Label htmlFor="email">{t('email_label')}</Label> */}
          <EmailInput initialValue={email} disabled={true} />
        </div>

        <div className="space-y-1.5">
          {/* <Label>{t('verify_otp_label')}</Label> */}
          <InputOTP
            maxLength={8}
            value={token}
            onChange={(val) => {
              setToken(val);
              setError(null);
              if (val.length > 0) setShowResendHelper(false);
            }}
            pattern={REGEXP_ONLY_DIGITS}
            disabled={isPending}
            containerClassName="w-full"
          >
            <InputOTPGroup className="w-full gap-2">
              <InputOTPSlot index={0} className="flex-1" />
              <InputOTPSlot index={1} className="flex-1" />
              <InputOTPSlot index={2} className="flex-1" />
              <InputOTPSlot index={3} className="flex-1" />
              <InputOTPSlot index={4} className="flex-1" />
              <InputOTPSlot index={5} className="flex-1" />
              <InputOTPSlot index={6} className="flex-1" />
              <InputOTPSlot index={7} className="flex-1" />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <motion.p
              className="text-destructive mt-1 text-left text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>

        {showResendHelper && (
          <motion.p
            className="text-muted-foreground text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('verify_resend_label')}{' '}
            <Link
              href={`/?email=${encodeURIComponent(email)}`}
              className="underline underline-offset-4"
            >
              {t('verify_resend_link')}
            </Link>
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Button
            type="submit"
            disabled={isPending || token.length < 8}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle className="size-4" />
            )}
            {isPending ? t('email_loading') : t('verify_otp_submit')}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
