'use client'

import { useState, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import {
  Home,
  Mail,
  Play,
  BarChart3,
  Globe,
  User,
  Hash,
  MapPin,
  Search,
  ChevronRight,
  Sparkles,
  Target,
  AlertTriangle,
  MessageCircle,
  Eye,
  Activity,
  Newspaper,
  Video,
  MessageSquare,
  Users,
  Smile,
  Meh,
  Frown,
  X,
  Shield,
  Database,
  TrendingUp,
  Building
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

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

interface NavItemProps {
  icon: React.ElementType
  label: string
  href?: string
  hasSubmenu?: boolean
  submenuContent?: React.ReactNode
}

function NavItem({ icon: Icon, label, href, hasSubmenu = false, submenuContent }: NavItemProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  
  // Special case: Individual post pages should show Social Feed as active
  const isPostPage = pathname.includes('/post/')
  const shouldShowSocialFeedActive = isPostPage && label === 'Social Feed'
  const shouldShowAnalysisHistoryActive = isPostPage && label === 'Analysis History'
  
  const active = shouldShowSocialFeedActive ? true : 
                 shouldShowAnalysisHistoryActive ? false :
                 href ? (pathname === href || (href !== '/' && pathname.startsWith(href + '/'))) : false

  const buttonContent = (
    <div
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
        active 
          ? 'bg-primary text-primary-foreground shadow-sm border border-primary/20' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent/50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {hasSubmenu && (
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      )}
    </div>
  )

  if (hasSubmenu && submenuContent) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {buttonContent}
        </PopoverTrigger>
        <PopoverContent 
          side="right" 
          align="start" 
          sideOffset={8}
          className="w-72 p-0 bg-card border border-border shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="list-animate-in">
            {submenuContent}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  if (href) {
    return <Link href={href}>{buttonContent}</Link>
  }

  return buttonContent
}

interface SubNavItemProps {
  icon: React.ElementType
  label: string
  href: string
}

function SubNavItem({ icon: Icon, label, href }: SubNavItemProps) {
  const pathname = usePathname()
  // Fallback: no query string in pathname in Next app router, so read from window if available
  let currentFilter: string | null = null
  if (typeof window !== 'undefined') {
    const sp = new URLSearchParams(window.location.search)
    currentFilter = sp.get('filter')
  }
  const linkFilter = href.split('?filter=')[1]
  const active = pathname.startsWith('/social-feed') && currentFilter === linkFilter

  return (
    <Link href={href}>
      <div
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
          active 
            ? 'bg-primary/10 text-primary border border-primary/20' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:border-accent/50 border border-transparent'
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {children}
    </div>
  )
}

function SocialFeedSubmenu() {
  return (
    <div className="py-2 animate-in fade-in-50 slide-in-from-left-2 duration-150">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Social Feed</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Browse and filter social content</p>
      </div>
      
      <div className="py-2">
        <SectionLabel>Discover</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Globe} label="All Posts" href="/social-feed?filter=all" />
          <SubNavItem icon={Sparkles} label="Latest Posts" href="/social-feed?filter=latest" />
        </div>
        
        <SectionLabel>Content & Engagement</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Target} label="High Impact" href="/social-feed?filter=high-impact" />
          <SubNavItem icon={AlertTriangle} label="Viral Negative" href="/social-feed?filter=viral-negative" />
          <SubNavItem icon={MessageCircle} label="Trending Discussions" href="/social-feed?filter=trending" />
          <SubNavItem icon={BarChart3} label="High Engagement" href="/social-feed?filter=high-engagement" />
          <SubNavItem icon={Eye} label="High Reach, Low Engagement" href="/social-feed?filter=high-reach" />
          <SubNavItem icon={Activity} label="Viral Potential" href="/social-feed?filter=viral-potential" />
        </div>
        
        <SectionLabel>Browse by Platform</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Newspaper} label="News" href="/social-feed?filter=news" />
          <SubNavItem icon={Video} label="Videos" href="/social-feed?filter=videos" />
          <SubNavItem icon={MessageSquare} label="Twitter" href="/social-feed?filter=twitter" />
          <SubNavItem icon={Users} label="Facebook" href="/social-feed?filter=facebook" />
          <SubNavItem icon={MapPin} label="Instagram" href="/social-feed?filter=instagram" />
        </div>
        
        <SectionLabel>Monitor Sentiment</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Smile} label="Positive Posts" href="/social-feed?filter=positive" />
          <SubNavItem icon={Meh} label="Neutral Posts" href="/social-feed?filter=neutral" />
          <SubNavItem icon={Frown} label="Negative Posts" href="/social-feed?filter=negative" />
        </div>
      </div>
    </div>
  )
}

