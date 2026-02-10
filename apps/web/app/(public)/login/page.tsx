import React from 'react'
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

export default function Page() {
    return (
        <div className={"flex h-screen items-center justify-center"}>
            <CardDemo />
        </div>
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

export function CardDemo() {
    const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
    const githubOAuthUrl = process.env.NEXT_PUBLIC_GITHUB_OAUTH_URL;

    return (
        <Card className="w-full max-w-sm bg-slate-950 opacity-90 text-white rounded-3xl">
            <div className={"flex justify-center items-center w-full"}>
                <Image src={"/streetlights.png"} alt={"streetlights"} width={48} height={12} />
            </div>

            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Button variant="outline" className={"text-white bg-slate-900"}>
                        <Link href="/register">
                            Register
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" placeholder="Enter your password" required/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full hover:bg-slate-700">
                    Log In
                </Button>
                <div className="text-xs text-muted-foreground mt-2">Or continue with</div>
                <OAuthButton label="Log In with Google" href={googleOAuthUrl} />
                <OAuthButton label="Log In with GitHub" href={githubOAuthUrl} />
            </CardFooter>
        </Card>
    )
}
