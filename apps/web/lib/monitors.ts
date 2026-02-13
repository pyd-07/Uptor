export type MonitorFormat = {
    id: string;
    name: string;
    url: string;
    status: string;
    lastChecked: string;
    responseTime: number | null;
    interval: string;
    is_active: boolean;
}

export type MonitorPageStats = {
    total: number;
    up: number;
    down: number;
    avg_latency: number;
}

export type DashboardPageStats = {
    totalMonitors: number
    upMonitors: number
    downMonitors: number
    pausedMonitors: number
    unknownMonitors: number
}