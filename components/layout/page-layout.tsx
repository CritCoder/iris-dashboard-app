'use client'

import { ReactNode } from 'react'
import { IconSidebar } from '@/components/dashboard/icon-sidebar'
import { MainSidebar } from '@/components/dashboard/main-sidebar'
import { QuickActions } from '@/components/ui/quick-actions'
import { KeyboardShortcutsDialog } from '@/components/ui/keyboard-shortcuts-dialog'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  return (  
    <div className="h-screen bg-background text-foreground flex overflow-hidden w-full">
      {/* Icon Sidebar - Fixed 64px */}
      <IconSidebar />
      
      {/* Main Sidebar - Fixed 256px */}
      <MainSidebar />
      
      {/* Main Content Area */}
      <div className="ml-80 flex-1 flex flex-col overflow-hidden w-full min-w-0">
        {children}
      </div>
      
      {/* Quick Actions Command Palette */}
      <QuickActions />
      
      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsDialog />
    </div>
  )
}