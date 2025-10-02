'use client'

import { ReactNode } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64 w-full">
        {children}
      </div>
    </div>
  )
}