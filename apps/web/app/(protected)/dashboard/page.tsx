"use client"

import {useState, useEffect} from 'react';
import DashboardCard from "@/components/layout/dashboard/DashboardCard";
import DashboardTable from "@/components/layout/dashboard/DashboardTable";
import {api} from "@/lib/api";
import { buildMonitorStats, MonitorFormat } from '@/lib/monitors';
import { PageStats } from '@/lib/monitors';
import {formatTimestamp} from "@/lib/utils";
import Link from 'next/link';
import { Activity, XCircle, Gauge, PauseCircle, Plus, RefreshCcw } from 'lucide-react';


export default function Page() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [stats, setStats] = useState<PageStats>()
    const [monitorsArr, setMonitorsArr] = useState<MonitorFormat[]>([])
    const [lastUpdated, setLastUpdated] = useState<string | null>(null)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/summary")
                const builtStats = buildMonitorStats(res.data)
                setStats(builtStats)
                setMonitorsArr(res.data)
                setLastUpdated(new Date().toISOString())
            } catch (err){
                console.error(err);
                setError("Failed to load dashboard")
            } finally {
                setLoading(false)
            }
        }
        void fetchData()
        const intervalId = setInterval(fetchData, 60*1000)
        return () => clearInterval(intervalId)
    }, [])


        return (
            <div className={"overflow-y-auto no-scrollbar pb-8 space-y-6"}>
                <header className={"flex flex-col gap-6 md:flex-row md:items-center md:justify-between"}>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                            Dashboard Overview
                        </h1>
                        <blockquote className="mt-6 border-l-2 pl-6 italic">
                            Monitor uptime, outages, and response latency for all endpoints from one place.
                        </blockquote>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                        {!loading && !error && stats && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                <span className="rounded-full bg-slate-700/70 px-3 py-1 text-xs text-slate-200 border border-white/10">
                                    {stats.total} Total
                                </span>
                                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-300 border border-green-400/20">
                                    {stats.up} Healthy
                                </span>
                                <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs text-red-300 border border-red-400/20">
                                    {stats.down} Down
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <RefreshCcw className="size-3.5" />
                            <span>
                                {lastUpdated ? `Updated ${formatTimestamp(lastUpdated)}` : 'Waiting for fresh data'}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="min-h-[420px]">
                    {loading && <LoadingState />}
                    {error && <ErrorState message={error} />}
                    {!loading && !error && stats?.total === 0 && <EmptyState />}
                    {!loading && !error && stats && stats.total > 0 && (
                        <DashboardContent stats={stats} monitors={monitorsArr} />
                    )}
                </div>

            </div>
        );
}


function DashboardContent({stats, monitors}: { stats: PageStats, monitors: MonitorFormat[] }) {

    return (
        <div className="text-white space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <DashboardCard
                    name="Monitors Up"
                    number={stats.up}
                    subtitle={`${stats.total} total monitors`}
                    color={"text-green-500"}
                    icon={Activity}
                    progressTotal={stats.total}
                />
                <DashboardCard
                    name="Monitors Down"
                    number={stats.down}
                    subtitle={`${stats.total} total monitors`}
                    color={"text-red-500"}
                    icon={XCircle}
                    progressTotal={stats.total}
                />
                <DashboardCard
                    name="Paused / Unknown"
                    number={stats.paused + stats.unknown}
                    subtitle="Paused + unknown monitors"
                    color={"text-orange-400"}
                    icon={PauseCircle}
                    progressTotal={stats.total}
                />
                <DashboardCard
                    name="Average Latency"
                    number={stats.avg_latency}
                    subtitle={stats.total > 0 ? `Across ${stats.total} monitored endpoints` : 'No latency data yet'}
                    color={stats.avg_latency>2000?"text-red-500":(stats.avg_latency>1000?"":"text-cyan-500")}
                    icon={Gauge}
                    suffix="ms"
                />
            </div>

            <div className="rounded-3xl overflow-hidden glass-card">
                <div className="border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className={"text-white font-semibold text-lg"}>
                            Monitors Status
                        </div>
                        <div className="text-xs sm:text-sm text-slate-300">
                            Live monitor statuses, endpoint response times, and recent checks.
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                        <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-green-300">
                            {stats.up}
                        </span>
                        <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-300">
                            {stats.down}
                        </span>
                    </div>
                </div>
                <DashboardTable monitors={monitors}/>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            Loading Dashboard...
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <div className="text-red-500 text-lg font-semibold">
                Something went wrong
            </div>
            <div className="text-sm text-gray-400">
                {message}
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-72 text-center space-y-4 px-6">
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-400/30">
                <Activity className="size-5 text-indigo-300" />
            </div>
            <div className="text-lg font-semibold text-white">
                No monitors yet
            </div>
            <div className="text-sm text-gray-400">
                Add your first monitor to start tracking uptime.
            </div>
            <Link
                href={'/monitors/new'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition"
            >
                <Plus className="size-4" />
                Add Monitor
            </Link>
        </div>
    )
}
