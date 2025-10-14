'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClearAuthPage() {
  const router = useRouter()
  const [cleared, setCleared] = useState(false)

  const clearAllAuth = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    })
    
    setCleared(true)
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  useEffect(() => {
    // Auto-clear on mount
    clearAllAuth()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔄 Clearing Authentication</CardTitle>
          <CardDescription>
            Removing all authentication data...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cleared ? (
            <>
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Authentication cleared successfully!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Clearing...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

