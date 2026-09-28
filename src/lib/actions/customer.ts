'use server';

import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

export async function getCustomerId(): Promise<string> {
  const t = await getTranslations();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error(t('verify_no_subscription'));

  const { data } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (data?.stripe_customer_id) return data.stripe_customer_id;

  // fallback to direct Stripe API call if supabase does not have the record
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  if (!customers.data.length) throw new Error(t('verify_no_subscription'));

  return customers.data[0].id;
}
