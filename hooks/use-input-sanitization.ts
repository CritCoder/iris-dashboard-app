'use client'

import { useState, useCallback, useRef } from 'react'
import { sanitizeInput, validateField, SanitizationOptions } from '@/lib/input-sanitization'

export interface UseSanitizationOptions {
  type: 'text' | 'email' | 'phone' | 'password' | 'otp' | 'search' | 'name' | 'url' | 'social' | 'location' | 'description' | 'number' | 'date' | 'filename' | 'hashtag' | 'entity'
  required?: boolean
  sanitizationOptions?: SanitizationOptions
  onError?: (error: string) => void
  onSuccess?: (sanitized: string) => void
}

export interface SanitizationResult {
  value: string
  sanitized: string
  isValid: boolean
  error?: string
  isDirty: boolean
}

/**
 * Hook for input sanitization with real-time validation
 */
export function useInputSanitization(
  initialValue: string = '',
  options: UseSanitizationOptions
) {
  const [result, setResult] = useState<SanitizationResult>({
    value: initialValue,
    sanitized: initialValue,
    isValid: true,
    isDirty: false
  })

  const timeoutRef = useRef<NodeJS.Timeout>()

  const sanitize = useCallback((input: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Debounce sanitization for better performance
    timeoutRef.current = setTimeout(() => {
      try {
        const validation = validateField(input, options.type, options.required)
        
        if (validation.isValid) {
          const sanitized = sanitizeInput(input, options.type, options.sanitizationOptions)
          
          setResult({
            value: input,
            sanitized,
            isValid: true,
            isDirty: input !== initialValue
          })

          options.onSuccess?.(sanitized)
        } else {
          setResult(prev => ({
            ...prev,
            value: input,
            isValid: false,
            error: validation.error,
            isDirty: input !== initialValue
          }))

          options.onError?.(validation.error || 'Invalid input')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Invalid input'
        
        setResult(prev => ({
          ...prev,
          value: input,
          isValid: false,
          error: errorMessage,
          isDirty: input !== initialValue
        }))

        options.onError?.(errorMessage)
      }
    }, 300) // 300ms debounce
  }, [options, initialValue])

  const reset = useCallback(() => {
    setResult({
      value: initialValue,
      sanitized: initialValue,
      isValid: true,
      isDirty: false
    })
  }, [initialValue])

  const clear = useCallback(() => {
    setResult({
      value: '',
      sanitized: '',
      isValid: true,
      isDirty: true
    })
  }, [])

  return {
    ...result,
    sanitize,
    reset,
    clear
  }
}

/**
 * Hook for form-level sanitization
 */
export function useFormSanitization<T extends Record<string, any>>(
  initialValues: T,
  fieldConfig: Record<keyof T, UseSanitizationOptions>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isValid, setIsValid] = useState(true)

  const updateField = useCallback((field: keyof T, value: string) => {
    const config = fieldConfig[field]
    const validation = validateField(value, config.type, config.required)

    setValues(prev => ({ ...prev, [field]: value }))
    
    if (validation.isValid) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } else {
      setErrors(prev => ({ ...prev, [field]: validation.error }))
    }

    // Check overall form validity
    const hasErrors = Object.keys(errors).length > 0
    setIsValid(!hasErrors && Object.keys(fieldConfig).every(field => {
      const config = fieldConfig[field]
      const fieldValue = field === field ? value : values[field]
      return !config.required || (fieldValue && fieldValue.trim().length > 0)
    }))
  }, [fieldConfig, errors, values])

  const sanitizeAll = useCallback(() => {
    const sanitizedValues = { ...values }
    const newErrors: Partial<Record<keyof T, string>> = {}

    Object.keys(fieldConfig).forEach(field => {
      const config = fieldConfig[field as keyof T]
      const value = values[field as keyof T]
      
      try {
        const sanitized = sanitizeInput(value, config.type, config.sanitizationOptions)
        sanitizedValues[field as keyof T] = sanitized
      } catch (error) {
        newErrors[field as keyof T] = error instanceof Error ? error.message : 'Invalid input'
      }
    })

    setValues(sanitizedValues)
    setErrors(newErrors)
    setIsValid(Object.keys(newErrors).length === 0)

    return { values: sanitizedValues, errors: newErrors, isValid: Object.keys(newErrors).length === 0 }
  }, [values, fieldConfig])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsValid(true)
  }, [initialValues])

  return {
    values,
    errors,
    isValid,
    updateField,
    sanitizeAll,
    reset
  }
}

/**
 * Hook for search input sanitization
 */
export function useSearchSanitization(initialQuery: string = '') {
  return useInputSanitization(initialQuery, {
    type: 'search',
    required: false,
    sanitizationOptions: {
      maxLength: 500,
      allowEmpty: true
    }
  })
}

/**
 * Hook for phone number sanitization
 */
export function usePhoneSanitization(initialPhone: string = '') {
  return useInputSanitization(initialPhone, {
    type: 'phone',
    required: true
  })
}

/**
 * Hook for email sanitization
 */
export function useEmailSanitization(initialEmail: string = '') {
  return useInputSanitization(initialEmail, {
    type: 'email',
    required: true
  })
}

/**
 * Hook for password sanitization
 */
export function usePasswordSanitization(initialPassword: string = '') {
  return useInputSanitization(initialPassword, {
    type: 'password',
    required: true
  })
}

/**
 * Hook for OTP sanitization
 */
export function useOTPSanitization(initialOTP: string = '') {
  return useInputSanitization(initialOTP, {
    type: 'otp',
    required: true
  })
}

/**
 * Hook for name sanitization
 */
export function useNameSanitization(initialName: string = '') {
  return useInputSanitization(initialName, {
    type: 'name',
    required: true
  })
}
