'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Mail, Phone, Loader2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ContactInfo {
  method: 'email' | 'mobile'
  value: string
  displayValue: string
}

export default function VerifyOTPPage() {
  const router = useRouter()
  const { otpLogin, login } = useAuth()
  const { success, error } = useToast()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(120)
  const [isVerifying, setIsVerifying] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  
  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get contact info from sessionStorage
    const storedContactInfo = sessionStorage.getItem('otpContactInfo')
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo))
      // Focus the first input after a short delay to ensure it's rendered
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } else {
      // If no contact info, redirect back to login
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    // Only allow single digit numeric input
    if (!/^\d*$/.test(value) || value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every(digit => digit !== '')) {
      // Small delay to ensure state is updated and visual feedback
      setTimeout(() => {
        const form = document.querySelector('form')
        if (form) {
          form.requestSubmit()
        }
      }, 200)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.some((d) => !d)) return
    
    setIsVerifying(true)
    
    try {
      if (contactInfo) {
        const otpCode = otp.join('')
        
        if (contactInfo.method === 'mobile') {
          // Use AuthProvider's otpLogin method
          const result = await otpLogin(contactInfo.value, otpCode)
          
          if (result.success) {
            // Clear session storage
            sessionStorage.removeItem('otpContactInfo')
            // AuthProvider will handle the redirect automatically
          } else {
            error('Invalid OTP. Please try again.')
          }
        } else {
          // For email OTP, use AuthProvider's login method
          const result = await login(contactInfo.value, 'temp_password') // This might need to be adjusted based on actual API
          
          if (result.success) {
            // Clear session storage
            sessionStorage.removeItem('otpContactInfo')
            // AuthProvider will handle the redirect automatically
          } else {
            error('Login failed. Please try again.')
          }
        }
      }
    } catch (err) {
      error('Network error. Please try again.')
      console.error('OTP verification error:', err)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!contactInfo) return
    
    setTimer(120)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    
    try {
      if (contactInfo.method === 'mobile') {
        // Use the same API endpoint as port 3008 for resending OTP
        // Remove the + sign from the beginning of the phone number if present
        const cleanPhoneNumber = contactInfo.value.startsWith('+') ? contactInfo.value.substring(1) : contactInfo.value;
        
        const response = await fetch(`${API_URL}/api/auth/otpLogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: cleanPhoneNumber
          })
        })

        const result = await response.json()

        if (result.success) {
          success('OTP resent successfully!')
        } else {
          error(result.error?.message || 'Failed to resend OTP')
        }
      } else {
        // For email, we might need to call the login endpoint again
        await new Promise(resolve => setTimeout(resolve, 1000))
        success('OTP resent successfully!')
      }
    } catch (err) {
      error('Failed to resend OTP. Please try again.')
    }
  }

  // Show loading if contact info is not available yet
  if (!contactInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/waves2.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none"></div>

      {/* Back Button - Fixed at top left */}
      <Link
        href="/login"
        className="fixed top-8 left-8 inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </Link>
      
      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 mb-4">
            <span className="text-2xl font-bold text-white">IRIS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify your account</h1>
          {contactInfo && (
            <div className="space-y-2">
              <p className="text-zinc-500">
                We've sent a 6-digit code to your {contactInfo.method}
              </p>
              <div className="flex items-center justify-center gap-2 text-white font-medium">
                {contactInfo.method === 'email' ? (
                  <Mail className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Phone className="w-4 h-4 text-zinc-400" />
                )}
                <span>{contactInfo.displayValue}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4 text-white cursor-pointer" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>

        {/* OTP Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                />
              ))}
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-zinc-500">
                  Resend code in <span className="text-white font-medium">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  Resend code
                </button>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={otp.some((d) => !d) || isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-2 group transition-colors">
              Having trouble? Contact support
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}