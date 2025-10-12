'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Phone, ArrowRight, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate input
    if (loginMethod === 'email' && !formData.email.trim()) {
      error('Please enter your email address')
      return
    }
    if (loginMethod === 'mobile') {
      if (!formData.mobile.trim()) {
        error('Please enter your mobile number')
        return
      }
      if (formData.mobile.length !== 10 || !/^\d{10}$/.test(formData.mobile)) {
        error('Invalid phone number format. Please enter a valid 10-digit mobile number.')
        return
      }
    }

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

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
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

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative">
          {/* Heading inside card */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <div className="h-6 overflow-hidden relative">
              <p 
                className={`text-base text-zinc-400 absolute left-0 right-0 transition-all duration-300 ease-in-out ${
                  loginMethod === 'mobile' 
                    ? 'translate-y-0 opacity-100' 
                    : '-translate-y-full opacity-0'
                }`}
              >
                Enter your mobile number to receive OTP
              </p>
              <p 
                className={`text-base text-zinc-400 absolute left-0 right-0 transition-all duration-300 ease-in-out ${
                  loginMethod === 'email' 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-full opacity-0'
                }`}
              >
                Enter your email to receive OTP
              </p>
            </div>
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-sm border border-white/10 p-1.5 rounded-xl">
            <button
              onClick={() => setLoginMethod('mobile')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                loginMethod === 'mobile'
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Phone className="w-4 h-4" />
              Mobile
            </button>
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                loginMethod === 'email'
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="min-h-[100px] relative overflow-hidden">
              <div className={`space-y-2 absolute w-full transition-all duration-300 ease-in-out ${
                loginMethod === 'email' 
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
                loginMethod === 'mobile' 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-full opacity-0 pointer-events-none'
              }`}>
                <Label htmlFor="mobile" className="text-white text-base font-medium">Mobile Number</Label>
                <div className="flex gap-2">
                  <div className="relative flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3.5 h-12">
                    {/* India Flag SVG */}
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <rect width="24" height="6" fill="#FF9933"/>
                      <rect y="6" width="24" height="6" fill="#FFFFFF"/>
                      <rect y="12" width="24" height="6" fill="#138808"/>
                      <circle cx="12" cy="9" r="2.5" stroke="#000080" strokeWidth="0.5" fill="none"/>
                      <g transform="translate(12, 9)">
                        {[...Array(24)].map((_, i) => (
                          <line
                            key={i}
                            x1="0"
                            y1="0"
                            x2={Math.cos((i * 15 * Math.PI) / 180) * 2}
                            y2={Math.sin((i * 15 * Math.PI) / 180) * 2}
                            stroke="#000080"
                            strokeWidth="0.2"
                          />
                        ))}
                      </g>
                    </svg>
                    <span className="text-base font-medium text-white">+91</span>
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setFormData({ ...formData, mobile: value })
                    }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-zinc-400 flex-1 h-12 text-base font-medium px-4 rounded-lg transition-all duration-200 focus:outline-none focus:border-white/30 focus:bg-white/10"
                    maxLength={10}
                  />
                  </div>
              </div>
            </div>

            <div className="h-6 overflow-hidden relative mb-4">
              <p 
                className={`text-center text-base text-zinc-400 absolute left-0 right-0 transition-all duration-300 ease-in-out ${
                  loginMethod === 'mobile' 
                    ? 'translate-y-0 opacity-100' 
                    : '-translate-y-full opacity-0'
                }`}
              >
                We'll send you a verification code via SMS
              </p>
              <p 
                className={`text-center text-base text-zinc-400 absolute left-0 right-0 transition-all duration-300 ease-in-out ${
                  loginMethod === 'email' 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-full opacity-0'
                }`}
              >
                We'll send you a verification code via email
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2 h-12 text-base font-medium transition-colors duration-200" 
              disabled={isLoading || (loginMethod === 'email' ? !formData.email.trim() : formData.mobile.length !== 10)}
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

          <div className="mt-6 text-center text-base text-zinc-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-zinc-600">
          <p>By continuing, you agree to our</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <button 
              onClick={() => setShowTerms(true)}
              className="hover:text-zinc-400 underline"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button 
              onClick={() => setShowPrivacy(true)}
              className="hover:text-zinc-400 underline"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Terms of Service</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Last updated: October 12, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-zinc-300 text-sm">
            <section>
              <h3 className="font-semibold text-white mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using the IRIS Intelligence Platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">2. Use License</h3>
              <p>
                Permission is granted to temporarily access the materials (information or software) on IRIS Intelligence Platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">3. User Accounts</h3>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">4. Privacy and Data Protection</h3>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our service, you agree to our collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">5. Prohibited Activities</h3>
              <p>
                You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction including but not limited to copyright laws.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">6. Limitation of Liability</h3>
              <p>
                In no event shall IRIS Intelligence Platform or its suppliers be liable for any damages arising out of the use or inability to use the materials on our platform.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Privacy Policy</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Last updated: October 12, 2025
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-zinc-300 text-sm">
            <section>
              <h3 className="font-semibold text-white mb-2">1. Information We Collect</h3>
              <p>
                We collect information that you provide directly to us, including but not limited to your name, email address, phone number, and any other information you choose to provide.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">2. How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to respond to your comments and questions.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">3. Information Sharing</h3>
              <p>
                We do not share your personal information with third parties except as described in this Privacy Policy or with your consent. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">4. Data Security</h3>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">5. Cookies and Tracking</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">6. Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information at any time. You may also have the right to restrict or object to certain processing of your data.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-white mb-2">7. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@iris.com
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}