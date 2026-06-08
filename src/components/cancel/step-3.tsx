'use client';

import { Dog, Headphones, Heart, NotepadText, PawPrint, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { CancelFooter } from './cancel-footer';

export function Step3() {
  const t = useTranslations();

  const features = [
    { icon: <NotepadText className="h-6 w-6 text-white" />, iconBg: 'bg-blue-500', label: t('cancel_step3_item_plan') },
    { icon: <PawPrint className="h-6 w-6 text-white fill-white" />, iconBg: 'bg-amber-400', label: t('cancel_step3_item_socialization') },
    { icon: <Heart className="h-6 w-6 text-white fill-white" />, iconBg: 'bg-purple-500', label: t('cancel_step3_item_stress') },
    { icon: <Dog className="h-6 w-6 text-white fill-white" />, iconBg: 'bg-green-500', label: t('cancel_step3_item_community') },
    { icon: <Headphones className="h-6 w-6 text-white fill-white" />, iconBg: 'bg-teal-400', label: t('cancel_step3_item_meetings') },
    { icon: <Sparkles className="h-6 w-6 text-white fill-white" />, iconBg: 'bg-pink-500', label: t('cancel_step3_item_contests') },
  ];

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-center text-3xl font-black">
        {t('cancel_step3_title')}
      </h1>

      <div className="flex justify-center -mb-4">
        <Image
          src="/images/dogs/dog-sad.png"
          alt=""
          width={200}
          height={180}
          className="object-contain"
          aria-hidden
        />
      </div>

      <div className="flex flex-col gap-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl bg-bakcground border px-4 py-3">
            <div className={`${f.iconBg} flex h-10 w-10 shrink-0 items-center justify-center rounded-full`}>
              {f.icon}
            </div>
            <p className="text-sm font-bold leading-snug text-gray-900">{f.label}</p>
          </div>
        ))}
      </div>

      <CancelFooter variant="step3" />
    </div>
  );
}
