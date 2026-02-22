import React from 'react'
import { LucideIcon } from 'lucide-react';

type DashboardCardProps = {
    name: string;
    number: string | number;
    subtitle: string;
    color: string;
    icon: LucideIcon;
    progressTotal?: number;
    suffix?: string;
};

export default function DashboardCard({
    name,
    number,
    subtitle,
    color,
    icon: Icon,
    progressTotal,
    suffix,
}: DashboardCardProps) {

    const numericValue = typeof number === 'number' ? number : Number(number)
    const hasProgress = Number.isFinite(numericValue) && !!progressTotal && progressTotal > 0
    const progress = hasProgress ? Math.min(100, Math.round((numericValue / progressTotal) * 100)) : null
    const displayValue = typeof number === 'number' ? number.toLocaleString() : number

    return (
        <article className="w-full min-h-[210px] rounded-3xl px-5 py-4 glass-card glass-card-hover flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
                <div className="text-white/70 text-sm tracking-wide uppercase">
                    {name}
                </div>
                <div className={`inline-flex items-center justify-center size-9 rounded-3xl border border-white/10 ${color}`}>
                    <Icon className="size-4" />
                </div>
            </div>

            <div className="flex-1 flex items-center py-4">
                <div className={`text-4xl sm:text-5xl font-semibold ${color}`}>
                    {displayValue}{suffix ? ` ${suffix}` : ''}
                </div>
            </div>

            <div className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                    <span>{subtitle}</span>
                    {progress !== null && <span>{progress}%</span>}
                </div>
                {progress !== null && (
                    <div className="h-1.5 rounded-full bg-slate-600/70 overflow-hidden">
                        <div className={`h-full rounded-full bg-current ${color}`} style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>
        </article>
    );
}
