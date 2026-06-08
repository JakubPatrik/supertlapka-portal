'use client';

import { Dog, Heart, NotepadText, PawPrint } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CancelFooter } from './cancel-footer';

export function Step1({ goToStep }: { goToStep: (s: number) => void }) {
  const t = useTranslations();
  const features = [
    {
      label: t('cancel_step1_feature_plan'),
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-600',
      icon: <NotepadText className="h-7 w-7 text-white" />,
    },
    {
      label: t('cancel_step1_feature_progress'),
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-400',
      icon: <PawPrint className="h-7 w-7 text-white fill-white" />,
    },
    {
      label: t('cancel_step1_feature_community'),
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
      icon: <Dog className="h-7 w-7 text-white fill-white" />,
    },
    {
      label: t('cancel_step1_feature_support'),
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-600',
      icon: <Heart className="h-7 w-7 text-white fill-white" />,
    },
  ];

  return (
    <div className="flex flex-col gap-3 pt-4">
      <div className="text-center">
        <h1 className="text-3xl font-black">
          {t('cancel_step1_title')}
        </h1>
        <p className="text-base text-muted-foreground">
          {t('cancel_step1_subtitle')}
        </p>
      </div>

      <div className="h-full grid grid-cols-2 gap-3">
        {features.map((f, i) => (
          <button
            key={i}
            onClick={() => goToStep(2)}
            className={`${f.bg} flex flex-col items-center justify-center gap-4 rounded-3xl p-5 text-center cursor-pointer`}
          >
            <div className={`${f.iconBg} flex size-14 items-center justify-center rounded-full`}>
              {f.icon}
            </div>
            <p className="text-base font-bold leading-snug">{f.label}</p>
          </button>
        ))}
      </div>

      <CancelFooter variant="step1" />
    </div>
  );
}
