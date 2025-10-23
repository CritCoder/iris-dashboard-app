'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Hash, MapPin, User, Building, AlertTriangle, Heart, MessageCircle, Share2, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { api } from '@/lib/api'
import Link from 'next/link'
import { useGlobalPostModal } from '@/contexts/global-post-modal-context'
import { AnimatedGrid, AnimatedCard } from '@/components/ui/animated'

interface Entity {
  id: string
  name: string
  type: 'TOPIC' | 'LOCATION' | 'ENTITY' | 'PERSON' | 'ORGANIZATION' | 'THREAT' | 'KEYWORD'
  category?: string
  totalMentions?: number
  lastSeen?: string
  sentiment?: string
  description?: string
  riskLevel?: string
}

interface Post {
  id: string
  platform: string
  content: string
  postedAt: string
  likesCount?: number
  commentsCount?: number
  sharesCount?: number
  viewsCount?: number
  aiSentiment?: string
  social_profile?: {
    username?: string
    displayName?: string
  }
  person?: {
    name?: string
  }
}

interface EntityDetailViewProps {
  entity: Entity
  onBack: () => void
}

export function EntityDetailView({ entity, onBack }: EntityDetailViewProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { openPost } = useGlobalPostModal()
  const [filter, setFilter] = useState<'latest' | 'positive' | 'negative'>('latest')

  useEffect(() => {
    loadPosts()
  }, [entity.name, filter])

  const loadPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const params: any = {
        search: entity.name,
        page: 1,
        limit: 20,
        sortBy: 'date'
      }

      if (filter === 'positive') {
        params.sentiment = 'POSITIVE'
      } else if (filter === 'negative') {
        params.sentiment = 'NEGATIVE'
      }

      const response = await api.social.getPosts(params)
      
      if (response.success && response.data) {
        setPosts(Array.isArray(response.data) ? response.data : [])
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error('Failed to load posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TOPIC':
      case 'KEYWORD':
        return Hash
      case 'LOCATION':
        return MapPin
      case 'PERSON':
        return User
      case 'ORGANIZATION':
        return Building
      case 'THREAT':
        return AlertTriangle
      default:
        return Hash
    }
  }

  const Icon = getTypeIcon(entity.type)

  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const posted = new Date(dateString)
    const diffMs = now.getTime() - posted.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks < 4) return `${diffWeeks}w ago`
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths}mo ago`
  }

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'twitter':
        return 'bg-blue-500'
      case 'facebook':
        return 'bg-blue-600'
      case 'instagram':
        return 'bg-pink-500'
      case 'news':
        return 'bg-orange-500'
      default:
        return 'bg-muted'
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE':
        return 'border-green-500/30 bg-green-500/5'
      case 'NEGATIVE':
        return 'border-red-500/30 bg-red-500/5'
      case 'NEUTRAL':
      default:
        return 'border-gray-500/30 bg-gray-500/5'
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background p-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mt-1"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">{entity.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{entity.type}</Badge>
                  {entity.category && (
                    <Badge variant="outline">{entity.category.replace('_', ' ')}</Badge>
                  )}
                  {entity.riskLevel && entity.riskLevel !== 'LOW' && (
                    <Badge 
                      variant={entity.riskLevel === 'HIGH' ? 'destructive' : 'default'}
                      className="gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {entity.riskLevel} Risk
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {entity.description && (
              <p className="text-sm text-muted-foreground mb-3">{entity.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{entity.totalMentions?.toLocaleString() || 0}</strong> mentions
              </span>
              {entity.lastSeen && (
                <span>Last seen: <strong className="text-foreground">{entity.lastSeen}</strong></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-border bg-background px-4">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'latest' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('latest')}
            className="rounded-b-none"
          >
            Latest
          </Button>
          <Button
            variant={filter === 'positive' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('positive')}
            className="rounded-b-none"
          >
            Positive
          </Button>
          <Button
            variant={filter === 'negative' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('negative')}
            className="rounded-b-none"
          >
            Negative
          </Button>
          <span className="ml-auto text-sm text-muted-foreground">
            {posts.length} posts
          </span>
        </div>
      </div>

      {/* Posts Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading posts</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Hash className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No posts found for this entity</p>
            </div>
          </div>
        ) : (
          <AnimatedGrid speed="fast" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post) => {
              const author = post.social_profile?.username || post.social_profile?.displayName || post.person?.name || 'Unknown User'
              const sentiment = post.aiSentiment || 'NEUTRAL'

              return (
                <AnimatedCard key={post.id}>
                  <Card 
                    className={`p-4 hover:bg-accent/5 transition-all cursor-pointer h-full flex flex-col ${getSentimentColor(sentiment)}`}
                    onClick={() => openPost(post.id, '1')}
                  >
                      {/* Post Header */}
                      <div className="flex items-start gap-3 mb-3 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full ${getPlatformColor(post.platform)} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                          {author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{author}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{post.platform}</span>
                            <span>·</span>
                            <span>{formatRelativeTime(post.postedAt)}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={sentiment === 'POSITIVE' ? 'default' : sentiment === 'NEGATIVE' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {sentiment}
                        </Badge>
                      </div>

                      {/* Post Content */}
                      <p className="text-sm text-foreground/90 mb-4 line-clamp-4 flex-1">
                        {post.content}
                      </p>

                      {/* Post Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {post.likesCount?.toLocaleString() || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {post.commentsCount?.toLocaleString() || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3.5 h-3.5" />
                            {post.sharesCount?.toLocaleString() || 0}
                          </span>
                        </div>
                        {post.viewsCount && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {post.viewsCount.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Card>
                </AnimatedCard>
              )
            })}
          </AnimatedGrid>
        )}
      </div>
    </div>
  )
}

