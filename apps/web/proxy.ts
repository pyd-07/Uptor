import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";


const protected_routes = [
    "/monitors",
    "/alerts",
    "/dashboard",
    "/organization"
]

export async function proxy(req:NextRequest) {
    const {pathname} = req.nextUrl
    const isProtected = protected_routes.some(
        (route) => pathname.startsWith(route)
    )
    if (isProtected) {
        const token = req.cookies.get("auth_token")?.value
        if (!token) {
            return NextResponse.redirect(new URL(`/login`, req.url),{
                status: 401
            })
        }
    }
    return NextResponse.next()
}