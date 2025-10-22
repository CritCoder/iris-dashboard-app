'use client'

import {
  Globe,
  MessageSquare,
  User,
  Building,
  Flame as Fire,
  BarChart,
  TrendingUp,
  Frown,
  Smile,
  AlertTriangle,
  MapPin,
  ShieldAlert,
  Search,
  Flag,
  Users,
  Newspaper,
  Library,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type MenuItem = {
  name: string
  icon: LucideIcon
  params: Record<string, string>
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

const menuItems: MenuSection[] = [
  {
    title: 'Primary',
    items: [
      { name: 'All Entities', icon: Globe, params: {} },
      { name: 'All Topics', icon: MessageSquare, params: { type: 'TOPIC' } },
      { name: 'All People', icon: User, params: { type: 'PERSON' } },
      { name: 'All Organizations', icon: Building, params: { type: 'ORGANIZATION' } },
    ],
  },
  {
    title: 'Engagement & Impact',
    items: [
      { name: 'High Impact Entities', icon: Fire, params: { minMentions: '100' } },
      { name: 'Trending Topics', icon: TrendingUp, params: { type: 'TOPIC', timeRange: '24h' } },
      { name: 'Frequently Mentioned', icon: BarChart, params: { sortBy: 'totalMentions' } },
    ],
  },
  {
    title: 'Sentiment Based',
    items: [
      { name: 'Negative Entities', icon: Frown, params: { sentiment: 'NEGATIVE' } },
      { name: 'Positive Entities', icon: Smile, params: { sentiment: 'POSITIVE' } },
      { name: 'Controversial', icon: AlertTriangle, params: { sentiment: 'MIXED' } },
    ],
  },
  {
    title: 'Entity Types',
    items: [
      { name: 'Topics', icon: MessageSquare, params: { type: 'TOPIC' } },
      { name: 'People', icon: User, params: { type: 'PERSON' } },
      { name: 'Organizations', icon: Building, params: { type: 'ORGANIZATION' } },
      { name: 'Locations', icon: MapPin, params: { type: 'LOCATION' } },
      { name: 'Threats', icon: ShieldAlert, params: { type: 'THREAT' } },
      { name: 'Keywords', icon: Search, params: { type: 'KEYWORD' } },
    ],
  },
  {
    title: 'Categories',
    items: [
      { name: 'Political Parties', icon: Flag, params: { category: 'POLITICAL_PARTY' } },
      { name: 'Politicians', icon: Users, params: { category: 'POLITICIAN' } },
      { name: 'News Outlets', icon: Newspaper, params: { category: 'NEWS_OUTLET' } },
      { name: 'Government Agencies', icon: Library, params: { category: 'GOVERNMENT_AGENCY' } },
    ],
  },
]

interface EntitiesSidebarProps {
  onFilterChange: (params: Record<string, string>) => void
  activeParams: Record<string, string | null | undefined>
}

export function EntitiesSidebar({ onFilterChange, activeParams }: EntitiesSidebarProps) {
  const isActive = (params: Record<string, string>): boolean => {
    const paramKeys = Object.keys(params)
    const activeParamKeys = Object.keys(activeParams).filter(
      (k) => activeParams[k] !== null && activeParams[k] !== undefined && k !== 'q'
    )

    if (paramKeys.length === 0 && activeParamKeys.length === 0) return true
    if (paramKeys.length !== activeParamKeys.length) return false

    return paramKeys.every((key) => activeParams[key] === params[key])
  }

  return (
    <div className="space-y-4">
      {menuItems.map((section) => (
        <div key={section.title}>
          <h2 className="px-2 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.params)
              return (
                <button
                  key={item.name}
                  onClick={() => onFilterChange(item.params)}
                  className={`w-full flex items-center px-3 py-1.5 text-sm font-medium rounded-md group transition-all duration-200 ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-4 w-4 flex-shrink-0 ${
                      active ? '' : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
