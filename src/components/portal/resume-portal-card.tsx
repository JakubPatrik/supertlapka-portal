'use client';

import { PlayCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { PortalCard } from './portal-card';

export function ResumePortalCard({
  action,
  titleKey,
  descKey,
  successKey,
}: {
  action: () => Promise<void>;
  titleKey: string;
  descKey: string;
  successKey: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      await action();
      toast.success(t(successKey));
      router.refresh();
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
        icon={<PlayCircle size={22} />}
        color="green"
        title={t(titleKey)}
        description={t(descKey)}
        loading={loading}
      />
    </button>
  );
}
