'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { VideoPlayer } from '../shared/video-player';
import { CancelFooter } from './cancel-footer';

export function Step0({ goToStep }: { goToStep: (s: number, reason?: number) => void }) {
  const t = useTranslations();
  const reasons = [
    { key: 'price', label: t('cancel_step0_reason_price') },
    { key: 'results', label: t('cancel_step0_reason_results') },
    { key: 'learned', label: t('cancel_step0_reason_learned') },
    { key: 'tech', label: t('cancel_step0_reason_tech') },
  ];

  return (
    <div className="flex flex-col gap-3 pt-4">
      <VideoPlayer src="https://player.mediadelivery.net/embed/642777/df2093eb-b2eb-4132-907c-c6289241ac91?autoplay=true&loop=false&muted=false&preload=true&responsive=true" />

      <div className="text-center">
        <h1 className="text-2xl font-black">{t('cancel_step0_title')}</h1>
        <p className="text-muted-foreground text-sm">{t('cancel_step0_subtitle')}</p>
      </div>

      <div className="relative -z-1 mx-auto -mb-16">
        <Image
          src="/images/dogs/dog-crying.png"
          alt=""
          width={240}
          height={180}
          className="object-contain"
          aria-hidden
        />
        <div className="absolute top-4 -right-16 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-[3px] border-red-500 bg-white/80">
          <p className="text-center text-xs leading-tight font-bold whitespace-pre-line text-red-500">
            {t('cancel_step0_stamp')}
          </p>
        </div>
      </div>

      <div className="bg-muted divide-border flex flex-col divide-y rounded-lg px-4">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <p className="flex-1 text-sm text-gray-800">{reason.label}</p>
            <Button
              onClick={() => {
                import('@/lib/analytics').then((analytics) => {
                  analytics.trackCustomEvent('cancellation_reason', { value: reason.key });
                });
                goToStep(1, i);
              }}
              variant="outline"
              size="sm"
            >
              {t('cancel_continue')}
            </Button>
          </div>
        ))}
      </div>

      <CancelFooter variant="step0" />
    </div>
  );
}
