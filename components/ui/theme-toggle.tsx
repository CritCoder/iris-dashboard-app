
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-[120px] h-8 bg-muted rounded-lg animate-pulse" />
    )
  }

  return (
    <div 
      role="tablist" 
      aria-orientation="vertical" 
      className="inline-flex flex-col items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground h-auto gap-1"
      tabIndex={0}
      data-orientation="vertical"
      style={{ outline: 'none' }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={theme === 'dark'}
        aria-controls="theme-content-dark"
        data-state={theme === 'dark' ? 'active' : 'inactive'}
        id="theme-trigger-dark"
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5 ${
          theme === 'dark'
            ? 'bg-background text-foreground shadow-sm border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        tabIndex={-1}
        data-orientation="vertical"
        onClick={() => theme !== 'dark' && toggleTheme()}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={theme === 'light'}
        aria-controls="theme-content-light"
        data-state={theme === 'light' ? 'active' : 'inactive'}
        id="theme-trigger-light"
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5 ${
          theme === 'light'
            ? 'bg-background text-foreground shadow-sm border border-border'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        tabIndex={-1}
        data-orientation="vertical"
        onClick={() => theme !== 'light' && toggleTheme()}
      >
        <Sun className="w-4 h-4" />
      </button>
    </div>
  )
}
