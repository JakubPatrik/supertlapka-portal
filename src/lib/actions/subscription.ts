'use server';

import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';

async function getCustomerId(): Promise<string> {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

async function getActiveSubscription() {
  const t = await getTranslations();
  const customerId = await getCustomerId();

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

async function getReturnUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}/portal`;
}

export async function createBillingPortalSession(): Promise<string> {
  const customerId = await getCustomerId();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: await getReturnUrl(),
    flow_data: { type: 'payment_method_update' },
  });
  return session.url;
}

export async function createCancelSubscriptionPortalSession(): Promise<string> {
  const subscription = await getActiveSubscription();
  const customerId = subscription.customer as string;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: await getReturnUrl(),
    flow_data: {
      type: 'subscription_cancel',
      subscription_cancel: { subscription: subscription.id },
    },
  });
  return session.url;
}
