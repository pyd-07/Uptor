import { MonitorFormat } from "@/lib/monitors";
import {formatTimestamp, formatResponseTimeColor, formatResponseStatusCode} from "@/lib/utils";
import { Activity, Clock3, ExternalLink, Timer } from "lucide-react";

type MonitorCardProps = {
    monitor: MonitorFormat;
    onToggleActivity: () => void;
    onDelete: () => void;
    isToggling?: boolean;
    isDeleting?: boolean;
}


function MonitorCard({ monitor, onToggleActivity, onDelete, isToggling = false, isDeleting = false }: MonitorCardProps) {
    const statusLabel = !monitor.is_active ? "PAUSED" : monitor.last_status.toUpperCase();
    const statusClass = !monitor.is_active
        ? "border-slate-500/30 bg-slate-500/10 text-slate-200"
        : monitor.last_status === "up"
            ? "border-green-500/30 bg-green-500/10 text-green-300"
            : monitor.last_status === "down"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-orange-500/30 bg-orange-500/10 text-orange-300";

    const isBusy = isToggling || isDeleting;

    return (
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white mb-1.5 truncate">{monitor.name}</div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-300 min-w-0">
                        <a
                            href={monitor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate underline-offset-4 hover:underline"
                            title={monitor.url}
                        >
                            {monitor.url}
                        </a>
                        <ExternalLink className="size-3.5 flex-shrink-0 text-slate-400" />
                    </div>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Clock3 className="size-3.5" /> Last Checked
                    </div>
                    <div className="text-slate-200">{formatTimestamp(monitor.last_checked_at)}</div>
                </div>
                <div>
                    <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Activity className="size-3.5" /> Response
                    </div>
                    <div className={`text-sm ${formatResponseTimeColor(monitor.response_time_ms, monitor.is_active)}`}>
                        {monitor.response_time_ms ? `${monitor.response_time_ms} ms` : "—"}
                    </div>
                </div>
                <div>
                    <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Activity className="size-3.5" /> Status Code
                    </div>
                    <div className={`text-sm ${formatResponseStatusCode(monitor.status_code)}`}>
                        {monitor.status_code ? `${monitor.status_code}` : "—"}
                    </div>
                </div>
                <div>
                    <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Timer className="size-3.5" /> Interval
                    </div>
                    <div className="text-slate-200">{(monitor.interval_sec)+" sec"}</div>
                </div>
                <div>
                    <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                        <Timer className="size-3.5" /> Timeout
                    </div>
                    <div className="text-slate-200">{(monitor.timeout_ms)+" ms"}</div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                    onClick={onToggleActivity}
                    disabled={isBusy}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 bg-slate-800/70 px-2.5 py-2 text-white transition hover:bg-slate-700/80 disabled:cursor-not-allowed disabled:opacity-60" >

                    {isToggling ? "Updating..." : monitor.is_active ? "Pause" : "Resume"}
                </button>
                <button
                    onClick={onDelete}
                    disabled={isBusy}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-2 text-red-200 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"

                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}

export default MonitorCard;
