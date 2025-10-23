/**
 * Comprehensive Input Sanitization Utilities
 * Production-grade sanitization for all input types across the platform
 */

// Types for sanitization options
export interface SanitizationOptions {
  trim?: boolean
  removeExtraSpaces?: boolean
  maxLength?: number
  minLength?: number
  allowEmpty?: boolean
  preserveNewlines?: boolean
  removeHtml?: boolean
  normalizeUnicode?: boolean
}

// Default sanitization options
const DEFAULT_OPTIONS: SanitizationOptions = {
  trim: true,
  removeExtraSpaces: true,
  allowEmpty: false,
  preserveNewlines: false,
  removeHtml: true,
  normalizeUnicode: true
}

/**
 * Sanitizes text input by removing extra spaces, trimming, and normalizing
 */
export function sanitizeText(
  input: string, 
  options: SanitizationOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let sanitized = input

  // Normalize unicode characters
  if (opts.normalizeUnicode) {
    sanitized = sanitized.normalize('NFC')
  }

  // Remove HTML tags if specified
  if (opts.removeHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }

  // Remove extra spaces and normalize whitespace
  if (opts.removeExtraSpaces) {
    sanitized = sanitized.replace(/\s+/g, ' ')
  }

  // Trim whitespace
  if (opts.trim) {
    sanitized = sanitized.trim()
  }

  // Preserve newlines if specified
  if (!opts.preserveNewlines) {
    sanitized = sanitized.replace(/\n/g, ' ')
  }

  // Apply length constraints
  if (opts.maxLength && sanitized.length > opts.maxLength) {
    sanitized = sanitized.substring(0, opts.maxLength)
  }

  if (opts.minLength && sanitized.length < opts.minLength && !opts.allowEmpty) {
    throw new Error(`Input must be at least ${opts.minLength} characters long`)
  }

  return sanitized
}

/**
 * Sanitizes email input
 */
export function sanitizeEmail(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 254, // RFC 5321 limit
    allowEmpty: false
  })

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format')
  }

  return sanitized.toLowerCase()
}

/**
 * Sanitizes phone number input (India specific)
 */
export function sanitizePhone(input: string): string {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '')
  
  // Validate length (should be 10 digits for India)
  if (digitsOnly.length !== 10) {
    throw new Error('Phone number must be exactly 10 digits')
  }

  // Validate that it's not all zeros or all same digits
  if (digitsOnly === '0000000000' || /^(\d)\1{9}$/.test(digitsOnly)) {
    throw new Error('Invalid phone number')
  }

  return digitsOnly
}

/**
 * Sanitizes password input
 */
export function sanitizePassword(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: false, // Don't trim passwords
    removeExtraSpaces: false, // Allow spaces in passwords
    minLength: 8,
    maxLength: 128
  })

  // Check for common weak passwords
  const weakPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]

  if (weakPasswords.includes(sanitized.toLowerCase())) {
    throw new Error('Password is too common. Please choose a stronger password.')
  }

  return sanitized
}

/**
 * Sanitizes OTP input
 */
export function sanitizeOTP(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 6,
    minLength: 6
  })

  // Ensure it's only digits
  if (!/^\d{6}$/.test(sanitized)) {
    throw new Error('OTP must be exactly 6 digits')
  }

  return sanitized
}

/**
 * Sanitizes search query input
 */
export function sanitizeSearchQuery(input: string): string {
  return sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 500,
    allowEmpty: true,
    removeHtml: true
  })
}

/**
 * Sanitizes name input (for user names, organization names, etc.)
 */
