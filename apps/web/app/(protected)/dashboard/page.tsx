"use client"

import {useState, useEffect} from 'react'
import DashboardCard from "@/components/layout/dashboard/DashboardCard";
import DashboardTable from "@/components/layout/dashboard/DashboardTable";
import Image from "next/image";
import {api} from "@/lib/api";
import { buildMonitorStats, MonitorFormat } from '@/lib/monitors';
import { PageStats } from '@/lib/monitors';


export default function Page() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [stats, setStats] = useState<PageStats>()
    const [monitorsArr, setMonitorsArr] = useState<MonitorFormat[]>([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/summary")
                const builtStats = buildMonitorStats(res.data.allMonitors)
                setStats(builtStats)
                setMonitorsArr(res.data.slowest_monitors)
            } catch (err){
                console.error(err);
                setError("Failed to load dashboard")
            } finally {
                setLoading(false)
            }
        }
        void fetchData()
    }, [])


        return (
            <div className={"overflow-y-auto no-scrollbar"}>
                <header className={"flex justify-between items-start w-full mt-0"}>
                    <div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            Dashboard Overview.
                        </h3>
                        <blockquote className="mt-6 border-l-2 pl-6 italic">
                            Get your insights
                        </blockquote>
                    </div>

                    <Image src={"/streetlights.png"} alt={"Streetlights"} width={48} height={12}/>
                </header>

                <div className="min-h-[400px]">
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
        <div className="text-white h-screen overflow-y-auto no-scrollbar md:flex md:flex-col justify-evenly">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <DashboardCard
                    name="Monitors Up"
                    number={stats.up}
                    total_monitors={stats.total}
                    color={"text-green-500"}
                />
                <DashboardCard
                    name="Monitors Down"
                    number={stats.down}
                    total_monitors={stats.total}
                    color={"text-red-500"}
                />
                <DashboardCard
                    name="Paused / Unknown"
                    number={stats.paused + stats.unknown}
                    total_monitors={stats.total}
                    color={"text-orange-400"}
                />
                <DashboardCard
                    name="Average Latency"
                    number={stats.avg_latency}
                    total_monitors={300}
                    color={stats.avg_latency>300?"text-red-500":"text-green-500"}
                />
            </div>
            <div
                className="bg-slate-600/50 rounded-3xl overflow-auto no-scrollbar glass-card glass-card-hover mt-5">
                <div className={"text-gray-300 font-extrabold text-xl text-center"}>
                    Monitors Status
                </div>
                <DashboardTable monitors={monitors}/>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            Loading dashboard...
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
        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="text-lg font-semibold">
                No monitors yet
            </div>
            <div className="text-sm text-gray-400">
                Add your first monitor to start tracking uptime.
            </div>
            <button className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition">
                Add Monitor
            </button>
        </div>
    )
}
