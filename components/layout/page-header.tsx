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
      <div className="w-full px-6 py-4">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="mb-3">
            <Breadcrumbs />
          </div>
        )}
        
        {/* Header Content */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground truncate">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground truncate mt-1">{description}</p>
            )}
          </div>
          
          {centerContent && (
            <div className="hidden lg:flex flex-1 justify-center px-8 max-w-2xl">
              {centerContent}
            </div>
          )}
          
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
