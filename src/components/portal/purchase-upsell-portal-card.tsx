'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { purchaseUpsellSubscription } from '@/lib/actions/subscription';
import { PlusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { PortalCard } from './portal-card';

export function PurchaseUpsellPortalCard() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePurchase() {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
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
      </AlertDialogTrigger>

      <AlertDialogContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <AlertDialogTitle>{t('portal_upsell_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('portal_upsell_confirm_desc')}</AlertDialogDescription>
            <p className="mt-8 text-muted-foreground text-[10px] leading-snug">
              {t.rich('portal_upsell_confirm_disclaimer', {
                email: (chunks) => (
                  <a href="mailto:podpora@supertlapka.cz" className="underline">
                    {chunks}
                  </a>
                ),
                terms: (chunks) => (
                  <a
                    href="https://supertlapka.cz/obchodni-podminky/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
          <Image
            src="/images/dogs/dog-happy.png"
            alt=""
            width={112}
            height={88}
            className="shrink-0 object-contain -mr-4"
            aria-hidden
          />
        </div>
        <AlertDialogFooter className="grid grid-cols-3 gap-4">
          <AlertDialogCancel className="w-full">
            {t('portal_upsell_confirm_cancel')}
          </AlertDialogCancel>
          <AlertDialogAction className="col-span-2 w-full" onClick={handlePurchase}>
            {t('portal_upsell_confirm_accept')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
