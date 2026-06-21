'use client';

import { purchaseUpsellSubscription } from '@/lib/actions/subscription';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { PortalCard } from './portal-card';

export function PurchaseUpsellPortalCard() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const result = await purchaseUpsellSubscription();
      if (result.type === 'success') {
        toast.success(t('portal_card_add_mentoring_success'));
        router.refresh();
      } else {
        window.location.href = result.url;
      }
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
        icon={<PlusCircle size={22} />}
        color="green"
        title={t('portal_card_add_mentoring_title')}
        description={t('portal_card_add_mentoring_desc')}
        loading={loading}
      />
    </button>
  );
}
