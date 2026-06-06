import { EmailForm } from '@/components/form/email-form';
import { sendOtp } from '@/lib/actions/auth';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const t = await getTranslations();

  async function handleSubmit(email: string): Promise<{ error: string } | void> {
    'use server';
    try {
      await sendOtp(email);
    } catch (err) {
      return { error: (err as Error).message };
    }
    redirect(`/verify?email=${encodeURIComponent(email)}`);
  }

  return (
    <main className="bg-background flex flex-1 items-center justify-center px-4 pt-24 sm:pt-[10%]">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl">
            <Image src="/images/logo.png" alt="SuperTlapka" width={64} height={64} priority />
          </div>
          <h1 className="text-foreground text-3xl">Super Tlapka</h1>
          <p className="text-muted-foreground text-sm">{t('welcome_subtitle')}</p>
        </div>

        <EmailForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
