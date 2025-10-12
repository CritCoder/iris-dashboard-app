'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login, otpLogin } = useAuth()
  const { success, error } = useToast()
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('mobile')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    countryCode: '+91'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate input
    if (loginMethod === 'email' && !formData.email.trim()) return
    if (loginMethod === 'mobile' && !formData.mobile.trim()) return

    setIsLoading(true)

        try {
          if (loginMethod === 'email') {
            // For email login, use the actual API
            const response = await fetch('https://irisnet.wiredleap.com/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formData.email,
                password: 'temp_password' // This might need to be adjusted based on the actual API
              })
            })

            const result = await response.json()

            if (result.success) {
              // Store the contact info in sessionStorage for OTP verification page
              const contactInfo = {
                method: loginMethod,
                value: formData.email,
                displayValue: formData.email
              }

              sessionStorage.setItem('otpContactInfo', JSON.stringify(contactInfo))
              router.push('/login/verify-otp')
            } else {
              error(result.error?.message || 'Login failed')
            }
          } else {
            // For mobile login, send OTP
            const phoneNumber = `${formData.countryCode}${formData.mobile}`
            const response = await fetch('https://irisnet.wiredleap.com/api/auth/otpLogin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phoneNumber: phoneNumber
              })
            })

            const result = await response.json()
            console.log('OTP Send Response:', result) // Debug log

            if (result.success) {
              success('OTP sent successfully!')
              
              // Store the contact info in sessionStorage for OTP verification page
              const contactInfo = {
                method: loginMethod,
                value: phoneNumber,
                displayValue: `${formData.countryCode} ${formData.mobile}`
              }

              sessionStorage.setItem('otpContactInfo', JSON.stringify(contactInfo))
              router.push('/login/verify-otp')
            } else {
              error(result.error?.message || result.message || 'Failed to send OTP')
            }
          }
    } catch (error) {
      error('Failed to send OTP. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 mb-4">
            <span className="text-2xl font-bold text-white">IRIS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-zinc-500">Enter your {loginMethod === 'email' ? 'email' : 'mobile number'} to receive OTP</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-lg">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                loginMethod === 'mobile'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMethod === 'email' ? (
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
                  <div className="relative">
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData({ ...formData, mobile: value })
                      
                      // Auto-submit when 6 digits are entered
                      if (value.length === 6 && /^\d+$/.test(value)) {
                        handleSubmit(e)
                      }
                    }}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 flex-1"
                    required
                  />
                </div>
              </div>
            )}

            <div className="text-center text-sm text-zinc-500 mb-4">
              We'll send you a verification code via {loginMethod === 'email' ? 'email' : 'SMS'}
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={isLoading || (loginMethod === 'email' ? !formData.email.trim() : !formData.mobile.trim())}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-600">
          <p>By continuing, you agree to our</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Link href="#" className="hover:text-zinc-400">Terms of Service</Link>
            <span>·</span>
            <Link href="#" className="hover:text-zinc-400">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}