
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
      aria-orientation="horizontal" 
      className="inline-flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1 text-zinc-600 dark:text-zinc-400 h-auto gap-1"
      tabIndex={0}
      data-orientation="horizontal"
      style={{ outline: 'none' }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={theme === 'dark'}
        aria-controls="theme-content-dark"
        data-state={theme === 'dark' ? 'active' : 'inactive'}
        id="theme-trigger-dark"
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5 ${
          theme === 'dark' 
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
        }`}
        tabIndex={-1}
        data-orientation="horizontal"
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
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 p-1.5 ${
          theme === 'light' 
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' 
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
        }`}
        tabIndex={-1}
        data-orientation="horizontal"
        onClick={() => theme !== 'light' && toggleTheme()}
      >
        <Sun className="w-4 h-4" />
      </button>
    </div>
  )
}
