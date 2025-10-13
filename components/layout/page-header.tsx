'use client'

import { ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMobileMenu } from '@/components/dashboard/new-dual-sidebar'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  centerContent?: ReactNode
}

export function PageHeader({ title, description, actions, centerContent }: PageHeaderProps) {
  const { setIsOpen } = useMobileMenu()

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="w-full px-3 sm:px-6 h-[72px] sm:h-[84px] flex items-center justify-between gap-3">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden flex-shrink-0"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

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
