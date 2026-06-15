'use client';

import { resumeUpsellSubscription } from '@/lib/actions/subscription';
import { PlayCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { PortalCard } from './portal-card';

export function ResumeMentoringPortalCard() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      await resumeUpsellSubscription();
      toast.success(t('portal_card_resume_mentoring_success'));
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full cursor-pointer text-left disabled:opacity-60"
      disabled={loading}
    >
      <PortalCard
        icon={<PlayCircle size={22} />}
        color="yellow"
        title={t('portal_card_resume_mentoring_title')}
        description={t('portal_card_resume_mentoring_desc')}
        loading={loading}
      />
    </button>
  );
}
