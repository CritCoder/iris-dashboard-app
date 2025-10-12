'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: { email: string; password: string }) => Promise<boolean>
  otpLogin: (data: { phoneNumber: string; otp: string }) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      // For testing purposes, if it's a mock token, create a mock user
      if (token.startsWith('mock_token_')) {
        const mockUser = {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        }
        setUser(mockUser)
        setLoading(false)
        return
      }

      // Original API call (commented out for testing)
      /*
      const response = await fetch('https://irisnet.wiredleap.com/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUser(result.data)
        } else {
          localStorage.removeItem('auth_token')
          setUser(null)
        }
      } else {
        localStorage.removeItem('auth_token')
        setUser(null)
      }
      */
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      const response = await fetch('https://irisnet.wiredleap.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const result = await response.json()

      if (result.success && result.data?.token) {
        localStorage.setItem('auth_token', result.data.token)
        setUser(result.data.user)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(result.error?.message || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
      return false
    }
  }

  const otpLogin = async (data: { phoneNumber: string; otp: string }): Promise<boolean> => {
    try {
      // For testing purposes, accept any 6-digit OTP
      if (data.otp.length === 6 && /^\d+$/.test(data.otp)) {
        // Mock successful login for testing
        const mockToken = 'mock_token_' + Date.now()
        const mockUser = {
          id: '1',
          email: data.phoneNumber + '@example.com',
          name: 'Test User',
          role: 'user'
        }
        
        localStorage.setItem('auth_token', mockToken)
        setUser(mockUser)
        toast.success('Login successful! (Mock authentication)')
        return true
      } else {
        toast.error('Please enter a valid 6-digit OTP')
        return false
      }
      
      // Original API call (commented out for testing)
      /*
      const response = await fetch('https://irisnet.wiredleap.com/api/auth/otpLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success && result.data?.token) {
        localStorage.setItem('auth_token', result.data.token)
        setUser(result.data.user)
        toast.success('Login successful!')
        return true
      } else {
        toast.error(result.error?.message || 'OTP verification failed')
        return false
      }
      */
    } catch (error) {
      console.error('OTP login error:', error)
      toast.error('OTP verification failed. Please try again.')
      return false
    }
  }

  const logout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.clear()
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      })

      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error during logout')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Redirect to login if not authenticated and not on a public route
  useEffect(() => {
    if (!loading && !user) {
      const publicRoutes = ['/login', '/signup', '/forgot-password', '/login/verify-otp']
      if (!publicRoutes.includes(pathname)) {
        router.push('/login')
      }
    }
  }, [user, loading, pathname, router])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    otpLogin,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
