import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock } from "lucide-react";

interface PricingTier {
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    highlighted?: boolean;
    current?: boolean;
}

export function PricingCards({tiers}: {tiers: PricingTier[]}) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
                <div
                    key={tier.name}
                    className={`relative glass-card glass-card-hover overflow-hidden rounded-[28px] border p-8 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                        tier.highlighted
                            ? "border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-slate-900/80 to-slate-800/80 shadow-[0_0_40px_rgba(249,115,22,0.15)] lg:scale-105"
                            : "border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/60"
                    }`}
                >
                    {tier.highlighted && (
                        <>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />
                            <Badge className="absolute top-6 right-6 bg-orange-500 text-white border-none">
                                Popular
                            </Badge>
                        </>
                    )}

                    <div className="relative">
                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="text-2xl mb-2 text-white">{tier.name}</h3>
                            <p className="text-sm text-slate-400">{tier.description}</p>
                        </div>

                        {/* Pricing */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl text-white">{tier.price}</span>
                                {tier.period && (
                                    <span className="text-slate-400">{tier.period}</span>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-2">
                                    <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                        tier.highlighted ? "text-orange-400" : "text-green-400"
                                    }`} />
                                    <span className="text-sm text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        {tier.current ? (
                            <Button
                                disabled
                                className="w-full bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700/50 cursor-not-allowed"
                            >
                                Current Plan
                            </Button>
                        ) : (
                            <Button
                                disabled
                                className={`w-full relative ${
                                    tier.highlighted
                                        ? "bg-orange-500/50 text-orange-200 border border-orange-500/40 hover:bg-orange-500/50"
                                        : "bg-slate-700/50 text-slate-300 border border-slate-600/40 hover:bg-slate-700/50"
                                } cursor-not-allowed opacity-70`}
                            >
                                <Lock className="h-4 w-4 mr-2" />
                                {tier.price === "Custom" ? "Contact Sales" : "Upgrade"}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
