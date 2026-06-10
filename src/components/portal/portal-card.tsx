import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

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
    const colorMap: Record<CardColor, { badge: string; chevron: string, border: string }> = {
        green: { badge: 'bg-green-500', chevron: 'text-green-500', border: 'border-green-500' },
        yellow: { badge: 'bg-yellow-400', chevron: 'text-yellow-400', border: 'border-yellow-400' },
        gray: { badge: 'bg-gray-300', chevron: 'text-gray-300', border: 'border-gray-400' },
        blue: { badge: 'bg-blue-500', chevron: 'text-blue-500', border: 'border-blue-500' },
    };
    const { badge, chevron, border } = colorMap[color];

    const content = (
        <div className={`flex items-center gap-4 rounded-2xl border ${border} px-4 py-4${disabled ? ' opacity-40 cursor-not-allowed' : ''}`}>
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${badge} text-white`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 leading-tight">{title}</p>
                <p className="mt-0.5 text-xs text-gray-500 leading-snug">{description}</p>
            </div>
            {loading
                ? <Loader2 className={`shrink-0 size-5 ${chevron} animate-spin`} />
                : <ChevronRight className={`shrink-0 size-7 ${chevron}`} />
            }
        </div>
    );

    if (href && !disabled) return <Link href={href}>{content}</Link>;
    return content;
}
