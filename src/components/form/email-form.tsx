'use client';

import { EmailInput, EmailInputHandle } from '@/components/shared/email-input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface EmailFormProps {
  onSubmit: (email: string) => Promise<{ error: string } | void>;
  initialEmail?: string;
}

export function EmailForm({ onSubmit, initialEmail }: EmailFormProps) {
  const t = useTranslations();
  const emailInputRef = useRef<EmailInputHandle>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(email: string) {
    setIsSaving(true);
    const result = await onSubmit(email);
    setIsSaving(false);
    if (result?.error) toast.error(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        {/* <Label htmlFor="email">{t('email_label')}</Label> */}
        <EmailInput
          ref={emailInputRef}
          onSubmit={handleSubmit}
          disabled={isSaving}
          initialValue={initialEmail}
        />
        <motion.div
          className="mx-auto mt-8 flex w-full max-w-[500px] items-start gap-3 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image
            src="/icons/privacy_icon.svg"
            alt=""
            width={24}
            height={24}
            className="size-5 shrink-0 text-[#9E9E9E] opacity-50"
          />
          <p className="text-muted-foreground/80 text-xs leading-relaxed">{t('email_privacy')}</p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Button
          disabled={isSaving}
          className="h-12 w-full rounded-xl text-base font-semibold"
          onClick={() => emailInputRef.current?.submit()}
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {isSaving ? t('email_loading') : t('login_submit')}
        </Button>
      </motion.div>
    </div>
  );
}
