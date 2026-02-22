export type MonitorFormat = {
    _id: string;
    name: string;
    url: string;
    last_status: string;
    last_checked_at: string;
    response_time_ms: number | null;
    interval_sec: number | null;
    timeout_ms: number | null;
    is_active: boolean;
    status_code: number;
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
  interval_sec: number;
  timeout_ms: number;
};


export function buildMonitorStats(monitors: MonitorFormat[]): PageStats {
  const total = monitors.length;
  const up = monitors.filter((monitor) => monitor.is_active && monitor.last_status === "up").length;
  const down = monitors.filter((monitor) => monitor.is_active && monitor.last_status === "down").length;
  const paused = monitors.filter((monitor) => !monitor.is_active).length;
  const unknown = monitors.filter((monitor) => monitor.is_active && monitor.last_status === "unknown").length;

  const latencies = monitors
    .map((monitor) => monitor.response_time_ms)
    .filter((value): value is number => value != null);

  const avg_latency =
    latencies.length > 0
      ? Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length)
      : 0;

  return { total, up, down, paused, unknown, avg_latency };
}

export function validateMonitorDraft(draft: MonitorFormDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  const intervalSec = Number.isFinite(draft.interval_sec) ? draft.interval_sec : 0;
  const timeoutMs = Number.isFinite(draft.timeout_ms) ? draft.timeout_ms : 0;

  if (!draft.name.trim()) {
    errors.name = "Monitor name is required.";
  } else if (draft.name.trim().length < 3) {
    errors.name = "Monitor name must be at least 3 characters.";
  }

  if (!draft.url.trim()) {
    errors.url = "Endpoint URL is required.";
  } else {
    try {
      const parsed = new URL(draft.url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.url = "Only http and https URLs are supported.";
      }
    } catch {
      errors.url = "Please enter a valid URL.";
    }
  }

  if (intervalSec < 300 || intervalSec > 3600) {
    errors.intervalSec = "Interval must be between 300 and 3600 seconds.";
  }

  if (timeoutMs < 1000 || timeoutMs > 30000) {
    errors.timeoutMs = "Timeout must be between 1000 and 30000 milliseconds.";
  }

  if (timeoutMs >= intervalSec * 1000) {
    errors.timeoutMs = "Timeout must be smaller than the interval.";
  }

  return errors;
}
