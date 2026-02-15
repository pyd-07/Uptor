"use client"
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Topbar() {
    return (
        <div className="fixed top-0 left-0 w-full flex items-center justify-between gap-4 p-6 mb-1">
            <Logo />
            <SearchBar />
            <More />
        </div>
    );
}

function Logo() {
    return (
        <div>

        </div>
    )
}

function SearchBar() {
    return (
        <div className="flex flex-1 max-w-md">
            <div className="flex items-center gap-2 w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-2">
                <Image src="/streetlights.png" alt="search" width={18} height={18} />
                <input
                    className="hidden md:block bg-transparent outline-none text-white placeholder:text-white/40 text-sm  w-2/3 md:w-full"
                    placeholder="Search monitors..."
                />
                <input
                    className="md:hidden bg-transparent outline-none text-white placeholder:text-white/40 text-sm  w-2/3 md:w-full"
                    placeholder="Search..."
                />
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
        <div className="flex items-center gap-3">
            <Link href="/about">
                <button className="bg-slate-950/80 border border-white/10 rounded-2xl p-2.5 hover:bg-slate-900 transition">
                    <Image src="/topbar/about.png" alt="About Us" width={18} height={18} />
                </button>
            </Link>

            <button className="bg-slate-950/80 border border-white/10 rounded-2xl p-2.5 hover:bg-slate-900 transition">
                <Image src="/alert.png" alt="notifications" width={18} height={18} />
            </button>
            
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
