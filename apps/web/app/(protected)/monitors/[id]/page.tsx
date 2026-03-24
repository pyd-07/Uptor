"use client"

import Image from "next/image"
import { api } from "@/lib/api"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function MonitorStatsPage(){
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [GraphStats, setGraphStats] = useState([])
    const path = usePathname()
    const id = path.split('/')[1]
    
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await api.get(`/monitors/${id}/stats`)
                setGraphStats(res.data)
            } catch(error) {
                setError("Failed to load stats")
            } finally {
                setLoading(false)
            }
        }
        void fetchData()
        const intervalId = setInterval(fetchData, 60*1000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <>
            <header className={"flex justify-between items-start w-full mt-0"}>
                <div>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Monitor Tracking
                    </h3>
                    <blockquote className="mt-6 border-l-2 pl-6 italic">
                        Track uptime & latency of your endpoints
                    </blockquote>
                </div>

                <Image src={"/streetlights.png"} alt={"Streetlights"} width={48} height={12}/>
            </header>
        </>
    )
}

