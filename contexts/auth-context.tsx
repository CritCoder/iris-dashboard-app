'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { authApi, AuthManager } from '@/lib/api'

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
      console.log('AuthContext: Checking auth, token exists:', !!token)
      
      if (!token) {
        console.log('AuthContext: No token found, user not authenticated')
        setUser(null)
        setLoading(false)
        return
      }

      // Always set token in AuthManager first
      AuthManager.setToken(token)
      console.log('AuthContext: Token set in AuthManager')

      // Handle test tokens for local development (fallback only)
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

      // Use centralized API client
      const result = await authApi.getProfile()

      console.log('Auth check response:', result) // Debug log

      if (result.success && result.data) {
        // Ensure cookie is set for middleware
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        setUser(result.data)
      } else {
        console.log('Auth check failed:', result.message)
        localStorage.removeItem('auth_token')
        AuthManager.clearToken()
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      AuthManager.clearToken()
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      // Use centralized API client
      const result = await authApi.login(credentials)
      console.log('Login response:', result) // Debug log

      if (result.success && result.data?.token) {
        const token = result.data.token
        localStorage.setItem('auth_token', token)
        AuthManager.setToken(token)
        // Set cookie for middleware authentication check
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        setUser(result.data.user)
        success('Login successful!')
        
        // Check for redirect parameter in URL or sessionStorage
        const urlParams = new URLSearchParams(window.location.search)
        let redirectPath = urlParams.get('redirect')
        
        // If no redirect in URL, check sessionStorage (from ProtectedRoute)
        if (!redirectPath) {
          redirectPath = sessionStorage.getItem('redirectPath')
          sessionStorage.removeItem('redirectPath')
        }
        
        // Redirect to original page or dashboard
        console.log('Login: Redirecting to', redirectPath || '/')
        router.push(redirectPath || '/')
        return true
      } else {
        error(result.error?.message || result.message || 'Login failed')
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
      // Use centralized API client
      const result = await authApi.otpLogin(data)
      console.log('OTP Login Response:', result) // Debug log

      if (result.success) {
        // Handle different possible response structures
        const token = result.data?.token || result.token || result.accessToken
        const user = result.data?.user || result.user || result.data
        
        if (token) {
          localStorage.setItem('auth_token', token)
          AuthManager.setToken(token)
          // Set cookie for middleware authentication check
          document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
          
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
          
          // Check for redirect parameter in URL or sessionStorage
          const urlParams = new URLSearchParams(window.location.search)
          let redirectPath = urlParams.get('redirect')
          
          // If no redirect in URL, check sessionStorage (from ProtectedRoute)
          if (!redirectPath) {
            redirectPath = sessionStorage.getItem('redirectPath')
            sessionStorage.removeItem('redirectPath')
          }
          
          // Redirect to original page or dashboard
          console.log('OTP Login: Redirecting to', redirectPath || '/')
          router.push(redirectPath || '/')
          return true
        } else {
          error('No authentication token received')
          return false
        }
      } else {
        error(result.error?.message || result.message || 'OTP verification failed')
        return false
      }
    } catch (error) {
      console.error('OTP login error:', error)
      error('OTP verification failed. Please try again.')
      return false
    }
  }

  const logout = () => {
    try {
      console.log('Logout: Starting logout process...')
      
      // Clear authentication data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.clear()
      AuthManager.clearToken()
      
      console.log('Logout: Cleared localStorage and AuthManager')
      
      // Clear all cookies including auth_token
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      })

      console.log('Logout: Cleared cookies')

      setUser(null)
      console.log('Logout: User state cleared')
      
      success('Logged out successfully')
      console.log('Logout: Redirecting to login...')
      
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
