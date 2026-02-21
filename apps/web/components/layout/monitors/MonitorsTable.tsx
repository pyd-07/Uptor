"use client"
import { useState } from "react";
import MonitorCard from "@/components/layout/monitors/MonitorCard";
import { api } from "@/lib/api";
import { MonitorFormat } from "@/lib/monitors";
import {formatResponseStatusCode, formatTimestamp, formatResponseTimeColor} from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

function getErrorMessage(error: unknown, fallback: string) {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object" &&
        (error as { response?: { data?: unknown } }).response?.data &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
    ) {
        return (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;
    }
    return fallback;
}

function getStatusMeta(monitor: MonitorFormat) {
    const label = !monitor.is_active ? "INACTIVE" : monitor.last_status.toUpperCase();
    const tone = !monitor.is_active
        ? "border-slate-500/30 bg-slate-500/10 text-slate-200"
        : monitor.last_status === "up"
            ? "border-green-500/30 bg-green-500/10 text-green-300"
            : monitor.last_status === "down"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-orange-500/30 bg-orange-500/10 text-orange-300";

    return { label, tone };
}

export function MonitorsTable({ monitors, setMonitors }
    : { monitors: MonitorFormat[], setMonitors: React.Dispatch<React.SetStateAction<MonitorFormat[]>>}
 ) {
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function toggleActivity(id: string) {
    if (togglingId || deletingId) return;
    setTogglingId(id);
    try {
        await api.patch(`/monitors/${id}`)
        toast.success("Monitor activity toggled.")
        setMonitors((prev) =>
            prev.map((m) =>
            m._id === id ? { ...m, is_active: !m.is_active } : m
            )
        )
    } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Failed to toggle monitor."))
    } finally {
        setTogglingId(null);
    }
    }

    async function handleDelete(id: string) {
        if (togglingId || deletingId) return;
        setDeletingId(id);
        try {
            await api.delete(`/monitors/${id}`)
            toast.success("Monitor deleted successfully.")
            setMonitors((prev) =>
                prev.filter((m)=>m._id!==id)
        )
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to delete monitor."))
        } finally {
            setDeletingId(null);
        }
    }

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
                            <th className="px-6 py-4 text-left text-sm">Status Code</th>
                            <th className="px-6 py-4 text-left text-sm">Response Time</th>
                            <th className="px-6 py-4 text-left text-sm">Last Checked</th>
                            <th className="px-6 py-4 text-left text-sm">Interval</th>
                            <th className="px-6 py-4 text-left text-sm">Timeout</th>
                            <th className="px-6 py-4 text-left text-sm">Activity</th>
                            <th className={"px-6 py-4 text-right text-sm"}></th>
                        </tr>
                        </thead>

                        <tbody>
                        {monitors.map((monitor) => {
                            const status = getStatusMeta(monitor);
                            const isToggling = togglingId === monitor._id;
                            const isDeleting = deletingId === monitor._id;

                            return (
                                <tr
                                    key={monitor._id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors glass-card-hover"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-300">
                                            {monitor.name}
                                        </div>
                                        <a
                                            href={monitor.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-muted-foreground truncate max-w-[300px] hover:underline underline-offset-4 flex items-center"
                                        >
                                            {monitor.url}
                                            <ExternalLink className="size-3.5 shrink-0" />
                                        </a>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${status.tone}`}>
                                            {status.label}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 text-left text-sm ${formatResponseStatusCode(monitor.status_code)}`}>
                                        {monitor.status_code ? monitor.status_code : "—"}
                                    </td>

                                    <td className={`px-6 py-4 text-left text-sm ${formatResponseTimeColor(monitor.response_time_ms, monitor.is_active)}`}>
                                        {monitor.response_time_ms ? `${monitor.response_time_ms} ms` : "-"}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {formatTimestamp(monitor.last_checked_at || "-")}
                                    </td>

                                    <td className={`px-6 py-4 text-left text-sm`}>
                                        {monitor.interval_sec ? `${monitor.interval_sec} sec` : "-"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {monitor.timeout_ms ? `${monitor.timeout_ms} ms` : "-"}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        <button
                                            type={"button"}
                                            onClick={()=>toggleActivity(monitor._id)}
                                            disabled={togglingId === monitor._id}
                                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-3xl border border-white/15 bg-slate-800/70 px-2 py-1 text-white transition hover:bg-slate-700/80 disabled:cursor-not-allowed disabled:opacity-60" >

                                            {isToggling ? "Updating..." : monitor.is_active ? "Pause" : "Resume"}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-white hover:bg-slate-800/50">
                                        <button
                                            onClick={()=>handleDelete(monitor._id)}
                                            disabled={deletingId === monitor._id}
                                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-3xl border border-red-500/30 bg-red-500/15 px-2 py-1 text-red-200 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"

                                        >
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
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
                    <MonitorCard
                        key={monitor._id}
                        monitor={monitor}
                        onToggleActivity={() => toggleActivity(monitor._id)}
                        onDelete={() => handleDelete(monitor._id)}
                        isToggling={togglingId === monitor._id}
                        isDeleting={deletingId === monitor._id}
                    />
                ))}
                
            </div>
        </>
    );
}
