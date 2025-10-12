'use client'

import { ReactNode } from 'react'
import { Sidebar, MobileMenuProvider } from '@/components/dashboard/sidebar'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-56 w-full">
          {children}
        </div>
      </div>
    </MobileMenuProvider>
  )
}