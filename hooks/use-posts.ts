'use client'

import { useState, useEffect } from 'react'
import { socialApi } from '@/lib/api'

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
        const params = {
          page,
          limit,
          campaignId,
          platform,
          sentiment,
          min_likesCount: minLikesCount,
          min_sharesCount: minSharesCount,
          min_commentsCount: minCommentsCount,
          min_viewsCount: minViewsCount,
          startDate,
          endDate
        }

        const result = await socialApi.getPosts(params)

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