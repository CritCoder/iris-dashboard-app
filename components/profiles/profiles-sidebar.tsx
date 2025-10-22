'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  Flame as Fire, // Using Flame as Fire
  Eye,
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'

const menuItems: {
  title: string
  items: {
    name: string
    icon: React.ElementType
    params: Record<string, string>
  }[]
}[] = [
  {
    title: 'Primary',
    items: [{ name: 'All Authors', icon: Users, params: {} }],
  },
  {
    title: 'Engagement & Impact',
    items: [
      { name: 'High Impact Authors', icon: Fire, params: { minFollowers: '500000' } },
      { name: 'High Reach Authors', icon: Eye, params: { minFollowers: '100000' } },
      { name: 'Frequent Posters', icon: MessageCircle, params: { minPosts: '1000' } },
    ],
  },
  {
    title: 'Sentiment Based',
    items: [
      { name: 'Negative Influencers', icon: ThumbsDown, params: { personStatus: 'SUSPICIOUS' } },
      { name: 'Positive Influencers', icon: ThumbsUp, params: { personStatus: 'WHOLESOME' } },
    ],
  },
  {
    title: 'Platforms',
    items: [
      { name: 'Twitter Influencers', icon: FaTwitter, params: { platform: 'twitter' } },
      { name: 'Facebook Pages', icon: FaFacebook, params: { platform: 'facebook' } },
      { name: 'Instagram Influencers', icon: FaInstagram, params: { platform: 'instagram' } },
    ],
  },
]

export function ProfilesSidebar({
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
        <h1 className="text-xl font-bold text-foreground">Profiles</h1>
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
                      <Icon className={`mr-3 h-4 w-4 flex-shrink-0 ${active ? '' : 'text-muted-foreground'}`} />
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