function LocationsSubmenu() {
  return (
    <div className="py-2 animate-in fade-in-50 slide-in-from-left-2 duration-150">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Locations</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Explore and filter by location</p>
      </div>
      
      <div className="py-2">
        <SectionLabel>Primary</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={MapPin} label="All Locations" href="/locations?filter=all" />
          <SubNavItem icon={TrendingUp} label="High Impact Locations" href="/locations?filter=high-impact" />
          <SubNavItem icon={Activity} label="Trending Locations" href="/locations?filter=trending" />
          <SubNavItem icon={MessageSquare} label="Frequently Mentioned" href="/locations?filter=frequent" />
        </div>
        
        <SectionLabel>Sentiment Based</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Frown} label="Negative Locations" href="/locations?filter=negative" />
          <SubNavItem icon={Smile} label="Positive Locations" href="/locations?filter=positive" />
          <SubNavItem icon={AlertTriangle} label="Controversial" href="/locations?filter=controversial" />
        </div>
        
        <SectionLabel>Police Divisions</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={MapPin} label="Whitefield Division" href="/locations?filter=whitefield" />
          <SubNavItem icon={MapPin} label="South East Division" href="/locations?filter=south-east" />
          <SubNavItem icon={MapPin} label="Central Division" href="/locations?filter=central" />
          <SubNavItem icon={MapPin} label="Northeast Division" href="/locations?filter=northeast" />
          <SubNavItem icon={MapPin} label="East Division" href="/locations?filter=east" />
          <SubNavItem icon={MapPin} label="North Division" href="/locations?filter=north" />
        </div>
      </div>
    </div>
  )
}

function EntitiesSubmenu() {
  return (
    <div className="py-2 animate-in fade-in-50 slide-in-from-left-2 duration-150">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Entities</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Explore and filter entities</p>
      </div>
      
      <div className="py-2">
        <SectionLabel>Primary</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Hash} label="All Entities" href="/entities?filter=all" />
          <SubNavItem icon={Hash} label="All Topics" href="/entities?filter=topics" />
          <SubNavItem icon={User} label="All People" href="/entities?filter=people" />
          <SubNavItem icon={Building} label="All Organizations" href="/entities?filter=organizations" />
        </div>
        
        <SectionLabel>Engagement & Impact</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={TrendingUp} label="High Impact Entities" href="/entities?filter=high-impact" />
          <SubNavItem icon={Activity} label="Trending Topics" href="/entities?filter=trending" />
          <SubNavItem icon={MessageSquare} label="Frequently Mentioned" href="/entities?filter=frequent" />
        </div>
        
        <SectionLabel>Sentiment Based</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Frown} label="Negative Entities" href="/entities?filter=negative" />
          <SubNavItem icon={Smile} label="Positive Entities" href="/entities?filter=positive" />
          <SubNavItem icon={AlertTriangle} label="Controversial" href="/entities?filter=controversial" />
        </div>
        
        <SectionLabel>Entity Types</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Hash} label="Topics" href="/entities?filter=topics" />
          <SubNavItem icon={User} label="People" href="/entities?filter=people" />
          <SubNavItem icon={Building} label="Organizations" href="/entities?filter=organizations" />
          <SubNavItem icon={MapPin} label="Locations" href="/entities?filter=locations" />
          <SubNavItem icon={AlertTriangle} label="Threats" href="/entities?filter=threats" />
          <SubNavItem icon={Hash} label="Keywords" href="/entities?filter=keywords" />
        </div>
        
        <SectionLabel>Categories</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Building} label="Political Parties" href="/entities?filter=political-parties" />
          <SubNavItem icon={User} label="Politicians" href="/entities?filter=politicians" />
          <SubNavItem icon={Newspaper} label="News Outlets" href="/entities?filter=news-outlets" />
          <SubNavItem icon={Shield} label="Government Agencies" href="/entities?filter=government" />
        </div>
      </div>
    </div>
  )
}

