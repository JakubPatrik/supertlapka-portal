import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

type CardColor = 'green' | 'yellow' | 'gray' | 'blue';

export function PortalCard({
  icon,
  color,
  title,
  description,
  href,
  loading,
  disabled,
}: {
  icon: React.ReactNode;
  color: CardColor;
  title: string;
  description: string;
  href?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const colorMap: Record<CardColor, { badge: string; chevron: string; border: string }> = {
    green: { badge: 'bg-green-500', chevron: 'text-green-500', border: 'border-green-500' },
    yellow: { badge: 'bg-yellow-400', chevron: 'text-yellow-400', border: 'border-yellow-400' },
    gray: { badge: 'bg-gray-300', chevron: 'text-gray-300', border: 'border-gray-400' },
    blue: { badge: 'bg-blue-500', chevron: 'text-blue-500', border: 'border-blue-500' },
  };
  const { badge, chevron, border } = colorMap[color];

  const content = (
    <div
      className={`flex items-center gap-4 rounded-2xl border ${border} px-4 py-4${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${badge} text-white`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-tight font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-gray-500">{description}</p>
      </div>
      {loading ? (
        <Loader2 className={`size-5 shrink-0 ${chevron} animate-spin`} />
      ) : (
        <ChevronRight className={`size-7 shrink-0 ${chevron}`} />
      )}
    </div>
  );

  if (href && !disabled) return <Link href={href}>{content}</Link>;
  return content;
}
