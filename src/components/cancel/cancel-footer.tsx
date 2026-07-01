import { PawPrint } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

type CancelFooterProps = {
  variant: 'step0' | 'step1' | 'step2' | 'step3';
};

export function CancelFooter({ variant }: CancelFooterProps) {
  const t = useTranslations();

  return (
    <footer className="right-0 bottom-0 left-0 z-10 shrink-0 py-4">
      <style>{`
          @keyframes cta-glow {
            0% { box-shadow: 0 0 0 0 color-mix(in oklch, var(--primary) 50%, transparent); }
            100% { box-shadow: 0 0 0 10px color-mix(in oklch, var(--primary) 0%, transparent); }
          }
        `}</style>

      {(variant === 'step0' || variant === 'step1') && (
        <Button
          size="lg"
          className="w-full"
          asChild
          style={{ animation: 'cta-glow 2s ease-in-out infinite' }}
        >
          <Link href="/portal">
            <Image src="/icons/back_arrow.svg" alt="" width={40} height={14} aria-hidden />
            {t('cancel_keep')}
          </Link>
        </Button>
      )}

      {variant === 'step2' && (
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            asChild
            style={{ animation: 'cta-glow 2s ease-in-out infinite' }}
          >
            <Link
              href="/portal/cancel?step=loading&action=pause"
              onClick={() => {
                import('@/lib/analytics').then((analytics) => {
                  analytics.trackCustomEvent('offer_outcome', { value: 'accept' });
                });
              }}
            >
              <PawPrint className="size-6 -rotate-45 fill-white" />
              {t('cancel_step2_accept')}
            </Link>
          </Button>

          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link
              href="/portal/cancel?step=3"
              onClick={() => {
                import('@/lib/analytics').then((analytics) => {
                  analytics.trackCustomEvent('offer_outcome', { value: 'reject' });
                });
              }}
            >
              {t('cancel_step2_continue_cancel')}
            </Link>
          </Button>
        </div>
      )}

      {variant === 'step3' && (
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            asChild
            style={{ animation: 'cta-glow 2s ease-in-out infinite' }}
          >
            <Link
              href="/portal"
              onClick={() => {
                import('@/lib/analytics').then((analytics) => {
                  analytics.trackCustomEvent('cancel_outcome', { value: 'reject' });
                });
              }}
            >
              <Image src="/icons/back_arrow.svg" alt="" width={40} height={14} aria-hidden />
              {t('cancel_keep')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full" asChild>
            <Link
              href="/portal/cancel?step=loading&action=cancel"
              onClick={() => {
                import('@/lib/analytics').then((analytics) => {
                  analytics.trackCustomEvent('cancel_outcome', { value: 'accept' });
                });
              }}
            >
              {t('cancel_step3_final_cancel')}
            </Link>
          </Button>
        </div>
      )}
    </footer>
  );
}
