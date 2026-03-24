"use client"

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen overflow-y-auto">
            <Topbar />
            <div className={"flex h-fit mt-2"}>
                <Sidebar />
                <main className={"flex-1 ml-22 mr-3 md:ml-72 px-6 py-12 flex flex-col overflow-y-auto rounded-3xl bg-slate-950/90 text-white"}>
                    <Toaster position="top-right" theme="system" richColors />
                    {children}
                </main>
            </div>
        </div>
    );
}
