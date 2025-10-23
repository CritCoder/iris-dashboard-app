import { Metadata } from 'next'
import { generateMetadata, generateStructuredData, siteConfig } from '@/lib/seo'

export const metadata: Metadata = generateMetadata({
  title: 'Create Account',
  description: 'Create your IRIS Intelligence Platform account and gain access to advanced social media analytics and intelligence tools.',
  keywords: ['signup', 'register', 'create account', 'iris', 'intelligence platform', 'registration'],
  canonical: `${siteConfig.url}/signup`,
  structuredData: generateStructuredData('WebPage', {
    title: 'Create Account - IRIS Intelligence Platform',
    description: 'Create your IRIS Intelligence Platform account',
    url: `${siteConfig.url}/signup`
  })
})

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}