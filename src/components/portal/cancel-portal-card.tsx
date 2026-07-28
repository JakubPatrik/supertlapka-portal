'use client';

import { createCancelSubscriptionPortalSession } from '@/lib/actions/subscription';
import { UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { PortalCard } from './portal-card';

export function CancelPortalCard() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const url = await createCancelSubscriptionPortalSession();
      window.open(url, '_blank');
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
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
        icon={<UserMinus size={22} />}
        color="rust"
        title={t('portal_card_mentoring_title')}
        description={t('portal_card_mentoring_desc')}
        loading={loading}
      />
    </button>
  );
}
