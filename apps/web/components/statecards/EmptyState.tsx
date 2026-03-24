import Link from 'next/link';
import { Activity, Plus } from 'lucide-react';


export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-72 text-center space-y-4 px-6">
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-400/30">
                <Activity className="size-5 text-indigo-300" />
            </div>
            <div className="text-lg font-semibold text-white">
                No monitors yet
            </div>
            <div className="text-sm text-gray-400">
                Add your first monitor to start tracking uptime.
            </div>
            <Link
                href={'/monitors/new'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition"
            >
                <Plus className="size-4" />
                Add Monitor
            </Link>
        </div>
    )
}