export function sanitizeName(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 100,
    minLength: 1,
    allowEmpty: false
  })

  // Remove special characters but allow basic punctuation
  const cleaned = sanitized.replace(/[<>{}[\]\\|`~!@#$%^&*()+=]/g, '')
  
  if (cleaned.length === 0) {
    throw new Error('Name cannot be empty or contain only special characters')
  }

  return cleaned
}

/**
 * Sanitizes URL input
 */
export function sanitizeURL(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 2048,
    allowEmpty: false
  })

  try {
    const url = new URL(sanitized)
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are allowed')
    }
    return url.toString()
  } catch {
    throw new Error('Invalid URL format')
  }
}

/**
 * Sanitizes social media handle/username
 */
export function sanitizeSocialHandle(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 30,
    minLength: 1,
    allowEmpty: false
  })

  // Remove @ symbol if present
  const cleaned = sanitized.replace(/^@/, '')
  
  // Allow only alphanumeric, underscores, and dots
  if (!/^[a-zA-Z0-9._]+$/.test(cleaned)) {
    throw new Error('Social media handle can only contain letters, numbers, underscores, and dots')
  }

  return cleaned
}

/**
 * Sanitizes location/address input
 */
export function sanitizeLocation(input: string): string {
  return sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 200,
    allowEmpty: true
  })
}

/**
 * Sanitizes description/textarea input
 */
export function sanitizeDescription(input: string): string {
  return sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 1000,
    allowEmpty: true,
    preserveNewlines: true
  })
}

/**
 * Sanitizes numeric input
 */
export function sanitizeNumber(input: string, options: { min?: number; max?: number; allowDecimals?: boolean } = {}): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    allowEmpty: false
  })

  const { min, max, allowDecimals = false } = options
  const regex = allowDecimals ? /^-?\d*\.?\d+$/ : /^-?\d+$/
  
  if (!regex.test(sanitized)) {
    throw new Error(allowDecimals ? 'Must be a valid number' : 'Must be a valid integer')
  }

  const num = allowDecimals ? parseFloat(sanitized) : parseInt(sanitized, 10)
  
  if (min !== undefined && num < min) {
    throw new Error(`Value must be at least ${min}`)
  }
  
  if (max !== undefined && num > max) {
    throw new Error(`Value must be at most ${max}`)
  }

  return sanitized
}

/**
 * Sanitizes date input
 */
export function sanitizeDate(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    allowEmpty: false
  })

  const date = new Date(sanitized)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }

  return sanitized
}

/**
 * Sanitizes file name input
 */
export function sanitizeFileName(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 255,
    allowEmpty: false
  })

  // Remove invalid characters for file names
  const cleaned = sanitized.replace(/[<>:"/\\|?*]/g, '')
  
  if (cleaned.length === 0) {
    throw new Error('Invalid file name')
  }

  return cleaned
}

/**
 * Sanitizes hashtag input
 */
export function sanitizeHashtag(input: string): string {
  const sanitized = sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 50,
    allowEmpty: false
  })

  // Remove # symbol if present
  const cleaned = sanitized.replace(/^#/, '')
  
  // Allow only alphanumeric and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) {
    throw new Error('Hashtag can only contain letters, numbers, and underscores')
  }

  return cleaned
}

/**
 * Sanitizes entity/topic input
 */
export function sanitizeEntity(input: string): string {
  return sanitizeText(input, {
    trim: true,
    removeExtraSpaces: true,
    maxLength: 100,
    allowEmpty: false
  })
}

/**
 * Generic sanitization function that determines type automatically
 */
export function sanitizeInput(input: string, type: 'text' | 'email' | 'phone' | 'password' | 'otp' | 'search' | 'name' | 'url' | 'social' | 'location' | 'description' | 'number' | 'date' | 'filename' | 'hashtag' | 'entity', options?: any): string {
  switch (type) {
    case 'email':
      return sanitizeEmail(input)
    case 'phone':
      return sanitizePhone(input)
    case 'password':
      return sanitizePassword(input)
    case 'otp':
      return sanitizeOTP(input)
    case 'search':
      return sanitizeSearchQuery(input)
    case 'name':
      return sanitizeName(input)
    case 'url':
      return sanitizeURL(input)
    case 'social':
      return sanitizeSocialHandle(input)
    case 'location':
      return sanitizeLocation(input)
    case 'description':
      return sanitizeDescription(input)
    case 'number':
      return sanitizeNumber(input, options)
    case 'date':
      return sanitizeDate(input)
    case 'filename':
      return sanitizeFileName(input)
    case 'hashtag':
      return sanitizeHashtag(input)
    case 'entity':
      return sanitizeEntity(input)
    case 'text':
    default:
      return sanitizeText(input, options)
  }
}

/**
 * Validation helper for form fields
 */
export function validateField(value: string, type: string, required: boolean = true): { isValid: boolean; error?: string; sanitized?: string } {
  try {
    if (required && (!value || value.trim().length === 0)) {
      return { isValid: false, error: 'This field is required' }
    }

    if (!required && (!value || value.trim().length === 0)) {
      return { isValid: true, sanitized: '' }
    }

    const sanitized = sanitizeInput(value, type as any)
    return { isValid: true, sanitized }
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid input'
    }
  }
}
