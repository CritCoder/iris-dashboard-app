'use client'

import { useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Download, Heart, MessageCircle, Share2, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'news'
  author: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  sentiment: 'positive' | 'negative' | 'neutral'
  engagement: number
  reach: number
  hasVideo: boolean
  impact: 'high' | 'medium' | 'low'
  isViral: boolean
  isTrending: boolean
}

// Generate dummy posts with varied data
const generatePosts = (): Post[] => {
  const platforms: ('facebook' | 'twitter' | 'instagram' | 'news')[] = ['facebook', 'twitter', 'instagram', 'news']
  const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'negative', 'neutral']
  const impacts: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low']
  const authors = [
    'Azin Naushad', 'Sparsh Burman', 'Jatin Johar', 'Suni Sunetha Y M', 
    'Anandotaab', 'Tech News Daily', 'Community Updates', 'Local Business',
    'News Reporter', 'Social Activist', 'City Police', 'Government Official'
  ]
  
  const contents = [
    "Hey guys, me and my friend are looking for a place to move in. We're open to: A 2BHK flat 🏠 Or 2 rooms in a 3BHK with flatmates 🏡 Preferred areas:HSR, BTM...",
    "Hi everyone, I'm a male professional looking for a flat or a room-share near Ecoworld / Bellandur / Green Glen Layout / Sobha Iris / Sterling...",
    "Fully furnished 3BHK available for rent in Green Glen Layout from 1st November. Please connect @9990410901 for more details",
    "Breaking: New AI breakthrough announced today. This could change everything we know about machine learning. Full story coming soon! #AI #Technology",
    "Important announcement regarding the upcoming town hall meeting. All residents are encouraged to attend and share their feedback.",
    "We apologize for the inconvenience caused yesterday. We are working hard to resolve the issues and improve our service.",
    "Congratulations to all the winners! Your hard work and dedication have paid off. Keep up the excellent work! 🎉",
    "This is unacceptable! We demand immediate action on this issue. The authorities must take responsibility now!",
    "Just sharing some thoughts on the current situation. What do you all think about this? Let's discuss in the comments.",
    "Amazing news for our community! New facilities will be opening next month. This is a great step forward for everyone.",
    "Concerned about the recent developments. We need to come together and find a solution that works for all stakeholders.",
    "Excited to announce our new initiative! This will benefit thousands of people in our city. Stay tuned for more updates!"
  ]

  return Array.from({ length: 100 }, (_, i) => {
    const likes = Math.floor(Math.random() * 10000)
    const comments = Math.floor(Math.random() * 1000)
    const shares = Math.floor(Math.random() * 2000)
    const views = Math.floor(Math.random() * 50000)
    const engagement = likes + comments + shares
    
    return {
      id: `post-${i}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
      likes,
      comments,
      shares,
      views,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      engagement,
      reach: views,
      hasVideo: Math.random() > 0.7,
      impact: impacts[Math.floor(Math.random() * impacts.length)],
      isViral: engagement > 5000,
      isTrending: Math.random() > 0.8
    }
  })
}

const allPosts = generatePosts()

function PostCard({ post }: { post: Post }) {
  const platformIcons = {
    facebook: '📘',
    twitter: '🐦',
    instagram: '📷',
    news: '📰'
  }

  const platformColors = {
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-500',
    instagram: 'bg-pink-600',
    news: 'bg-orange-600'
  }

  return (
    <Link href={`/analysis-history/1/post/${post.id}`}>
      <div className="bg-card border border-border rounded-lg p-4 card-hover pressable cursor-pointer h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full ${platformColors[post.platform]} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
            {post.author[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-foreground font-medium text-sm mb-0.5">{post.author}</div>
            <div className="text-muted-foreground text-xs">
              {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} · {post.timestamp}
            </div>
          </div>
        </div>

        <p className="text-foreground/90 text-sm mb-4 line-clamp-4 flex-1">{post.content}</p>

        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> {post.shares}
            </span>
          </div>
          <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 interactive">
            View <Eye className="w-3.5 h-3.5" /> {post.views}
          </button>
        </div>
      </div>
    </Link>
  )
}

function SocialFeedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeFilter = searchParams.get('filter') || 'all-posts'
  const [searchQuery, setSearchQuery] = useState('')

  const handleFilterChange = (filterId: string) => {
    router.push(`/social-feed?filter=${filterId}`)
  }

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts]

    // Apply filter based on active filter
    switch (activeFilter) {
      case 'all-posts':
        // Show all posts
        break
      case 'latest-posts':
        posts = posts.sort((a, b) => {
          const aHours = parseInt(a.timestamp)
          const bHours = parseInt(b.timestamp)
          return aHours - bHours
        })
        break
      case 'high-impact':
        posts = posts.filter(p => p.impact === 'high')
        break
      case 'viral-negative':
        posts = posts.filter(p => p.isViral && p.sentiment === 'negative')
        break
      case 'trending':
        posts = posts.filter(p => p.isTrending)
        break
      case 'high-engagement':
        posts = posts.filter(p => p.engagement > 3000).sort((a, b) => b.engagement - a.engagement)
        break
      case 'high-reach-low-engagement':
        posts = posts.filter(p => p.reach > 20000 && p.engagement < 1000)
        break
      case 'viral-potential':
        posts = posts.filter(p => p.engagement > 2000 && p.engagement < 5000)
        break
      case 'news':
        posts = posts.filter(p => p.platform === 'news')
        break
      case 'videos':
        posts = posts.filter(p => p.hasVideo)
        break
      case 'twitter':
        posts = posts.filter(p => p.platform === 'twitter')
        break
      case 'facebook':
        posts = posts.filter(p => p.platform === 'facebook')
        break
      case 'instagram':
        posts = posts.filter(p => p.platform === 'instagram')
        break
      case 'positive':
        posts = posts.filter(p => p.sentiment === 'positive')
        break
      case 'neutral':
        posts = posts.filter(p => p.sentiment === 'neutral')
        break
      case 'negative':
        posts = posts.filter(p => p.sentiment === 'negative')
        break
    }

    // Apply search filter
    if (searchQuery) {
      posts = posts.filter(p => 
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return posts.slice(0, 20) // Limit to 20 posts
  }, [activeFilter, searchQuery])

  const discoverFilters = [
    { id: 'all-posts', label: 'All Posts', icon: '📋' },
    { id: 'latest-posts', label: 'Latest Posts', icon: '✨' }
  ]

  const contentFilters = [
    { id: 'high-impact', label: 'High Impact', icon: '🎯' },
    { id: 'viral-negative', label: 'Viral Negative', icon: '⚠️' },
    { id: 'trending', label: 'Trending Discussions', icon: '💬' },
    { id: 'high-engagement', label: 'High Engagement', icon: '📊' },
    { id: 'high-reach-low-engagement', label: 'High Reach, Low Engagement', icon: '👁️' },
    { id: 'viral-potential', label: 'Viral Potential', icon: '🚀' }
  ]

  const platformFilters = [
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'twitter', label: 'Twitter', icon: '🐦' },
    { id: 'facebook', label: 'Facebook', icon: '📘' },
    { id: 'instagram', label: 'Instagram', icon: '📷' }
  ]

  const sentimentFilters = [
    { id: 'positive', label: 'Positive Posts', icon: '😊' },
    { id: 'neutral', label: 'Neutral Posts', icon: '😐' },
    { id: 'negative', label: 'Negative Posts', icon: '😞' }
  ]

  const getFilterLabel = (filterId: string) => {
    const allFilters = [...discoverFilters, ...contentFilters, ...platformFilters, ...sentimentFilters]
    return allFilters.find(f => f.id === filterId)?.label || 'All Posts'
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title={getFilterLabel(activeFilter)}
            description={`${filteredPosts.length} posts loaded`}
            actions={
              <div className="w-full">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full sm:flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm h-9 w-full"
                    />
                  </div>

                  {/* Filters Row - Responsive */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none flex-1 sm:flex-none min-w-[100px]">
                      <option>All Campaigns</option>
                    </select>

                    <select className="bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none flex-1 sm:flex-none min-w-[100px]">
                      <option>All Sentiments</option>
                      <option>Positive</option>
                      <option>Negative</option>
                      <option>Neutral</option>
                    </select>

                    <select className="hidden md:block bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                      <option>All Platforms</option>
                      <option>Facebook</option>
                      <option>Twitter</option>
                      <option>Instagram</option>
                    </select>

                    <select className="hidden lg:block bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                      <option>All Media</option>
                    </select>

                    <select className="hidden lg:block bg-background border border-border text-foreground text-sm rounded-lg pl-3 pr-8 py-2 h-9 cursor-pointer hover:bg-accent/20 transition-colors appearance-none">
                      <option>All Time</option>
                    </select>

                    <Button variant="outline" size="sm" className="gap-2 h-9 hidden sm:flex">
                      <Download className="w-4 h-4" />
                      <span className="hidden lg:inline">Export PDF</span>
                      <span className="lg:hidden">Export</span>
                    </Button>
                  </div>
                </div>
              </div>
            }
          />

          {/* Posts Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 list-animate-in">
              <div className="mb-4 text-sm text-zinc-500">
                {filteredPosts.length} posts loaded (more available)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default function SocialFeedPage() {
  return (
    <Suspense fallback={<FeedSkeleton /> }>
      <SocialFeedContent />
    </Suspense>
  )
}

function FeedSkeleton() {
  return (
    <PageLayout>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <div className="flex-1">
                  <div className="h-3 w-32 bg-secondary rounded mb-2" />
                  <div className="h-2 w-24 bg-secondary rounded" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-secondary rounded" />
                <div className="h-3 w-5/6 bg-secondary rounded" />
                <div className="h-3 w-2/3 bg-secondary rounded" />
              </div>
              <div className="h-8 w-full bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
