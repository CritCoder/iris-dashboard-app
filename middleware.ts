import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/login/verify-otp',
  '/signup/verify-otp',
  '/forgot-password/verify-otp',
  '/forgot-password/reset',
  '/test-animations',
  '/page-test',
  '/test-map', // For testing Google Maps
  '/test-osm', // For testing OpenStreetMap
  '/social-feed', // Temporarily public for development
  '/locations', // Temporarily public for development
  '/profiles', // Temporarily public for development
  '/analysis-history', // Temporarily public for development
  '/communities-groups', // Temporarily public for development
  '/', // Dashboard temporarily public for development
]

// Define public route patterns that don't require authentication
const publicRoutePatterns = [
  /^\/social-feed\/post\/[^\/]+$/, // Social feed individual posts
  /^\/analysis-history\/[^\/]+\/post\/[^\/]+$/, // Analysis history individual posts
]

// Define static assets and Next.js internals to exclude from middleware
const excludedPaths = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/placeholder.svg',
  '/waves.mp4',
  '/waves2.mp4',
  '/public',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for excluded paths
  if (excludedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow access to public route patterns
  if (publicRoutePatterns.some(pattern => pattern.test(pathname))) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get('auth_token')?.value

  // If no token found, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    // Add the original URL as a redirect parameter so we can send them back after login
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token exists, allow the request to continue
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

