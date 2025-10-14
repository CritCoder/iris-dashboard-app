'use client'

import { ReactNode } from 'react'
import { MobileMenuProvider, NewDualSidebar } from '@/components/dashboard/new-dual-sidebar'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (  
    <MobileMenuProvider>
      <div className="h-screen bg-background text-foreground flex overflow-hidden w-full">
        <NewDualSidebar />
        <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
          {children}
        </div>
      </div>
    </MobileMenuProvider>
  )
}