'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if still loading or on auth pages
    if (loading) return
    
    const authPages = ['/login', '/signup', '/forgot-password', '/debug-auth', '/clear-auth']
    const isAuthPage = authPages.some(page => pathname?.startsWith(page))
    
    // If not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !isAuthPage) {
      console.log('ProtectedRoute: User not authenticated, redirecting to login from', pathname)
      // Store the intended destination in sessionStorage
      if (pathname) {
        sessionStorage.setItem('redirectPath', pathname)
      }
      router.push('/login')
    }
  }, [isAuthenticated, loading, pathname, router])
  
  // Allow auth pages to render without authentication
  const authPages = ['/login', '/signup', '/forgot-password', '/debug-auth', '/clear-auth']
  const isAuthPage = authPages.some(page => pathname?.startsWith(page))
  
  if (isAuthPage) {
    return <>{children}</>
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
