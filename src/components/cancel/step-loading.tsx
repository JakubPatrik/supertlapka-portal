'use client';

import { cancelSubscription, pauseSubscription } from '@/lib/actions/subscription';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type State = 'loading' | 'success' | 'error';

type StepLoadingProps = {
  action: 'pause' | 'cancel';
};

export function StepLoading({ action }: StepLoadingProps) {
  const t = useTranslations();
  const router = useRouter();
  const [state, setState] = useState<State>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const run = async () => {
      try {
        if (action === 'pause') {
          await pauseSubscription();
        } else {
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

  useEffect(() => {
    if (state !== 'success') return;
    const timer = setTimeout(() => router.replace('/portal'), 2000);
    return () => clearTimeout(timer);
  }, [state, router]);

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
        </>
      )}

      {state === 'error' && (
        <>
          <XCircle className="text-destructive size-16" />
          <h2 className="text-2xl font-black">{t('cancel_error_title')}</h2>
          <p className="text-muted-foreground text-base">{errorMsg || t('cancel_error_text')}</p>
        </>
      )}
    </div>
  );
}
