import { MonitorFormat } from "@/lib/monitors";

function MonitorCard({ monitor }: { monitor: MonitorFormat }) {
    return (
        <div className="glass-card glass-card-hover p-4 rounded-xl">
            <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-300 mb-1">{monitor.name}</div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <a href={monitor.url} className="truncate">{monitor.url}</a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                    <div className="text-gray-300 text-xs mb-1">Last Checked</div>
                    <div className="text-gray-400">{monitor.lastChecked}</div>
                </div>
                <div>
                    <div className="text-gray-300 text-xs mb-1">Response</div>
                    <div className={
                        monitor.status === 'up' ? 'text-green-400' :
                            monitor.status === 'down' ? 'text-red-400' :
                                'text-orange-400'
                    }>
                        {(monitor.responseTime? monitor.responseTime + "ms": "null")}
                    </div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs mb-1">Interval</div>
                    <div className="text-gray-300">{monitor.interval}</div>
                </div>
                <div>
                    <button className={"glass-card glass-card-hover rounded-lg w-full mb-1"}>
                        {monitor.is_active?"Active":"Paused"}
                    </button>
                    <button className={"bg-red-500/80 glass-card-hover rounded-lg w-full mt-2"}>
                        Delete
                    </button>
                </div>
            </div>

        </div>
    );
}

export default MonitorCard;