'use client'

import React, { useState, useCallback, useMemo, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  Home, Mail, Play, BarChart3, Globe, Users, Hash, MapPin, Building2,
  Search, Shield, ChevronRight, X,
  TrendingUp
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Sheet, SheetContent } from '@/components/ui/sheet'

// Context for mobile menu
export const MobileMenuContext = createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
} | null>(null)

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  )
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider')
  }
  return context
}

interface NavItemData {
  id: string
  label: string
  icon: React.ElementType
  href: string
  submenu?: string
  description?: string
}

interface SubmenuItemData {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

interface DualSidebarProps {
  activeNavItem: string
  setActiveNavItem: (id: string) => void
  expandedSubMenu: string | null
  setExpandedSubMenu: (id: string | null) => void
}

function DualSidebarContent({ activeNavItem, setActiveNavItem, expandedSubMenu, setExpandedSubMenu, sidebarAnimationState, setSidebarAnimationState }: DualSidebarProps & { sidebarAnimationState: {[key: string]: 'entering' | 'entered' | 'exiting' | 'exited'}, setSidebarAnimationState: React.Dispatch<React.SetStateAction<{[key: string]: 'entering' | 'entered' | 'exiting' | 'exited'}>> }) {
  const pathname = usePathname()
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const { setIsOpen: setMobileOpen } = useMobileMenu()
  const { logout, user } = useAuth()

  const toggleSubMenu = useCallback((menuId: string) => {
    if (expandedSubMenu === menuId) {
      // Closing current submenu
      setSidebarAnimationState(prev => ({ ...prev, [menuId]: 'exiting' }))
      setTimeout(() => {
        setExpandedSubMenu(null)
        setSidebarAnimationState(prev => ({ ...prev, [menuId]: 'exited' }))
      }, 300) // Match the exit animation duration
    } else {
      // Opening new submenu
      setExpandedSubMenu(menuId)
      setSidebarAnimationState(prev => ({ ...prev, [menuId]: 'entering' }))
      setTimeout(() => {
        setSidebarAnimationState(prev => ({ ...prev, [menuId]: 'entered' }))
      }, 50) // Small delay to ensure smooth transition
    }
  }, [expandedSubMenu, setExpandedSubMenu])

  const exploreItems = useMemo<NavItemData[]>(() => [
    { id: 'social-feed', label: 'Social Feed', icon: Globe, href: '/social-feed', submenu: undefined, description: 'whats happening (feed)' },
    { id: 'profiles', label: 'Profiles', icon: Users, href: '/profiles', submenu: undefined, description: 'who is talking' },
    { id: 'entities', label: 'Entities', icon: Hash, href: '/entities', submenu: undefined, description: 'what is being talked about' },
    { id: 'locations', label: 'Locations', icon: MapPin, href: '/locations', submenu: undefined, description: 'where things are happening' },
    { id: 'groups', label: 'Groups', icon: Building2, href: '/groups', submenu: 'groups', description: 'communities and groups' },
  ], [])



  const groupsSubmenu = useMemo(() => [
    {
      category: 'PRIMARY',
      items: [
        { id: 'all-groups', label: 'All Groups', icon: Building2, href: '/groups' },
        { id: 'monitored-groups', label: 'Monitored Groups', icon: Eye, href: '/groups?view=monitored' },
        { id: 'suspicious-groups', label: 'Suspicious Groups', icon: AlertTriangle, href: '/groups?view=suspicious' },
      ]
    },
    {
      category: 'COMMUNITY TYPE',
      items: [
        { id: 'religious', label: 'Religious Groups', icon: Building2, href: '/groups?type=religious' },
        { id: 'political', label: 'Political Groups', icon: Users, href: '/groups?type=political' },
        { id: 'social', label: 'Social Groups', icon: Users, href: '/groups?type=social' },
      ]
    },
    {
      category: 'GROUP TYPE',
      items: [
        { id: 'high-risk', label: 'High Risk Groups', icon: AlertTriangle, href: '/groups?risk=high' },
        { id: 'medium-risk', label: 'Medium Risk Groups', icon: Shield, href: '/groups?risk=medium' },
        { id: 'low-risk', label: 'Low Risk Groups', icon: Shield, href: '/groups?risk=low' },
      ]
    },
    {
      category: 'ACTIVITY & SIZE',
      items: [
        { id: 'monitored', label: 'Monitored Groups', icon: Eye, href: '/groups?monitored=true' },
        { id: 'large-groups', label: 'Large Groups (10k+)', icon: TrendingUp, href: '/groups?size=large' },
        { id: 'facebook', label: 'Facebook Groups', icon: Globe, href: '/groups?platform=facebook' },
      ]
    }
  ], [])

  const NavItem = ({ item, isActive, hasSubmenu }: { item: NavItemData; isActive: boolean; hasSubmenu: boolean }) => {
    const handleClick = () => {
      setActiveNavItem(item.id)
      if (item.submenu) {
        toggleSubMenu(item.submenu)
      } else {
        setExpandedSubMenu(null)
      }
      setMobileOpen(false)
    }

    return (
      <Link href={item.href} onClick={handleClick}>
        <button
          onMouseEnter={() => setHoveredNav(item.id)}
          onMouseLeave={() => setHoveredNav(null)}
          className={`w-full flex items-center justify-start px-3.5 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden ${
            isActive
              ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-foreground border border-blue-500/30'
              : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
          }`}
        >
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <div className="flex items-start gap-3 relative z-10 flex-1">
            <div className={`transition-all duration-300 ${isActive ? 'text-blue-500' : 'text-foreground/70 group-hover:text-blue-500'}`}>
              <item.icon size={18} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">{item.label}</span>
              {item.description && (
                <span className="text-xs text-foreground/60 whitespace-nowrap">{item.description}</span>
              )}
            </div>
          </div>
          {hasSubmenu && (
            <ChevronRight size={16} className={`transition-all duration-300 relative z-10 flex-shrink-0 ${
              expandedSubMenu === item.submenu ? 'rotate-90 text-blue-500' : 'group-hover:translate-x-1 text-foreground/50'
            }`} />
          )}
        </button>
      </Link>
    )
  }

  const SubmenuNavItem = ({ item, isActive }: { item: SubmenuItemData; isActive: boolean }) => (
    <Link href={item.href} onClick={() => setMobileOpen(false)}>
      <button
        onMouseEnter={() => setHoveredNav(item.id)}
        onMouseLeave={() => setHoveredNav(null)}
        className={`w-full flex items-center justify-start gap-2 md:gap-3 px-2 md:px-3.5 py-2 md:py-2.5 text-xs md:text-sm rounded-lg transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-foreground border border-blue-500/30'
            : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
        }`}
      >
        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        <div className={`transition-all duration-300 relative z-10 flex-shrink-0 ${
          isActive ? 'text-blue-500' : 'text-foreground/70 group-hover:text-blue-500'
        }`}>
          <item.icon size={14} className="md:w-4 md:h-4" strokeWidth={1.5} />
        </div>
        <span className="relative z-10 text-left truncate">{item.label}</span>
      </button>
    </Link>
  )

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="px-4 py-4 text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase flex items-center gap-2">
      <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
      {label}
    </div>
  )

