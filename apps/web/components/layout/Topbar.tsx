"use client"
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Topbar() {
    return (
        <div className="fixed top-0 left-0 z-40 w-full py-3">
            <div className="flex w-full items-center justify-between px-4">
                <MyMessage />
                <More />
            </div>
        </div>
    );
}


function MyMessage() {
    return (
            <div className="flex min-w-0 items-center gap-3 rounded-full border border-white/10 glass-card-hover sm:max-w-xl sm:px-4 sm:py-2.5">
                <div className="min-w-0">
                    <p className="truncate text-xs text-gray-200 sm:text-sm">
                        Built with love, logs, docs, and occasional despair.
                    </p>
                </div>                
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
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 justify-end">
            <Link href="/about">
                <button className="rounded-2xl border border-white/10 bg-slate-950/80 p-2.5 transition hover:bg-slate-900">
                    <Image src="/topbar/about.png" alt="About Us" width={18} height={18} />
                </button>
            </Link>
            
            <details className="relative">
                <summary className="list-none cursor-pointer bg-slate-950/80 border border-white/10 rounded-2xl p-2 hover:bg-slate-900 transition [&::-webkit-details-marker]:hidden">
                    <Image src="/user_pfp.png" alt="profile" width={24} height={24} className="rounded-full" />
                </summary>
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-xl z-50">
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
