import React from 'react'

type DashboardCardProps = {
    name: string;
    number: string | number;
    total_monitors: string | number;
    color: string;
};

export default function DashboardCard({ name, number, total_monitors, color }: DashboardCardProps) {

    return (
        <div className="w-full min-h-[220px] bg-slate-700/50 rounded-3xl p-5 glass-card glass-card-hover flex flex-col justify-between">

            {/* Top Section */}
            <div className="flex flex-col justify-between py-4 gap-6">
                <div className="text-white/60 text-xl">{name}</div>

                <div className={`text-5xl font-semibold ${color}`}>
                    {number}
                </div>

            </div>

            <div className="bg-slate-600/40 rounded-3xl p-4 flex items-center justify-between border border-white/10">
                <div className="text-white text-sm font-medium">
                    Out of {total_monitors}
                </div>
            </div>
        </div>
    );
}
