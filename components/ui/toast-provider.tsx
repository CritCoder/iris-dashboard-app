"use client"

import { useToasts } from './toast'

export function ToastProvider() {
  // This component just initializes the toast system
  // The actual toast container is mounted automatically when needed
  return null
}

// Export the toast hooks for use throughout the app
export { useToasts }
