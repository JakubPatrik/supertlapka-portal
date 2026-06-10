'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { VideoPlayer } from '../shared/video-player';
import { CancelFooter } from './cancel-footer';

export function Step2() {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-5 pt-4">
      <VideoPlayer src="https://player.mediadelivery.net/embed/642777/b72ab1c8-b894-4bd3-92d5-6639a3d4f7df?autoplay=true&loop=false&muted=false&preload=true&responsive=true" />

      <div className="relative -z-2 border border-primary overflow-visible rounded-[40px] bg-[#FFF4D4] px-6 pt-2 mb-8">
        <div className="text-center mx-auto max-w-sm z-2">
          <h1 className="mt-2 text-4xl font-black leading-tight text-primary">
            {t('cancel_step2_offer_title')}
          </h1>
          <p className="mx-auto max-w-xs mt-5 pb-12 text-2xl font-bold">
            {t('cancel_step2_offer_subtitle')}
          </p>
          <div className="absolute top-22 -left-8 rotate-45 -z-1">
            <Image src="/icons/gift.png" alt="" width={80} height={40} aria-hidden />
          </div>
          <div className="absolute top-15 -left-6 z-10">
            <div className="h-44 w-6 bg-background border-r border-primary"></div>
          </div>
          <div className="absolute -bottom-12 left-8">
            <Image src="/icons/curved_arrow.svg" alt="" width={80} height={40} aria-hidden />
          </div>
        </div>

        <Image
          src="/images/dogs/dog-celebrating.png"
          alt=""
          width={110}
          height={110}
          className="absolute -z-1 top-24 -right-4 object-contain"
          aria-hidden
        />
      </div>

      <CancelFooter variant="step2" />
    </div>
  );
}
