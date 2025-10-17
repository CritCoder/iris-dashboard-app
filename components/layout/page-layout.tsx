'use client'

import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden w-full">
      {children}
    </div>
  )
}