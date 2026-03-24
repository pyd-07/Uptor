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


type ChartData = [{
    status: string,
    response_time_ms: number,
    status_code: number,
    checked_at: string
}]


const chartConfig = {
  check: {
    label: "Check",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineDefault({chartData}: {chartData: ChartData}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitor Statistical Trends</CardTitle>
        <CardDescription>Latest MonitorChecks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="checked_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleString([],{
                    hour: '2-digit'
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(value)=>{
                    const date = new Date(value)
                    return date.toLocaleString([],{
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }}
                formatter={(value, name, item)=>(
                    <div className="flex flex-col gap-1">
                        {/* Main metric (Response Time) */}
                        <div className="flex items-center gap-2">
                            <div 
                            className="h-2 w-2 rounded-full bg-[--color-check]" 
                            />
                            <span className="text-muted-foreground">Response:</span>
                            <span className="font-mono font-medium">{value}ms</span>
                        </div>
                            
                        {/* Additional metadata from the payload */}
                        <div className="flex flex-col border-t pt-1 mt-1 gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                            <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={item.payload.status === "up" ? "text-emerald-500" : "text-red-500"}>
                                {item.payload.status}
                            </span>
                            </div>
                            <div className="flex justify-between">
                            <span>Code:</span>
                            <span className="font-mono">{item.payload.status_code}</span>
                            </div>
                        </div>
                    </div>
                )}
              />}
            />
            <Line
              dataKey="response_time_ms"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Knowing the latency made easier.
        </div>
        <div className="leading-none text-muted-foreground">
          Showing latest checks
        </div>
      </CardFooter>
    </Card>
  )
}
