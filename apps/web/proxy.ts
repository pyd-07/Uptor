import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = [
    "/dashboard",
    "/alerts",
    "/monitors",
    "/subscriptions",
]

const authPaths = [
    "/login",
    "/register",
]

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isProtected = protectedPaths.some(Path =>
        pathname.startsWith(Path)
    )

    const isAuthentication = authPaths.some(Path =>
        pathname.startsWith(Path)
    )

    const hasAuth = request.cookies.has("auth_token");
    if (isProtected && !hasAuth ) {
        return NextResponse.redirect(new URL('/login', request.url));
    } else if (isAuthentication && hasAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next()
}

