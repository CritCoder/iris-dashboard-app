'use client'

import { useState, createContext, useContext, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  Home, Mail, Play, BarChart3, Globe, Users, Hash, MapPin, Building,
  Search, Shield, ChevronRight, X,
  TrendingUp, Eye, MessageSquare, Sparkles, Target, AlertTriangle, Activity,
  Newspaper, Video, Smile, Meh, Frown, User, MessageCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Sheet, SheetContent } from '@/components/ui/sheet'

// Create a context for mobile menu state
export const MobileMenuContext = createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
} | null>(null)

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
  href?: string
  submenu?: string
}

interface SubmenuItemData {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

interface DualSidebarProps {
  activeNavItem: string
  setActiveNavItem: (item: string) => void
  expandedSubMenu: string | null
  setExpandedSubMenu: (menu: string | null) => void
}

function NavItem({
  item,
  isActive,
  onClick,
  hasSubmenu
}: {
  item: NavItemData
  isActive: boolean
  onClick: () => void
  hasSubmenu: boolean
}) {
  const pathname = usePathname()
  const isCurrentPath = item.href && (pathname === item.href || pathname.startsWith(item.href + '/'))

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all duration-200 group ${
        isActive || isCurrentPath
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      <div className="flex items-center gap-3">
        <item.icon size={18} strokeWidth={1.5} />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {hasSubmenu && (
        <ChevronRight size={16} className="transition-transform duration-200" />
      )}
    </button>
  )
}

function SubmenuNavItem({
  item,
  isActive,
  onClick
}: {
  item: SubmenuItemData
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Link href={item.href}>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3.5 py-2 text-sm rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        <item.icon size={16} strokeWidth={1.5} />
        <span>{item.label}</span>
      </button>
    </Link>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 py-3 text-xs font-bold text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
      <div className="w-1 h-1 rounded-full bg-cyan-400/60" />
      {label}
    </div>
  )
}

function DualSidebarContent({ activeNavItem, setActiveNavItem, expandedSubMenu, setExpandedSubMenu }: DualSidebarProps) {
  const { logout, user } = useAuth()
  const pathname = usePathname()
  const [activeSubmenuItem, setActiveSubmenuItem] = useState<string | null>(null)

  const toggleSubMenu = useCallback((menuId: string) => {
    setExpandedSubMenu(expandedSubMenu === menuId ? null : menuId)
  }, [expandedSubMenu, setExpandedSubMenu])

  const exploreItems = useMemo<NavItemData[]>(() => [
    { id: 'social-feed', label: 'Social Feed', icon: Globe, href: '/social-feed', submenu: 'social-feed' },
    { id: 'profiles', label: 'Profiles', icon: Users, href: '/profiles' },
    { id: 'entities', label: 'Entities', icon: Hash, href: '/entities' },
    { id: 'locations', label: 'Locations', icon: MapPin, href: '/locations' },
    { id: 'groups', label: 'Groups & Organizations', icon: Building, href: '/organizations' },
  ], [])

  const socialFeedSubmenu = useMemo(() => [
    {
      category: 'DISCOVER',
      items: [
        { id: 'all-posts', label: 'All Posts', icon: Globe, href: '/social-feed?filter=all' },
        { id: 'latest-posts', label: 'Latest Posts', icon: Sparkles, href: '/social-feed?filter=latest' },
      ]
    },
    {
      category: 'CONTENT & ENGAGEMENT',
      items: [
        { id: 'high-impact', label: 'High Impact', icon: Target, href: '/social-feed?filter=high-impact' },
        { id: 'viral-negative', label: 'Viral Negative', icon: AlertTriangle, href: '/social-feed?filter=viral-negative' },
        { id: 'trending', label: 'Trending Discussions', icon: MessageCircle, href: '/social-feed?filter=trending' },
        { id: 'high-engagement', label: 'High Engagement', icon: BarChart3, href: '/social-feed?filter=high-engagement' },
        { id: 'high-reach', label: 'High Reach/Low Engage', icon: Eye, href: '/social-feed?filter=high-reach' },
        { id: 'viral-potential', label: 'Viral Potential', icon: Activity, href: '/social-feed?filter=viral-potential' },
      ]
    },
    {
      category: 'BROWSE BY PLATFORM',
      items: [
        { id: 'news', label: 'News', icon: Newspaper, href: '/social-feed?filter=news' },
        { id: 'videos', label: 'Videos', icon: Video, href: '/social-feed?filter=videos' },
        { id: 'twitter', label: 'Twitter', icon: MessageSquare, href: '/social-feed?filter=twitter' },
        { id: 'facebook', label: 'Facebook', icon: Users, href: '/social-feed?filter=facebook' },
        { id: 'instagram', label: 'Instagram', icon: MapPin, href: '/social-feed?filter=instagram' },
      ]
    },
    {
      category: 'MONITOR SENTIMENT',
      items: [
        { id: 'positive', label: 'Positive Posts', icon: Smile, href: '/social-feed?filter=positive' },
        { id: 'neutral', label: 'Neutral Posts', icon: Meh, href: '/social-feed?filter=neutral' },
        { id: 'negative', label: 'Negative Posts', icon: Frown, href: '/social-feed?filter=negative' },
      ]
    }
  ], [])

  const getSubmenuContent = (submenuId: string) => {
    switch (submenuId) {
      case 'social-feed':
        return socialFeedSubmenu
      default:
        return []
    }
  }

  const submenuContent = expandedSubMenu ? getSubmenuContent(expandedSubMenu) : []

  return (
    <div className="flex h-full">
      {/* Main Sidebar */}
      <div className="w-64 bg-background border-r border-border flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-20 border-b border-border px-4 flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-primary">I</span>
            </div>
            <div>
              <div className="font-bold text-foreground text-sm">IRIS</div>
              <div className="text-xs text-muted-foreground">Intelligence Platform</div>
            </div>
          </Link>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-4 space-y-1">
            <NavItem
              item={{ id: 'home', label: 'Home', icon: Home, href: '/' }}
              isActive={activeNavItem === 'home'}
              onClick={() => setActiveNavItem('home')}
              hasSubmenu={false}
            />
            <NavItem
              item={{ id: 'inbox', label: 'Social Inbox', icon: Mail, href: '/social-inbox' }}
              isActive={activeNavItem === 'inbox'}
              onClick={() => setActiveNavItem('inbox')}
              hasSubmenu={false}
            />
          </div>

          {/* Analyze Section */}
          <div className="mt-2">
            <SectionLabel label="ANALYZE" />
            <div className="px-3 space-y-1">
              <NavItem
                item={{ id: 'start-analysis', label: 'Start Analysis', icon: Play, href: '/start-analysis' }}
                isActive={activeNavItem === 'start-analysis'}
                onClick={() => setActiveNavItem('start-analysis')}
                hasSubmenu={false}
              />
              <NavItem
                item={{ id: 'analysis-history', label: 'Analysis History', icon: BarChart3, href: '/analysis-history' }}
                isActive={activeNavItem === 'analysis-history'}
                onClick={() => setActiveNavItem('analysis-history')}
                hasSubmenu={false}
              />
            </div>
          </div>

          {/* Explore Section */}
          <div className="mt-4">
            <SectionLabel label="EXPLORE" />
            <div className="px-3 space-y-1">
              {exploreItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeNavItem === item.id}
                  onClick={() => {
                    setActiveNavItem(item.id)
                    if (item.submenu) {
                      toggleSubMenu(item.submenu)
                    }
                  }}
                  hasSubmenu={!!item.submenu}
                />
              ))}
            </div>
          </div>

          {/* Intelligence Section */}
          <div className="mt-4">
            <SectionLabel label="INTELLIGENCE" />
            <div className="px-3 space-y-1">
              <NavItem
                item={{ id: 'entity-search', label: 'Entity Search', icon: Search, href: '/entity-search' }}
                isActive={activeNavItem === 'entity-search'}
                onClick={() => setActiveNavItem('entity-search')}
                hasSubmenu={false}
              />
              <NavItem
                item={{ id: 'osint-tools', label: 'OSINT Tools', icon: Shield, href: '/osint-tools' }}
                isActive={activeNavItem === 'osint-tools'}
                onClick={() => setActiveNavItem('osint-tools')}
                hasSubmenu={false}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 space-y-3 flex-shrink-0">
          <ThemeToggle />
          <div className="px-2">
            <div className="text-xs text-foreground font-medium truncate">{user?.email || 'suumit@mydukaan.io'}</div>
            <button
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Submenu Sidebar */}
      {expandedSubMenu && submenuContent.length > 0 && (
        <div className="w-72 bg-background border-r border-border flex flex-col h-full overflow-hidden animate-in slide-in-from-left-10 duration-300">
          {/* Submenu Header */}
          <div className="h-20 border-b border-border px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                {expandedSubMenu === 'social-feed' && <Globe size={16} className="text-primary" />}
                {expandedSubMenu === 'profiles' && <Users size={16} className="text-primary" />}
                {expandedSubMenu === 'entities' && <Hash size={16} className="text-primary" />}
                {expandedSubMenu === 'locations' && <MapPin size={16} className="text-primary" />}
              </div>
              <span className="text-sm font-bold text-foreground capitalize">{expandedSubMenu.replace('-', ' ')}</span>
            </div>
            <button
              onClick={() => setExpandedSubMenu(null)}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              <X size={18} className="text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* Submenu Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 py-6 px-4">
              {submenuContent.map((section: any) => (
                <div key={section.category}>
                  <div className="px-0 py-2 text-xs font-bold text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                    <div className="w-0.5 h-3 bg-primary/60 rounded-full" />
                    {section.category}
                  </div>
                  <div className="space-y-1 mt-3">
                    {section.items.map((item: SubmenuItemData) => (
                      <SubmenuNavItem
                        key={item.id}
                        item={item}
                        isActive={activeSubmenuItem === item.id}
                        onClick={() => setActiveSubmenuItem(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <MobileMenuContext.Provider value={{ isOpen: mobileOpen, setIsOpen: setMobileOpen }}>
      {children}
    </MobileMenuContext.Provider>
  )
}

function DualSidebarWrapper() {
  const { isOpen: mobileOpen, setIsOpen: setMobileOpen } = useMobileMenu()
  const [activeNavItem, setActiveNavItem] = useState('home')
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed h-screen z-40">
        <DualSidebarContent
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
          expandedSubMenu={expandedSubMenu}
          setExpandedSubMenu={setExpandedSubMenu}
        />
      </aside>

      {/* Mobile Sidebar in Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-full max-w-md p-0 lg:hidden">
          <div className="h-full">
            <DualSidebarContent
              activeNavItem={activeNavItem}
              setActiveNavItem={setActiveNavItem}
              expandedSubMenu={expandedSubMenu}
              setExpandedSubMenu={setExpandedSubMenu}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export function DualSidebar() {
  return <DualSidebarWrapper />
}
