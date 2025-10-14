'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
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
      <div className="w-full px-3 sm:px-6 min-h-[72px] sm:h-[84px] flex items-center justify-between gap-2 sm:gap-3 py-3 sm:py-0">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden flex-shrink-0 hover:bg-accent active:bg-accent/80 transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">{title}</h1>
          {description && (
            <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground truncate mt-0.5">{description}</p>
          )}
        </div>
        {centerContent && (
          <div className="hidden md:flex flex-1 justify-center px-4 lg:px-8">
            {centerContent}
          </div>
        )}
        {actions && (
          <div className="flex-shrink-0 min-w-0 max-w-[50%] sm:max-w-none">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
