'use client';

import {
  cancelSubscription,
  getPortalSubscriptions,
  pauseSubscription,
} from '@/lib/actions/subscription';
import { AlertTriangle, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

type State = 'loading' | 'success' | 'error';

type StepLoadingProps = {
  action: 'pause' | 'cancel';
};

export function StepLoading({ action }: StepLoadingProps) {
  const t = useTranslations();
  const [state, setState] = useState<State>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [showMentoringNote, setShowMentoringNote] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const run = async () => {
      try {
        if (action === 'pause') {
          await pauseSubscription();
        } else {
          // Mentoring is a separate Stripe subscription that cancelSubscription() does not
          // touch, so warn about it - but only when it's actually still running.
          const subs = await getPortalSubscriptions();
          setShowMentoringNote(subs.upsell?.canCancel === true);
          await cancelSubscription();
        }
        setState('success');
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : t('cancel_error_text'));
        setState('error');
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      {state === 'loading' && (
        <>
          <Loader2 className="text-primary size-16 animate-spin" />
          <p className="text-muted-foreground text-lg font-semibold">
            {action === 'pause' ? t('cancel_loading_pause_text') : t('cancel_loading_cancel_text')}
          </p>
        </>
      )}

      {state === 'success' && (
        <>
          <CheckCircle className="size-16 text-green-500" />
          <h2 className="text-2xl font-black">{t('cancel_success_title')}</h2>
          <p className="text-muted-foreground text-base">
            {action === 'pause' ? t('cancel_success_pause_text') : t('cancel_success_cancel_text')}
          </p>

          {showMentoringNote && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left">
              <AlertTriangle className="size-5 shrink-0 text-amber-500" />
              <p className="text-sm leading-snug font-bold text-amber-900">
                {t('cancel_success_mentoring_note')}
              </p>
            </div>
          )}

          <Button size="lg" className="w-full" asChild>
            <Link href="/portal">{t('cancel_success_back_to_portal')}</Link>
          </Button>
        </>
      )}

      {state === 'error' && (
        <>
          <XCircle className="text-destructive size-16" />
          <h2 className="text-2xl font-black">{t('cancel_error_title')}</h2>
          <p className="text-muted-foreground text-base">{errorMsg || t('cancel_error_text')}</p>

          <Button size="lg" className="w-full" asChild>
            <Link href="/portal">{t('cancel_success_back_to_portal')}</Link>
          </Button>
        </>
      )}
    </div>
  );
}
