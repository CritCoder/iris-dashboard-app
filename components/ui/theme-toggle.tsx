
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
    )
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <Sun className="w-5 h-5" strokeWidth={1.5} />
        )}
      </motion.div>
    </motion.button>
  )
}
