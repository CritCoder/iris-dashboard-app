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
import { convertToPostCardFormat } from '@/lib/utils'

function SocialFeedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(params)
    router.push(`/social-feed?${newParams.toString()}`)
  }

  const apiParams = useMemo(() => {
    const params: any = {
      limit: 50,
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

  const posts = useMemo(() => {
    return postsData ? postsData.map(convertToPostCardFormat) : []
  }, [postsData])

  // Infinite scroll setup
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    loading: loadingMore,
    onLoadMore: loadMore,
    threshold: 300
  })

  return (
    <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        <ExploreSidebar
          onFilterChange={handleFilterChange}
          activeParams={searchParams}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-border bg-background">
            <h1 className="text-xl font-bold text-foreground">Social Feed</h1>
            <span className="text-sm text-muted-foreground ml-auto">
              {posts.length} of {total} posts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2 sm:p-3">
              {loading && posts.length === 0 ? (
                <SocialFeedSkeleton />
              ) : error ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircle className="w-12 h-12 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle>Error Loading Posts</EmptyTitle>
                    <EmptyDescription>{error}</EmptyDescription>
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
