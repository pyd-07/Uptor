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


export type PageStats = {
    total: number
    up: number
    down: number
    paused: number
    unknown: number
    avg_latency: number
}

export type MonitorFormDraft = {
  name: string;
  url: string;
  intervalSec: number;
  timeoutMs: number;
};


export function buildMonitorStats(monitors: MonitorFormat[]): PageStats {
  const total = monitors.length;
  const up = monitors.filter((monitor) => monitor.is_active && monitor.status === "up").length;
  const down = monitors.filter((monitor) => monitor.is_active && monitor.status === "down").length;
  const paused = monitors.filter((monitor) => !monitor.is_active).length;
  const unknown = monitors.filter((monitor) => monitor.is_active && monitor.status === "unknown").length;

  const latencies = monitors
    .map((monitor) => monitor.responseTime)
    .filter((value): value is number => value != null);

  const avg_latency =
    latencies.length > 0
      ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)
      : 0;

  return { total, up, down, paused, unknown, avg_latency };
}