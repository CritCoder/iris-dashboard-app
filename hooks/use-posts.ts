'use client'

import { useState, useEffect } from 'react'

interface PostAuthor {
  id: string
  username: string
  displayName?: string
  profileImageUrl?: string
  verified?: boolean
  followersCount?: number
}

interface PostMedia {
  id: string
  type: 'image' | 'video' | 'gif'
  url: string
  thumbnailUrl?: string
  width?: number
  height?: number
}

interface PostEngagement {
  likesCount: number
  sharesCount: number
  commentsCount: number
  viewsCount: number
  impressions?: number
}

interface PostMetrics extends PostEngagement {
  engagementRate?: number
  reach?: number
  clicks?: number
}

interface SocialPost {
  id: string
  content: string
  author: PostAuthor
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'reddit' | 'tiktok'
  postUrl: string
  publishedAt: string
  createdAt: string
  updatedAt: string

  // Engagement metrics
  metrics: PostMetrics

  // Content analysis
  sentiment: {
    label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED'
    confidence: number
    scores: {
      positive: number
      negative: number
      neutral: number
      mixed?: number
    }
  }

  // Media attachments
  media?: PostMedia[]

  // Content classification
  contentType: 'text' | 'image' | 'video' | 'link' | 'poll'
  language?: string
  hashtags?: string[]
  mentions?: string[]

  // Campaign association
  campaignId: string

  // Additional metadata
  isRetweet?: boolean
  isReply?: boolean
  parentPostId?: string
  threadId?: string
  location?: {
    name: string
    coordinates?: [number, number]
  }
}

interface PostsApiResponse {
  success: boolean
  message: string
  data: any[] // API returns array directly
}

interface UsePostsParams {
  campaignId?: string
  page?: number
  limit?: number
  platform?: string
  sentiment?: string
  minLikesCount?: number
  minSharesCount?: number
  minCommentsCount?: number
  minViewsCount?: number
  startDate?: string
  endDate?: string
  enabled?: boolean
}

export function usePosts({
  campaignId,
  page = 1,
  limit = 20,
  platform,
  sentiment,
  minLikesCount,
  minSharesCount,
  minCommentsCount,
  minViewsCount,
  startDate,
  endDate,
  enabled = true
}: UsePostsParams) {
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })

        // Add optional filters
        if (campaignId) params.append('campaignId', campaignId)
        if (platform) params.append('platform', platform)
        if (sentiment) params.append('sentiment', sentiment)
        if (minLikesCount) params.append('min_likesCount', minLikesCount.toString())
        if (minSharesCount) params.append('min_sharesCount', minSharesCount.toString())
        if (minCommentsCount) params.append('min_commentsCount', minCommentsCount.toString())
        if (minViewsCount) params.append('min_viewsCount', minViewsCount.toString())
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const response = await fetch(
          `https://irisnet.wiredleap.com/api/social/posts?${params.toString()}`,
          {
            headers: {
              'Accept': '*/*',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWY1Mmx5NWQwMDAyejI2aHBjYTd6aHQ1Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYwNDYxOTI5LCJleHAiOjE3NjA1NDgzMjl9.0ENbbqq1_ENPbW0xoc3TnQ4B5bmqfkdIfdFEZvX84t4',
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: PostsApiResponse = await response.json()

        if (result.success) {
          setData(result.data || [])
          setPagination(null) // No pagination info in current response
        } else {
          throw new Error(result.message || 'Failed to fetch posts')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [
    campaignId,
    page,
    limit,
    platform,
    sentiment,
    minLikesCount,
    minSharesCount,
    minCommentsCount,
    minViewsCount,
    startDate,
    endDate,
    enabled
  ])

  return {
    data,
    pagination,
    loading,
    error,
    refetch: () => {
      setData([])
      setPagination(null)
    }
  }
}

// Helper function to convert API post to PostCard format
export function convertToPostCardFormat(apiPost: any) {
  // Extract author information from metadata
  const authorName = apiPost.metadata?.authorName || apiPost.metadata?.originalData?.author?.name || 'Unknown Author'
  const authorScreenName = apiPost.metadata?.authorScreenName || apiPost.metadata?.originalData?.author?.userName || authorName

  // Ensure platform is one of the supported platforms
  let platform = 'twitter' as 'facebook' | 'twitter' | 'instagram'
  if (apiPost.platform === 'facebook' || apiPost.platform === 'instagram' || apiPost.platform === 'twitter') {
    platform = apiPost.platform
  }

  // Convert sentiment to lowercase and handle all cases
  let sentiment = 'neutral' as 'positive' | 'negative' | 'neutral'
  if (apiPost.aiSentiment) {
    const aiSentiment = apiPost.aiSentiment.toLowerCase()
    if (aiSentiment === 'positive') sentiment = 'positive'
    if (aiSentiment === 'negative') sentiment = 'negative'
    if (aiSentiment === 'neutral') sentiment = 'neutral'
  }

  return {
    id: apiPost.id || 'unknown',
    author: authorName,
    platform: platform,
    content: apiPost.content || '',
    timestamp: apiPost.postedAt ? new Date(apiPost.postedAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) : 'Unknown time',
    likes: apiPost.likesCount || 0,
    comments: apiPost.commentsCount || 0,
    shares: apiPost.sharesCount || 0,
    views: apiPost.viewsCount || 0,
    sentiment: sentiment
  }
}