'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'

export default function DebugAuthPage() {
  const router = useRouter()
  const { login, user, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const checkToken = () => {
    const t = localStorage.getItem('auth_token')
    setToken(t)
  }

  const clearEverything = () => {
    localStorage.clear()
    sessionStorage.clear()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    })
    setToken(null)
    alert('Everything cleared!')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const success = await login({ email, password })
      if (success) {
        checkToken()
        router.push('/social-feed')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setToken(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔐 Auth Debug Panel</CardTitle>
          <CardDescription>
            Debug and manage authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token Status */}
          <div className="space-y-2">
            <Label>Token Status</Label>
            <div className="flex items-center gap-2">
              <Button onClick={checkToken} variant="outline" size="sm">
                Check Token
              </Button>
              {token ? (
                <span className="text-green-600 text-sm">✅ Token exists ({token.length} chars)</span>
              ) : (
                <span className="text-red-600 text-sm">❌ No token</span>
              )}
            </div>
            {token && (
              <p className="text-xs text-muted-foreground break-all">
                {token.substring(0, 50)}...
              </p>
            )}
          </div>

          {/* User Status */}
          <div className="space-y-2">
            <Label>User Status</Label>
            {user ? (
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not logged in</p>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* Actions */}
            <div className="space-y-2">
              {user && (
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Logout
                </Button>
              )}
              <Button onClick={clearEverything} variant="destructive" className="w-full">
                Clear Everything
              </Button>
              <Button onClick={() => router.push('/social-feed')} variant="secondary" className="w-full">
                Go to Social Feed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

