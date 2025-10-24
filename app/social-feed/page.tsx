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
import { Loader2, MessageCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { PostCard } from '@/components/posts/post-card'
import { ExploreSidebar } from '@/components/explore/explore-sidebar'
import { SocialFeedSkeleton } from '@/components/skeletons/social-feed-skeleton'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import Masonry from 'react-masonry-css'
import { useInfiniteSocialPosts } from '@/hooks/use-infinite-social-posts'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useScrollRestoration } from '@/hooks/use-scroll-restoration'
import { useFilterCounts } from '@/hooks/use-filter-counts'
import { convertToPostCardFormat } from '@/lib/utils'

function SocialFeedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (params: Record<string, string>) => {
    // Clear scroll position when filters change
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('scroll_social-feed')
    }
    const newParams = new URLSearchParams(params)
    router.push(`/social-feed?${newParams.toString()}`)
  }

  const apiParams = useMemo(() => {
    const params: any = {
      limit: 20, // Reduced from 50 to 20 for faster initial load
    }
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  const {
    data: postsData,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    refetch,
    total
  } = useInfiniteSocialPosts(apiParams)

  // Get filter counts for sidebar
  const { counts: filterCounts } = useFilterCounts()

  const posts = useMemo(() => {
    return postsData ? postsData.map(convertToPostCardFormat) : []
  }, [postsData])

  // Debug total count
  console.log('📱 Social Feed - Total posts:', total, 'Posts data length:', postsData?.length, 'Loading:', loading, 'Error:', error)
  console.log('📱 Social Feed - Infinite scroll state:', { hasNextPage, loadingMore, postsLength: posts.length })

  // Generate dynamic page title based on active filters
  const getPageTitle = () => {
    const platform = searchParams.get('platform')
    const sentiment = searchParams.get('sentiment')
    const timeRange = searchParams.get('timeRange')
    const minLikes = searchParams.get('min_likesCount')
    const minShares = searchParams.get('min_sharesCount')
    const hasVideos = searchParams.get('hasVideos')
    
    let title = 'Social Feed'
    
    // Platform filters
    if (platform === 'facebook') title = 'Facebook Social Feed'
    else if (platform === 'twitter') title = 'Twitter Social Feed'
    else if (platform === 'instagram') title = 'Instagram Social Feed'
    else if (platform === 'youtube') title = 'YouTube Social Feed'
    else if (platform === 'india-news') title = 'News Social Feed'
    
    // Sentiment filters
    if (sentiment === 'POSITIVE') title = 'Positive Posts'
    else if (sentiment === 'NEGATIVE') title = 'Negative Posts'
    else if (sentiment === 'NEUTRAL') title = 'Neutral Posts'
    
    // Content type filters
    if (hasVideos === 'true') title = 'Video Posts'
    
    // Engagement filters
    if (minLikes === '1000' && minShares === '500') title = 'High Impact Posts'
    else if (sentiment === 'NEGATIVE' && minShares === '1000') title = 'Viral Negative Posts'
    else if (minLikes === '100' && searchParams.get('min_commentsCount') === '50') title = 'High Engagement Posts'
    else if (searchParams.get('min_viewsCount') === '10000' && searchParams.get('max_likesCount') === '50') title = 'High Reach, Low Engagement Posts'
    
    // Time-based filters
    if (timeRange === '24h' && searchParams.get('sortBy') === 'postedAt') title = 'Latest Posts'
    else if (timeRange === '24h' && searchParams.get('sortBy') === 'commentsCount') title = 'Trending Discussions'
    else if (timeRange === '6h' && searchParams.get('sortBy') === 'sharesCount') title = 'Viral Potential Posts'
    
    return title
  }

  // Infinite scroll setup
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    loading: loadingMore,
    onLoadMore: loadMore,
    threshold: 300
  })

  // Scroll restoration setup
  const scrollContainerRef = useScrollRestoration('social-feed')

  // Handle scroll restoration after posts are loaded (for infinite scroll)
  useEffect(() => {
    if (posts.length > 0 && scrollContainerRef.current) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const savedPosition = sessionStorage.getItem('scroll_social-feed')
        if (savedPosition && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = parseInt(savedPosition, 10)
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [posts.length])

  return (
    <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        <ExploreSidebar
          onFilterChange={handleFilterChange}
          activeParams={searchParams}
          filterCounts={filterCounts}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-border bg-background">
            <h1 className="text-xl font-bold text-foreground">{getPageTitle()}</h1>
            <span className="text-sm text-muted-foreground ml-auto">
              {posts.length} of {total || '?'} posts
              {error && <span className="text-red-500 ml-2">(API Error)</span>}
            </span>
          </div>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <div className="p-2 sm:p-3">
              {loading && posts.length === 0 ? (
                <SocialFeedSkeleton />
              ) : error && !posts.length ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircle className="w-12 h-12 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>Error Loading Posts</EmptyTitle>
                    <EmptyDescription>
                      {error.includes('Authentication') ?
                        'Authentication failed. Please login again.' :
                        error
                      }
                    </EmptyDescription>
                    {error.includes('Authentication') && (
                      <div className="mt-4">
                        <Button onClick={() => window.location.href = '/login'}>
                          Go to Login
                        </Button>
                      </div>
                    )}
                  </EmptyHeader>
                </Empty>
              ) : posts.length > 0 ? (
                <>
                  <Masonry
                    breakpointCols={{
                      default: 4,
                      1600: 3,
                      1200: 2,
                      700: 1,
                    }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {posts.map((post) => (
                      <div key={post.id}>
                        <PostCard post={post} />
                      </div>
                    ))}
                  </Masonry>
                  
                  {/* Infinite scroll trigger */}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className="flex flex-col items-center gap-4 py-8">
                      {loadingMore ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading more posts...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-muted-foreground text-sm">
                            Scroll to load more posts
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={loadMore}
                            className="gap-2"
                          >
                            <ChevronDown className="w-4 h-4" />
                            Load More Posts
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  
                  {!hasNextPage && posts.length > 0 && (
                    <div className="flex justify-center py-8">
                      <div className="text-muted-foreground text-sm">
                        You've reached the end! No more posts to load.
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
                      Try adjusting your filters or search query.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </div>
        </div>
      </div>
      
      
      <style jsx global>{`
        .my-masonry-grid {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          margin-left: -12px;
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 12px;
          background-clip: padding-box;
        }
        .my-masonry-grid_column > div {
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
