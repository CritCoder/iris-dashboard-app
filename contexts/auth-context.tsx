'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthManager } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
  [key: string]: any
}

interface Organization {
  id: string
  name: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  organization: Organization | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  hasVerificationIssues: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  otpLogin: (phoneNumber: string, otp?: string) => Promise<{ success: boolean; data?: any; error?: string }>
  logout: () => void
  addUser: (userData: any) => Promise<{ success: boolean; user?: any; error?: string }>
  getOrganizationUsers: () => Promise<{ success: boolean; users?: any[]; error?: string }>
  apiCall: (endpoint: string, options?: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verificationAttempts, setVerificationAttempts] = useState(0)
  const router = useRouter()
  const pathname = usePathname()


  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/privacy', '/verify-otp']
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))

  useEffect(() => {
    // Skip authentication checks for public routes
    if (isPublicRoute) {
      setIsLoading(false)
      return
    }

    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedOrganization = localStorage.getItem('organization')

    if (storedToken && storedUser && storedOrganization) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setOrganization(JSON.parse(storedOrganization))
        
        // Also restore cookie for middleware
        document.cookie = `auth_token=${storedToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
        
        // Set loading to false immediately for better UX
        setIsLoading(false)
        
        // Verify token in background (non-blocking)
        verifyTokenWithRetry(storedToken)
      } catch (error) {
        console.warn('Error parsing stored auth data:', error)
        logout()
        return
      }
    } else {
      // Set loading to false immediately if no stored auth data
      setIsLoading(false)
    }
  }, [pathname, isPublicRoute])

  // Redirect authenticated users away from login pages
  useEffect(() => {
    if (!isLoading && user && token && isPublicRoute) {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem('redirectPath')
      
      if (redirectPath) {
        console.log('User is authenticated, redirecting to stored path:', redirectPath)
        sessionStorage.removeItem('redirectPath')
        router.push(redirectPath)
      } else {
        console.log('User is authenticated, redirecting from', pathname, 'to dashboard')
        router.push('/')
      }
    }
  }, [isLoading, user, token, isPublicRoute, pathname, router])

  const verifyTokenWithRetry = async (tokenToVerify: string, attempt = 1) => {
    const maxAttempts = 2 // Reduced from 3
    const retryDelay = Math.min(500 * Math.pow(2, attempt - 1), 2000) // Reduced delays

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        },
        signal: AbortSignal.timeout(3000) // Reduced from 10000
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
        setVerificationAttempts(0)
        console.log('Token verification successful')
      } else if (response.status === 401) {
        console.log('Token is invalid or expired, logging out')
        logout()
      } else {
        throw new Error(`Server error: ${response.status}`)
      }
    } catch (error: any) {
      console.warn(`Token verification attempt ${attempt} failed:`, error.message)
      
      if (attempt < maxAttempts) {
        setTimeout(() => {
          verifyTokenWithRetry(tokenToVerify, attempt + 1)
        }, retryDelay)
      } else {
        console.warn('Token verification failed after maximum attempts.')
        setVerificationAttempts(maxAttempts)
        // Don't set isLoading to false here - let the timeout handle it
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Login failed')
      }

      const { token: newToken, user: userData, organization: orgData } = data.data
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('organization', JSON.stringify(orgData))

      // Also set cookie for middleware
      document.cookie = `auth_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`

      AuthManager.setToken(newToken)
      AuthManager.setUser(userData)
      AuthManager.setOrganization(orgData)

      setToken(newToken)
      setUser(userData)
      setOrganization(orgData)
      setVerificationAttempts(0)
      setIsLoading(false)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const otpLogin = async (phoneNumber: string, otp: string = '') => {
    try {
      // Remove the + sign from the beginning of the phone number if present
      const cleanPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
      
      const response = await fetch(`${API_BASE_URL}/api/auth/otpLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: cleanPhoneNumber, otp }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'You are not authorized to login.')
      }

      // If OTP was provided and verification successful, store auth data
      if (otp && data.data.token) {
        const { token: newToken, user: userData, organization: orgData } = data.data
        
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('organization', JSON.stringify(orgData))

        // Also set cookie for middleware
        document.cookie = `auth_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`

        AuthManager.setToken(newToken)
        AuthManager.setUser(userData)
        AuthManager.setOrganization(orgData)

        setToken(newToken)
        setUser(userData)
        setOrganization(orgData)
        setVerificationAttempts(0)
        setIsLoading(false)
      }

      return { success: true, data: data.data }
    } catch (error: any) {
      const isNetworkError = error?.name === 'TypeError' || /Failed to fetch/i.test(error?.message || '')
      if (isNetworkError) {
        return { 
          success: false, 
          error: `Cannot reach API at ${API_BASE_URL}. Is the backend running and accessible?`
        }
      }
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
    
    // Also clear cookie for middleware
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    AuthManager.clearToken()
    
    setToken(null)
    setUser(null)
    setOrganization(null)
    setIsLoading(false)
    setVerificationAttempts(0)
    
    if (typeof window !== 'undefined' && !isPublicRoute) {
      window.location.href = '/login'
    }
  }

  const addUser = async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to add user')
      }

      return { success: true, user: data.data.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const getOrganizationUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/organization-users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users')
      }

      return { success: true, users: data.data.users }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const apiCall = async (endpoint: string, options: any = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (response.status === 401) {
        logout()
        throw new Error('Session expired')
      }

      return data
    } catch (error: any) {
      if (error.message === 'Session expired') {
        throw error
      }
      throw new Error('Network error')
    }
  }

  const value = {
    user,
    organization,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    hasVerificationIssues: verificationAttempts >= 3,
    login,
    otpLogin,
    logout,
    addUser,
    getOrganizationUsers,
    apiCall
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protecting routes
export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated, isLoading, hasVerificationIssues } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !isAuthenticated && !hasVerificationIssues) {
        router.push('/login')
      }
    }, [isAuthenticated, isLoading, hasVerificationIssues, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated && !hasVerificationIssues) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}
