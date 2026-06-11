import { BillingPortalCard } from '@/components/portal/billing-portal-card';
import { CancelPortalCard } from '@/components/portal/cancel-portal-card';
import { PortalCard } from '@/components/portal/portal-card';
import { ResumeMentoringPortalCard } from '@/components/portal/resume-mentoring-portal-card';
import { ResumePortalCard } from '@/components/portal/resume-portal-card';
import { NavHeader } from '@/components/shared/nav-header';
import { getPortalSubscriptions, resumeCancelledSubscription, resumeSubscription } from '@/lib/actions/subscription';
import { Ban } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export default async function PortalPage() {
  const [t, subscriptions] = await Promise.all([
    getTranslations(),
    getPortalSubscriptions(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader />

      <main className="flex-1 mx-auto max-w-md relative">
        <section className="relative bg-muted rounded-lg px-6 pb-0 pt-8 mt-8 min-h-[220px]">
          <div className="max-w-[55%]">
            <h1 className="text-4xl font-bold leading-tight text-black">
              {t('portal_title')}
            </h1>
            <p className="mt-3 text-sm text-gray-600 leading-snug">
              {t('portal_subtitle')}
            </p>
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
          {(subscriptions.upsell?.canReactivate || subscriptions.upsell?.canResume)
            ? <ResumeMentoringPortalCard />
            : <CancelPortalCard />}
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

        <div className="pointer-events-none fixed -bottom-16 -right-8 z-[-1]">
          <Image
            src="/images/paw.png"
            alt=""
            width={200}
            height={200}
            aria-hidden
          />
        </div>
      </main>
    </div>
  );
}
