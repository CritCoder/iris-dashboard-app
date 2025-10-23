'use client'

import { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { MobileNav } from '@/components/layout/mobile-nav'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  centerContent?: ReactNode
  showBreadcrumbs?: boolean
}

export function PageHeader({ title, description, actions, centerContent, showBreadcrumbs = true }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center">
        {/* Compact Header - Single Row with fixed height to match pagination footer */}
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Mobile Nav Trigger + Breadcrumbs */}
          {showBreadcrumbs && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile-only Nav */}
              <MobileNav />
              <Breadcrumbs />
            </div>
          )}

          {centerContent && (
            <div className="hidden lg:flex flex-1 justify-center px-8 max-w-2xl">
              {centerContent}
            </div>
          )}

          {actions && (
            <div className="flex-shrink-0 ml-auto">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
