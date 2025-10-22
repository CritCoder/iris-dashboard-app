'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { IconSidebar } from '@/components/dashboard/icon-sidebar'
// import { MainSidebar } from '@/components/dashboard/main-sidebar'
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
    // Reserve horizontal space for fixed sidebars (icon-only on md, full on lg)
    <div className="h-screen bg-card text-foreground flex w-full pl-0  overflow-x-hidden">
      {/* Main Sidebar - Fixed 256px */}
      {/* <MainSidebar /> */}

      {/* Icon Sidebar - Fixed 64px */}
      <IconSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full min-w-0 ml-20 p-4 pr-0">
        <div className="flex-1 flex flex-col w-full h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden">
          {children}
        </div>
      </main>

      {/* Quick Actions Command Palette */}
      <QuickActions />

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsDialog />
    </div>
  )
}
