'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Globe, BarChart3, Search, Bell } from 'lucide-react'
import { SimpleTooltip } from '@/components/ui/rich-tooltip'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { motion } from 'framer-motion'

interface IconNavItem {
  id: string
  icon: React.ElementType
  href: string
  label: string
  shortcut?: string
}

const navItems: IconNavItem[] = [
  { id: 'dashboard', icon: Home, href: '/', label: 'Dashboard', shortcut: '⌘D' },
  { id: 'profiles', icon: Users, href: '/profiles', label: 'Profiles', shortcut: '⌘P' },
  { id: 'social', icon: Globe, href: '/social-feed', label: 'Social Feed', shortcut: '⌘S' },
  { id: 'analysis', icon: BarChart3, href: '/analysis-history', label: 'Analysis', shortcut: '⌘A' },
  { id: 'search', icon: Search, href: '/entity-search', label: 'Search', shortcut: '⌘K' },
]

export function IconSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-card border-r border-border flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <motion.div
          className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white font-bold text-lg">I</span>
        </motion.div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <SimpleTooltip
              key={item.id}
              content={item.label}
              side="right"
              shortcut={item.shortcut}
            >
              <Link href={item.href}>
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                  {active && (
                    <motion.div
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                      layoutId="active-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            </SimpleTooltip>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 w-full px-2">
        <SimpleTooltip content="Notifications" side="right">
          <motion.button
            className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        </SimpleTooltip>

        <SimpleTooltip content="Toggle Theme" side="right" shortcut="⌘T">
          <div className="w-12 h-12 flex items-center justify-center">
            <ThemeToggle />
          </div>
        </SimpleTooltip>
      </div>
    </div>
  )
}

