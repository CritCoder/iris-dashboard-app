'use client'

import { ChevronRight } from 'lucide-react'
import { PostCard, Post } from './post-card'
import { Button } from '@/components/ui/button'

interface PostRowProps {
  title: string
  description?: string
  posts: Post[]
  campaignId?: string
  onSeeAll?: () => void
}

function PostRow({ title, description, posts, campaignId = '1', onSeeAll }: PostRowProps) {
  if (posts.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSeeAll}
          className="text-primary hover:text-primary/80 gap-1 text-xs"
        >
          See all
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-4">
        {posts.slice(0, 10).map((post) => (
          <div key={post.id} className="w-full">
            <PostCard
              post={post}
              view="grid"
              campaignId={campaignId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface PostRowsProps {
  posts: Post[]
  campaignId?: string
  onCategorySelect?: (categoryName: string) => void
}

export function PostRows({ posts, campaignId = '1', onCategorySelect }: PostRowsProps) {
  // Filter posts by different criteria for different columns
  const latestPosts = posts.filter(() => true).slice(0, 20)

  const highImpactPosts = posts.filter(post =>
    post.likes > 100 || post.shares > 50
  ).slice(0, 20)

  const viralNegativePosts = posts.filter(post =>
    post.sentiment === 'negative' && post.shares > 10
  ).slice(0, 20)

  const trendingDiscussions = posts.filter(post =>
    post.comments > 10
  ).sort((a, b) => b.comments - a.comments).slice(0, 20)

  const positivePosts = posts.filter(post =>
    post.sentiment === 'positive'
  ).slice(0, 20)

  const twitterPosts = posts.filter(post =>
    post.platform === 'twitter'
  ).slice(0, 20)

  const facebookPosts = posts.filter(post =>
    post.platform === 'facebook'
  ).slice(0, 20)

  const instagramPosts = posts.filter(post =>
    post.platform === 'instagram'
  ).slice(0, 20)

  // Create column data for TweetDeck-style layout
  const columns = [
    {
      title: "Latest Posts",
      description: "Most recent activity",
      posts: latestPosts,
      bgClass: "bg-blue-500/5 border-blue-500/20"
    },
    {
      title: "High Impact",
      description: "Significant engagement",
      posts: highImpactPosts,
      bgClass: "bg-green-500/5 border-green-500/20"
    },
    {
      title: "Trending",
      description: "Active discussions",
      posts: trendingDiscussions,
      bgClass: "bg-orange-500/5 border-orange-500/20"
    },
    {
      title: "Twitter",
      description: "Twitter content",
      posts: twitterPosts,
      bgClass: "bg-purple-500/5 border-purple-500/20"
    }
  ].filter(column => column.posts.length > 0) // Only show columns with content

  if (columns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p>No posts available</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="flex gap-6 h-full">
        {columns.map((column, index) => (
          <div
            key={index}
            className={`flex-1 min-w-0 flex flex-col h-full border rounded-lg ${column.bgClass}`}
          >
            {/* Column Header */}
            <div className="flex-shrink-0 p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{column.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (onCategorySelect) {
                      onCategorySelect(column.title)
                    }
                  }}
                  className="text-primary hover:text-primary/80 gap-1 text-xs h-6 px-2"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Column Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {column.posts.map((post) => (
                <div key={post.id} className="w-full">
                  <PostCard
                    post={post}
                    view="grid"
                    campaignId={campaignId}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}