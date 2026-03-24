"use client"

import {useEffect, useState, useMemo} from 'react'
import Image from "next/image";
import LoadingState from '@/components/statecards/LoadingState';
import EmptyState from '@/components/statecards/EmptyState';
import ErrorState from '@/components/statecards/ErrorState';
import MonitorStatusGrid from "@/components/layout/monitors/MonitorStatusGrid";
import { MonitorsTable } from "@/components/layout/monitors/MonitorsTable";
import { api } from "@/lib/api";
import { buildMonitorStats, MonitorFormat } from '@/lib/monitors';
import { PageStats } from '@/lib/monitors';


export default function MonitorPage() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [monitors, setMonitors] = useState<MonitorFormat[]>([])
    const stats = useMemo(() => {
       return buildMonitorStats(monitors)
    }, [monitors])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await api.get(
                    "/monitors",
                )
                setMonitors(res.data)
            } catch {
                setError("Failed to load monitors.")
            } finally {
                setLoading(false)
            }
        }
        void fetchData()
        const intervalId = setInterval(fetchData, 60*1000)
        return () => clearInterval(intervalId)
    }, []);

    return (
        <>
            <header className={"flex justify-between items-start w-full mt-0"}>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Monitors
                    </h3>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        Track uptime & latency of your endpoints
                    </blockquote>
                </div>

                <Image src={"/streetlights.png"} alt={"Streetlights"} width={48} height={12}/>
            </header>

            <div className="min-h-[420px] overflow-y-auto no-scrollbar py-6">
                {loading && <LoadingState />}
                {error && <ErrorState message={error} />}
                {!loading && !error && stats?.total === 0 && <EmptyState />}
                {!loading && !error && stats && stats.total > 0 && (
                    <MonitorsContent stats={stats} monitors={monitors} setMonitors={setMonitors}/>
                )}
            </div>
        </>
    )
}

function MonitorsContent(
        {stats, monitors, setMonitors}: 
        {stats: PageStats, monitors: MonitorFormat[], setMonitors: React.Dispatch<React.SetStateAction<MonitorFormat[]>>}
    ) {

    return (
        <div className={"overflow-y-auto no-scrollbar pt-6 transition-opacity duration-300"}>
            <div className={""}>
                <MonitorStatusGrid stats={stats} />
            </div>

            <div className={"bg-slate-900 rounded-3xl overflow-y-auto no-scrollbar"}>
                <MonitorsTable monitors={monitors} setMonitors={setMonitors} />
            </div>
        </div>
    )
}

