import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

type DashboardMonitor = {
    id: string;
    name: string;
    url: string;
    status: string;
    responseTime: number | null;
    interval: string;
    lastChecked: string;
    is_active: boolean;
};


function statusBadge(status: string, active: boolean) {
    if (!active){
        return <Badge className={"bg-gray-500"}>INACTIVE</Badge>
    }
    if (status === "down") {
        return <Badge variant="destructive">DOWN</Badge>;
    }
    if (status === "up") {
        return <Badge className="bg-green-500/20 text-green-300 border-none">UP</Badge>;
    }
    if (status === "paused") {
        return <Badge className="bg-orange-500/20 text-orange-300 border-none">PAUSED</Badge>;
    }
    return <Badge className="bg-slate-500/20 text-slate-200 border-none">UNKNOWN</Badge>;
}

export default function DashboardTable({ monitors }: { monitors: DashboardMonitor[] }) {
    return (
        <Table>
            <TableCaption>Your Monitors.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-white">Monitor</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">URL</TableHead>
                    <TableHead className={"text-white"}>Response Time</TableHead>
                    <TableHead className="text-right text-white">Last Check</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {monitors.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                            No monitors yet.
                        </TableCell>
                    </TableRow>
                ) : (
                    monitors.map((monitor) => (
                        <TableRow key={monitor.id}>
                            <TableCell className="font-medium text-gray-200">
                                {monitor.name}
                            </TableCell>
                            <TableCell>{statusBadge(monitor.status, monitor.is_active)}</TableCell>
                            <TableCell className="text-muted-foreground truncate max-w-[280px]">
                                {monitor.url}
                            </TableCell>
                            <TableCell>
                                {monitor.responseTime && monitor.is_active? monitor.responseTime+" ms" : "-"}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {monitor.lastChecked}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
