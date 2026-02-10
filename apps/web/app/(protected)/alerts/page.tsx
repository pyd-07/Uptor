import React from 'react'
import Image from "next/image";
import {Badge} from "@/components/ui/badge";

type BackendAlert = {
    _id?: string;
    type: string;
    sent_via?: string[];
    sent_at?: string | null;
};

const page = [
    {
        monitorId: "65f1a9c2a1b2c3d4e5f60101",
        type: "down",
        result: {
            statusCode: 500,
            responseTime: 3200,
            error: "Connection timeout"
        },
        status: "sent",
        sent_via: ["email"],
        sent_at: new Date("2026-02-05T10:15:00Z")
    },
    {
        monitorId: "65f1a9c2a1b2c3d4e5f60101",
        type: "recovery",
        result: {
            statusCode: 200,
            responseTime: 180,
            message: "Service recovered successfully"
        },
        status: "sent",
        sent_via: ["email", "telegram"],
        sent_at: new Date("2026-02-05T10:25:00Z")
    },
    {
        monitorId: "65f1a9c2a1b2c3d4e5f60202",
        type: "unknown",
        result: {
            statusCode: null,
            responseTime: null,
            error: "DNS lookup failed"
        },
        status: "failed",
        sent_via: [],
        sent_at: null
    },
    {
        monitorId: "65f1a9c2a1b2c3d4e5f60303",
        type: "down",
        result: {
            statusCode: 503,
            responseTime: 4100,
            error: "Service unavailable"
        },
        status: "processing",
        sent_via: ["telegram"],
        sent_at: null
    },
    {
        monitorId: "65f1a9c2a1b2c3d4e5f60303",
        type: "recovery",
        result: {
            statusCode: 200,
            responseTime: 210,
            message: "Health check passed"
        },
        status: "pending",
        sent_via: [],
        sent_at: null
    }
];

const hadAlertsError = false

export default function AlertsPage() {
    return (
        <div>
            <header className="flex justify-between items-center w-full mt-0">
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Alerts</h3>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        Monitor downtime and recovery notifications.
                    </blockquote>
                </div>

                <Image src="/streetlights.png" alt="Streetlights" width={48} height={12} />
            </header>

            <div className="pt-6 overflow-y-auto no-scrollbar">
                <div className="bg-slate-900 rounded-3xl overflow-y-auto no-scrollbar">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-lg font-semibold text-gray-400">Alert History</h2>
                    </div>

                    {hadAlertsError ? (
                        <div className="px-6 py-4 text-xs text-orange-300">
                            Some alerts could not be loaded. Showing available results.
                        </div>
                    ) : null}

                    {page.length === 0 ? (
                        <div className="px-6 py-8 text-sm text-muted-foreground">
                            No alerts yet. We will show incidents here when they occur.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-6 py-4 text-left text-sm">Type</th>
                                    <th className="px-6 py-4 text-left text-sm">Monitor</th>
                                    <th className="px-6 py-4 text-left text-sm">Channels</th>
                                    <th className="px-6 py-4 text-right text-sm">Sent</th>
                                </tr>
                                </thead>
                                <tbody>
                                {page.map((alert) => (
                                    <tr
                                        key={alert.monitorId}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">{alertBadge(alert.type)}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-300">
                                                /Monitor Name
                                            </div>
                                            <a
                                                href=""
                                                className="text-sm text-muted-foreground truncate max-w-[300px]"
                                            >
                                                /Monitor url
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {alert.sent_via.length > 0
                                                ? alert.sent_via.join(", ")
                                                : "Pending"}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                            {formatRelativeTime(alert.sent_at)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function alertBadge(type: BackendAlert["type"]) {
    if (type === "down") {
        return <Badge variant="destructive">DOWN</Badge>;
    }
    if (type === "recovery") {
        return <Badge className="bg-green-500/20 text-green-300 border-none">RECOVERY</Badge>;
    }
    return <Badge className="bg-orange-500/20 text-orange-300 border-none">UNKNOWN</Badge>;
}

function formatRelativeTime(value?: string | null) {
    if (!value) {
        return "Not sent";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Not sent";
    }

    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    if (diffSec < 30) {
        return "Just now";
    }
    if (diffSec < 60) {
        return `${diffSec} sec ago`;
    }
    const diffMin = Math.round(diffSec / 60);
    if (diffMin < 60) {
        return `${diffMin} min ago`;
    }
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) {
        return `${diffHr} hr ago`;
    }
    const diffDay = Math.round(diffHr / 24);
    return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}