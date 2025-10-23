import { Metadata } from 'next'
import { generateMetadata, generateStructuredData, siteConfig } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Reset Password',
  description: 'Reset your IRIS Intelligence Platform password. Securely recover access to your account.',
  keywords: ['password reset', 'forgot password', 'account recovery', 'iris', 'intelligence platform'],
  canonical: `${siteConfig.url}/forgot-password`,
  noindex: true, // Don't index password reset pages
  structuredData: generateStructuredData('WebPage', {
    title: 'Reset Password - IRIS Intelligence Platform',
    description: 'Reset your IRIS Intelligence Platform password',
    url: `${siteConfig.url}/forgot-password`
  })
})

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}