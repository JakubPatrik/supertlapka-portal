import { BillingPortalCard } from '@/components/portal/billing-portal-card';
import { CancelPortalCard } from '@/components/portal/cancel-portal-card';
import { PurchaseUpsellPortalCard } from '@/components/portal/purchase-upsell-portal-card';
import { PortalCard } from '@/components/portal/portal-card';
import { ResumeMentoringPortalCard } from '@/components/portal/resume-mentoring-portal-card';
import { ResumePortalCard } from '@/components/portal/resume-portal-card';
import { NavHeader } from '@/components/shared/nav-header';
import {
  getPortalSubscriptions,
  resumeCancelledSubscription,
  resumeSubscription,
} from '@/lib/actions/subscription';
import { createClient } from '@/lib/supabase/server';
import { Ban } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function PortalPage() {
  const supabase = await createClient();
  const [
    t,
    subscriptions,
    {
      data: { user },
    },
  ] = await Promise.all([getTranslations(), getPortalSubscriptions(), supabase.auth.getUser()]);

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader />

      <main className="relative mx-auto max-w-md flex-1">
        <section className="bg-muted relative mt-8 min-h-[220px] rounded-lg px-6 pt-8 pb-0">
          <div className="max-w-[55%]">
            {user?.email && (
              <p className="mb-2 text-xs text-gray-500">
                {t('portal_logged_in_as', { email: user.email })}
              </p>
            )}
            <h1 className="text-4xl leading-tight font-bold text-black">{t('portal_title')}</h1>
            <p className="mt-3 text-sm leading-snug text-gray-600">{t('portal_subtitle')}</p>
          </div>
          <Image
            src="/images/dogs/dog-happy.png"
            alt=""
            width={190}
            height={250}
            className="absolute -top-8 right-0 object-contain object-bottom"
            priority
            aria-hidden
          />
        </section>

        <section className="space-y-3 px-4 py-6">
          <BillingPortalCard />
          {subscriptions.upsell?.canReactivate || subscriptions.upsell?.canResume ? (
            <ResumeMentoringPortalCard />
          ) : subscriptions.upsell?.canCancel ? (
            <CancelPortalCard />
          ) : (
            <PurchaseUpsellPortalCard />
          )}
          {subscriptions.regular?.canResume ? (
            <ResumePortalCard
              action={resumeSubscription}
              titleKey="portal_card_resume_title"
              descKey="portal_card_resume_desc"
              successKey="portal_card_resume_success"
            />
          ) : subscriptions.regular?.canReactivate ? (
            <ResumePortalCard
              action={resumeCancelledSubscription}
              titleKey="portal_card_resume_cancelled_title"
              descKey="portal_card_resume_cancelled_desc"
              successKey="portal_card_resume_cancelled_success"
            />
          ) : (
            <PortalCard
              icon={<Ban size={22} />}
              color="gray"
              title={t('portal_card_cancel_title')}
              description={t('portal_card_cancel_desc')}
              href="/portal/cancel"
            />
          )}
        </section>

        <div className="pointer-events-none fixed -right-8 -bottom-16 z-[-1]">
          <Image src="/images/paw.png" alt="" width={200} height={200} aria-hidden />
        </div>
      </main>
    </div>
  );
}
