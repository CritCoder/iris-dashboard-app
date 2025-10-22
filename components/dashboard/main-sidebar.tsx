'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Clock, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollPersistence, SidebarPersistence, RecentItems } from '@/lib/state-persistence'
import { SimpleTooltip } from '@/components/ui/rich-tooltip'
import { useAuth } from '@/contexts/auth-context'
import { navConfig } from './nav-config'

interface MainSidebarProps {
  className?: string
}

export function MainSidebar({ className = '' }: MainSidebarProps) {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [recentProfiles, setRecentProfiles] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { logout, user } = useAuth()

  // Initialize once - restore expanded menu and scroll position
  useEffect(() => {
    if (!isInitialized) {
      const saved = SidebarPersistence.restoreExpanded()
      if (saved) setExpandedMenu(saved)

      if (scrollRef.current) {
        const position = ScrollPersistence.restore('main-sidebar')
        scrollRef.current.scrollTop = position
      }

      setRecentProfiles(RecentItems.get('profile').slice(0, 5))
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Auto-expand menu if current path matches a submenu item
  useEffect(() => {
    if (isInitialized && pathname) {
      navConfig.forEach((section) => {
        section.items.forEach((item) => {
          if (item.submenu) {
            const hasActiveSubmenu = item.submenu.some((subItem) => isActive(subItem.href))
            if (hasActiveSubmenu && expandedMenu !== item.id) {
              setExpandedMenu(item.id)
              SidebarPersistence.saveExpanded(item.id)
            }
          }
        })
      })
    }
  }, [pathname, isInitialized, expandedMenu])

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        ScrollPersistence.save('main-sidebar', scrollRef.current.scrollTop)
      }
    }

    const ref = scrollRef.current
    ref?.addEventListener('scroll', handleScroll, { passive: true })
    return () => ref?.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenu(prev => {
      const newExpanded = prev === menuId ? null : menuId
      SidebarPersistence.saveExpanded(newExpanded)
      return newExpanded
    })
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`hidden lg:flex fixed left-16 top-0 h-screen w-64 bg-card border-r border-border flex-col z-40 ${className}`}
    >
      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        <div className="p-4 space-y-6">
          {/* Recent Items */}
          {recentProfiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                Recent
              </div>
              <div className="space-y-1">
                {recentProfiles.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <motion.div
                      className="px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors truncate"
                      whileHover={{ x: 2 }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Sections */}
          {navConfig.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="px-2 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  const hasSubmenu = item.submenu && item.submenu.length > 0

                  return (
                    <div key={item.id}>
                      <SimpleTooltip content={item.description || item.label} side="right">
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            if (hasSubmenu) {
                              e.preventDefault()
                              toggleMenu(item.id)
                            }
                          }}
                        >
                          <motion.div
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                              active
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-foreground hover:bg-accent/50'
                            }`}
                            whileHover={{ x: 2 }}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                            <span className="text-sm flex-1 truncate">{item.label}</span>
                            {hasSubmenu && (
                              <ChevronRight
                                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                  expandedMenu === item.id ? 'rotate-90' : ''
                                }`}
                              />
                            )}
                          </motion.div>
                        </Link>
                      </SimpleTooltip>

                      {/* Submenu */}
                      <AnimatePresence>
                        {hasSubmenu && expandedMenu === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-7 mt-1 space-y-1 border-l-2 border-border/50 pl-3">
                              {item.submenu?.map((subItem) => {
                                const SubIcon = subItem.icon
                                const subActive = isActive(subItem.href)

                                return (
                                  <Link key={subItem.id} href={subItem.href}>
                                    <motion.div
                                      className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-xs transition-all ${
                                        subActive
                                          ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                                          : 'text-muted-foreground/80 hover:bg-accent/50 hover:text-foreground border border-transparent'
                                      }`}
                                      whileHover={{ x: 2 }}
                                    >
                                      <SubIcon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                                      <span className="truncate">{subItem.label}</span>
                                    </motion.div>
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Section with Logout */}
      <div className="border-t border-border p-4 bg-card">
        <SimpleTooltip content="Sign out of your account" side="right">
          <motion.button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span className="flex-1 text-left">Sign Out</span>
          </motion.button>
        </SimpleTooltip>
      </div>
    </aside>
  )
}
