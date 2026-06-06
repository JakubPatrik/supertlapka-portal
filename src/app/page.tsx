'use client';

import { EmailInput } from '@/components/shared/email-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations();

  async function handleSubmit(email: string) {
    alert(email);
  }

  return (
    <main className="bg-background flex flex-1 items-center justify-center px-4 pt-[10%]">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl">
            <Image src="/images/logo.png" alt="SuperTlapka" width={64} height={64} priority />
          </div>
          <h1 className="text-foreground text-3xl">Super Tlapka</h1>
          <p className="text-muted-foreground text-sm">{t('welcome_subtitle')}</p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('email_label')}</Label>
            <EmailInput onSubmit={handleSubmit} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold">
              {t('login_submit')}
            </Button>
          </motion.div>
        </form>
      </div>
    </main>
  );
}
