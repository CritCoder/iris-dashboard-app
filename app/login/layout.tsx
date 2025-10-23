import { Metadata } from 'next'
import { generateMetadata, generateStructuredData, siteConfig } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Sign In',
  description: 'Sign in to your IRIS Intelligence Platform account. Access advanced social media analytics and intelligence gathering tools.',
  keywords: ['login', 'sign in', 'iris', 'intelligence platform', 'authentication'],
  canonical: `${siteConfig.url}/login`,
  structuredData: generateStructuredData('WebPage', {
    title: 'Sign In - IRIS Intelligence Platform',
    description: 'Sign in to your IRIS Intelligence Platform account',
    url: `${siteConfig.url}/login`
  })
})

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}