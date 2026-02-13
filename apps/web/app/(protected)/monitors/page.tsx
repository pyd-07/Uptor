"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import MonitorStatusGrid from "@/components/layout/monitors/MonitorStatusGrid";
import {MonitorsTable} from "@/components/layout/monitors/MonitorsTable";
import {api} from "@/lib/api";
import { MonitorFormat } from '@/lib/monitors';
import { MonitorPageStats } from '@/lib/monitors';


export default function MonitorPage() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [stats, setStats] = useState<MonitorPageStats>()
    const [monitors, setMonitors] = useState<MonitorFormat[]>([])

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await api.get(
                    "/monitors",
                )
                setStats(res.data.stats)
                setMonitors((res.data.monitors))
            } catch {
                setError("Failed to load monitors.")
            } finally {
                setLoading(false)
            }
        }
        void fetchData()
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

            <div className="min-h-[400px]">
                {loading && <LoadingState />}
                {error && <ErrorState message={error} />}
                {!loading && !error && stats?.total === 0 && <EmptyState />}
                {!loading && !error && stats && stats.total > 0 && (
                    <MonitorsContent stats={stats} monitors={monitors} />
                )}
            </div>
        </>
    )
}

function MonitorsContent({stats, monitors}: {stats: MonitorPageStats, monitors: MonitorFormat[]}) {

    return (
        <div className={"overflow-y-auto no-scrollbar pt-6 transition-opacity duration-300"}>
            <div className={""}>
                <MonitorStatusGrid stats={stats} />
            </div>

            <div className={"bg-slate-900 rounded-3xl overflow-y-auto no-scrollbar"}>
                <MonitorsTable monitors={monitors} />
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