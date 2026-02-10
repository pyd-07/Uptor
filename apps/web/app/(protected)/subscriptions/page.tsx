import React from 'react'
import Image from "next/image";
import {CurrentPlanCard} from "@/components/layout/subscriptions/CurrentPlanCard";
import {PricingCards} from "@/components/layout/subscriptions/PricingCards";

const dummyData = {monitorCount: 3,
    channelCount:1}


const tiers = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for small projects",
        current: true,
        features: [
            "Up to 10 monitors",
            "5 minute check interval",
            "3 alert channels",
            "7 days incident history",
            "Email notifications",
            "Basic status page"
        ]
    },
    {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For growing teams and businesses",
        highlighted: true,
        features: [
            "Up to 100 monitors",
            "1 minute check interval",
            "Unlimited alert channels",
            "90 days incident history",
            "SMS & webhook alerts",
            "Custom status page",
            "API access",
            "Priority support"
        ]
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large-scale operations",
        features: [
            "Unlimited monitors",
            "30 second check interval",
            "Unlimited alert channels",
            "Unlimited incident history",
            "All notification types",
            "White-label status page",
            "Advanced API access",
            "24/7 dedicated support",
            "SLA guarantee"
        ]
    }
];



export default function Page() {
    return (
        <>
            <header className={"flex justify-between items-center w-full mt-0"}>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Subscriptions
                    </h3>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        Manage your plan and usage.
                    </blockquote>
                </div>
                <Image src={"/streetlights.png"} alt={"Streetlights"} width={48} height={12}/>
            </header>
            <div className={"pt-6 overflow-y-auto no-scrollbar px-2"}>
                <div>
                    <CurrentPlanCard prop={dummyData}/>
                </div>
                <div className={"mt-10"}>
                    <PricingCards tiers={tiers}/>
                </div>
            </div>
        </>
    )
}
