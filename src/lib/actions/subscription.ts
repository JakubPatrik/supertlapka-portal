'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { getTranslations } from 'next-intl/server';

async function getActiveSubscription() {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) throw new Error(t('verify_no_subscription'));

  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  if (!customers.data.length) throw new Error(t('verify_no_subscription'));

  const customerId = customers.data[0].id;
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 5 });
  const active = subscriptions.data.find((s) => s.status === 'active');
  if (!active) throw new Error(t('verify_no_subscription'));

  return active;
}

export async function pauseSubscription(): Promise<void> {
  const subscription = await getActiveSubscription();
  await stripe.subscriptions.update(subscription.id, {
    pause_collection: {
      behavior: 'void',
      resumes_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    },
  });
}

export async function cancelSubscription(): Promise<void> {
  const subscription = await getActiveSubscription();
  await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: true,
  });
}
