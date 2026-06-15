'use client';

import { createBillingPortalSession } from '@/lib/actions/subscription';
import { Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { PortalCard } from './portal-card';

export function BillingPortalCard() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const url = await createBillingPortalSession();
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
        icon={<Receipt size={22} />}
        color="blue"
        title={t('portal_card_billing_title')}
        description={t('portal_card_billing_desc')}
        loading={loading}
      />
    </button>
  );
}
