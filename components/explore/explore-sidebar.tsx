'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Sparkles,
  BarChart,
  Flame,
  MessagesSquare,
  TrendingUp,
  Eye,
  ShieldAlert,
  Globe,
  Newspaper,
  Video,
  Smile,
  Frown,
  MinusCircle,
} from 'lucide-react'
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaReddit } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const menuItems = [
  {
    title: 'Discover',
    items: [
      { name: 'All Posts', icon: Globe, params: {} },
      { name: 'Latest Posts', icon: Sparkles, params: { timeRange: '24h', sortBy: 'postedAt', sortOrder: 'desc' } },
    ],
  },
  {
    title: 'Content & Engagement',
    items: [
      { name: 'High Impact', icon: Flame, params: { min_likesCount: '1000', min_sharesCount: '500' } },
      { name: 'Viral Negative', icon: ShieldAlert, params: { sentiment: 'NEGATIVE', min_sharesCount: '1000' } },
      { name: 'Trending Discussions', icon: MessagesSquare, params: { timeRange: '24h', sortBy: 'commentsCount' } },
      { name: 'High Engagement', icon: BarChart, params: { min_likesCount: '100', min_commentsCount: '50' } },
      { name: 'High Reach, Low Engagement', icon: Eye, params: { min_viewsCount: '10000', max_likesCount: '50' } },
      { name: 'Viral Potential', icon: TrendingUp, params: { timeRange: '6h', sortBy: 'sharesCount' } },
    ],
  },
  {
    title: 'Browse by Platform',
    items: [
      { name: 'News', icon: Newspaper, params: { platform: 'india-news' } },
      { name: 'Videos', icon: Video, params: { hasVideos: 'true' } },
      { name: 'Twitter', icon: FaTwitter, params: { platform: 'twitter' } },
      { name: 'Facebook', icon: FaFacebook, params: { platform: 'facebook' } },
      { name: 'Instagram', icon: FaInstagram, params: { platform: 'instagram' } },
      { name: 'YouTube', icon: FaYoutube, params: { platform: 'youtube' } },
      { name: 'Reddit', icon: FaReddit, params: { platform: 'reddit' } },
    ],
  },
  {
    title: 'Monitor Sentiment',
    items: [
      { name: 'Positive Posts', icon: Smile, params: { sentiment: 'POSITIVE' } },
      { name: 'Neutral Posts', icon: MinusCircle, params: { sentiment: 'NEUTRAL' } },
      { name: 'Negative Posts', icon: Frown, params: { sentiment: 'NEGATIVE' } },
    ],
  },
]

export function ExploreSidebar({
  onFilterChange,
  activeParams,
}: {
  onFilterChange: (params: Record<string, string>) => void
  activeParams: URLSearchParams
}) {
  const pathname = usePathname()

  const isActive = (params: Record<string, string>) => {
    const itemParams = new URLSearchParams(params)
    itemParams.sort()
    
    // Create a copy of activeParams to sort, as URLSearchParams.sort() is in-place
    const sortedActiveParams = new URLSearchParams(activeParams.toString())
    sortedActiveParams.sort()

    return itemParams.toString() === sortedActiveParams.toString()
  }

  const createHref = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(params)
    return `${pathname}?${newParams.toString()}`
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full flex-shrink-0">
      <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Explore</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h2 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h2>

            <div className="mt-1 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.params)
                const href = createHref(item.params)

                return (
                  <Link
                    href={href}
                    key={item.name}
                    className={`flex items-center justify-between px-3 py-1.5 text-sm font-medium rounded-md group transition-all duration-200 ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      onFilterChange(item.params)
                    }}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 h-4 w-4 flex-shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
