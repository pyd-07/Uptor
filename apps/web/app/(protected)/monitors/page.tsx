"use client"

import {useEffect, useState, useMemo} from 'react'
import Image from "next/image";
import Link from 'next/link';
import { Activity, Plus } from 'lucide-react';
import MonitorStatusGrid from "@/components/layout/monitors/MonitorStatusGrid";
import {MonitorsTable} from "@/components/layout/monitors/MonitorsTable";
import {api} from "@/lib/api";
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
                console.log(res.data)
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

            <div className="min-h-[400px] overflow-y-auto no-scrollbar">
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

function LoadingState() {
    return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            Loading Monitors...
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