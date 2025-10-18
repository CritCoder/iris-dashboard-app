'use client'

import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col w-full relative">
      {children}
    </div>
  )
}
