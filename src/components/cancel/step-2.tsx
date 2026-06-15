'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { VideoPlayer } from '../shared/video-player';
import { CancelFooter } from './cancel-footer';

const REASON_VIDEOS: Record<number, string> = {
  0: 'https://player.mediadelivery.net/embed/642777/10cf8309-972a-4516-af07-3ffc2a5ec276?autoplay=true&loop=false&muted=false&preload=true&responsive=true',
  1: 'https://player.mediadelivery.net/embed/642777/dd682e3f-2cd0-4b45-898e-1082518ab84c?autoplay=true&loop=false&muted=false&preload=true&responsive=true',
  2: 'https://player.mediadelivery.net/embed/642777/d0484a83-987e-4228-829e-c9af64184c85?autoplay=true&loop=false&muted=false&preload=true&responsive=true',
  3: 'https://player.mediadelivery.net/embed/642777/55a310dd-8621-4f5e-9332-5fe4509f9b85?autoplay=true&loop=false&muted=false&preload=true&responsive=true',
};
const FALLBACK_VIDEO =
  'https://player.mediadelivery.net/embed/642777/b72ab1c8-b894-4bd3-92d5-6639a3d4f7df?autoplay=true&loop=false&muted=false&preload=true&responsive=true';

export function Step2({ reason }: { reason?: number }) {
  const t = useTranslations();
  const videoSrc =
    reason !== undefined ? (REASON_VIDEOS[reason] ?? FALLBACK_VIDEO) : FALLBACK_VIDEO;

  return (
    <div className="flex flex-col gap-5 pt-4">
      <VideoPlayer src={videoSrc} />

      <div className="border-primary relative -z-2 mb-8 overflow-visible rounded-[40px] border bg-[#FFF4D4] px-6 pt-2">
        <div className="z-2 mx-auto max-w-sm text-center">
          <h1 className="text-primary mt-2 text-4xl leading-tight font-black">
            {t('cancel_step2_offer_title')}
          </h1>
          <p className="mx-auto mt-5 max-w-xs pb-12 text-2xl font-bold">
            {t('cancel_step2_offer_subtitle')}
          </p>
          <div className="absolute top-22 -left-8 -z-1 rotate-45">
            <Image src="/icons/gift.png" alt="" width={80} height={40} aria-hidden />
          </div>
          <div className="absolute top-15 -left-6 z-10">
            <div className="bg-background border-primary h-44 w-6 border-r"></div>
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
          className="absolute top-24 -right-4 -z-1 object-contain"
          aria-hidden
        />
      </div>

      <CancelFooter variant="step2" />
    </div>
  );
}
