'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { IconSidebar } from '@/components/dashboard/icon-sidebar'
import { MainSidebar } from '@/components/dashboard/main-sidebar'
import { QuickActions } from '@/components/ui/quick-actions'
import { KeyboardShortcutsDialog } from '@/components/ui/keyboard-shortcuts-dialog'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface ClientLayoutProps {
  children: ReactNode
}

// Public routes that should not show sidebar
const PUBLIC_ROUTES = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password']

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // For public routes, render without sidebars and without any wrapper constraints
  if (isPublicRoute) {
    return <>{children}</>
  }

  // For authenticated routes, render with sidebars
  return (
    <div className="h-screen bg-background text-foreground w-full overflow-hidden">
      {/* Icon Sidebar - Hidden on mobile, visible on lg+ */}
      <IconSidebar className="hidden lg:flex" />

      {/* Main Sidebar - Hidden on mobile, visible on lg+ */}
      <MainSidebar className="hidden lg:block" />

      {/* Main Content Area - Full width on mobile, offset for sidebars on lg+ */}
      <div className="lg:ml-80 h-screen bg-background overflow-hidden">
        {children}
      </div>

      {/* Quick Actions Command Palette */}
      <QuickActions />

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsDialog />
    </div>
  )
}
