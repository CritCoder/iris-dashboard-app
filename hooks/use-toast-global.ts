"use client"

import { useToasts } from '@/components/ui/toast'

export const useToast = () => {
  const toasts = useToasts()
  
  return {
    toast: toasts.message,
    success: toasts.success,
    warning: toasts.warning,
    error: toasts.error,
    // Legacy compatibility with existing toast system
    message: toasts.message,
  }
}
