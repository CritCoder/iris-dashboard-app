'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Clock, FileText, User, MapPin, Hash, Globe, BarChart3, Mail, Play, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'page' | 'post' | 'profile' | 'entity' | 'location' | 'analysis'
  icon: React.ElementType
  href: string
  category: string
}

const searchResults: SearchResult[] = [
  // Pages
  {
    id: 'home',
    title: 'Intelligence Dashboard',
    description: 'Real-time insights on narratives, opponents, and public sentiment',
    type: 'page',
    icon: BarChart3,
    href: '/',
    category: 'Pages'
  },
  {
    id: 'social-inbox',
    title: 'Social Inbox',
    description: 'New posts from all campaigns',
    type: 'page',
    icon: Mail,
    href: '/social-inbox',
    category: 'Pages'
  },
  {
    id: 'start-analysis',
    title: 'Start Analysis',
    description: 'Advanced social media intelligence gathering and analysis',
    type: 'page',
    icon: Play,
    href: '/start-analysis',
    category: 'Pages'
  },
  {
    id: 'analysis-history',
    title: 'Analysis History',
    description: 'Track and manage your campaign analyses',
    type: 'page',
    icon: BarChart3,
    href: '/analysis-history',
    category: 'Pages'
  },
  {
    id: 'social-feed',
    title: 'Social Feed',
    description: 'Browse and filter social content',
    type: 'page',
    icon: Globe,
    href: '/social-feed',
    category: 'Pages'
  },
  {
    id: 'profiles',
    title: 'Profiles',
    description: 'Explore influencer profiles and analytics',
    type: 'page',
    icon: User,
    href: '/profiles',
    category: 'Pages'
  },
  {
    id: 'entities',
    title: 'Entities',
    description: 'Manage and track entities',
    type: 'page',
    icon: Hash,
    href: '/entities',
    category: 'Pages'
  },
  {
    id: 'locations',
    title: 'Locations',
    description: 'Geographic data and location tracking',
    type: 'page',
    icon: MapPin,
    href: '/locations',
    category: 'Pages'
  },
  {
    id: 'entity-search',
    title: 'Entity Search',
    description: 'Search and discover information across multiple databases',
    type: 'page',
    icon: Search,
    href: '/entity-search',
    category: 'Pages'
  },
  // Sample Posts
  {
    id: 'post-1',
    title: 'Rahul Kumar Sharma - Housing Search',
    description: 'Looking for 2BHK flat in HSR, BTM, Bellandur areas',
    type: 'post',
    icon: FileText,
    href: '/analysis-history/1/post/post-1',
    category: 'Posts'
  },
  {
    id: 'post-2',
    title: 'Azin Naushad - Room Share',
    description: 'Professional looking for flat or room-share near Ecoworld',
    type: 'post',
    icon: FileText,
    href: '/analysis-history/1/post/post-2',
    category: 'Posts'
  },
  // Sample Profiles
  {
    id: 'profile-1',
    title: 'Rahul Gandhi',
    description: 'Twitter • 28.2M followers • 8.3K posts',
    type: 'profile',
    icon: User,
    href: '/profiles/profile-1',
    category: 'Profiles'
  },
  {
    id: 'profile-2',
    title: 'AajTak',
    description: 'Twitter • 24.6M followers • 1.0M posts',
    type: 'profile',
    icon: User,
    href: '/profiles/profile-2',
    category: 'Profiles'
  },
  // Sample Entities
  {
    id: 'entity-1',
    title: 'Bellandur Campaign',
    description: '4.4K posts • 15.9K engagement • 11% sentiment',
    type: 'entity',
    icon: Hash,
    href: '/entities/entity-1',
    category: 'Entities'
  },
  {
    id: 'entity-2',
    title: 'Bengaluru Police',
    description: '444 posts • 258.7K engagement • 85% sentiment',
    type: 'entity',
    icon: Hash,
    href: '/entities/entity-2',
    category: 'Entities'
  }
]

interface SpotlightSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([])
      return
    }

    const filtered = searchResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase()) ||
      result.category.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredResults(filtered)
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    // Keyboard shortcuts have been disabled
    return () => {}
  }, [])

  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div className="flex items-start justify-center pt-[10vh] px-4">
        <div 
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
            <Search className="w-5 h-5 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages, posts, profiles, entities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-lg"
            />
            <kbd className="px-2 py-1 text-xs text-zinc-500 bg-zinc-800 rounded border border-zinc-700">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
            {filteredResults.length === 0 && query.trim() ? (
              <div className="flex min-h-[200px] items-center justify-center p-8 text-center text-zinc-400">
                <div className="flex flex-col items-center gap-3">
                  <Search className="w-8 h-8 text-zinc-500" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center p-8 text-center text-zinc-400">
                <div className="flex flex-col items-center gap-3">
                  <Clock className="w-8 h-8 text-zinc-500" />
                  <p className="text-sm">Start typing to search...</p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {filteredResults.map((result, index) => {
                  const Icon = result.icon
                  return (
                    <a
                      key={result.id}
                      href={result.href}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                        index === selectedIndex
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                      )}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{result.title}</span>
                          <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{result.description}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-zinc-800 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-xs">↵</kbd>
                Select
              </span>
            </div>
            <span>{filteredResults.length} results</span>
          </div>
        </div>
      </div>
    </div>
  )
}
