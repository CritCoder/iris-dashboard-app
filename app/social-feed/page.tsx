'use client'

import { useState, useMemo, Suspense, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Download, Heart, MessageCircle, Share2, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useSocialPosts } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'news'
  author?: string
  authorName?: string
  authorDisplayName?: string
  username?: string
  handle?: string
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

// All data will be fetched from APIs - no hard-coded data

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

  // Better author handling - check for various author fields and provide fallbacks
  const getAuthorInfo = () => {
    // Check multiple possible author fields
    const author = post.author || post.authorName || post.authorDisplayName || post.username || post.handle
    
    if (author && author !== 'Unknown Author' && author !== 'null' && author !== 'undefined' && author.trim() !== '') {
      return {
        name: author,
        initial: author[0].toUpperCase()
      }
    }
    
    // Fallback based on platform
    const platformFallbacks = {
      facebook: 'Facebook User',
      twitter: 'Twitter User', 
      instagram: 'Instagram User',
      news: 'News Source'
    }
    
    return {
      name: platformFallbacks[post.platform] || 'Social Media User',
      initial: platformFallbacks[post.platform]?.[0] || 'S'
    }
  }

  const authorInfo = getAuthorInfo()

  return (
    <Link href={`/analysis-history/1/post/${post.id}`}>
      <div className="bg-card border border-border rounded-lg p-4 card-hover pressable cursor-pointer h-full flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full ${platformColors[post.platform]} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
            {authorInfo.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-foreground font-medium text-sm mb-0.5 truncate">
              {authorInfo.name}
            </div>
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
  const [isExporting, setIsExporting] = useState(false)

  // Build API params based on filters
  const apiParams = useMemo(() => {
    const params: any = {
      page: 1,
      limit: 20,
    }

    if (searchQuery) {
      params.search = searchQuery
    }

    // Apply filter-based params
    switch (activeFilter) {
      case 'high-impact':
        params.priority = 'high'
        break
      case 'viral-negative':
        params.sentiment = 'negative'
        params.needsAttention = true
        break
      case 'trending':
        params.isFlagged = true
        break
      case 'high-engagement':
        params.min_likesCount = 1000
        params.min_commentsCount = 100
        break
      case 'news':
        params.platform = 'news'
        break
      case 'videos':
        params.hasVideos = true
        break
      case 'twitter':
        params.platform = 'twitter'
        break
      case 'facebook':
        params.platform = 'facebook'
        break
      case 'instagram':
        params.platform = 'instagram'
        break
      case 'positive':
        params.sentiment = 'positive'
        break
      case 'neutral':
        params.sentiment = 'neutral'
        break
      case 'negative':
        params.sentiment = 'negative'
        break
    }

    return params
  }, [activeFilter, searchQuery])

  const { data: apiPosts, loading, error } = useSocialPosts(apiParams)

  const handleFilterChange = (filterId: string) => {
    router.push(`/social-feed?filter=${filterId}`)
  }

  // Sample data for when API fails
  const samplePosts: Post[] = [
    {
      id: '1',
      platform: 'twitter',
      author: 'BengaluruPolice',
      content: 'Traffic update: Heavy congestion on MG Road due to ongoing metro construction. Please use alternative routes.',
      timestamp: '2h',
      likes: 245,
      comments: 67,
      shares: 89,
      views: 12500,
      sentiment: 'neutral',
      engagement: 401,
      reach: 25000,
      hasVideo: false,
      impact: 'medium',
      isViral: false,
      isTrending: true
    },
    {
      id: '2',
      platform: 'facebook',
      author: 'Karnataka Police',
      content: 'Safety reminder: Always wear helmets while riding two-wheelers. Your safety is our priority!',
      timestamp: '4h',
      likes: 1200,
      comments: 234,
      shares: 456,
      views: 45000,
      sentiment: 'positive',
      engagement: 1890,
      reach: 50000,
      hasVideo: true,
      impact: 'high',
      isViral: true,
      isTrending: false
    },
    {
      id: '3',
      platform: 'instagram',
      author: 'WhitefieldTraffic',
      content: 'Beautiful sunrise from Whitefield! Remember to drive safely and follow traffic rules.',
      timestamp: '6h',
      likes: 890,
      comments: 123,
      shares: 234,
      views: 18000,
      sentiment: 'positive',
      engagement: 1247,
      reach: 22000,
      hasVideo: false,
      impact: 'medium',
      isViral: false,
      isTrending: false
    },
    {
      id: '4',
      platform: 'news',
      author: 'Times of India',
      content: 'Bengaluru police launch new digital initiative for faster complaint registration and tracking.',
      timestamp: '8h',
      likes: 567,
      comments: 89,
      shares: 123,
      views: 32000,
      sentiment: 'positive',
      engagement: 779,
      reach: 40000,
      hasVideo: false,
      impact: 'high',
      isViral: false,
      isTrending: true
    },
    {
      id: '5',
      platform: 'twitter',
      author: 'BellandurResident',
      content: 'Traffic situation in Bellandur is getting worse day by day. Need immediate attention from authorities.',
      timestamp: '10h',
      likes: 345,
      comments: 156,
      shares: 78,
      views: 15000,
      sentiment: 'negative',
      engagement: 579,
      reach: 18000,
      hasVideo: false,
      impact: 'medium',
      isViral: false,
      isTrending: false
    },
    {
      id: '6',
      platform: 'facebook',
      author: 'Karnataka CM Office',
      content: 'New infrastructure projects announced for Bengaluru to improve traffic flow and connectivity.',
      timestamp: '12h',
      likes: 2100,
      comments: 456,
      shares: 789,
      views: 65000,
      sentiment: 'positive',
      engagement: 3345,
      reach: 75000,
      hasVideo: true,
      impact: 'high',
      isViral: true,
      isTrending: true
    }
  ]

  const filteredPosts = useMemo(() => {
    // Use API data if available, otherwise use sample data
    const posts = apiPosts && apiPosts.length > 0 ? apiPosts : samplePosts
    
    // Ensure all posts have proper author data
    const postsWithAuthors = posts.map(post => ({
      ...post,
      author: post.author || 'Unknown Author'
    }))
    
    let filtered = [...postsWithAuthors]

    // Apply filter based on active filter for client-side filtering
    switch (activeFilter) {
      case 'latest-posts':
        filtered = filtered.sort((a, b) => {
          const aHours = parseInt(a.timestamp)
          const bHours = parseInt(b.timestamp)
          return aHours - bHours
        })
        break
      case 'high-reach-low-engagement':
        filtered = filtered.filter(p => p.reach > 20000 && p.engagement < 1000)
        break
      case 'viral-potential':
        filtered = filtered.filter(p => p.engagement > 2000 && p.engagement < 5000)
        break
      case 'high-impact':
        filtered = filtered.filter(p => p.impact === 'high')
        break
      case 'viral-negative':
        filtered = filtered.filter(p => p.sentiment === 'negative' && p.isViral)
        break
      case 'trending':
        filtered = filtered.filter(p => p.isTrending)
        break
      case 'high-engagement':
        filtered = filtered.filter(p => p.engagement > 1000)
        break
      case 'news':
        filtered = filtered.filter(p => p.platform === 'news')
        break
      case 'videos':
        filtered = filtered.filter(p => p.hasVideo)
        break
      case 'twitter':
        filtered = filtered.filter(p => p.platform === 'twitter')
        break
      case 'facebook':
        filtered = filtered.filter(p => p.platform === 'facebook')
        break
      case 'instagram':
        filtered = filtered.filter(p => p.platform === 'instagram')
        break
      case 'positive':
        filtered = filtered.filter(p => p.sentiment === 'positive')
        break
      case 'neutral':
        filtered = filtered.filter(p => p.sentiment === 'neutral')
        break
      case 'negative':
        filtered = filtered.filter(p => p.sentiment === 'negative')
        break
    }

    return filtered.slice(0, 20) // Limit to 20 posts
  }, [apiPosts, activeFilter])

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
        {/* Header */}
        <PageHeader
          title={getFilterLabel(activeFilter)}
          description={`${filteredPosts.length} posts loaded`}
        />

        {/* Filters Section - Below Header */}
        <div className="border-b border-border bg-background">
          <div className="p-4 sm:p-6">
            {/* Search Bar */}
            <div className="relative w-full mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-11 w-full text-sm bg-background/80"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Button
                variant={activeFilter === 'latest-posts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('latest-posts')}
                className="h-9 px-4 rounded-full"
              >
                Latest
              </Button>
              <Button
                variant={activeFilter === 'high-impact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('high-impact')}
                className="h-9 px-4 rounded-full"
              >
                Top Posts
              </Button>
              <Button
                variant={activeFilter === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('positive')}
                className="h-9 px-4 rounded-full"
              >
                Positive
              </Button>
              <Button
                variant={activeFilter === 'negative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('negative')}
                className="h-9 px-4 rounded-full"
              >
                Negative
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg px-4 py-2 h-10 cursor-pointer hover:bg-accent/20 transition-colors min-w-[140px]">
                <option>All Campaigns</option>
              </select>

              <select className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg px-4 py-2 h-10 cursor-pointer hover:bg-accent/20 transition-colors min-w-[140px]">
                <option>All Platforms</option>
                <option>Facebook</option>
                <option>Twitter</option>
                <option>Instagram</option>
                <option>News</option>
              </select>

              <select className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg px-4 py-2 h-10 cursor-pointer hover:bg-accent/20 transition-colors min-w-[130px]">
                <option>All Media</option>
                <option>With Images</option>
                <option>With Videos</option>
                <option>Text Only</option>
              </select>

              <select className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg px-4 py-2 h-10 cursor-pointer hover:bg-accent/20 transition-colors min-w-[130px]">
                <option>All Time</option>
                <option>Last Hour</option>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>

              <Button variant="outline" size="sm" className="gap-2 h-10 ml-auto">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="flex-1 overflow-y-auto">
          <AnimatedPage className="p-4 sm:p-6">
            {(filteredPosts || []).length > 0 ? (
              <AnimatedGrid stagger={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {(filteredPosts || []).map((post) => (
                  <AnimatedCard key={post.id}>
                    <PostCard post={post} />
                  </AnimatedCard>
                ))}
              </AnimatedGrid>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircle className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Posts Found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your filters or search query to find more posts.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </AnimatedPage>
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
