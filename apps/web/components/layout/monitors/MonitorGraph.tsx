"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type ChartDataPoint = {
  status: string
  response_time_ms: number
  status_code: number
  checked_at: string
}

export type ChartData = ChartDataPoint[]

const chartConfig = {
  check: {
    label: "Response Time",
    color: "#38bdf8",
  },
} satisfies ChartConfig

export default function MonitorGraph({ chartData }: { chartData: ChartData | undefined }) {
  const sorted = chartData
    ? [...chartData].sort(
        (a, b) => new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
      )
    : []

  return (
    <Card className="text-slate-100 bg-slate-900 mt-8 h-full border border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-slate-100">Monitor Statistical Trends</CardTitle>
        <CardDescription className="text-slate-400">Latest Monitor Checks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={sorted}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} stroke="#1e293b" />
            <XAxis
              dataKey="checked_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#94a3b8", fontSize: 11 }} 
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleString([], { hour: "2-digit", minute: "2-digit" })
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "#38bdf8", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  className="bg-slate-800 border border-slate-700 shadow-xl shadow-black/40 rounded-lg"
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return (
                      <span className="text-slate-300 text-xs font-medium">
                        {date.toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )
                  }}
                  formatter={(value, _name, item) => (
                    <div className="flex flex-col gap-2 py-0.5">
                      {/* Response time — primary metric */}
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-sky-400" />
                        <span className="text-slate-400 text-xs">Response</span>
                        <span className="font-mono font-semibold text-sky-300 ml-auto">
                          {value}ms
                        </span>
                      </div>

                      <div className="flex flex-col border-t border-slate-700 pt-1.5 gap-1.5 text-[10px] uppercase tracking-wider">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">Status</span>
                          <span
                            className={
                              item.payload.status === "up"
                                ? "text-emerald-400 font-semibold"
                                : "text-red-400 font-semibold"
                            }
                          >
                            {item.payload.status}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-500">HTTP Code</span>
                          <span className="font-mono text-slate-300">
                            {item.payload.status_code}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="response_time_ms"
              type="monotone"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#38bdf8",
                stroke: "#0ea5e9",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm border-t border-slate-700/50 pt-4 mt-2">
        <div className="flex gap-2 font-medium text-slate-200">
          Latency trends at a glance
        </div>
        <div className="text-slate-500 text-xs">
          Sorted oldest → newest · hover for details
        </div>
      </CardFooter>
    </Card>
  )
}