function ProfilesSubmenu() {
  return (
    <div className="py-2 animate-in fade-in-50 slide-in-from-left-2 duration-150">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Profiles</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Explore and filter profiles</p>
      </div>
      
      <div className="py-2">
        <SectionLabel>Primary</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Users} label="All Authors" href="/profiles?filter=all" />
        </div>
        
        <SectionLabel>Engagement & Impact</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={TrendingUp} label="High Impact Authors" href="/profiles?filter=high-impact" />
          <SubNavItem icon={Eye} label="High Reach Authors" href="/profiles?filter=high-reach" />
          <SubNavItem icon={MessageSquare} label="Frequent Posters" href="/profiles?filter=frequent" />
        </div>
        
        <SectionLabel>Sentiment Based</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Frown} label="Negative Influencers" href="/profiles?filter=negative" />
          <SubNavItem icon={Smile} label="Positive Influencers" href="/profiles?filter=positive" />
        </div>
        
        <SectionLabel>Platforms</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={MessageSquare} label="Twitter Influencers" href="/profiles?filter=twitter" />
          <SubNavItem icon={Users} label="Facebook Pages" href="/profiles?filter=facebook" />
          <SubNavItem icon={MapPin} label="Instagram Influencers" href="/profiles?filter=instagram" />
        </div>
      </div>
    </div>
  )
}

function EntitySearchSubmenu() {
  return (
    <div className="py-2 animate-in fade-in-50 slide-in-from-left-2 duration-150">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Entity Search</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Advanced search and intelligence tools</p>
      </div>
      
      <div className="py-2">
        <SectionLabel>Search</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Search} label="Search" href="/entity-search?type=search" />
        </div>
        
        <SectionLabel>Phone Intelligence</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Search} label="Unified Mobile Search" href="/entity-search?type=unified-mobile" />
          <SubNavItem icon={Search} label="TrueCaller Search" href="/entity-search?type=truecaller" />
          <SubNavItem icon={Search} label="Mobile to Account" href="/entity-search?type=mobile-account" />
          <SubNavItem icon={Search} label="UPI to Bank" href="/entity-search?type=upi-bank" />
          <SubNavItem icon={Search} label="Mobile to Address" href="/entity-search?type=mobile-address" />
          <SubNavItem icon={Search} label="Mobile to Name" href="/entity-search?type=mobile-name" />
          <SubNavItem icon={Search} label="Mobile to PAN" href="/entity-search?type=mobile-pan" />
          <SubNavItem icon={Search} label="Mobile to Vehicle" href="/entity-search?type=mobile-vehicle" />
        </div>
        
        <SectionLabel>Vehicle Intelligence</SectionLabel>
        <div className="px-2 space-y-1">
          <SubNavItem icon={Search} label="Vehicle Unified Search" href="/entity-search?type=vehicle-unified" />
          <SubNavItem icon={Search} label="Vehicle Details (RC)" href="/entity-search?type=vehicle-rc" />
          <SubNavItem icon={Search} label="Vehicle to Mobile" href="/entity-search?type=vehicle-mobile" />
        </div>
      </div>
    </div>
  )
}

function SidebarContent() {
  const { logout, user } = useAuth()

  return (
    <>
      <div className="px-6 border-b border-border flex-shrink-0" style={{ height: '84px' }}>
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer h-full">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-foreground">IRIS</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">IRIS</div>
              <div className="text-xs text-muted-foreground">Intelligence Platform</div>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem icon={Home} label="Home" href="/" />
        <NavItem icon={Mail} label="Social Inbox" href="/social-inbox" />
        <NavItem icon={Play} label="Start Analysis" href="/start-analysis" />
        <NavItem icon={BarChart3} label="Analysis History" href="/analysis-history" />

        <NavItem
          icon={Globe}
          label="Social Feed"
          href="/social-feed"
          hasSubmenu
          submenuContent={<SocialFeedSubmenu />}
        />

        <NavItem
          icon={User}
          label="Profiles"
          href="/profiles"
          hasSubmenu
          submenuContent={<ProfilesSubmenu />}
        />
        
        <NavItem
          icon={Hash}
          label="Entities"
          href="/entities"
          hasSubmenu
          submenuContent={<EntitiesSubmenu />}
        />
        
        <NavItem
          icon={MapPin}
          label="Locations"
          href="/locations"
          hasSubmenu
          submenuContent={<LocationsSubmenu />}
        />
        
        <NavItem
          icon={Search}
          label="Entity Search"
          href="/entity-search"
          hasSubmenu
          submenuContent={<EntitySearchSubmenu />}
        />
        <NavItem icon={Shield} label="OSINT Tools" href="/osint-tools" />
      </nav>

      <div className="p-4 border-t border-border flex-shrink-0">
        {/* Theme Toggle */}
        <div className="mb-4 flex justify-start">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold flex-shrink-0 text-foreground">
            N
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {user?.email || 'suumit@mydukaan.io'}
            </div>
            <button 
              onClick={logout}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
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

export function Sidebar() {
  const { isOpen: mobileOpen, setIsOpen: setMobileOpen } = useMobileMenu()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 border-r border-border bg-background flex-col fixed h-screen overflow-y-auto z-40 pointer-events-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar in Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 lg:hidden">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
