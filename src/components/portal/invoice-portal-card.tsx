import { type PortalInvoice } from '@/lib/actions/invoice';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { PDFIcon } from '../shared/pdf-icon';

const STATUS_STYLES: Record<PortalInvoice['status'], string> = {
  paid: 'border-green-500',
  failed: 'border-red-400',
  upcoming: 'border-amber-400',
};

export async function InvoicePortalCard({ invoices }: { invoices: PortalInvoice[] }) {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const groups = new Map<
    string,
    { periodStart: number; periodEnd: number; invoices: PortalInvoice[] }
  >();
  for (const invoice of invoices) {
    const key = `${invoice.periodStart}-${invoice.periodEnd}`;
    const group = groups.get(key);
    if (group) {
      group.invoices.push(invoice);
    } else {
      groups.set(key, {
        periodStart: invoice.periodStart,
        periodEnd: invoice.periodEnd,
        invoices: [invoice],
      });
    }
  }
  const sortedGroups = [...groups.values()].sort((a, b) => b.periodStart - a.periodStart);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">{t('portal_invoices_title')}</h2>
      {sortedGroups.map((group) => (
        <div key={`${group.periodStart}-${group.periodEnd}`} className="space-y-2">
          <p className="text-xs font-medium text-gray-500">
            {dateFormatter.format(new Date(group.periodStart * 1000))} –{' '}
            {dateFormatter.format(new Date(group.periodEnd * 1000))}
          </p>
          <div className="space-y-2">
            {group.invoices.map((invoice) => {
              const amount = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: invoice.currency,
              }).format(invoice.amount / 100);

              const statusLabel =
                invoice.status === 'paid'
                  ? t('portal_invoice_status_paid')
                  : invoice.status === 'failed'
                    ? t('portal_invoice_status_failed')
                    : invoice.collectAt
                      ? t('portal_invoice_status_upcoming', {
                          date: dateFormatter.format(new Date(invoice.collectAt * 1000)),
                        })
                      : t('portal_invoice_status_upcoming_pending');

              return (
                <div
                  key={invoice.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${STATUS_STYLES[invoice.status]}`}
                >
                  {invoice.status === 'paid' ? (
                    <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                  ) : invoice.status === 'failed' ? (
                    <XCircle className="size-5 shrink-0 text-red-500" />
                  ) : (
                    <Clock className="size-5 shrink-0 text-amber-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{amount}</p>
                    <p className="text-xs text-gray-500">{statusLabel}</p>
                  </div>
                  {invoice.hostedInvoiceUrl && (
                    <a
                      href={invoice.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1 text-gray-400 hover:text-gray-600"
                    >
                      <span className="mt-px text-sm font-medium">{t('portal_invoice_view')}</span>
                      <PDFIcon className="size-5" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
