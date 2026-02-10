import React from 'react'
import DashboardCard from "@/components/layout/dashboard/DashboardCard";
import DashboardTable from "@/components/layout/dashboard/DashboardTable";
import Image from "next/image";

export default function Page() {

    // backend fetch
    const monitorsArr= [
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

    // backend fetch
    const totalMonitors = monitorsArr.length;
    const upMonitors = monitorsArr.filter((monitor)=> monitor.status==="up" && monitor.is_active).length
    const downMonitors = monitorsArr.filter((monitor)=> monitor.status==="down" && monitor.is_active).length
    const pausedMonitors = monitorsArr.filter((monitor)=> !monitor.is_active).length
    const unknownMonitors = monitorsArr.filter((monitor)=> monitor.status==="unknown" && monitor.is_active).length



    return (
        <div className={"overflow-y-auto no-scrollbar"}>
            <header className={"flex justify-between items-center w-full mt-0"}>
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
            <div className="text-white h-screen overflow-y-auto no-scrollbar md:flex md:flex-col justify-evenly">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <DashboardCard
                        name="Total Monitors"
                        number={totalMonitors}
                        total_monitors={totalMonitors}
                        color={"text-white"}
                    />
                    <DashboardCard
                        name="Monitors Up"
                        number={upMonitors}
                        total_monitors={totalMonitors}
                        color={"text-green-500"}
                    />
                    <DashboardCard
                        name="Monitors Down"
                        number={downMonitors}
                        total_monitors={totalMonitors}
                        color={"text-red-500"}
                    />
                    <DashboardCard
                        name="Paused / Unknown"
                        number={pausedMonitors + unknownMonitors}
                        total_monitors={totalMonitors}
                        color={"text-orange-400"}
                    />
                </div>
                <div className="bg-slate-600/50 rounded-3xl overflow-auto no-scrollbar glass-card glass-card-hover mt-5">
                    <div className={"text-gray-300 font-extrabold text-xl text-center"}>
                        Monitors Status
                    </div>
                    <DashboardTable monitors={monitorsArr}/>
                </div>
            </div>
        </div>
    );


}
