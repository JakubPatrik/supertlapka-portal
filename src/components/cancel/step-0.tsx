'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { VideoPlayer } from '../shared/video-player';
import { CancelFooter } from './cancel-footer';

export function Step0({ goToStep }: { goToStep: (s: number) => void }) {
  const t = useTranslations();
  const reasons = [
    t('cancel_step0_reason_price'),
    t('cancel_step0_reason_results'),
    t('cancel_step0_reason_learned'),
    t('cancel_step0_reason_tech'),
  ];

  return (
    <div className="flex flex-col gap-3 pt-4">
      <VideoPlayer src="https://player.mediadelivery.net/embed/642777/b72ab1c8-b894-4bd3-92d5-6639a3d4f7df?autoplay=true&loop=false&muted=false&preload=true&responsive=true" />

      <div className="text-center">
        <h1 className="text-2xl font-black">
          {t('cancel_step0_title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('cancel_step0_subtitle')}
        </p>
      </div>

      <div className="relative mx-auto -mb-16 -z-1">
        <Image
          src="/images/dogs/dog-crying.png"
          alt=""
          width={240}
          height={180}
          className="object-contain"
          aria-hidden
        />
        <div className="absolute -right-16 top-4 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-[3px] border-red-500 bg-white/80">
          <p className="whitespace-pre-line text-center text-xs font-bold leading-tight text-red-500">
            {t('cancel_step0_stamp')}
          </p>
        </div>
      </div>

      <div className="bg-muted rounded-lg px-4 flex flex-col divide-y divide-border">
        {reasons.map((reason, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <p className="flex-1 text-sm text-gray-800">{reason}</p>
            <Button
              onClick={() => goToStep(1)}
              variant="outline" size="sm"
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
