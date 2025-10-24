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
]

// Define public route patterns that don't require authentication
const publicRoutePatterns = [
  // No public route patterns - all routes require authentication
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
    const response = NextResponse.next()
    // Add cache-busting headers for development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
    return response
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    const response = NextResponse.next()
    // Add cache-busting headers for development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
    return response
  }

  // Allow access to public route patterns
  if (publicRoutePatterns.some(pattern => pattern.test(pathname))) {
    const response = NextResponse.next()
    // Add cache-busting headers for development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
      response.headers.set('Pragma', 'no-cache')
      response.headers.set('Expires', '0')
    }
    return response
  }

  // Since we use localStorage for tokens (client-side), we can't check them in middleware
  // The ProtectedRoute component will handle authentication on the client side
  // For now, allow all requests to pass through and let client-side auth handle it
  const response = NextResponse.next()
  // Add cache-busting headers for development
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  return response
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

