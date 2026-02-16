import React from 'react';

type StatsCardProps = {
    title: string;
    value: string | number | null;
    icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
    return (
        <div className="glass-card glass-card-hover rounded-3xl p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-3xl border border-white/10">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-gray-300 text-sm mb-1">{title}</p>
                <p className="text-2xl font-semibold text-gray-200">{value}</p>
            </div>
        </div>
    );
}

export default StatsCard;