  const GroupsSubmenuContent = () => (
    <div className="space-y-4 md:space-y-6 py-3 md:py-6 px-2 md:px-4">
      {groupsSubmenu.map((section: { category: string; items: SubmenuItemData[] }) => (
        <div key={section.category}>
          <div className="px-0 py-1.5 md:py-2.5 text-[10px] md:text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center gap-2">
            <div className="w-0.5 h-2 md:h-3 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full" />
            {section.category}
          </div>
          <div className="space-y-1 md:space-y-1.5 mt-2 md:mt-4">
            {section.items.map((item: SubmenuItemData) => (
              <SubmenuNavItem
                key={item.id}
                item={item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes slideInInertia {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutInertia {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-100%);
          }
        }

        .sidebar-enter {
          animation: slideInInertia 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .sidebar-exit {
          animation: slideOutInertia 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .sidebar-content {
          transform: translateX(0);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-content.entering {
          transform: translateX(-100%);
        }

        .sidebar-content.entered {
          transform: translateX(0);
        }

        .sidebar-content.exiting {
          transform: translateX(-100%);
        }
      `}</style>

      <div className="flex h-full w-full">
        {/* Main Sidebar - Responsive width */}
        <div className="w-full sm:w-80 bg-background border-r border-border flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="h-[72px] sm:h-[84px] border-b border-border px-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-blue-500/10 rounded-md flex items-center justify-center flex-shrink-0 border border-blue-500/20">
              <span className="text-blue-500 font-bold text-sm">I</span>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-foreground text-sm truncate">IRIS</div>
              <div className="text-xs text-muted-foreground truncate">AI Social Media Intelligence</div>
            </div>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-3 py-4 space-y-1.5">
              <NavItem
                item={{ id: 'home', label: 'Home', icon: Home, href: '/' }}
                isActive={pathname === '/'}
                hasSubmenu={false}
              />
              <NavItem
                item={{ id: 'inbox', label: 'Social Inbox', icon: Mail, href: '/social-inbox' }}
                isActive={pathname === '/social-inbox'}
                hasSubmenu={false}
              />
            </div>

            {/* Analyze Section */}
            <div className="mt-2">
              <SectionLabel label="ANALYZE" />
              <div className="px-3 space-y-1.5">
                <NavItem
                  item={{ id: 'start-analysis', label: 'Start Analysis', icon: Play, href: '/start-analysis' }}
                  isActive={pathname === '/start-analysis'}
                  hasSubmenu={false}
                />
                <NavItem
                  item={{ id: 'analysis-history', label: 'Analysis History', icon: BarChart3, href: '/analysis-history' }}
                  isActive={pathname.startsWith('/analysis-history')}
                  hasSubmenu={false}
                />
              </div>
            </div>

            {/* Explore Section */}
            <div className="mt-4">
              <SectionLabel label="EXPLORE" />
              <div className="px-3 space-y-1.5">
                {exploreItems.map((item) => (
                  <div key={item.id}>
                    <NavItem
                      item={item}
                      isActive={pathname === item.href || !!(item.submenu && expandedSubMenu === item.submenu)}
                      hasSubmenu={!!item.submenu}
                    />
                    
                    {/* Mobile Inline Submenu - Shows on mobile when expanded */}
                    {item.submenu && expandedSubMenu === item.submenu && (
                      <div className="md:hidden mt-2 ml-2 pl-4 border-l-2 border-blue-500/30 space-y-1 animate-in slide-in-from-top-2 duration-300">
                        {item.submenu === 'groups' && <GroupsSubmenuContent />}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Intelligence Section */}
            <div className="mt-4">
              <SectionLabel label="INTELLIGENCE" />
              <div className="px-3 space-y-1.5">
                <NavItem
                  item={{ id: 'entity-search', label: 'Entity Search', icon: Search, href: '/entity-search' }}
                  isActive={pathname === '/entity-search'}
                  hasSubmenu={false}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-3 space-y-3 flex-shrink-0">
            <ThemeToggle />
            <div className="px-3 py-2.5 bg-muted/50 border border-border rounded-lg hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=80" 
                    alt="User Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold hidden">
                    SU
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-foreground font-medium truncate">{user?.email || 'suumit@mydukaan.io'}</div>
                  <button 
                    onClick={logout}
                    className="text-xs text-muted-foreground hover:text-blue-500 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submenu Sidebar - Hidden on mobile, shown on larger screens */}
        {expandedSubMenu === 'groups' && (
          <div className={`hidden md:flex w-72 bg-background border-r border-border flex-col h-full overflow-hidden sidebar-enter sidebar-content ${sidebarAnimationState['groups'] || 'entered'}`}>
            {/* Submenu Header */}
            <div className="h-[72px] sm:h-[84px] border-b border-border px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Building2 size={16} className="text-blue-500" />
                </div>
                <span className="text-sm font-bold text-foreground">Groups & Communities</span>
              </div>
              <button
                onClick={() => toggleSubMenu('groups')}
                className="p-1 hover:bg-muted rounded transition-all duration-300 group"
              >
                <X size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </button>
            </div>

            {/* Submenu Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <GroupsSubmenuContent />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function DualSidebarWrapper() {
  const pathname = usePathname()
  const { isOpen: mobileOpen, setIsOpen: setMobileOpen } = useMobileMenu()

  const [activeNavItem, setActiveNavItem] = useState(() => {
    if (pathname === '/') return 'home'
    if (pathname === '/social-inbox') return 'inbox'
    if (pathname === '/start-analysis') return 'start-analysis'
    if (pathname.startsWith('/analysis-history')) return 'analysis-history'
    if (pathname === '/social-feed') return 'social-feed'
    if (pathname.startsWith('/profiles')) return 'profiles'
    if (pathname === '/entities') return 'entities'
    if (pathname === '/locations') return 'locations'
    if (pathname === '/entity-search') return 'entity-search'
    return 'home'
  })

  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null)
  const [sidebarAnimationState, setSidebarAnimationState] = useState<{[key: string]: 'entering' | 'entered' | 'exiting' | 'exited'}>({})

  // Auto-close mobile menu on resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setMobileOpen])

  // Auto-expand submenu based on current path
  React.useEffect(() => {
    if (pathname === '/social-feed') {
      setExpandedSubMenu('social-feed')
    } else if (pathname === '/communities-groups') {
      setExpandedSubMenu('groups')
    } else {
      setExpandedSubMenu(null)
    }
  }, [pathname])

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        <DualSidebarContent
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
          expandedSubMenu={expandedSubMenu}
          setExpandedSubMenu={setExpandedSubMenu}
          sidebarAnimationState={sidebarAnimationState}
          setSidebarAnimationState={setSidebarAnimationState}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[85vw] sm:w-80 max-w-sm overflow-y-auto">
          <DualSidebarContent
            activeNavItem={activeNavItem}
            setActiveNavItem={setActiveNavItem}
            expandedSubMenu={expandedSubMenu}
            setExpandedSubMenu={setExpandedSubMenu}
            sidebarAnimationState={sidebarAnimationState}
            setSidebarAnimationState={setSidebarAnimationState}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export function NewDualSidebar() {
  return <DualSidebarWrapper />
}
