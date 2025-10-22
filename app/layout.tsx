import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { AuthProvider } from '@/contexts/auth-context'
import { ToastProvider } from '@/components/ui/toast-provider'
import { RouteProgress } from '@/components/layout/route-progress'
import { PageTransition } from '@/components/layout/page-transition'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ClientLayout } from '@/components/layout/client-layout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IRIS - Intelligence Platform',
  description: 'Social Media Analytics Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <ProtectedRoute>
              <ToastProvider />
              <RouteProgress />
              <ClientLayout>
                <PageTransition className="flex-1 min-h-0 flex flex-col w-full">
                  {children}
                </PageTransition>
              </ClientLayout>
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
