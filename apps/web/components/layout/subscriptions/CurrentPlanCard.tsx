import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Bell, Activity } from "lucide-react";

type props = {
    monitorCount: number;
    channelCount: number;
}
export function CurrentPlanCard({prop}: {prop: props}) {
    return (
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 glass-card-hover from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl text-white">Free Plan</h3>
                            <Badge
                                variant="secondary"
                                className="bg-slate-700/50 text-slate-300 border-slate-600/50 glass-card"
                            >
                                Current
                            </Badge>
                        </div>
                        <p className="text-slate-400">
                            Perfect for getting started with uptime monitoring
                        </p>
                    </div>

                    <Button
                        disabled
                        className="bg-orange-500/50 text-orange-200 border border-orange-500/30 hover:bg-orange-500/50 cursor-not-allowed opacity-60 whitespace-nowrap"
                    >
                        Upgrade Plan
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Monitors Usage */}
                    <div className="rounded-3xl border border-white/5 bg-slate-800/40 p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="rounded-lg bg-orange-500/10 p-2">
                                <Activity className="h-4 w-4 text-orange-400" />
                            </div>
                            <h4 className="text-white">Monitors</h4>
                        </div>
                        <div className="mb-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl text-white">{prop.monitorCount}</span>
                                <span className="text-slate-400">/ {5}</span>
                            </div>
                        </div>
                        <Progress value={prop.monitorCount/5 * 100} className="h-2 bg-slate-700/80" />
                        <p className="mt-2 text-sm text-slate-500">{5-prop.monitorCount} monitors available</p>
                    </div>

                    {/* Check Interval */}
                    <div className="rounded-3xl border border-white/5 bg-slate-800/40 p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="rounded-lg bg-blue-500/10 p-2">
                                <Clock className="h-4 w-4 text-blue-400" />
                            </div>
                            <h4 className="text-white">Minimun Check Interval</h4>
                        </div>
                        <div className="mb-2">
                            <span className="text-3xl text-white">5 min</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Standard monitoring frequency</p>
                    </div>

                    {/* Alert Channels */}
                    <div className="rounded-3xl border border-white/5 bg-slate-800/40 p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="rounded-lg bg-green-500/10 p-2">
                                <Bell className="h-4 w-4 text-green-400" />
                            </div>
                            <h4 className="text-white">Alert Channels</h4>
                        </div>
                        <div className="mb-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl text-white">{prop.channelCount}</span>
                                <span className="text-slate-400">/ 2</span>
                            </div>
                        </div>
                        <Progress value={prop.channelCount/2 * 100} className="h-2 bg-slate-700/80" />
                        <p className="mt-2 text-sm text-slate-500">{2-prop.channelCount} channel under development.</p>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 p-4">
                    <p className="text-sm text-orange-300/90">
                        <span className="text-orange-200">Subscriptions are coming soon.</span> You'll be able to upgrade your plan once billing is enabled.
                    </p>
                </div>
            </div>
        </div>
    );
}
