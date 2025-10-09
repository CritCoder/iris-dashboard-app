'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Mail, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactInfo {
  method: 'email' | 'mobile'
  value: string
  displayValue: string
}

export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [isVerifying, setIsVerifying] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get contact info from sessionStorage
    const storedContactInfo = sessionStorage.getItem('otpContactInfo')
    if (storedContactInfo) {
      setContactInfo(JSON.parse(storedContactInfo))
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
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
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
    
    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear session storage
    sessionStorage.removeItem('otpContactInfo')
    
    setIsVerifying(false)
    router.push('/')
  }

  const handleResend = async () => {
    if (!contactInfo) return
    
    setTimer(60)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    
    // Simulate API call to resend OTP
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

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
              </div>
            </div>
          )}
        </div>

        {/* OTP Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
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
                  className="w-12 h-14 text-center text-2xl font-bold bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
            <button className="text-sm text-zinc-500 hover:text-zinc-300">
              Having trouble? Contact support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}