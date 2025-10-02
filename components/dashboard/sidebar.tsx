'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Frown
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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
  const active = href ? pathname === href : false

  const buttonContent = (
    <div
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all cursor-pointer ${
        active 
          ? 'bg-secondary text-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
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
            ? 'bg-secondary text-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
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
    <div className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
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

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col fixed h-screen overflow-y-auto z-40 pointer-events-auto">
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
          hasSubmenu
          submenuContent={<SocialFeedSubmenu />}
        />
        
        <NavItem icon={User} label="Profiles" href="/profiles" />
        <NavItem icon={Hash} label="Entities" href="/entities" />
        <NavItem icon={MapPin} label="Locations" href="/locations" />
        <NavItem icon={Search} label="Entity Search" href="/entity-search" />
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
            <div className="text-sm font-medium text-foreground truncate">suumit@mydukaan.io</div>
            <button className="text-xs text-muted-foreground hover:text-foreground">Logout</button>
          </div>
        </div>
      </div>
    </aside>
  )
}
