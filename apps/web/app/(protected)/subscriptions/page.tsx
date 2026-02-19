import React from 'react'
import Image from "next/image";
import { Activity, CheckCircle2, Clock3, CreditCard, Sparkles } from "lucide-react";

const freePlan = {
    monitors: 5,
    minimumInterval: "5 minutes",
}

const includedFeatures = [
    "Email alerts",
    "Uptime and latency tracking",
    "Incident history",
    "Basic status visibility",
]

export default function Page() {
    return (
        <>
            <header className={"flex justify-between items-center w-full mt-0"}>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Subscriptions
                    </h3>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        Subscriptions are not yet enabled.
                    </blockquote>
                </div>
                <Image src={"/streetlights.png"} alt={"Streetlights"} width={48} height={12}/>
            </header>
            <div className={"pt-6 overflow-y-auto no-scrollbar px-2 space-y-6 pb-8"}>
                <section className="relative overflow-hidden rounded-[32px] border border-white/10  p-6 sm:p-8">
                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                <CreditCard className="size-3.5" />
                                Billing Not Yet Set Up
                            </div>
                            <h4 className="mt-4 text-2xl text-white sm:text-3xl">Free Plan is active for all users</h4>
                            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                                Paid subscriptions and upgrades are coming soon. Until then, every workspace uses the same free plan limits.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
                            <div className="flex items-center gap-2 text-emerald-300">
                                <CheckCircle2 className="size-4" />
                                <span className="text-sm font-medium">Free Service</span>
                            </div>
                            <p className="mt-1 text-xs text-emerald-200/90">Monitoring continues normally on the free tier.</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 p-6">
                        <div className="mb-4 inline-flex rounded-xl bg-orange-500/10 p-2">
                            <Activity className="size-5 text-orange-300" />
                        </div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">Monitor limit</p>
                        <div className="mt-2 flex items-end gap-2">
                            <span className="text-4xl font-semibold text-white">{freePlan.monitors}</span>
                            <span className="pb-1 text-slate-400">max monitors</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-300">Use up to {freePlan.monitors} monitors on the current free plan.</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 p-6">
                        <div className="mb-4 inline-flex rounded-xl bg-cyan-500/10 p-2">
                            <Clock3 className="size-5 text-cyan-300" />
                        </div>
                        <p className="text-xs uppercase tracking-wider text-slate-400">Minimum check interval</p>
                        <div className="mt-2 flex items-end gap-2">
                            <span className="text-4xl font-semibold text-white">{freePlan.minimumInterval}</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-300">Checks can run every {freePlan.minimumInterval} or slower.</p>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/10 p-6">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles className="size-4 text-yellow-300" />
                        <h5 className="text-lg font-semibold">Included in Free Plan</h5>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {includedFeatures.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200">
                                <CheckCircle2 className="size-4 text-emerald-300" />
                                {feature}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
                        Plan upgrades will be available once subscriptions are enabled.
                    </div>
                </section>
            </div>
        </>
    )
}
