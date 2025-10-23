import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'
import { GlobalPostModalProvider } from '@/contexts/global-post-modal-context'
import { ToastProvider } from '@/components/ui/toast-provider'
import { RouteProgress } from '@/components/layout/route-progress'
import { PageTransition } from '@/components/layout/page-transition'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ClientLayout } from '@/components/layout/client-layout'
import { GlobalPostModal } from '@/components/posts/global-post-modal'
import { siteConfig, generateStructuredData } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: 'IRIS Intelligence Platform',
    },
  ],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteStructuredData = generateStructuredData('WebSite', {})
  const organizationStructuredData = generateStructuredData('Organization', {})

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <GlobalPostModalProvider>
              <ProtectedRoute>
                <ToastProvider />
                <RouteProgress />
                <ClientLayout>
                  <PageTransition className="flex-1 min-h-0 flex flex-col w-full">
                    {children}
                  </PageTransition>
                </ClientLayout>
                <GlobalPostModal />
              </ProtectedRoute>
            </GlobalPostModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
