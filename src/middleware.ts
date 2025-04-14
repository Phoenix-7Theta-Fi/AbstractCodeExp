import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define paths that require authentication
const protectedPaths = ['/dashboard']
// Define paths that should be inaccessible when authenticated
const authPaths = ['/', '/login', '/register']

// AbstractSnippet: MID001
// --- Middleware for Authentication Routing ---
export function middleware(request: NextRequest) {
    // Step 1: Extract the pathname from the incoming request URL
    const { pathname } = request.nextUrl

    // Step 2: Retrieve the 'session' cookie from the request
    const sessionCookie = request.cookies.get('session')
    // Step 3: Determine authentication status based on the presence of the session cookie's value
    const isAuthenticated = !!sessionCookie?.value

    // Step 4: Check if the user is authenticated AND trying to access an authentication-related path (e.g., login page)
    if (isAuthenticated && authPaths.includes(pathname)) {
        // Step 5a: If authenticated and on an auth path, redirect to the dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Step 6: Check if the user is NOT authenticated AND trying to access a protected path
    if (!isAuthenticated && protectedPaths.some(path => pathname.startsWith(path))) {
        // Step 7a: If unauthenticated and on a protected path, redirect to the root (login/register) page
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Step 8: If none of the redirect conditions are met, allow the request to proceed to the intended destination
    return NextResponse.next()
}

// Configure the paths that trigger the middleware
export const config = {
    matcher: [...protectedPaths, ...authPaths]
}
