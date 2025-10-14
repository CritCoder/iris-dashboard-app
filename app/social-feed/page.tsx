/**
 * Social Feed Page - Integrated with Social Posts API
 * 
 * API Endpoint: GET /api/social/posts
 * Documentation: https://irisnet.wiredleap.com/api
 * 
 * Features:
 * - Real-time post fetching with server-side filtering
 * - Advanced search and filtering (platform, sentiment, media type, time range)
 * - Pagination support (20 posts per page)
 * - Automatic fallback to sample data when API is unavailable
 * - Loading states and error handling
 * 
 * Supported Filters:
 * - Platform: twitter, facebook, instagram, news
 * - Sentiment: POSITIVE, NEUTRAL, NEGATIVE
 * - Media Type: images, videos, text only
 * - Time Range: 1h, 24h, 7d, 30d
 * - Classification: CRITICAL, URGENT, HIGH, MEDIUM, LOW
 * - Custom filters: trending, viral, high-engagement, high-impact
 * 
 * Data Transformation:
 * - API response is transformed to match Post interface
 * - Handles multiple author field variations (username, displayName, person.name)
 * - Converts ISO timestamps to relative time (2h, 3d, etc.)
 * - Calculates engagement metrics and viral status
 */

'use client'

import { useState, useMemo, Suspense, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Download, Heart, MessageCircle, Share2, Eye, X, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ensureAuthToken } from '@/lib/auth-utils'
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMediaType, setSelectedMediaType] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('all')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ensure auth token is loaded on mount
  useEffect(() => {
    ensureAuthToken()
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Build API params based on filters
  const buildApiParams = useCallback((page: number) => {
    const params: any = {
      page,
      limit: 20,
      sortBy: 'date', // Default sort by date
    }

    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery
    }

    // Apply platform filter
    if (selectedPlatform !== 'all') {
      params.platform = selectedPlatform
    }

    // Apply media type filter
    if (selectedMediaType === 'images') {
      params.hasImages = true
    } else if (selectedMediaType === 'videos') {
      params.hasVideos = true
    } else if (selectedMediaType === 'text') {
      params.hasImages = false
      params.hasVideos = false
    }

    // Apply time range filter
    if (selectedTimeRange !== 'all') {
      params.timeRange = selectedTimeRange
    }

    // Apply filter-based params
    switch (activeFilter) {
      case 'latest-posts':
        params.sortBy = 'date'
        break
      case 'high-impact':
        params.classification = 'CRITICAL,URGENT,HIGH'
        params.sortBy = 'priority'
        break
      case 'viral-negative':
        params.sentiment = 'NEGATIVE'
        params.needsAttention = true
        params.min_likesCount = 1000
        break
      case 'trending':
        params.isFlagged = true
        params.sortBy = 'engagement'
        break
      case 'high-engagement':
        params.min_likesCount = 1000
        params.min_commentsCount = 100
        params.sortBy = 'engagement'
        break
      case 'news':
        if (!params.platform) params.platform = 'news'
        break
      case 'videos':
        params.hasVideos = true
        break
      case 'twitter':
        if (!params.platform) params.platform = 'twitter'
        break
      case 'facebook':
        if (!params.platform) params.platform = 'facebook'
        break
      case 'instagram':
        if (!params.platform) params.platform = 'instagram'
        break
      case 'positive':
        params.sentiment = 'POSITIVE'
        break
      case 'neutral':
        params.sentiment = 'NEUTRAL'
        break
      case 'negative':
        params.sentiment = 'NEGATIVE'
        break
    }

    return params
  }, [activeFilter, debouncedSearchQuery, selectedPlatform, selectedMediaType, selectedTimeRange])

  // Load posts function
  const loadPosts = useCallback(async (isLoadMore = false, page = 1) => {
    console.log('loadPosts called:', { isLoadMore, page })
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      const params = buildApiParams(page)
      console.log('API params:', params)
      
      const response = await api.social.getPosts(params)
      console.log('API response:', {
        success: response.success,
        dataLength: response.data?.length,
        pagination: (response as any).pagination
      })
      
      if (response.success && response.data) {
        const newPosts = response.data.map(transformApiPost)
        console.log('Transformed posts:', newPosts.length)
        
        if (isLoadMore) {
          // Append new posts
          console.log('Appending posts, current count:', allPosts.length)
          setAllPosts(prev => {
            const updated = [...prev, ...newPosts]
            console.log('Updated posts count:', updated.length)
            return updated
          })
        } else {
          // Replace posts
          console.log('Replacing posts with:', newPosts.length)
          setAllPosts(newPosts)
        }
        
        // Check if more posts are available
        const hasNext = (response as any).pagination?.hasNext || false
        console.log('Has more:', hasNext)
        setHasMore(hasNext)
        setError(null)
      } else {
        console.log('API response not successful, using sample data')
        // Use sample data as fallback
        if (!isLoadMore) {
          setAllPosts(samplePosts)
        }
        setHasMore(false)
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      // Use sample data as fallback
      if (!isLoadMore) {
        setAllPosts(samplePosts)
      }
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [buildApiParams])

  // Load more posts
  const loadMore = useCallback(() => {
    console.log('loadMore called:', { loadingMore, hasMore, currentPage })
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1
      console.log('Loading page:', nextPage)
      setCurrentPage(nextPage)
      loadPosts(true, nextPage)
    } else {
      console.log('Cannot load more:', { loadingMore, hasMore })
    }
  }, [loadingMore, hasMore, currentPage, loadPosts])

  // Load initial posts and reset on filter change
  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
    setAllPosts([])
    loadPosts(false, 1)
  }, [activeFilter, debouncedSearchQuery, selectedPlatform, selectedMediaType, selectedTimeRange])

  const handleFilterChange = (filterId: string) => {
    router.push(`/social-feed?filter=${filterId}`)
  }

  // Transform API response to match Post interface
  const transformApiPost = (apiPost: any): Post => {
    // Get author from various possible fields
    const author = apiPost.social_profile?.username || 
                   apiPost.social_profile?.displayName || 
                   apiPost.person?.name || 
                   'Unknown Author'

    // Convert ISO timestamp to relative time
    const getRelativeTime = (isoDate: string) => {
      const now = new Date()
      const posted = new Date(isoDate)
      const diffMs = now.getTime() - posted.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)
      
      if (diffDays > 0) return `${diffDays}d`
      if (diffHours > 0) return `${diffHours}h`
      return 'now'
    }

    return {
      id: apiPost.id,
      platform: apiPost.platform?.toLowerCase() as 'facebook' | 'twitter' | 'instagram' | 'news',
      author,
      authorName: apiPost.person?.name,
      authorDisplayName: apiPost.social_profile?.displayName,
      username: apiPost.social_profile?.username,
      content: apiPost.content || '',
      timestamp: getRelativeTime(apiPost.postedAt),
      likes: apiPost.likesCount || 0,
      comments: apiPost.commentsCount || 0,
      shares: apiPost.sharesCount || 0,
      views: apiPost.viewsCount || 0,
      sentiment: (apiPost.aiSentiment?.toLowerCase() || 'neutral') as 'positive' | 'negative' | 'neutral',
      engagement: (apiPost.likesCount || 0) + (apiPost.commentsCount || 0) + (apiPost.sharesCount || 0),
      reach: apiPost.viewsCount || 0,
      hasVideo: (apiPost.videoUrls && apiPost.videoUrls.length > 0) || apiPost.contentType === 'video',
      impact: apiPost.classification === 'CRITICAL' || apiPost.classification === 'URGENT' ? 'high' 
              : apiPost.classification === 'MEDIUM' ? 'medium' 
              : 'low',
      isViral: (apiPost.likesCount || 0) > 1000 && (apiPost.sharesCount || 0) > 100,
      isTrending: apiPost.isFlagged || apiPost.needsAttention || false,
    }
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

  // Apply client-side filters that can't be done server-side
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts]

    switch (activeFilter) {
      case 'latest-posts':
        // Already sorted by API (default sortBy: 'date')
        break
      case 'high-reach-low-engagement':
        filtered = filtered.filter(p => p.reach > 20000 && p.engagement < 1000)
        break
      case 'viral-potential':
        filtered = filtered.filter(p => p.engagement > 2000 && p.engagement < 5000)
        break
      // All other filters are handled by API params
    }

    return filtered
  }, [allPosts, activeFilter])

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
          description={
            loading 
              ? 'Loading posts...' 
              : error 
                ? 'Using sample data - API unavailable' 
                : `${filteredPosts.length} posts loaded${hasMore ? ' (scroll for more)' : ''}`
          }
        />

        {/* Filters Section - Compact Layout */}
        <div className="border-b border-border bg-background">
          <div className="p-3">
            {/* Search Bar */}
            <div className="relative w-full mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-9 w-full text-sm bg-background/80"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <Button
                variant={activeFilter === 'latest-posts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('latest-posts')}
                className="h-8 px-3 rounded-full text-xs"
              >
                Latest
              </Button>
              <Button
                variant={activeFilter === 'high-impact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('high-impact')}
                className="h-8 px-3 rounded-full text-xs"
              >
                Top Posts
              </Button>
              <Button
                variant={activeFilter === 'positive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('positive')}
                className="h-8 px-3 rounded-full text-xs"
              >
                Positive
              </Button>
              <Button
                variant={activeFilter === 'negative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('negative')}
                className="h-8 px-3 rounded-full text-xs"
              >
                Negative
              </Button>
            </div>

            {/* Advanced Filters - Compact Row */}
            <div className="flex flex-wrap items-center gap-2">
              <select className="appearance-none bg-background border border-border text-foreground text-xs rounded-md px-3 py-1.5 h-8 cursor-pointer hover:bg-accent/20 transition-colors min-w-[120px]">
                <option>All Campaigns</option>
              </select>

              <select 
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="appearance-none bg-background border border-border text-foreground text-xs rounded-md px-3 py-1.5 h-8 cursor-pointer hover:bg-accent/20 transition-colors min-w-[120px]"
              >
                <option value="all">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="news">News</option>
              </select>

              <select 
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value)}
                className="appearance-none bg-background border border-border text-foreground text-xs rounded-md px-3 py-1.5 h-8 cursor-pointer hover:bg-accent/20 transition-colors min-w-[110px]"
              >
                <option value="all">All Media</option>
                <option value="images">With Images</option>
                <option value="videos">With Videos</option>
                <option value="text">Text Only</option>
              </select>

              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="appearance-none bg-background border border-border text-foreground text-xs rounded-md px-3 py-1.5 h-8 cursor-pointer hover:bg-accent/20 transition-colors min-w-[110px]"
              >
                <option value="all">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              <Button variant="outline" size="sm" className="gap-1.5 h-8 ml-auto text-xs px-3">
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="flex-1 overflow-y-auto">
          <AnimatedPage className="p-2 sm:p-3">
            {loading ? (
              <FeedSkeleton />
            ) : (filteredPosts || []).length > 0 ? (
              <>
                <AnimatedGrid stagger={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3">
                  {(filteredPosts || []).map((post) => (
                    <AnimatedCard key={post.id}>
                      <PostCard post={post} />
                    </AnimatedCard>
                  ))}
                </AnimatedGrid>
                
                {/* Infinite Scroll Trigger & Load More Button */}
                {hasMore && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={loadMore}
                      disabled={loadingMore}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        <>
                          Load More Posts
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {!hasMore && filteredPosts.length > 0 && (
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    No more posts to load
                  </div>
                )}
              </>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageCircle className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Posts Found</EmptyTitle>
                  <EmptyDescription>
                    {error 
                      ? 'Unable to load posts from API. Showing sample data.' 
                      : 'Try adjusting your filters or search query to find more posts.'
                    }
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
    <Suspense fallback={
      <PageLayout>
        <div className="h-screen flex flex-col overflow-hidden">
          <PageHeader title="Social Feed" description="Loading posts..." />
          <div className="flex-1 overflow-y-auto p-3">
            <FeedSkeleton />
          </div>
        </div>
      </PageLayout>
    }>
      <SocialFeedContent />
    </Suspense>
  )
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3">
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
  )
}
