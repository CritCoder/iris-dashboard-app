'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Mail, Play, BarChart3, Globe, Users, Hash, MapPin, Building2,
  Search, Shield
} from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'inbox', label: 'Social Inbox', icon: Mail, href: '/social-inbox' },
]

const analyzeItems = [
  { id: 'start-analysis', label: 'Start Analysis', icon: Play, href: '/start-analysis' },
  { id: 'analysis-history', label: 'Analysis History', icon: BarChart3, href: '/analysis-history' },
]

const exploreItems = [
  { id: 'social-feed', label: 'Social Feed', icon: Globe, href: '/social-feed', description: 'What\'s happening (feed)' },
  { id: 'profiles', label: 'Profiles', icon: Users, href: '/profiles', description: 'Who is talking' },
  { id: 'entities', label: 'Entities', icon: Hash, href: '/entities', description: 'What is being talked about' },
  { id: 'locations', label: 'Locations', icon: MapPin, href: '/locations', description: 'Where things are happening' },
]

const communitiesSubmenuItems = [
  {
    category: 'PRIMARY',
    items: [
      { id: 'all-communities', label: 'All Communities', icon: Building2, href: '/communities' },
    ]
  },
  {
    category: 'COMMUNITY TYPE',
    items: [
      { id: 'political-communities', label: 'Political Communities', icon: Building2, href: '/communities?type=political' },
      { id: 'business-communities', label: 'Business Communities', icon: Building2, href: '/communities?type=business' },
      { id: 'social-communities', label: 'Social Communities', icon: Building2, href: '/communities?type=social' },
    ]
  }
]

const groupsSubmenuItems = [
  {
    category: 'PRIMARY',
    items: [
      { id: 'all-groups', label: 'All Groups', icon: Users, href: '/communities-groups' },
    ]
  },
  {
    category: 'GROUP TYPE',
    items: [
      { id: 'organizations', label: 'Organizations', icon: Building2, href: '/organizations' },
      { id: 'user-groups', label: 'User Groups', icon: Users, href: '/communities-groups?type=user' },
    ]
  }
]

const intelligenceItems = [
  { id: 'entity-search', label: 'Entity Search', icon: Search, href: '/entity-search' },
  { id: 'osint-tools', label: 'OSINT Tools', icon: Shield, href: '/osint-tools' },
]

interface SubmenuItem {
  id: string
  label: string
  icon: React.ElementType
  href: string
}

interface SubmenuCategory {
  category: string
  items: SubmenuItem[]
}

const SubmenuContent = ({ items }: { items: SubmenuCategory[] }) => {
  return (
    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
      {items.map((category) => (
        <div key={category.category} className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
          <div className="space-y-1">
            {category.items.map((item) => (
              <NavigationMenuLink key={item.id} asChild>
                <Link
                  href={item.href}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={16} />
                    <div className="text-sm font-medium leading-none">{item.label}</div>
                  </div>
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const SimpleNavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className={cn(
          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <item.icon size={16} />
          <span>{item.label}</span>
        </div>
      </Link>
    </NavigationMenuLink>
  )
}

export function HeaderNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">I</span>
            </div>
            <div>
              <div className="font-bold text-foreground text-sm">IRIS</div>
              <div className="text-xs text-muted-foreground">Intelligence Platform</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex">
            {/* Main Navigation Items */}
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.id}>
                <SimpleNavItem item={item} isActive={pathname === item.href} />
              </NavigationMenuItem>
            ))}

            {/* Analyze Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  <span>Analyze</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[300px] gap-3 p-4">
                  {analyzeItems.map((item) => (
                    <NavigationMenuLink key={item.id} asChild>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={16} />
                          <div className="text-sm font-medium leading-none">{item.label}</div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Explore Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>Explore</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  {/* Simple explore items */}
                  {exploreItems.map((item) => (
                    <NavigationMenuLink key={item.id} asChild>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={16} />
                          <div>
                            <div className="text-sm font-medium leading-none">{item.label}</div>
                            {item.description && (
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                  
                  {/* Profiles with submenu */}
                  <NavigationMenuLink asChild>
                    <Link
                      href="/profiles"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <div>
                          <div className="text-sm font-medium leading-none">Profiles</div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            Who is talking
                          </p>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>

                  {/* Communities with submenu */}
                  <NavigationMenuLink asChild>
                    <Link
                      href="/communities"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 size={16} />
                        <div>
                          <div className="text-sm font-medium leading-none">Communities</div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            Groups and communities
                          </p>
                        </div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Communities Submenu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span>Communities</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <SubmenuContent items={communitiesSubmenuItems} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Groups Submenu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Groups</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <SubmenuContent items={groupsSubmenuItems} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Intelligence Section */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-10">
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  <span>Intelligence</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[300px] gap-3 p-4">
                  {intelligenceItems.map((item) => (
                    <NavigationMenuLink key={item.id} asChild>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={16} />
                          <div className="text-sm font-medium leading-none">{item.label}</div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Add mobile menu button here if needed */}
        </div>
      </div>
    </header>
  )
}
