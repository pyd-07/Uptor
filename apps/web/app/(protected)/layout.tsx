"use client"

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar";
import { Toaster } from "sonner";
import {toast} from "sonner";
import {useEffect} from "react";
import {checkAuth} from "@/lib/checkAuth";
import {useRouter} from "next/navigation";

export default function ProtectedLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    useEffect(() => {
        async function isAuthenticated(){
            const status = await checkAuth()
            if (status){
                toast.success("Welcome Back")
            } else {
                router.push("/login")
                toast.error("Kindly Login Again")
            }
        }
        void isAuthenticated();
    }, [router]);


    return (
        <div className="h-screen overflow-hidden">
            <Topbar />
            <div className={"flex h-screen pt-24 mb-4"}>
                <Sidebar />
                <main className={"flex-1 ml-22 mr-3 md:ml-72 px-6 py-12 flex flex-col overflow-hidden rounded-3xl bg-slate-950/90 text-white"}>
                    <Toaster position="top-right" theme="system" richColors />
                    {children}
                </main>
            </div>
        </div>
    );
}
