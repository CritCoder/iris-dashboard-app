// Auth utility functions

import { AuthManager } from './api'

/**
 * Ensures the auth token is loaded from localStorage
 * This should be called before making any authenticated API requests
 */
export function ensureAuthToken(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const token = localStorage.getItem('token')
  
  if (token) {
    // Ensure token is set in AuthManager
    AuthManager.setToken(token)
    console.log('AuthUtils: Token ensured in AuthManager')
    return true
  }

  console.warn('AuthUtils: No auth token found in localStorage')
  return false
}

/**
 * Gets the current auth token
 */
export function getAuthToken(): string | null {
  return AuthManager.getToken()
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!AuthManager.getToken()
}

/**
 * Gets the current user
 */
export function getUser(): any {
  return AuthManager.getUser()
}

/**
 * Gets the current organization
 */
export function getOrganization(): any {
  return AuthManager.getOrganization()
}

/**
 * Clears all auth data
 */
export function clearAuth(): void {
  AuthManager.clearToken()
}

