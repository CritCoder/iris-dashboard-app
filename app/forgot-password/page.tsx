'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Mail, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { PhoneInput } from '@/components/ui/phone-input'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [resetMethod, setResetMethod] = useState<'email' | 'mobile'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    countryCode: '+91'
  })
  
  // Get API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate input
    if (resetMethod === 'email' && !formData.email.trim()) {
      error('Please enter your email address')
      return
    }
    if (resetMethod === 'mobile' && !formData.mobile.trim()) {
      error('Please enter your mobile number')
      return
    }

    setIsLoading(true)

    try {
      if (resetMethod === 'email') {
        // For email reset, we'll use a generic reset endpoint
        const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email
          })
        })

        const result = await response.json()

        if (result.success) {
          // Store the contact info in sessionStorage for OTP verification page
          const contactInfo = {
            method: resetMethod,
            value: formData.email,
            displayValue: formData.email
          }

          sessionStorage.setItem('otpContactInfo', JSON.stringify(contactInfo))
          success('Reset code sent to your email!')
          router.push('/forgot-password/verify-otp')
        } else {
          error(result.error?.message || 'Failed to send reset code')
        }
      } else {
        // For mobile reset, use the OTP endpoint
        const phoneNumber = `${formData.countryCode}${formData.mobile}`
        // Remove the + sign from the beginning of the phone number if present
        const cleanPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
        
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
          // Store the contact info in sessionStorage for OTP verification page
          const contactInfo = {
            method: resetMethod,
            value: phoneNumber,
            displayValue: `${formData.countryCode} ${formData.mobile}`
          }

          sessionStorage.setItem('otpContactInfo', JSON.stringify(contactInfo))
          success('Reset code sent to your mobile!')
          router.push('/forgot-password/verify-otp')
        } else {
          error(result.error?.message || 'Failed to send reset code')
        }
      }
    } catch (err) {
      error('Failed to send reset code. Please try again.')
      console.error('Reset password error:', err)
    } finally {
      setIsLoading(false)
    }
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
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 perspective-1000">
            <svg 
              className="w-20 h-20 animate-rotate-3d" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Shield - Modern Rounded */}
              <path 
                d="M50 5 Q52 5 54 6.5 L85 22 Q87 23 87 25 L87 45 Q87 68 50 95 Q13 68 13 45 L13 25 Q13 23 15 22 L46 6.5 Q48 5 50 5 Z" 
                fill="url(#shieldGradient1)"
                stroke="url(#shieldStroke)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Middle Shield - Modern Rounded */}
              <path 
                d="M50 15 Q51.5 15 53 16 L75 29 Q76.5 30 76.5 32 L76.5 45 Q76.5 63 50 85 Q23.5 63 23.5 45 L23.5 32 Q23.5 30 25 29 L47 16 Q48.5 15 50 15 Z" 
                fill="url(#shieldGradient2)"
                opacity="0.8"
              />
              {/* Inner Shield - Modern Rounded */}
              <path 
                d="M50 25 Q51 25 52 25.5 L65 36 Q66 37 66 38.5 L66 45 Q66 58 50 75 Q34 58 34 45 L34 38.5 Q34 37 35 36 L48 25.5 Q49 25 50 25 Z" 
                fill="url(#shieldGradient3)"
                opacity="0.6"
              />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="shieldGradient1" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#71717a" />
                  <stop offset="100%" stopColor="#27272a" />
                </linearGradient>
                <linearGradient id="shieldGradient2" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#52525b" />
                  <stop offset="100%" stopColor="#18181b" />
                </linearGradient>
                <linearGradient id="shieldGradient3" x1="50" y1="25" x2="50" y2="75" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3f3f46" />
                  <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
                <linearGradient id="shieldStroke" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#a1a1aa" />
                  <stop offset="100%" stopColor="#52525b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Heading inside card */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Reset your password</h1>
            <p className="text-base text-zinc-400">Enter your email or mobile number to receive a verification code</p>
          </div>

          {/* Reset Method Toggle */}
          <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-sm border border-white/10 p-1.5 rounded-xl">
            <button
              onClick={() => setResetMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                resetMethod === 'email'
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setResetMethod('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                resetMethod === 'mobile'
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Phone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="min-h-[100px] relative overflow-hidden">
              <div className={`space-y-2 absolute w-full transition-all duration-300 ease-in-out ${
                resetMethod === 'email' 
                  ? 'translate-x-0 opacity-100' 
                  : 'translate-x-full opacity-0 pointer-events-none'
              }`}>
                <Label htmlFor="email" className="text-white text-base font-medium">Email Address</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-zinc-400 h-12 text-base font-medium px-4 rounded-lg transition-all duration-200 focus:outline-none focus:border-white/30 focus:bg-white/10"
                />
              </div>
              <div className={`space-y-2 absolute w-full transition-all duration-300 ease-in-out ${
                resetMethod === 'mobile' 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-full opacity-0 pointer-events-none'
              }`}>
                <Label htmlFor="mobile" className="text-white text-base font-medium">Mobile Number</Label>
                <PhoneInput
                  value={formData.mobile}
                  onChange={(value) => setFormData({ ...formData, mobile: value })}
                  placeholder="9876543210"
                  id="mobile"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2 h-12 text-base font-medium transition-colors duration-200" 
              disabled={isLoading || (resetMethod === 'email' ? !formData.email.trim() : formData.mobile.length !== 10)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-base text-zinc-400">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
              Sign in
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-600">
          <p>Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  )
}