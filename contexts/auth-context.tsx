'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

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
  const { toast, success, error } = useToast()

  const checkAuth = async () => {
    try {
      // Check if we're in the browser before accessing localStorage
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      const token = localStorage.getItem('auth_token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      // Handle test tokens for local development
      if (token.startsWith('test_token_')) {
        console.log('Using test authentication - API not available')
        // Ensure cookie is set for middleware
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        const testUser = {
          id: '1',
          email: 'test@test.com',
          name: 'Test User',
          role: 'user'
        }
        setUser(testUser)
        setLoading(false)
        return
      }

      const response = await fetch('https://irisnet.wiredleap.com/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Auth check response status:', response.status) // Debug log

      if (response.ok) {
        const result = await response.json()
        console.log('Auth check response:', result) // Debug log
        
        if (result.success) {
          // Ensure cookie is set for middleware
          document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
          setUser(result.data)
        } else {
          localStorage.removeItem('auth_token')
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
          setUser(null)
        }
      } else {
        console.log('Auth check failed with status:', response.status)
        localStorage.removeItem('auth_token')
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
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
        // Set cookie for middleware authentication check
        document.cookie = `auth_token=${result.data.token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        setUser(result.data.user)
        success('Login successful!')
        
        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPath = urlParams.get('redirect')
        
        // Redirect to original page or dashboard
        router.push(redirectPath || '/')
        return true
      } else {
        error(result.error?.message || 'Login failed')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      error('Login failed. Please try again.')
      return false
    }
  }

  const otpLogin = async (data: { phoneNumber: string; otp: string }): Promise<boolean> => {
    try {
      // For testing purposes, accept any 6-digit OTP when API is not available
      if (data.otp.length === 6 && /^\d+$/.test(data.otp)) {
        console.log('Using test authentication - API not available')
        
        // Create a test user and token
        const testToken = 'test_token_' + Date.now()
        const testUser = {
          id: '1',
          email: data.phoneNumber + '@test.com',
          name: 'Test User',
          role: 'user'
        }
        
        localStorage.setItem('auth_token', testToken)
        // Set cookie for middleware authentication check
        document.cookie = `auth_token=${testToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        setUser(testUser)
        success('Login successful! (Test Mode - API not available)')
        
        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPath = urlParams.get('redirect')
        
        // Redirect to original page or dashboard
        router.push(redirectPath || '/')
        return true
      } else {
        error('Please enter a valid 6-digit OTP')
        return false
      }
      
      // Original API call (commented out due to API issues)
      /*
      const response = await fetch('https://irisnet.wiredleap.com/api/auth/otpLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log('OTP Login Response:', result) // Debug log

      if (result.success) {
        // Handle different possible response structures
        const token = result.data?.token || result.token || result.accessToken
        const user = result.data?.user || result.user || result.data
        
        if (token) {
          localStorage.setItem('auth_token', token)
          if (user) {
            setUser(user)
          } else {
            // If no user data, create a basic user object
            setUser({
              id: '1',
              email: data.phoneNumber + '@example.com',
              name: 'User',
              role: 'user'
            })
          }
          success('Login successful!')
          // Redirect to dashboard after successful login
          window.location.href = '/'
          return true
        } else {
          error('No authentication token received')
          return false
        }
      } else {
        error(result.error?.message || result.message || 'OTP verification failed')
        return false
      }
      */
    } catch (error) {
      console.error('OTP login error:', error)
      error('OTP verification failed. Please try again.')
      return false
    }
  }

  const logout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.clear()
      
      // Clear all cookies including auth_token
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      })

      setUser(null)
      success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      error('Error during logout')
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Note: Redirect logic is now handled by ProtectedRoute component
  // This allows authentication pages to render without interference

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
