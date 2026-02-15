"use client"

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

type AlertType = "down" | "recovery" | "unknown" | string;

type AlertMonitor = {
  _id?: string;
  name?: string;
  url?: string;
};

type RawAlert = {
  _id?: string;
  type: AlertType;
  sent_via?: string[];
  sent_at?: string | null;
  monitorId?: string | AlertMonitor;
};

type AlertRow = {
  _id: string;
  type: AlertType;
  sent_via: string[];
  sent_at: string | null;
  monitor: AlertMonitor | null;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get<RawAlert[]>('/alerts', {
          params: { limit: 50 },
        });

        const normalized = (Array.isArray(res.data) ? res.data : []).map((alert, index) => {
          const populatedMonitor =
            alert.monitorId && typeof alert.monitorId === 'object' ? alert.monitorId : null;

          return {
            _id: alert._id ?? `alert-${index}`,
            type: alert.type,
            sent_via: Array.isArray(alert.sent_via) ? alert.sent_via : [],
            sent_at: alert.sent_at ?? null,
            monitor: populatedMonitor,
          };
        });

        setAlerts(normalized);
      } catch {
        setError('Failed to load alerts.');
      } finally {
        setLoading(false);
      }
    };

    void fetchAlerts();
  }, []);

  return (
    <div>
      <header className="flex justify-between items-center w-full mt-0">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold">Alerts</h3>
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            Monitor downtime and recovery notifications.
          </blockquote>
        </div>

        <Image src="/streetlights.png" alt="Streetlights" width={48} height={12} />
      </header>

      <div className="pt-6 overflow-y-auto no-scrollbar">
        <div className="bg-slate-900 rounded-3xl overflow-y-auto no-scrollbar glass-card">
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
                  {alerts.map((alert) => (
                    <tr
                      key={alert._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors glass-card-hover"
                    >
                      <td className="px-6 py-4">{alertBadge(alert.type)}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-300">
                          {alert.monitor?.name ?? 'Deleted monitor'}
                        </div>
                        {alert.monitor?.url ? (
                          <a
                            href={alert.monitor.url}
                            className="text-sm text-muted-foreground truncate max-w-[300px] inline-block"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {alert.monitor.url}
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">No URL</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {alert.sent_via.length > 0 ? alert.sent_via.join(', ') : 'Pending'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                        {formatSentAt(alert.sent_at)}
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

function alertBadge(type: AlertType) {
  if (type === "down") {
    return <Badge variant="destructive">DOWN</Badge>;
  }
  if (type === "recovery") {
    return <Badge className="bg-green-500/20 text-green-300 border-none">RECOVERY</Badge>;
  }
  return <Badge className="bg-orange-500/20 text-orange-300 border-none">UNKNOWN</Badge>;
}

function formatSentAt(sentAt: string | null) {
  if (!sentAt) {
    return "Pending";
  }

  const date = new Date(sentAt);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}
