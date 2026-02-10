import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Uptor",
    description: "Monitor Tracking and Performance Analytics",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[url('/dark.png')] h-screen overflow-hidden`}>
               <Topbar />
               <div className={"flex h-screen pt-24 mb-4"}>
                   <Sidebar />
                   <main className={"flex-1 ml-22 mr-3 md:ml-72 px-6 py-12 flex flex-col overflow-hidden rounded-3xl bg-slate-950/90 text-white"}>
                       {children}
                   </main>
               </div>
            </body>
        </html>
    );
}
