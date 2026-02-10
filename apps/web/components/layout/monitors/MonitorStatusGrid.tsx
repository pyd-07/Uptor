import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import StatsCard from "@/components/layout/monitors/MonitorStatusCard";

type stats = {
    total: string | number;
    up: string | number;
    down: string | number;
    latency: number | null;
}

export default function StatsGrid({stat}: {stat:stats}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
                title="Total Monitors"
                value={stat.total}
                icon={<Activity className="w-5 h-5 text-orange-400" />}
            />
            <StatsCard
                title="Up"
                value={stat.up}
                icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
            />
            <StatsCard
                title="Down"
                value={stat.down}
                icon={<XCircle className="w-5 h-5 text-destructive" />}
            />
            <StatsCard
                title="Avg Latency (combined)"
                value={stat.latency}
                icon={<Clock className="w-5 h-5 text-blue-400" />}
            />
        </div>
    );
}
