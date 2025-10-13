'use client'

import { ReactNode } from 'react'
import { DualSidebar, MobileMenuProvider } from '@/components/dashboard/dual-sidebar'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden w-full">
        <DualSidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 w-full">
          {children}
        </div>
      </div>
    </MobileMenuProvider>
  )
}