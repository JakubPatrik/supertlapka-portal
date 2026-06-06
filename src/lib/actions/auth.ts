'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { getTranslations } from 'next-intl/server';

export async function sendOtp(email: string): Promise<void> {
  const t = await getTranslations();

  const customers = await stripe.customers.list({ email, limit: 1 });
  if (!customers.data.length) {
    throw new Error(t('verify_no_subscription'));
  }

  const customerId = customers.data[0].id;
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 5 });
  const hasActive = subscriptions.data.some((s) => s.status === 'active');
  if (!hasActive) {
    throw new Error(t('verify_no_subscription'));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(email: string, token: string): Promise<void> {
  const t = await getTranslations();
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw new Error(t('verify_otp_error'));
}
