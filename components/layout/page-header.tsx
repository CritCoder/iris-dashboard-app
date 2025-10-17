'use client'

import { ReactNode } from 'react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

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
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-2">
        {/* Compact Header - Single Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <div className="flex-shrink-0">
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
