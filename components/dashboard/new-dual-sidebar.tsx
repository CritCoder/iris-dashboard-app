'use client'

import React, { useState, useCallback, useMemo, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Mail, Play, BarChart3, Globe, Users, Hash, MapPin, Building2,
  Search, Shield, ChevronRight, X,
  TrendingUp, TrendingDown as TrendingDownIcon, Eye, MessageSquare, ThumbsDown, ThumbsUp, Twitter, Facebook, Instagram
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

function DualSidebarContent({ activeNavItem, setActiveNavItem, expandedSubMenu, setExpandedSubMenu }: DualSidebarProps) {
  const pathname = usePathname()
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)
  const { setIsOpen: setMobileOpen } = useMobileMenu()

  const toggleSubMenu = useCallback((menuId: string) => {
    setExpandedSubMenu(expandedSubMenu === menuId ? null : menuId)
  }, [expandedSubMenu, setExpandedSubMenu])

  const exploreItems = useMemo<NavItemData[]>(() => [
    { id: 'social-feed', label: 'Social Feed', icon: Globe, href: '/social-feed', submenu: undefined, description: 'whats happening (feed)' },
    { id: 'profiles', label: 'Profiles', icon: Users, href: '/profiles', submenu: 'profiles', description: 'who is talking' },
    { id: 'entities', label: 'Entities', icon: Hash, href: '/entities', submenu: undefined, description: 'what is being talked about' },
    { id: 'locations', label: 'Locations', icon: MapPin, href: '/locations', submenu: undefined, description: 'where things are happening' },
    { id: 'communities-groups', label: 'Communities & Groups', icon: Building2, href: '/communities-groups', submenu: 'communities-groups', description: 'social communities and groups' },
  ], [])

  const profilesSubmenu = useMemo(() => [
    {
      category: 'PRIMARY',
      items: [
        { id: 'all-authors', label: 'All Authors', icon: Users, href: '/profiles' },
      ]
    },
    {
      category: 'ENGAGEMENT & IMPACT',
      items: [
        { id: 'high-impact', label: 'High Impact Authors', icon: TrendingUp, href: '/profiles?filter=high-impact' },
        { id: 'high-reach', label: 'High Reach Authors', icon: Eye, href: '/profiles?filter=high-reach' },
        { id: 'frequent-posters', label: 'Frequent Posters', icon: MessageSquare, href: '/profiles?filter=frequent-posters' },
      ]
    },
    {
      category: 'SENTIMENT BASED',
      items: [
        { id: 'negative-influencers', label: 'Negative Influencers', icon: ThumbsDown, href: '/profiles?filter=negative' },
        { id: 'positive-influencers', label: 'Positive Influencers', icon: ThumbsUp, href: '/profiles?filter=positive' },
      ]
    },
    {
      category: 'PLATFORMS',
      items: [
        { id: 'twitter-influencers', label: 'Twitter Influencers', icon: Twitter, href: '/profiles?platform=twitter' },
        { id: 'facebook-pages', label: 'Facebook Pages', icon: Facebook, href: '/profiles?platform=facebook' },
        { id: 'instagram-influencers', label: 'Instagram Influencers', icon: Instagram, href: '/profiles?platform=instagram' },
      ]
    }
  ], [])

  const communitiesGroupsSubmenu = useMemo(() => [
    {
      category: 'PRIMARY',
      items: [
        { id: 'all-communities-groups', label: 'All Communities & Groups', icon: Building2, href: '/communities-groups' },
        { id: 'communities-only', label: 'Communities Only', icon: Building2, href: '/communities-groups?view=communities' },
        { id: 'groups-only', label: 'Groups Only', icon: Users, href: '/communities-groups?view=groups' },
      ]
    },
    {
      category: 'COMMUNITY TYPE',
      items: [
        { id: 'political', label: 'Political Communities', icon: Building2, href: '/communities-groups?type=political' },
        { id: 'social', label: 'Social Communities', icon: Users, href: '/communities-groups?type=social' },
        { id: 'professional', label: 'Professional Groups', icon: Building2, href: '/communities-groups?type=professional' },
      ]
    },
    {
      category: 'GROUP TYPE',
      items: [
        { id: 'public-groups', label: 'Public Groups', icon: Globe, href: '/communities-groups?type=public' },
        { id: 'private-groups', label: 'Private Groups', icon: Shield, href: '/communities-groups?type=private' },
        { id: 'closed-groups', label: 'Closed Groups', icon: Building2, href: '/communities-groups?type=closed' },
      ]
    },
    {
      category: 'ACTIVITY & SIZE',
      items: [
        { id: 'high-activity', label: 'High Activity', icon: TrendingUp, href: '/communities-groups?activity=high' },
        { id: 'large-groups', label: 'Large Groups (10k+)', icon: TrendingUp, href: '/communities-groups?size=large' },
        { id: 'active', label: 'Recently Active', icon: BarChart3, href: '/communities-groups?status=active' },
      ]
    }
  ], [])

  const entitiesSubmenu = useMemo(() => [
    {
      category: 'PRIMARY',
      items: [
        { id: 'all-entities', label: 'All Entities', icon: Hash, href: '/entities' },
      ]
    },
    {
      category: 'ENTITY TYPE',
      items: [
        { id: 'topics', label: 'Topics', icon: Hash, href: '/entities?type=topic' },
        { id: 'organizations', label: 'Organizations', icon: Building2, href: '/entities?type=organization' },
        { id: 'people', label: 'People', icon: Users, href: '/entities?type=person' },
        { id: 'locations', label: 'Locations', icon: MapPin, href: '/entities?type=location' },
      ]
    },
    {
      category: 'ACTIVITY',
      items: [
        { id: 'trending-entities', label: 'Trending', icon: TrendingUp, href: '/entities?activity=trending' },
        { id: 'active-entities', label: 'Active', icon: BarChart3, href: '/entities?activity=active' },
        { id: 'inactive-entities', label: 'Inactive', icon: TrendingDownIcon, href: '/entities?activity=inactive' },
      ]
    }
  ], [])

  const locationsSubmenu = useMemo(() => [
    {
      category: 'PRIMARY',
      items: [
        { id: 'all-locations', label: 'All Locations', icon: MapPin, href: '/locations' },
      ]
    },
    {
      category: 'REGION',
      items: [
        { id: 'karnataka', label: 'Karnataka', icon: MapPin, href: '/locations?region=karnataka' },
        { id: 'bangalore', label: 'Bangalore', icon: MapPin, href: '/locations?region=bangalore' },
        { id: 'other-states', label: 'Other States', icon: MapPin, href: '/locations?region=other' },
      ]
    },
    {
      category: 'ACTIVITY',
      items: [
        { id: 'high-activity-locations', label: 'High Activity', icon: TrendingUp, href: '/locations?activity=high' },
        { id: 'medium-activity-locations', label: 'Medium Activity', icon: BarChart3, href: '/locations?activity=medium' },
        { id: 'low-activity-locations', label: 'Low Activity', icon: TrendingDownIcon, href: '/locations?activity=low' },
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
        className={`w-full flex items-center justify-start gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-all duration-300 group relative overflow-hidden ${
          isActive
            ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-foreground border border-blue-500/30'
            : 'text-foreground/80 hover:text-foreground hover:bg-muted/50'
        }`}
      >
        {!isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        <div className={`transition-all duration-300 relative z-10 ${
          isActive ? 'text-blue-500' : 'text-foreground/70 group-hover:text-blue-500'
        }`}>
          <item.icon size={16} strokeWidth={1.5} />
        </div>
        <span className="relative z-10 text-left">{item.label}</span>
      </button>
    </Link>
  )

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="px-4 py-4 text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase flex items-center gap-2">
      <div className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
      {label}
    </div>
  )

  const ProfilesSubmenuContent = () => (
    <div className="space-y-6 py-6 px-4">
      {profilesSubmenu.map((section) => (
        <div key={section.category}>
          <div className="px-0 py-2.5 text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center gap-2">
            <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full" />
            {section.category}
          </div>
          <div className="space-y-1.5 mt-4">
            {section.items.map((item) => (
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

  const CommunitiesGroupsSubmenuContent = () => (
    <div className="space-y-6 py-6 px-4">
      {communitiesGroupsSubmenu.map((section) => (
        <div key={section.category}>
          <div className="px-0 py-2.5 text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center gap-2">
            <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full" />
            {section.category}
          </div>
          <div className="space-y-1.5 mt-4">
            {section.items.map((item) => (
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

  const EntitiesSubmenuContent = () => (
    <div className="space-y-6 py-6 px-4">
      {entitiesSubmenu.map((section) => (
        <div key={section.category}>
          <div className="px-0 py-2.5 text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center gap-2">
            <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full" />
            {section.category}
          </div>
          <div className="space-y-1.5 mt-4">
            {section.items.map((item) => (
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

  const LocationsSubmenuContent = () => (
    <div className="space-y-6 py-6 px-4">
      {locationsSubmenu.map((section) => (
        <div key={section.category}>
          <div className="px-0 py-2.5 text-xs font-bold text-muted-foreground/60 tracking-widest uppercase flex items-center gap-2">
            <div className="w-0.5 h-3 bg-gradient-to-b from-blue-500/60 to-transparent rounded-full" />
            {section.category}
          </div>
          <div className="space-y-1.5 mt-4">
            {section.items.map((item) => (
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

        .sidebar-enter {
          animation: slideInInertia 0.6s cubic-bezier(0.23, 1, 0.320, 1) forwards;
        }
      `}</style>

      <div className="flex h-full">
        {/* Main Sidebar - 80 units wide */}
        <div className="w-80 bg-background border-r border-border flex flex-col h-full overflow-hidden">
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
          <div className="flex-1 overflow-hidden">
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
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={pathname === item.href || (item.submenu && expandedSubMenu === item.submenu)}
                    hasSubmenu={!!item.submenu}
                  />
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
                  <div className="text-xs text-foreground font-medium truncate">suumit@mydukaan.io</div>
                  <button className="text-xs text-muted-foreground hover:text-blue-500 transition-colors font-medium">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submenu Sidebar - 72 units wide */}
        {expandedSubMenu === 'profiles' && (
          <div className="w-72 bg-background border-r border-border flex flex-col h-full overflow-hidden sidebar-enter">
            {/* Submenu Header */}
            <div className="h-[72px] sm:h-[84px] border-b border-border px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Users size={16} className="text-blue-500" />
                </div>
                <span className="text-sm font-bold text-foreground">Profiles</span>
              </div>
              <button
                onClick={() => toggleSubMenu('profiles')}
                className="p-1 hover:bg-muted rounded transition-all duration-300 group"
              >
                <X size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </button>
            </div>

            {/* Submenu Content */}
            <div className="flex-1 overflow-hidden">
              <ProfilesSubmenuContent />
            </div>
          </div>
        )}

        {expandedSubMenu === 'communities-groups' && (
          <div className="w-72 bg-background border-r border-border flex flex-col h-full overflow-hidden sidebar-enter">
            {/* Submenu Header */}
            <div className="h-[72px] sm:h-[84px] border-b border-border px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Building2 size={16} className="text-blue-500" />
                </div>
                <span className="text-sm font-bold text-foreground">Communities & Groups</span>
              </div>
              <button
                onClick={() => toggleSubMenu('communities-groups')}
                className="p-1 hover:bg-muted rounded transition-all duration-300 group"
              >
                <X size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </button>
            </div>

            {/* Submenu Content */}
            <div className="flex-1 overflow-hidden">
              <CommunitiesGroupsSubmenuContent />
            </div>
          </div>
        )}

        {expandedSubMenu === 'entities' && (
          <div className="w-72 bg-background border-r border-border flex flex-col h-full overflow-hidden sidebar-enter">
            {/* Submenu Header */}
            <div className="h-[72px] sm:h-[84px] border-b border-border px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Hash size={16} className="text-blue-500" />
                </div>
                <span className="text-sm font-bold text-foreground">Entities</span>
              </div>
              <button
                onClick={() => toggleSubMenu('entities')}
                className="p-1 hover:bg-muted rounded transition-all duration-300 group"
              >
                <X size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </button>
            </div>

            {/* Submenu Content */}
            <div className="flex-1 overflow-hidden">
              <EntitiesSubmenuContent />
            </div>
          </div>
        )}

        {expandedSubMenu === 'locations' && (
          <div className="w-72 bg-background border-r border-border flex flex-col h-full overflow-hidden sidebar-enter">
            {/* Submenu Header */}
            <div className="h-[72px] sm:h-[84px] border-b border-border px-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <MapPin size={16} className="text-blue-500" />
                </div>
                <span className="text-sm font-bold text-foreground">Locations</span>
              </div>
              <button
                onClick={() => toggleSubMenu('locations')}
                className="p-1 hover:bg-muted rounded transition-all duration-300 group"
              >
                <X size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
              </button>
            </div>

            {/* Submenu Content */}
            <div className="flex-1 overflow-hidden">
              <LocationsSubmenuContent />
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

  // Auto-expand submenu based on current path
  React.useEffect(() => {
    if (pathname === '/profiles') {
      setExpandedSubMenu('profiles')
    } else if (pathname === '/entities') {
      setExpandedSubMenu('entities')
    } else if (pathname === '/locations') {
      setExpandedSubMenu('locations')
    } else if (pathname === '/social-feed') {
      setExpandedSubMenu('social-feed')
    } else if (pathname === '/communities-groups') {
      setExpandedSubMenu('communities-groups')
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
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <DualSidebarContent
            activeNavItem={activeNavItem}
            setActiveNavItem={setActiveNavItem}
            expandedSubMenu={expandedSubMenu}
            setExpandedSubMenu={setExpandedSubMenu}
          />
        </SheetContent>
      </Sheet>
    </>
  )
}

export function NewDualSidebar() {
  return <DualSidebarWrapper />
}
