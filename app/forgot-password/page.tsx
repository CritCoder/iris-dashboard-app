'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Mail, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

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
        const response = await fetch(`${API_URL}/api/auth/otpLogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber
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
    } catch (error) {
      error('Failed to send reset code. Please try again.')
      console.error('Reset password error:', error)
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

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 mb-4">
            <span className="text-2xl font-bold text-white">IRIS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-zinc-500">Enter your email or mobile number to receive a verification code</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-lg">
            <button
              onClick={() => setResetMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                resetMethod === 'email'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setResetMethod('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                resetMethod === 'mobile'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {resetMethod === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-white">Mobile Number</Label>
                <div className="flex gap-2">
                  <select 
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 w-28 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer pr-8 text-sm font-medium"
                  >
                    <option value="+91" className="bg-zinc-800 text-white">+91</option>
                    <option value="+1" className="bg-zinc-800 text-white">+1</option>
                    <option value="+44" className="bg-zinc-800 text-white">+44</option>
                    <option value="+61" className="bg-zinc-800 text-white">+61</option>
                    <option value="+86" className="bg-zinc-800 text-white">+86</option>
                  </select>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 flex-1"
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={isLoading || (resetMethod === 'email' ? !formData.email.trim() : !formData.mobile.trim())}
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

          <div className="mt-6 text-center text-sm text-zinc-500">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}