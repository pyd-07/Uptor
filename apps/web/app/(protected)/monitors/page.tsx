import React from 'react'
import Image from "next/image";
import MonitorStatusGrid from "@/components/layout/monitors/MonitorStatusGrid";
import {MonitorsTable} from "@/components/layout/monitors/MonitorsTable";

// Fetching Monitors

const monitors= [
    {
        id: '1',
        name: 'Main Website',
        url: 'https://uptor.com',
        status: 'up',
        lastChecked: '2 min ago',
        responseTime: 124,
        interval: '1 min',
        is_active: true
    },
    {
        id: '2',
        name: 'API Gateway',
        url: 'https://api.uptor.com',
        status: 'up',
        lastChecked: '1 min ago',
        responseTime: 89,
        interval: '1 min',
        is_active: false
    },
    {
        id: '3',
        name: 'Payment Service',
        url: 'https://payments.uptor.com/health',
        status: 'down',
        lastChecked: '30 sec ago',
        responseTime: null,
        interval: '30 sec',
        is_active: true
    },
    {
        id: '4',
        name: 'Auth Service',
        url: 'https://auth.uptor.com',
        status: 'up',
        lastChecked: '1 min ago',
        responseTime: 156,
        interval: '1 min',
        is_active: true
    },
    {
        id: '5',
        name: 'CDN Edge Node',
        url: 'https://cdn.uptor.com',
        status: 'up',
        lastChecked: '45 sec ago',
        responseTime: 67,
        interval: '1 min',
        is_active: true
    },
    {
        id: '6',
        name: 'Database Health',
        url: 'https://db.uptor.com/ping',
        status: 'up',
        lastChecked: '2 min ago',
        responseTime: 203,
        interval: '2 min',
        is_active: false
    },
    {
        id: '7',
        name: 'Email Service',
        url: 'https://mail.uptor.com/status',
        status: 'paused',
        lastChecked: '1 hour ago',
        responseTime: null,
        interval: '5 min',
        is_active: true
    },
    {
        id: '8',
        name: 'Analytics Dashboard',
        url: 'https://analytics.uptor.com',
        status: 'up',
        lastChecked: '3 min ago',
        responseTime: 289,
        interval: '5 min',
        is_active: false
    },
    {
        id: '9',
        name: 'Webhooks Processor',
        url: 'https://webhooks.uptor.com',
        status: 'down',
        lastChecked: '1 min ago',
        responseTime: null,
        interval: '1 min',
        is_active: true
    },
    {
        id: '10',
        name: 'Status Page',
        url: 'https://status.uptor.com',
        status: 'up',
        lastChecked: '4 min ago',
        responseTime: 178,
        interval: '2 min',
        is_active: false
    }
];
// --- end

const valid_latencies = monitors.filter((m) => typeof m.responseTime === "number");

const avg_latency = valid_latencies.length > 0
    ? valid_latencies.reduce((sum, m) => sum + m.responseTime, 0) / valid_latencies.length
    : 0;

const stat = {
    total: monitors.length+1,
    up: monitors.filter(m => m.status === 'up').length,
    down: monitors.filter(m => m.status === 'down').length,
    latency: avg_latency
}


export default function MonitorPage() {
    return (
        <>
            <header className={"flex justify-between items-center w-full mt-0"}>
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

            <div className={"overflow-y-auto no-scrollbar pt-6"}>
                <div className={""}>
                    <MonitorStatusGrid stat={stat} />
                </div>

                <div className={"bg-slate-900 rounded-3xl overflow-y-auto no-scrollbar"}>
                    <MonitorsTable monitors={monitors} />
                </div>
            </div>

        </>
    )
}
