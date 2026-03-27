// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const publicRoutes = ["/about", "/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/about', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files like CSS/JS)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with an extension (e.g., .svg, .png, .jpg, .css)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

