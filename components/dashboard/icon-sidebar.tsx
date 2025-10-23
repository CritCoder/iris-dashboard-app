'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { 
  Home, 
  Users, 
  Globe, 
  BarChart3, 
  Search, 
  Bell,
  PlusSquare,
  History,
  MapPin,
  UsersRound,
  Inbox,
  Package,
  DatabaseZap,
  LogOut
} from 'lucide-react'
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

interface NavSection {
  title?: string
  items: IconNavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { id: 'dashboard', icon: Home, href: '/', label: 'Dashboard' },
      { id: 'start-analysis', icon: PlusSquare, href: '/start-analysis', label: 'Start Analysis' },
    ],
  },
  {
    title: 'Search',
    items: [
      { id: 'analysis-history', icon: History, href: '/analysis-history', label: 'Analysis History' },
    ],
  },
  {
    title: 'Explore',
    items: [
      { id: 'social-feed', icon: Globe, href: '/social-feed', label: 'Social Feed' },
      { id: 'profiles', icon: Users, href: '/profiles', label: 'Profiles' },
      { id: 'entities', icon: Package, href: '/entities', label: 'Entities' },
      { id: 'locations', icon: MapPin, href: '/locations', label: 'Locations' },
      { id: 'groups', icon: UsersRound, href: '/groups', label: 'Groups' },
    ],
  },
  {
    title: 'OSINT',
    items: [
      { id: 'entity-search', icon: Search, href: '/entity-search', label: 'Entity Search' },
      { id: 'breached-data', icon: DatabaseZap, href: '/breached-data', label: 'Breached Data' },
    ],
  },
  {
    title: 'Inbox',
    items: [
      { id: 'social-inbox', icon: Inbox, href: '/social-inbox', label: 'Social Inbox' },
    ],
  },
]

export function IconSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      // Use the AuthContext logout function for proper cleanup and redirect
      logout()
    }
  }

  return (
    <div className="hidden md:flex fixed left-0 top-0 h-screen w-16 bg-card border-r border-border/50 flex-col items-center py-4 z-50">
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
        {navSections.map((section, sectionIndex) => (
          <div key={section.title || `section-${sectionIndex}`}>
            <div className="flex flex-col gap-2">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <div key={item.id} className="flex flex-col items-center gap-0.5">
                    <SimpleTooltip
                      content={item.label}
                      side="right"
                      shortcut={item.shortcut}
                    >
                      <Link href={item.href} className="flex justify-center">
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
                    <span className={`text-[8px] text-center leading-tight max-w-12 ${
                      active ? 'text-primary' : 'text-muted-foreground/70'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
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

        <SimpleTooltip content="Toggle Theme" side="right">
          <div className="w-12 h-12 flex items-center justify-center">
            <ThemeToggle />
          </div>
        </SimpleTooltip>

        <SimpleTooltip content="Logout" side="right">
          <motion.button
            onClick={handleLogout}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>
        </SimpleTooltip>
      </div>
    </div>
  )
}
