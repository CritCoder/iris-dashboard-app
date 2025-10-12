'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const publicRoutes = ['/login', '/signup', '/forgot-password', '/login/verify-otp']
      if (!publicRoutes.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  // Show loading while checking authentication
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

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/login/verify-otp']
    if (!publicRoutes.includes(pathname)) {
      return null // Will redirect to login
    }
  }

  return <>{children}</>
}
