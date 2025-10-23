'use client'

import React, { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useInputSanitization } from '@/hooks/use-input-sanitization'
import { UseSanitizationOptions } from '@/hooks/use-input-sanitization'

interface SanitizedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  sanitizationType: UseSanitizationOptions['type']
  onSanitizedChange?: (sanitized: string, isValid: boolean, error?: string) => void
  showValidation?: boolean
  errorClassName?: string
  successClassName?: string
}

export const SanitizedInput = forwardRef<HTMLInputElement, SanitizedInputProps>(
  ({ 
    sanitizationType, 
    onSanitizedChange, 
    showValidation = true,
    errorClassName,
    successClassName,
    className,
    ...props 
  }, ref) => {
    const sanitization = useInputSanitization(props.value as string || '', {
      type: sanitizationType,
      required: props.required,
      onError: (error) => onSanitizedChange?.(props.value as string || '', false, error),
      onSuccess: (sanitized) => onSanitizedChange?.(sanitized, true)
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      sanitization.sanitize(value)
      props.onChange?.(e)
    }

    const getValidationClassName = () => {
      if (!showValidation) return ''
      
      if (sanitization.isDirty) {
        if (sanitization.isValid) {
          return successClassName || 'border-green-500 focus:border-green-500'
        } else {
          return errorClassName || 'border-red-500 focus:border-red-500'
        }
      }
      
      return ''
    }

    return (
      <div className="relative">
        <Input
          ref={ref}
          {...props}
          onChange={handleChange}
          className={cn(
            className,
            getValidationClassName()
          )}
        />
        {showValidation && sanitization.isDirty && !sanitization.isValid && sanitization.error && (
          <p className="text-red-500 text-xs mt-1">{sanitization.error}</p>
        )}
        {showValidation && sanitization.isDirty && sanitization.isValid && (
          <p className="text-green-500 text-xs mt-1">✓ Valid</p>
        )}
      </div>
    )
  }
)

SanitizedInput.displayName = 'SanitizedInput'

// Pre-configured components for common use cases
export const SanitizedEmailInput = forwardRef<HTMLInputElement, Omit<SanitizedInputProps, 'sanitizationType'>>(
  (props, ref) => <SanitizedInput ref={ref} sanitizationType="email" {...props} />
)

export const SanitizedPhoneInput = forwardRef<HTMLInputElement, Omit<SanitizedInputProps, 'sanitizationType'>>(
  (props, ref) => <SanitizedInput ref={ref} sanitizationType="phone" {...props} />
)

export const SanitizedPasswordInput = forwardRef<HTMLInputElement, Omit<SanitizedInputProps, 'sanitizationType'>>(
  (props, ref) => <SanitizedInput ref={ref} sanitizationType="password" {...props} />
)

export const SanitizedNameInput = forwardRef<HTMLInputElement, Omit<SanitizedInputProps, 'sanitizationType'>>(
  (props, ref) => <SanitizedInput ref={ref} sanitizationType="name" {...props} />
)

export const SanitizedSearchInput = forwardRef<HTMLInputElement, Omit<SanitizedInputProps, 'sanitizationType'>>(
  (props, ref) => <SanitizedInput ref={ref} sanitizationType="search" {...props} />
)

export const SanitizedOTPInput = forwardRef<HTMLInputElement, Omit<SanitizedInputProps, 'sanitizationType'>>(
  (props, ref) => <SanitizedInput ref={ref} sanitizationType="otp" {...props} />
)

SanitizedEmailInput.displayName = 'SanitizedEmailInput'
SanitizedPhoneInput.displayName = 'SanitizedPhoneInput'
SanitizedPasswordInput.displayName = 'SanitizedPasswordInput'
SanitizedNameInput.displayName = 'SanitizedNameInput'
SanitizedSearchInput.displayName = 'SanitizedSearchInput'
SanitizedOTPInput.displayName = 'SanitizedOTPInput'
