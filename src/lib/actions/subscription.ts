'use server';

import { ALLOWED_SUBSCRIPTION_STATUSES, stripe, type StripeCustomer } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { unlockSkoolUpsell } from '../services/skool.service';
import { promoteToPremium } from '../services/smartemailing.service';

async function getCustomerId(): Promise<string> {
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

async function getSubscriptions(productId?: string) {
  const customerId = await getCustomerId();
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
  return subscriptions.data.filter(
    (s) =>
      ALLOWED_SUBSCRIPTION_STATUSES.includes(s.status) &&
      (!productId || s.items.data.some((item) => item.price.product === productId)),
  );
}

type SubState = {
  canReactivate: boolean;
  canResume: boolean;
  canCancel: boolean;
} | null;

function resolveSubState(
  sub: Awaited<ReturnType<typeof stripe.subscriptions.list>>['data'][number] | undefined,
): SubState {
  if (!sub) return null;
  const isPaused = sub.pause_collection !== null;
  const isScheduledToCancel = sub.cancel_at_period_end || !!sub.cancel_at;
  return {
    canReactivate: isScheduledToCancel && !isPaused,
    canResume: isPaused,
    canCancel: !isScheduledToCancel && !isPaused,
  };
}

export async function getPortalSubscriptions(): Promise<{ regular: SubState; upsell: SubState }> {
  try {
    const customerId = await getCustomerId();
    const { data } = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
    const active = data.filter((s) => ALLOWED_SUBSCRIPTION_STATUSES.includes(s.status));
    const regular = active.find((s) =>
      s.items.data.some((i) => i.price.product === process.env.STRIPE_PRODUCT_REGULAR),
    );
    const upsell = active.find((s) =>
      s.items.data.some((i) => i.price.product === process.env.STRIPE_PRODUCT_UPSELL),
    );
    return { regular: resolveSubState(regular), upsell: resolveSubState(upsell) };
  } catch {
    return { regular: null, upsell: null };
  }
}

export async function pauseSubscription(): Promise<void> {
  const t = await getTranslations();
  const subs = await getSubscriptions(process.env.STRIPE_PRODUCT_REGULAR);
  const active = subs.find((s) => !s.pause_collection);
  if (!active) throw new Error(t('verify_no_subscription'));
  await stripe.subscriptions.update(active.id, {
    pause_collection: {
      behavior: 'void',
      resumes_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    },
  });
}

async function terminateSubscription(
  sub: Awaited<ReturnType<typeof stripe.subscriptions.list>>['data'][number],
): Promise<void> {
  const scheduleId = sub.schedule
    ? typeof sub.schedule === 'string'
      ? sub.schedule
      : sub.schedule.id
    : undefined;

  // Past-due subs already failed to pay for the current period, so there's nothing left
  // to let run out - cancel immediately instead of waiting for the period end.
  if (sub.status === 'past_due') {
    if (scheduleId) {
      await stripe.subscriptionSchedules.cancel(scheduleId);
    } else {
      await stripe.subscriptions.cancel(sub.id);
    }
    return;
  }

  if (scheduleId) {
    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
    const now = Math.floor(Date.now() / 1000);
    const currentPhase =
      schedule.phases.find((p) => p.start_date <= now && (!p.end_date || p.end_date > now)) ??
      schedule.phases[schedule.phases.length - 1];
    await stripe.subscriptionSchedules.update(scheduleId, {
      end_behavior: 'cancel',
      phases: [
        {
          items: currentPhase.items.map((item) => ({
            price: typeof item.price === 'string' ? item.price : item.price.id,
            quantity: item.quantity ?? 1,
          })),
          start_date: currentPhase.start_date,
          end_date: sub.items.data[0].current_period_end,
        },
      ],
    });
  } else {
    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
  }
}

async function undoCancelAtPeriodEnd(
  sub: Awaited<ReturnType<typeof stripe.subscriptions.list>>['data'][number],
): Promise<void> {
  if (sub.schedule) {
    const scheduleId = typeof sub.schedule === 'string' ? sub.schedule : sub.schedule.id;
    await stripe.subscriptionSchedules.release(scheduleId);
    return;
  }
  const updates: Parameters<typeof stripe.subscriptions.update>[1] = {};
  if (sub.cancel_at_period_end) {
    updates.cancel_at_period_end = false;
  } else if (sub.cancel_at) {
    updates.cancel_at = '';
  }
  if (Object.keys(updates).length) {
    await stripe.subscriptions.update(sub.id, updates);
  }
}

export async function cancelSubscription(): Promise<void> {
  const t = await getTranslations();
  const subs = await getSubscriptions(process.env.STRIPE_PRODUCT_REGULAR);
  const active = subs.find((s) => !s.pause_collection);
  if (!active) throw new Error(t('verify_no_subscription'));
  await terminateSubscription(active);
}

export async function resumeSubscription(): Promise<void> {
  const t = await getTranslations();
  const subs = await getSubscriptions(process.env.STRIPE_PRODUCT_REGULAR);
  const paused = subs.find((s) => s.pause_collection !== null);
  if (!paused) throw new Error(t('verify_no_subscription'));
  await stripe.subscriptions.update(paused.id, { pause_collection: '' });
}

export async function resumeCancelledSubscription(): Promise<void> {
  const t = await getTranslations();
  const subs = await getSubscriptions(process.env.STRIPE_PRODUCT_REGULAR);
  const cancelled = subs.find((s) => s.cancel_at_period_end || !!s.cancel_at);
  if (!cancelled) throw new Error(t('verify_no_subscription'));
  await undoCancelAtPeriodEnd(cancelled);
}

export async function resumeUpsellSubscription(): Promise<void> {
  const t = await getTranslations();
  const customerId = await getCustomerId();
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
  const resumable = subscriptions.data.find(
    (s) =>
      ALLOWED_SUBSCRIPTION_STATUSES.includes(s.status) &&
      (s.cancel_at_period_end || !!s.cancel_at || s.pause_collection !== null) &&
      s.items.data.some((item) => item.price.product === process.env.STRIPE_PRODUCT_UPSELL),
  );
  if (!resumable) throw new Error(t('verify_no_mentoring'));
  if (resumable.cancel_at_period_end || resumable.cancel_at) {
    await undoCancelAtPeriodEnd(resumable);
  }
  if (resumable.pause_collection) {
    await stripe.subscriptions.update(resumable.id, { pause_collection: '' });
  }
}

export async function purchaseUpsellSubscription(): Promise<
  { type: 'success' } | { type: 'checkout'; url: string }
> {
  const customerId = await getCustomerId();

  const subs = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
  const regular = subs.data.find((s) =>
    s.items.data.some((i) => i.price.product === process.env.STRIPE_PRODUCT_REGULAR),
  );
  const currency = regular?.currency;

  try {
    const customer = (await stripe.customers.retrieve(customerId)) as StripeCustomer;
    let paymentMethodId = customer.invoice_settings?.default_payment_method as string | undefined;
    if (!paymentMethodId) {
      paymentMethodId = customer.default_source as string | undefined;
    }
    if (!paymentMethodId) {
      const methods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
        limit: 1,
      });
      paymentMethodId = methods.data[0]?.id;
    }
    if (paymentMethodId) {
      await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: process.env.STRIPE_PRICE_UPSELL_FULL }],
        default_payment_method: paymentMethodId,
        ...(currency ? { currency } : {}),
      });

      // Fire-and-forget:
      const email = customer.email;
      if (email) {
        // Promote to Premium in SmartEmailing
        promoteToPremium(email).catch((err) =>
          console.error('[SmartEmailing] Failed to promote to Premium:', err),
        );

        // Unlock Skool Upsell
        unlockSkoolUpsell(email).catch((err) =>
          console.error('[Skool] Failed to unlock upsell:', err),
        );
      }

      return { type: 'success' };
    }
  } catch (err) {
    console.error(
      '[purchaseUpsellSubscription] auto-purchase failed, falling back to checkout:',
      err,
    );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_UPSELL_FULL, quantity: 1 }],
    ...(currency ? { currency } : {}),
    success_url: await getReturnUrl(),
    cancel_url: await getReturnUrl(),
  });
  return { type: 'checkout', url: session.url! };
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

