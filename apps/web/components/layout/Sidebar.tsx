"use client"

import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type UserType = {
    name: string,
    org_name: string,
    role: string
}

export default function Sidebar() {
    return (
        <aside className="
            fixed left-4
            top-1/2 -translate-y-1/2
            h-[70vh]
            w-16 md:w-[256px]
            bg-slate-950/85
            rounded-3xl
            flex flex-col
            p-4 gap-4
            transition-all duration-300
        ">
            <Streetlights/>
            <User/>
            <hr className="border-white opacity-20 m-0" />

            <div className="flex-1 overflow-y-auto pr-1">
                <Navigations />
            </div>

            <AddMonitorBox />
        </aside>
    )
}

function Streetlights(){
    return (
        <div>
            <Image src={'/streetlights.png'} alt="streetlights png" width={48} height={12}/>
        </div>
    )
}

function User() {
    const [user, setUser] = useState<UserType>()
    useEffect(()=>{
        async function fetchUser() {
            try {
                const res = await api.get("/auth/me")
                setUser(res.data.user)
            } catch (error) {
                console.error(error)
            }
        }
        void fetchUser()
    },[])

    return (
        <div className={"relative text-white flex"}>
            <Image src={'/user_pfp.png'} alt={"User pfp"}  width={58} height={48}/>
            <div className={"hidden md:flex flex-col justify-evenly ml-2 "}>
                <span className={"text-sm opacity-50"}>{user?.role}</span>
                <span className={"text-sm opacity-70"}>{user?.org_name}</span>
                <span className={"text-sm"}>{user?.name}</span>
            </div>
        </div>
    )
}


function Navigations() {
    const navItems = [
        { href: "/dashboard", label: "Dashboard", src: "/sidebar/icon_dashboard.png" },
        { href: "/monitors", label: "Monitors", src: "/sidebar/icon_monitors.png" },
        { href: "/subscriptions", label: "Subscriptions", src: "/sidebar/subscription.png" },
        { href: "/alerts", label: "Alerts", src: "/alert.png" },
    ];

    return (
        <div className="m-0 text-white">
            <span className="text-[10px] opacity-50 hidden md:block mb-2 px-2">MAIN</span>
            <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="group">
                        <li className="
                            flex items-center
                            justify-center py-3 md:justify-start
                            hover:bg-slate-900 rounded-xl
                            md:p-2 transition-all
                        ">
                            <div className="flex items-center justify-center w-8 h-8">
                                <Image
                                    src={item.src}
                                    alt={item.label}
                                    width={24}
                                    height={24}

                                />
                            </div>
                            <span className="hidden md:block text-sm ml-3 truncate">
                                {item.label}
                            </span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

function AddMonitorBox() {
    "use client"
    return (
        <div className={"mt-auto flex flex-col items-center"}>
            <div
                className={"hidden md:flex border rounded-3xl text-white border-slate-700 flex-col justify-center items-center p-5 mb-4"}>
                <div className={"text-lg font-bold"}>Lets start !</div>
                <div className={"text-xs text-center font-semibold opacity-50"}>Adding your monitor could not be easier.</div>
            </div>

            <Link href="/monitors/new">
                <button
                    className={"bg-orange-500 p-3 md:px-4 md:py-2 rounded-full hover:bg-orange-400 transition-colors flex items-center justify-center"}>
                    <Image src={"/add_icon.png"} alt={"icon"} width={16} height={16}/>
                    <span className="hidden md:inline ml-2 text-sm font-medium text-white font-semibold">Add Monitor</span>
                </button>
            </Link>
        </div>
    )
}
