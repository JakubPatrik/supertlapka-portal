'use server';

import { getCustomerId } from '@/lib/actions/customer';
import { ALLOWED_SUBSCRIPTION_STATUSES, stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export type PortalInvoice = {
  id: string;
  status: 'paid' | 'failed' | 'upcoming';
  amount: number;
  currency: string;
  periodStart: number;
  periodEnd: number;
  collectAt: number | null;
  hostedInvoiceUrl: string | null;
};

function getInvoicePeriod(invoice: Stripe.Invoice): { start: number; end: number } {
  const periods = invoice.lines.data.map((line) => line.period);

  if (!periods.length) return { start: invoice.period_start, end: invoice.period_end };

  return {
    start: Math.min(...periods.map((p) => p.start)),
    end: Math.max(...periods.map((p) => p.end)),
  };
}

export async function getPortalInvoices(): Promise<PortalInvoice[]> {
  try {
    const customerId = await getCustomerId();
    const [invoices, subscriptions] = await Promise.all([
      stripe.invoices.list({ customer: customerId, limit: 100 }),
      stripe.subscriptions.list({ customer: customerId, limit: 10 }),
    ]);

    // Drafts (not finalized) and unattempted open invoices are excluded - history should
    // only ever show a settled outcome, paid or failed; "upcoming" comes from the preview below.
    const settled = invoices.data
      .filter(
        (invoice) =>
          invoice.status === 'paid' || invoice.status === 'uncollectible' || invoice.attempted,
      )
      .map((invoice) => {
        const period = getInvoicePeriod(invoice);
        const status: PortalInvoice['status'] = invoice.status === 'paid' ? 'paid' : 'failed';
        return {
          id: invoice.id,
          status,
          amount: invoice.status === 'paid' ? invoice.amount_paid : invoice.amount_due,
          currency: invoice.currency,
          periodStart: period.start,
          periodEnd: period.end,
          collectAt: null,
          hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
        };
      });

    // Stripe only creates an invoice object close to its due date, so a subscription's
    // next charge otherwise has no invoice to list - preview it instead per active sub.
    const settledPeriods = new Set(
      settled.map((invoice) => `${invoice.periodStart}-${invoice.periodEnd}`),
    );
    const activeSubscriptions = subscriptions.data.filter((sub) =>
      ALLOWED_SUBSCRIPTION_STATUSES.includes(sub.status),
    );
    const previews = await Promise.all(
      activeSubscriptions.map((sub) =>
        stripe.invoices.createPreview({ subscription: sub.id }).catch(() => null),
      ),
    );

    const planned: PortalInvoice[] = previews
      .filter((invoice): invoice is NonNullable<(typeof previews)[number]> => invoice !== null)
      .map((invoice) => {
        const period = getInvoicePeriod(invoice);
        return { invoice, period };
      })
      .filter(({ period }) => !settledPeriods.has(`${period.start}-${period.end}`))
      .map(({ invoice, period }) => ({
        id: invoice.id!,
        status: 'upcoming',
        amount: invoice.amount_due,
        currency: invoice.currency,
        periodStart: period.start,
        periodEnd: period.end,
        collectAt: invoice.next_payment_attempt ?? invoice.due_date,
        hostedInvoiceUrl: null,
      }));

    return [...settled, ...planned];
  } catch {
    return [];
  }
}