export async function cancelUpsellSubscription(): Promise<void> {
  const t = await getTranslations();
  const customerId = await getCustomerId();
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
  const mentoring = subscriptions.data.find(
    (s) =>
      ALLOWED_SUBSCRIPTION_STATUSES.includes(s.status) &&
      !s.cancel_at_period_end &&
      s.items.data.some((item) => item.price.product === process.env.STRIPE_PRODUCT_UPSELL),
  );
  if (!mentoring) throw new Error(t('verify_no_mentoring'));
  await terminateSubscription(mentoring);
}

export async function createCancelSubscriptionPortalSession(): Promise<string> {
  const t = await getTranslations();
  const customerId = await getCustomerId();

  const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
  const mentoring = subscriptions.data.find(
    (s) =>
      ALLOWED_SUBSCRIPTION_STATUSES.includes(s.status) &&
      !s.cancel_at_period_end &&
      s.items.data.some((item) => item.price.product === process.env.STRIPE_PRODUCT_UPSELL),
  );
  if (!mentoring) throw new Error(t('verify_no_mentoring'));

  // If managed by a schedule, or past_due (cancel immediately, not via the portal's
  // period-end flow), cancel directly via the API instead of the billing portal.
  if (mentoring.schedule || mentoring.status === 'past_due') {
    await terminateSubscription(mentoring);
    return await getReturnUrl();
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: await getReturnUrl(),
      flow_data: {
        type: 'subscription_cancel',
        subscription_cancel: { subscription: mentoring.id },
      },
    });
    return session.url;
  } catch {
    throw new Error(t('verify_no_mentoring'));
  }
}
