'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Phone, ArrowRight, Eye, EyeOff, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [signupMethod, setSignupMethod] = useState<'email' | 'mobile'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    countryCode: '+91',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate input
    if (!formData.name.trim()) {
      toast.error('Please enter your full name')
      return
    }
    if (signupMethod === 'email' && !formData.email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    if (signupMethod === 'mobile' && !formData.mobile.trim()) {
      toast.error('Please enter your mobile number')
      return
    }
    if (!formData.password.trim()) {
      toast.error('Please enter a password')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      if (signupMethod === 'email') {
        // For email signup, use the actual API
        const response = await fetch('https://irisnet.wiredleap.com/api/auth/add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'user'
          })
        })

        const result = await response.json()

        if (result.success) {
          // Store the contact info in sessionStorage for OTP verification page
          const contactInfo = {
            method: signupMethod,
            value: formData.email,
            displayValue: formData.email
          }

          sessionStorage.setItem('otpContactInfo', JSON.stringify(contactInfo))
          toast.success('Account created successfully! Please verify your email.')
          router.push('/signup/verify-otp')
        } else {
          toast.error(result.error?.message || 'Signup failed')
        }
      } else {
        // For mobile signup, use the OTP endpoint
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

        if (result.success) {
          // Store the contact info in sessionStorage for OTP verification page
          const contactInfo = {
            method: signupMethod,
            value: phoneNumber,
            displayValue: `${formData.countryCode} ${formData.mobile}`
          }

          sessionStorage.setItem('otpContactInfo', JSON.stringify(contactInfo))
          toast.success('OTP sent successfully! Please verify your mobile number.')
          router.push('/signup/verify-otp')
        } else {
          toast.error(result.error?.message || 'Failed to send OTP')
        }
      }
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
      console.error('Signup error:', error)
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
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-zinc-500">Get started with IRIS Intelligence Platform</p>
        </div>

        {/* Signup Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          {/* Signup Method Toggle */}
          <div className="flex gap-2 mb-6 bg-zinc-950 p-1 rounded-lg">
            <button
              onClick={() => setSignupMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                signupMethod === 'email'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => setSignupMethod('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                signupMethod === 'mobile'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Phone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 pl-10"
                  required
                />
              </div>
            </div>

            {signupMethod === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 pl-10"
                    required
                  />
                </div>
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
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-zinc-500">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                required
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 rounded bg-zinc-800 border-zinc-700" required />
              <label className="text-zinc-400">
                I agree to the{' '}
                <Link href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={isLoading || !formData.name.trim() || (signupMethod === 'email' ? !formData.email.trim() : !formData.mobile.trim()) || !formData.password.trim() || formData.password !== formData.confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}