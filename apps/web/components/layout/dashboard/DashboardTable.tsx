import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

type DashboardMonitor = {
    _id: string;
    name: string;
    url: string;
    last_status: string;
    responseTime: number | null;
    interval: string;
    lastChecked: string;
    is_active: boolean;
};


function statusBadge(status: string, active: boolean) {
    if (!active){
        return <Badge className={"bg-slate-500/20 text-slate-200 border border-slate-300/20"}>INACTIVE</Badge>
    }
    if (status === "down") {
        return <Badge className="bg-red-500/20 text-red-300 border border-red-400/20">DOWN</Badge>;
    }
    if (status === "up") {
        return <Badge className="bg-green-500/20 text-green-300 border border-green-400/20">UP</Badge>;
    }
    if (status === "paused") {
        return <Badge className="bg-orange-500/20 text-orange-300 border border-orange-400/20">PAUSED</Badge>;
    }
    return <Badge className="bg-slate-500/20 text-slate-200 border border-slate-300/20">UNKNOWN</Badge>;
}

function formatLastChecked(value: string) {
    const parsedDate = new Date(value)

    if (Number.isNaN(parsedDate.getTime())) {
        return value || '-'
    }

    return parsedDate.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatResponseTime(responseTime: number | null, isActive: boolean) {
    if (!isActive || responseTime === null) {
        return <span className="text-slate-400">-</span>
    }

    const tone = responseTime > 800
        ? 'text-red-300'
        : responseTime > 300
            ? 'text-orange-300'
            : 'text-green-300'

    return <span className={`font-medium ${tone}`}>{responseTime} ms</span>
}

export default function DashboardTable({ monitors }: { monitors: DashboardMonitor[] }) {
    return (
        <Table className="min-w-[760px]">
            <TableHeader className="bg-slate-900/40">
                <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white px-4 sm:px-6">Monitor</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">URL</TableHead>
                    <TableHead className={"text-white"}>Response Time</TableHead>
                    <TableHead className="text-right text-white px-4 sm:px-6">Last Check</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {monitors.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No monitors yet.
                        </TableCell>
                    </TableRow>
                ) : (
                    monitors.map((monitor, index) => (
                        <TableRow key={monitor._id} className={index % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'}>
                            <TableCell className="font-medium text-gray-100 px-4 sm:px-6">
                                {monitor.name}
                            </TableCell>
                            <TableCell>{statusBadge(monitor.last_status, monitor.is_active)}</TableCell>
                            <TableCell className="text-muted-foreground truncate max-w-[320px]">
                                <a
                                    href={monitor.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 hover:text-blue-300 transition-colors"
                                    title={monitor.url}
                                >
                                    <span className="truncate max-w-[250px]">{monitor.url}</span>
                                    <ExternalLink className="size-3.5 shrink-0" />
                                </a>
                            </TableCell>
                            <TableCell>
                                {formatResponseTime(monitor.responseTime, monitor.is_active)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground px-4 sm:px-6">
                                {formatLastChecked(monitor.lastChecked)}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
