"use client"

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

import {
  RawAlert,
  AlertType,
  AlertDeliveryStatus,
  formatSentAt,
  formatSentVia,
  getAlertMonitor,
} from "@/lib/alerts";


export default function AlertsPage() {
  const [alerts, setAlerts] = useState<RawAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<RawAlert[]>('/alerts', {
          params: { limit: 50 },
        });

        setAlerts(Array.isArray(res.data) ? res.data : []);
      } catch {
        setError('Failed to load alerts.');
      } finally {
        setLoading(false);
      }
    };
    void fetchAlerts();
    const intervalId = setInterval(fetchAlerts, 60*1000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-8">
      <header className="flex justify-between items-center w-full mt-0">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold">Alerts</h3>
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            Monitor downtime and recovery notifications.
          </blockquote>
        </div>

        <Image src="/streetlights.png" alt="Streetlights" width={48} height={12} />
      </header>

      <div className="pt-6">
        <div className="bg-slate-900 rounded-3xl glass-card">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-gray-400">Alert History</h2>
          </div>

          {error ? (
            <div className="px-6 py-4 text-xs text-orange-300">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="px-6 py-8 text-sm text-muted-foreground">
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="px-6 py-8 text-sm text-muted-foreground">
              No alerts yet. We will show incidents here when they occur.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full overflow-y-auto">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-left text-sm">Type</th>
                    <th className="px-6 py-4 text-left text-sm">Monitor</th>
                    <th className="px-6 py-4 text-left text-sm">Channels</th>
                    <th className="px-6 py-4 text-left text-sm">Mail Status</th>
                    <th className="px-6 py-4 text-right text-sm">Sent</th>
                  </tr>
                </thead>
                <tbody className={"overflow-y-auto"}>
                  {alerts.map((alert, index) => {
                    const monitor = getAlertMonitor(alert.monitorId);

                    return (
                    <tr
                      key={alert._id ?? `alert-${index}`}
                      className="border-b border-white/5 hover:bg-white/[0.02] glass-card-hover"
                    >
                      <td className="px-6 py-4">{alertBadge(alert.type)}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-300">
                          {monitor?.name ?? 'Deleted monitor'}
                        </div>
                        {monitor?.url ? (
                          <a
                            href={monitor.url}
                            className="text-sm text-muted-foreground truncate max-w-[300px] inline-block"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {monitor.url}
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">No URL</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatSentVia(alert.sent_via)}
                      </td>
                      <td className="px-6 py-4">
                        {deliveryStatusBadge(alert.status ?? null)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {formatSentAt(alert.sent_at, alert.status ?? null)}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function alertBadge(type: AlertType) {
  if (type === "down") {
    return <Badge className={"bg-red-500 text-white border-none"}>DOWN</Badge>;
  }
  if (type === "recovery") {
    return <Badge className="bg-green-500/20 text-green-300 border-none">RECOVERY</Badge>;
  }
  return <Badge className="bg-orange-500/20 text-orange-300 border-none">UNKNOWN</Badge>;
}

function deliveryStatusBadge(status: AlertDeliveryStatus | null) {
  const normalizedStatus = (status ?? "").toLowerCase();

  if (normalizedStatus === "failed") {
    return <Badge className="bg-red-500/20 text-red-300 border-none">FAILED</Badge>;
  }

  if (normalizedStatus === "pending") {
    return <Badge className="bg-amber-500/20 text-amber-300 border-none">PENDING</Badge>;
  }

  if (normalizedStatus === "processing") {
    return <Badge className="bg-blue-500/20 text-blue-300 border-none">PROCESSING</Badge>;
  }

  if (normalizedStatus === "sent") {
    return <Badge className="bg-green-500/20 text-green-300 border-none">SENT</Badge>;
  }

  return <Badge className="bg-slate-500/20 text-slate-300 border-none">UNKNOWN</Badge>;
}
