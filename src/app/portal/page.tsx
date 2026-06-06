import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

export default async function PortalPage() {
  const t = await getTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="bg-background flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-foreground text-3xl">{t('portal_welcome')}</h1>
        <div className="bg-muted rounded-xl p-4">
          <p className="text-muted-foreground mb-1 text-xs">{t('portal_user_id_label')}</p>
          <p className="text-foreground font-mono text-sm break-all">{user?.id}</p>
        </div>
      </div>
    </main>
  );
}
