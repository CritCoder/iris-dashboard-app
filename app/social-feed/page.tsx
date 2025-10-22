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

import { useState, useMemo, Suspense, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Download, Heart, MessageCircle, Share2, Eye, X, Loader2, ArrowRight } from 'lucide-react'
import { responsive } from '@/lib/performance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ensureAuthToken } from '@/lib/auth-utils'
import { FadeInUp, StaggerList, StaggerItem } from '@/components/ui/animated'
import { motion } from 'framer-motion'
import Masonry from 'react-masonry-css'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SocialFeedSkeleton } from '@/components/skeletons/social-feed-skeleton'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'news'
  author?: string
  authorName?: string
  authorDisplayName?: string
  authorAvatar?: string // Add this line
  username?: string
  handle?: string
  content: string
  thumbnailUrl?: string // Add this line
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
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={authorInfo.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              authorInfo.initial
            )}
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

        {post.thumbnailUrl && (
          <div className="my-2 -mx-4">
            <img src={post.thumbnailUrl} alt="Post image" className="w-full h-auto" />
          </div>
        )}

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
  console.log('SocialFeedContent component is rendering')
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeFilter = searchParams.get('filter') || 'all-posts'

  // Initialize search query from URL params
  const urlSearchQuery = searchParams.get('search') || ''

  // Test if component is rendering
  console.log('Component is rendering, activeFilter:', activeFilter, 'search:', urlSearchQuery)
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(urlSearchQuery)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMediaType, setSelectedMediaType] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('all')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const loaderRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
    console.log('🔄 LOAD POSTS CALLED:', { 
      isLoadMore, 
      page, 
      currentPostsCount: allPosts.length,
      hasMore,
      loadingMore,
      timestamp: new Date().toISOString()
    })
    
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError(null)
    }

    try {
      const params = buildApiParams(page)
      console.log('📋 API PARAMS:', params)
      
      const response = await api.social.getPosts(params)
      console.log('📊 API RESPONSE DETAILS:', {
        success: response.success,
        dataLength: Array.isArray(response.data) ? response.data.length : 0,
        pagination: (response as any).pagination,
        hasData: !!response.data,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        timestamp: new Date().toISOString()
      })
      
      // Temporarily force sample data for testing
      if (response.success && response.data && Array.isArray(response.data as any)) {
        const newPosts = (response.data as any[]).map(transformApiPost)
        console.log('Transformed posts:', newPosts.length)
        
        // Capture total count from API response
        const apiTotalCount = (response as any).pagination?.total || (response as any).total || newPosts.length
        setTotalCount(apiTotalCount)
        console.log('Total count from API:', apiTotalCount)
        
        if (isLoadMore) {
          // Append new posts
          console.log('📝 APPENDING POSTS:', {
            currentCount: allPosts.length,
            newPostsCount: newPosts.length,
            newPostIds: newPosts.map(p => p.id),
            timestamp: new Date().toISOString()
          })
          
          setAllPosts(prev => {
            // Check for duplicate IDs
            const existingIds = new Set(prev.map(p => p.id))
            const duplicateIds = newPosts.filter(p => existingIds.has(p.id))
            
            if (duplicateIds.length > 0) {
              console.warn('⚠️ DUPLICATE POST IDS DETECTED:', {
                duplicateIds: duplicateIds.map(p => p.id),
                count: duplicateIds.length
              })
            }
            
            const updated = [...prev, ...newPosts]
            console.log('✅ POSTS APPENDED:', {
              previousCount: prev.length,
              newCount: updated.length,
              totalAdded: newPosts.length
            })
            return updated
          })
        } else {
          // Replace posts
          console.log('🔄 REPLACING POSTS:', {
            newCount: newPosts.length,
            newPostIds: newPosts.map(p => p.id),
            timestamp: new Date().toISOString()
          })
          setAllPosts(newPosts)
        }
        
        // Check if more posts are available
        const pagination = (response as any).pagination
        const hasNext = pagination?.hasNext || false
        const totalPages = pagination?.totalPages || 0
        const currentPageNum = pagination?.page || page
        const limit = pagination?.limit || 20
        
        // More robust hasMore logic:
        // 1. Check if API says hasNext
        // 2. Check if we got fewer posts than the limit (indicating end of data)
        // 3. Check if current page is less than total pages
        // 4. Fallback: if we got a full page of posts, assume there might be more
        const hasMorePosts = hasNext || 
                            (newPosts.length >= limit && currentPageNum < totalPages) ||
                            (newPosts.length >= limit && totalPages === 0) || // Fallback if no totalPages info
                            (newPosts.length >= limit && !pagination) // Fallback if no pagination info at all
        
        console.log('Pagination check:', {
          hasNext,
          totalPages,
          currentPageNum,
          limit,
          newPostsLength: newPosts.length,
          hasMorePosts
        })
        setHasMore(hasMorePosts)
        setError(null)
      } else {
        console.log('API response not successful, using sample data')
        // Use sample data as fallback with pagination
        const postsPerPage = 5 // Show 5 posts per page for sample data
        const startIndex = (page - 1) * postsPerPage
        const endIndex = startIndex + postsPerPage
        const pagePosts = samplePosts.slice(startIndex, endIndex)
        
        if (!isLoadMore) {
          setAllPosts(pagePosts)
          setHasMore(endIndex < samplePosts.length)
        } else {
          setAllPosts(prev => [...prev, ...pagePosts])
          setHasMore(endIndex < samplePosts.length)
        }
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      // Use sample data as fallback with pagination
      const postsPerPage = 5 // Show 5 posts per page for sample data
      const startIndex = (page - 1) * postsPerPage
      const endIndex = startIndex + postsPerPage
      const pagePosts = samplePosts.slice(startIndex, endIndex)
      
      if (!isLoadMore) {
        setAllPosts(pagePosts)
        setHasMore(endIndex < samplePosts.length)
      } else {
        setAllPosts(prev => [...prev, ...pagePosts])
        setHasMore(endIndex < samplePosts.length)
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [buildApiParams])

  // Load more posts
  const loadMore = useCallback(() => {
    console.log('📥 LOAD MORE CALLED:', {
      loadingMore,
      hasMore,
      currentPage,
      currentPostsCount: allPosts.length,
      timestamp: new Date().toISOString()
    })
    
    if (loadingMore || !hasMore) {
      console.log('🚫 LOAD MORE BLOCKED:', {
        reason: loadingMore ? 'already loading' : 'no more posts',
        loadingMore,
        hasMore
      })
      return
    }
    
    console.log('✅ LOAD MORE PROCEEDING')
    setCurrentPage(prevPage => {
      const nextPage = prevPage + 1
      console.log('📄 LOADING PAGE:', nextPage)
      loadPosts(true, nextPage)
      return nextPage
    })
  }, [loadingMore, hasMore, loadPosts, currentPage, allPosts.length])

  // Infinite scroll observer
  useEffect(() => {
    const scrollableRoot = scrollContainerRef.current
    const element = loaderRef.current

    console.log('👁️ INTERSECTION OBSERVER SETUP:', {
      hasScrollableRoot: !!scrollableRoot,
      hasElement: !!element,
      hasMore,
      loadingMore,
      timestamp: new Date().toISOString()
    })

    if (!scrollableRoot || !element) {
      console.warn('⚠️ INTERSECTION OBSERVER: Missing refs', {
        scrollableRoot: !!scrollableRoot,
        element: !!element
      })
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        console.log('👀 INTERSECTION OBSERVER TRIGGERED:', {
          isIntersecting: entry.isIntersecting,
          hasMore,
          loadingMore,
          shouldLoadMore: entry.isIntersecting && hasMore && !loadingMore,
          timestamp: new Date().toISOString()
        })
        
        if (entry.isIntersecting && hasMore && !loadingMore) {
          console.log('🚀 TRIGGERING LOAD MORE')
          loadMore()
        }
      },
      {
        root: scrollableRoot,
        rootMargin: '200px',
        threshold: 0.1,
      },
    )

    observer.observe(element)
    console.log('✅ INTERSECTION OBSERVER: Started observing')

    return () => {
      observer.unobserve(element)
      console.log('🛑 INTERSECTION OBSERVER: Stopped observing')
    }
  }, [hasMore, loadingMore, loadMore])

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
      authorAvatar: apiPost.social_profile?.profile_picture_url || apiPost.metadata?.originalData?.author?.profile_picture_url,
      username: apiPost.social_profile?.username,
      content: apiPost.content || '',
      thumbnailUrl: apiPost.thumbnailUrl || (apiPost.imageUrls && apiPost.imageUrls[0]) || apiPost.metadata?.originalData?.image?.uri,
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

  // Sample data for when API fails - static data to avoid duplicate keys
  const samplePosts: Post[] = [
    {
      id: 'sample-1',
      platform: 'twitter',
      author: 'BengaluruPolice',
      content: 'Sample post 1: Traffic update on MG Road due to metro construction. Please use alternative routes.',
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
      id: 'sample-2',
      platform: 'facebook',
      author: 'Karnataka Police',
      content: 'Sample post 2: Safety reminder about wearing helmets while riding two-wheelers.',
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
      id: 'sample-3',
      platform: 'instagram',
      author: 'WhitefieldTraffic',
      content: 'Sample post 3: Beautiful sunrise from Whitefield! Remember to drive safely.',
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
      id: 'sample-4',
      platform: 'news',
      author: 'Times of India',
      content: 'Sample post 4: Bengaluru police launch new digital initiative for faster complaint registration.',
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
      id: 'sample-5',
      platform: 'twitter',
      author: 'BellandurResident',
      content: 'Sample post 5: Traffic situation in Bellandur is getting worse day by day.',
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
      id: 'sample-6',
      platform: 'facebook',
      author: 'Karnataka CM Office',
      content: 'Sample post 6: New infrastructure projects announced for Bengaluru to improve traffic flow.',
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
    },
    {
      id: 'sample-7',
      platform: 'instagram',
      author: 'TrafficControl',
      content: 'Sample post 7: Road maintenance work on Outer Ring Road. Expect delays.',
      timestamp: '14h',
      likes: 456,
      comments: 89,
      shares: 123,
      views: 22000,
      sentiment: 'neutral',
      engagement: 668,
      reach: 28000,
      hasVideo: false,
      impact: 'medium',
      isViral: false,
      isTrending: false
    },
    {
      id: 'sample-8',
      platform: 'twitter',
      author: 'CityUpdates',
      content: 'Sample post 8: New bus routes announced to connect IT corridors with residential areas.',
      timestamp: '16h',
      likes: 789,
      comments: 234,
      shares: 345,
      views: 35000,
      sentiment: 'positive',
      engagement: 1368,
      reach: 42000,
      hasVideo: false,
      impact: 'high',
      isViral: false,
      isTrending: true
    },
    {
      id: 'sample-9',
      platform: 'facebook',
      author: 'PublicSafety',
      content: 'Sample post 9: Emergency contact numbers for traffic assistance in Bengaluru.',
      timestamp: '18h',
      likes: 1234,
      comments: 345,
      shares: 567,
      views: 48000,
      sentiment: 'positive',
      engagement: 2146,
      reach: 55000,
      hasVideo: false,
      impact: 'high',
      isViral: true,
      isTrending: false
    },
    {
      id: 'sample-10',
      platform: 'news',
      author: 'UrbanPlanning',
      content: 'Sample post 10: Smart city initiatives to improve traffic management in Bengaluru.',
      timestamp: '20h',
      likes: 678,
      comments: 123,
      shares: 234,
      views: 28000,
      sentiment: 'positive',
      engagement: 1035,
      reach: 35000,
      hasVideo: true,
      impact: 'medium',
      isViral: false,
      isTrending: false
    }
  ]

  // Apply client-side filters that can't be done server-side
  const filteredPosts = useMemo(() => {
    // First, ensure unique posts by ID to prevent React key conflicts
    const uniquePosts = allPosts.reduce((acc, post) => {
      if (!acc.find(p => p.id === post.id)) {
        acc.push(post)
      }
      return acc
    }, [] as Post[])
    
    if (uniquePosts.length !== allPosts.length) {
      console.warn('🔧 DUPLICATE POSTS REMOVED:', {
        originalCount: allPosts.length,
        uniqueCount: uniquePosts.length,
        removedCount: allPosts.length - uniquePosts.length
      })
    }
    
    let filtered = [...uniquePosts]
    console.log('🔍 FILTERING POSTS:', {
      allPostsLength: allPosts.length,
      uniquePostsLength: uniquePosts.length,
      activeFilter,
      timestamp: new Date().toISOString()
    })

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

    console.log('Filtered posts length:', filtered.length)
    console.log('Sample filtered posts:', filtered.slice(0, 2))
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
    { id: 'high-reach-low-engagement', label: 'High Reach/Low Engage', icon: '👁️' },
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

  // Calculate count for each filter
  const getFilterCount = (filterId: string) => {
    return allPosts.filter(post => {
      // Apply the filter logic
      if (filterId === 'all-posts') return true
      if (filterId === 'latest-posts') return true // Same as all for now
      if (filterId === 'positive') return post.sentiment === 'positive'
      if (filterId === 'negative') return post.sentiment === 'negative'
      if (filterId === 'neutral') return post.sentiment === 'neutral'
      if (filterId === 'news') return post.platform === 'news'
      if (filterId === 'videos') return post.hasVideo
      if (filterId === 'twitter') return post.platform === 'twitter'
      if (filterId === 'facebook') return post.platform === 'facebook'
      if (filterId === 'instagram') return post.platform === 'instagram'
      if (filterId === 'high-impact') return post.impact === 'high'
      if (filterId === 'viral-negative') return post.isViral && post.sentiment === 'negative'
      if (filterId === 'trending') return post.isTrending
      if (filterId === 'high-engagement') return post.engagement > 500
      if (filterId === 'high-reach-low-engagement') return post.reach > 1000 && post.engagement < 100
      if (filterId === 'viral-potential') return post.engagement > 300 && post.shares > 50
      return true
    }).length
  }

  const [showSearch, setShowSearch] = useState(!!urlSearchQuery) // Show search if query param exists
  const [showDebug, setShowDebug] = useState(false)

  return (
    <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        {/* Vertical Filter Sidebar */}
        <div className="w-64 border-r border-border bg-card flex-shrink-0 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            {/* Main Feeds */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Feeds</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleFilterChange('all-posts')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'all-posts'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span>📋 All Posts</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === 'all-posts' 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getFilterCount('all-posts')}
                  </span>
                </button>
                <button
                  onClick={() => handleFilterChange('latest-posts')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'latest-posts'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span>✨ Latest</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === 'latest-posts' 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getFilterCount('latest-posts')}
                  </span>
                </button>
                <button
                  onClick={() => handleFilterChange('high-impact')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'high-impact'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span>🎯 Top</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === 'high-impact' 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getFilterCount('high-impact')}
                  </span>
                </button>
                <button
                  onClick={() => handleFilterChange('positive')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'positive'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span>😊 Positive</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === 'positive' 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getFilterCount('positive')}
                  </span>
                </button>
                <button
                  onClick={() => handleFilterChange('negative')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFilter === 'negative'
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span>😞 Negative</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === 'negative' 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {getFilterCount('negative')}
                  </span>
                </button>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Platforms</h3>
              <div className="space-y-1">
                {platformFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      activeFilter === filter.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="flex items-center gap-1 flex-1 min-w-0">
                      <span>{filter.icon}</span>
                      <span className="truncate">{filter.label}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      activeFilter === filter.id 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getFilterCount(filter.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Filters */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content</h3>
              <div className="space-y-1">
                {contentFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      activeFilter === filter.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="flex items-center gap-1 flex-1 min-w-0">
                      <span>{filter.icon}</span>
                      <span className="truncate">{filter.label}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      activeFilter === filter.id 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getFilterCount(filter.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters - Moved to Bottom */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Filters</h3>
              <div className="space-y-2">
                <select
                  value={selectedMediaType}
                  onChange={(e) => setSelectedMediaType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg cursor-pointer"
                >
                  <option value="all">All Media</option>
                  <option value="images">Images</option>
                  <option value="videos">Videos</option>
                  <option value="text">Text Only</option>
                </select>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="border-b border-border bg-background px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{getFilterLabel(activeFilter)}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredPosts.length} posts
              </span>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1">
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Posts Grid */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <FadeInUp className="p-2 sm:p-3">
              {(() => {
                console.log('Rendering posts - loading:', loading, 'filteredPosts length:', (filteredPosts || []).length, 'allPosts length:', allPosts.length, 'hasMore:', hasMore)
                return null
              })()}
              {loading ? (
                <FeedSkeleton />
              ) : (filteredPosts || []).length > 0 ? (
                <>
                  <Masonry
                    breakpointCols={{
                      default: 4,
                      1600: 3,
                      1200: 2,
                      700: 1
                    }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {(filteredPosts || []).map((post, index) => (
                      <div key={`${post.id}-${index}-${post.platform}`}>
                        <PostCard post={post} />
                      </div>
                    ))}
                  </Masonry>
                  
                  {/* Infinite Scroll Trigger & Loader */}
                  {hasMore && (
                    <div ref={loaderRef} className="h-20 mt-6 flex justify-center items-center">
                      {loadingMore && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Loading more posts...</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!hasMore && filteredPosts.length > 0 && (
                    <div className="mt-6 text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        {error ? 'No more posts to load (using sample data)' : 'No more posts to load'}
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        Showing {filteredPosts.length} posts
                        {error && (
                          <div className="mt-1 text-orange-500">
                            API unavailable - showing sample data only
                          </div>
                        )}
                      </div>
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
            </FadeInUp>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .my-masonry-grid {
          display: -webkit-box; /* Not needed if autoprefixing */
          display: -ms-flexbox; /* Not needed if autoprefixing */
          display: flex;
          margin-left: -12px; /* gutter size offset */
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 12px; /* gutter size */
          background-clip: padding-box;
        }
        .my-masonry-grid_column > div { /* change div to reference your elements */
          margin-bottom: 12px;
        }
      `}</style>
    </PageLayout>
  )
}

export default function SocialFeedPage() {
  return (
    <Suspense fallback={<SocialFeedSkeleton />}>
      <SocialFeedContent />
    </Suspense>
  )
}

function FeedSkeleton() {
  return <SocialFeedSkeleton />
}
