"use client"
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Topbar() {
    return (
        <div className="fixed top-0 left-0 z-40 w-full py-3">
            <div className="ml-4 flex min-w-0 items-center justify-between gap-2 sm:gap-3">
                <MyMessage />
                <More />
            </div>
        </div>
    );
}


function MyMessage() {
    return (
        <div className="flex min-w-0 flex-1 items-center rounded-full border border-white/10 glass-card-hover px-3 py-2 sm:max-w-xl sm:px-4 sm:py-2.5">
            <p className="truncate text-[11px] leading-4 text-gray-200 sm:text-sm">
                <span className="sm:hidden">Built with love, logs, and docs.</span>
                <span className="hidden sm:inline">Built with love, logs, docs, and occasional despair.</span>
            </p>
        </div>
    )
}

function More() {  

    const router = useRouter()

    async function handleLogout() {
        try {
        await api.post("/auth/logout")

        router.replace("/login")
        router.refresh()
        } catch (err) {
        console.error("Logout failed:", err)
        }
    }

    return (
        <div className="mr-4 flex shrink-0 items-center gap-2 sm:gap-3 justify-end">
            <Link href="/about">
                <button className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 transition hover:bg-slate-900 sm:size-10 sm:rounded-2xl">
                    <Image src="/topbar/about.png" alt="About Us" width={17} height={17} />
                </button>
            </Link>
            
            <details className="relative">
                <summary className="flex size-9 list-none cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 transition hover:bg-slate-900 [&::-webkit-details-marker]:hidden sm:size-10 sm:rounded-2xl">
                    <Image src="/user_pfp.png" alt="profile" width={22} height={22} className="rounded-full" />
                </summary>
                <div className="absolute right-0 mt-2 z-50 w-40 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-xl sm:w-44">
                    <div className="px-3 py-2 text-xs text-white/60">Account</div>

                    <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-slate-900 transition text-white"
                    >
                    Log out
                    </button>
                </div>
            </details>
        </div>
    )
}
