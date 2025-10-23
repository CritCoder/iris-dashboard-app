'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react'
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
      { name: 'Twitter', icon: Twitter, params: { platform: 'twitter' } },
      { name: 'Facebook', icon: Facebook, params: { platform: 'facebook' } },
      { name: 'Instagram', icon: Instagram, params: { platform: 'instagram' } },
      { name: 'YouTube', icon: Youtube, params: { platform: 'youtube' } },
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

interface ExploreSidebarProps {
  totalPosts?: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ExploreSidebar({ totalPosts = 0, searchQuery, setSearchQuery }: ExploreSidebarProps) {
  const searchParams = useSearchParams()

  const isActive = (params: Record<string, string>) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    const itemParams = new URLSearchParams(params)
    currentParams.sort()
    itemParams.sort()

    // Special case for "All Posts" with empty params
    if (itemParams.toString() === '' && currentParams.has('search')) {
      return currentParams.toString() === `search=${currentParams.get('search')}`
    }
    
    return currentParams.toString() === itemParams.toString()
  }

  const createHref = (params) => {
    const newParams = new URLSearchParams()
    for (const key in params) {
      newParams.set(key, params[key])
    }
    return `/social-inbox?${newParams.toString()}`
  }

  return (
    <div className="w-64 bg-black backdrop-blur-xl border-r border-gray-700/50 flex flex-col h-full flex-shrink-0">
      <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-gray-700/50">
        <h1 className="text-xl font-bold text-white cyber-text">Explore</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm bg-gray-800/60 border-gray-700/50 text-white"
          />
        </div>
        {menuItems.map((section) => (
          <div key={section.title}>
            <h2 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{section.title}</h2>

            <div className="mt-1 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.params)
                const href = createHref(item.params)
                const showCount = item.name === 'All Posts' && totalPosts > 0

                return (
                  <Link
                    href={href}
                    key={item.name}
                    className={`flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-md group transition-all duration-200 ${
                      active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`mr-3 h-4 w-4 flex-shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
                      <span>{item.name}</span>
                    </div>
                    {showCount && (
                      <span className={`text-xs font-bold terminal-text ${active ? 'text-primary-foreground' : 'text-cyan-400'}`}>
                        {totalPosts}
                      </span>
                    )}
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
