'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [resetMethod, setResetMethod] = useState<'email' | 'mobile'>('email')
  const [formData, setFormData] = useState({
    email: '',
    mobile: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/forgot-password/verify-otp')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
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
                  <select className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 w-24">
                    <option>+91</option>
                    <option>+1</option>
                    <option>+44</option>
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

            <Button type="submit" className="w-full gap-2">
              Send Verification Code
              <ArrowRight className="w-4 h-4" />
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