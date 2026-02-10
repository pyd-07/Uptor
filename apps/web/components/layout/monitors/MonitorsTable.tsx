import MonitorCard from "@/components/layout/monitors/MonitorCard";

type Monitor = {
    id: string;
    name: string;
    url: string;
    status: string;
    lastChecked: string;
    responseTime: number | null;
    interval: string;
    is_active: boolean;
};

export function MonitorsTable({ monitors }: { monitors: Monitor[] }) {

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-gray-400">
                        All Monitors
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-left text-sm">Monitor</th>
                            <th className="px-6 py-4 text-left text-sm">Status</th>
                            <th className="px-6 py-4 text-left text-sm">Last Checked</th>
                            <th className="px-6 py-4 text-left text-sm">Response Time</th>
                            <th className="px-6 py-4 text-left text-sm">Interval</th>
                            <th className="px-6 py-4 text-left text-sm">Activity</th>
                            <th className={"px-6 py-4 text-right text-sm"}></th>
                        </tr>
                        </thead>

                        <tbody>
                        {monitors.map((monitor) => (
                            <tr
                                key={monitor.id}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-300">
                                        {monitor.name}
                                    </div>
                                    <a href={monitor.url} className="text-sm text-muted-foreground truncate max-w-[300px]">
                                        {monitor.url}
                                    </a>
                                </td>

                                <td className="px-6 py-4">
                    <span
                        className={`text-sm font-medium ${
                            monitor.status === "up"
                                ? "text-green-400"
                                : monitor.status === "down"
                                    ? "text-red-400"
                                    : "text-orange-400"
                        }`}
                    >
                      {monitor.status.toUpperCase()}
                    </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {monitor.lastChecked}
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    {(monitor.responseTime? monitor.responseTime+" ms" : "null").toUpperCase()}
                                </td>

                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {monitor.interval}
                                </td>

                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    <button className={"glass-card glass-card-hover rounded-lg w-full"}>
                                        {monitor.is_active?"Active":"Paused"}
                                    </button>
                                </td>

                                <td className="px-6 py-4 glass-card-hover text-sm text-white">
                                    <button className={"bg-red-500/80 glass-card-hover rounded-lg w-full px-1"}>
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
                <div className="glass-card rounded-xl px-4 py-3">
                    <h2 className="text-lg font-semibold text-white">
                        All Monitors
                    </h2>
                </div>

                {monitors.map((monitor) => (
                    <MonitorCard key={monitor.id} monitor={monitor} />
                ))}
            </div>
        </>
    );
}
