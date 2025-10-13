'use client'

import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  centerContent?: ReactNode
}

export function PageHeader({ title, description, actions, centerContent }: PageHeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="w-full px-3 sm:px-6 h-[72px] sm:h-[84px] flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-xl font-bold text-foreground truncate">{title}</h1>
            {description && (
              <>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate leading-tight">{description}</p>
              </>
            )}
          </div>
        </div>
        {centerContent && (
          <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">
            {centerContent}
          </div>
        )}
        {actions && (
          <div className="flex-shrink-0 min-w-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
