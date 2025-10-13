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

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="flex gap-4 pb-2 min-w-max">
          {posts.slice(0, 6).map((post) => (
            <div key={post.id} className="w-80 flex-shrink-0">
              <PostCard
                post={post}
                view="grid"
                campaignId={campaignId}
              />
            </div>
          ))}
        </div>
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
  // Filter posts by different criteria
  const latestPosts = posts.filter(() => true).slice(0, 6)

  const highImpactPosts = posts.filter(post =>
    post.likes > 100 || post.shares > 50
  )

  const viralNegativePosts = posts.filter(post =>
    post.sentiment === 'negative' && post.shares > 10
  )

  const trendingDiscussions = posts.filter(post =>
    post.comments > 10
  ).sort((a, b) => b.comments - a.comments)

  const positivePosts = posts.filter(post =>
    post.sentiment === 'positive'
  )

  const twitterPosts = posts.filter(post =>
    post.platform === 'twitter'
  )

  const facebookPosts = posts.filter(post =>
    post.platform === 'facebook'
  )

  const instagramPosts = posts.filter(post =>
    post.platform === 'instagram'
  )

  const sections = [
    {
      title: "Latest Posts",
      description: "Most recent social media activity",
      posts: latestPosts,
    },
    {
      title: "High Impact",
      description: "Posts with significant engagement",
      posts: highImpactPosts,
    },
    {
      title: "Viral Negative",
      description: "Negative content gaining traction",
      posts: viralNegativePosts,
    },
    {
      title: "Trending Discussions",
      description: "Posts sparking conversations",
      posts: trendingDiscussions,
    },
    {
      title: "Positive Sentiment",
      description: "Uplifting and positive content",
      posts: positivePosts,
    },
    {
      title: "Twitter",
      description: "Content from Twitter/X",
      posts: twitterPosts,
    },
    {
      title: "Facebook",
      description: "Content from Facebook",
      posts: facebookPosts,
    },
    {
      title: "Instagram",
      description: "Content from Instagram",
      posts: instagramPosts,
    },
  ].filter(section => section.posts.length > 0) // Only show sections with content

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <PostRow
          key={index}
          title={section.title}
          description={section.description}
          posts={section.posts}
          campaignId={campaignId}
          onSeeAll={() => {
            if (onCategorySelect) {
              onCategorySelect(section.title)
            }
          }}
        />
      ))}

      {sections.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p>No posts available</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  )
}