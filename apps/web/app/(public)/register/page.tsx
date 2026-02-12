"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image";
import Link from "next/link";
import { api } from '@/lib/api'


export default function Page() {
    return (
        <div className={"flex h-screen items-center justify-center"}>
            <CardDemo />
        </div>
    )
}

const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
const githubOAuthUrl = process.env.NEXT_PUBLIC_GITHUB_OAUTH_URL;

export function CardDemo() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [org_mail, setOrgMail] = useState("")
    const [org_name, setOrgName] = useState("")
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setLoading(true)
            setError("")

            try {
                const res = await api.post(
                    "/auth/register",
                    {
                        name,
                        email,
                        password,
                        org_name,
                        org_mail
                    }
                )
                router.push('/dashboard')
            }catch (err: any){
                if (err.response){
                    setError(err.response.data.message)
                } else {
                    setError("Something went wrong.")
                }
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

    return (
        <Card className="w-full max-w-sm bg-slate-950 opacity-90 text-white rounded-3xl">
            <div className={"flex justify-center items-center w-full"}>
                <Image src={"/streetlights.png"} alt={"streetlights"} width={48} height={12} />
            </div>

            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                    Create an account to start using UPTOR monitoring
                </CardDescription>
                <CardAction>
                    <Button variant="outline" className={"text-white bg-slate-900"} disabled={loading}>
                        <Link href="/login">
                            Log In
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="name">Name</Label>
                                </div>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    required
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    required
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                            <div className="flex items-center">
                            <Label htmlFor="org name">Organisation Name</Label>
                            </div>
                            <Input 
                                    id="org name"
                                    type="text" 
                                    placeholder="Enter name of your organisation" 
                                    required
                                    value={org_name}
                                    onChange={(e)=>setOrgName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                            <div className="flex items-center">
                            <Label htmlFor="org mail">Organisation Mail</Label>
                            </div>
                            <Input 
                                id="org mail" 
                                type="email" 
                                placeholder="Enter mail of your organisation" 
                                required
                                value={org_mail}
                                onChange={(e)=>setOrgMail(e.target.value)}
                            />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 mt-5">
                        {error && (
                            <div className="text-red-500 text-sm mb-2">
                                {error}
                            </div>
                            )
                        }
                        <Button type="submit" className="w-full hover:bg-slate-700" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                        
                        <div className="text-xs text-muted-foreground mt-2">Or continue with</div>
                        <OAuthButton label="Sign Up with Google" href={googleOAuthUrl} />
                        <OAuthButton label="Sign Up with GitHub" href={githubOAuthUrl} />
                    </CardFooter>
                </form>
        </Card>
    )
}

function OAuthButton({ label, href }: { label: string; href?: string }) {
    if (!href) {
        return (
            <Button variant="ghost" className="w-full" disabled>
                {label}
            </Button>
        );
    }

    return (
        <Button variant="ghost" className="w-full" asChild>
            <a href={href}>{label}</a>
        </Button>
    );
}
