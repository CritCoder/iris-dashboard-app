'use client'

import { useState, useEffect } from 'react'

interface Campaign {
  id: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
  startDate: string
  endDate: string
  monitoringStatus: 'ACTIVE' | 'INACTIVE' | 'PROCESSING'
  monitoringData?: {
    isActive?: boolean
    startedAt?: string
    lastCheckAt?: string
    lastUpdated?: string
    nextCheckAt?: string
    totalChecks?: number
    postsUpdated?: number
    newPostsFound?: number
    intervalMinutes?: number
    lastScrapeWindow?: {
      endDate: string
      startDate: string
    }
  }
  metrics: {
    totalPosts: number
    totalEngagement: number
    totalLikes: number
    totalShares: number
    totalComments: number
    totalViews: number
    totalProfiles: number
    averageEngagement: number
    averageLikes: number
    averageShares: number
    averageComments: number
    averageViews: number
    platforms: string[]
    platformDistribution: Record<string, number>
    sentimentDistribution: {
      NEUTRAL: number
      NEGATIVE: number
      POSITIVE: number
      MIXED?: number
    }
    contentTypes: Record<string, number>
    mediaStats: {
      postsWithImages: number
      postsWithVideos: number
      postsWithAttachments: number
      totalImages: number
      totalVideos: number
      totalAttachments: number
    }
    lastUpdated: string
  }
  settings: {
    platforms: string[]
    timeRange: {
      endDate: string
      startDate: string
    }
    searchType: string
    searchTopic: string
    campaignType: string
    intervalMinutes: number
  }
  metadata: {
    platforms: string[]
    searchType: string
    campaignType: string
    estimatedScope: number
    searchInitiated: string
    sentimentAnalysis: {
      confidence: number
      lastUpdated: string
      distribution: {
        [key: string]: {
          count: number
          percentage: number
        }
      }
      previousSentiment: string
      calculationOptions: Record<string, any>
      totalPostsAnalyzed: number
    }
  }
  createdAt: string
  updatedAt: string
  campaignType: string
  organizationId: string
  createdBy: string
  sentiment: string
  organization: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
  createdByUser: {
    id: string
    email: string
  }
  _count: {
    alerts: number
    events: number
    entities: number
    accounts: number
  }
}

interface ApiResponse {
  success: boolean
  message: string
  data: Campaign[]
}

interface UseCampaignsParams {
  page?: number
  limit?: number
  enabled?: boolean
}

export function useCampaigns({
  page = 1,
  limit = 10,
  enabled = true
}: UseCampaignsParams = {}) {
  const [data, setData] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fetchCampaigns = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://irisnet.wiredleap.com/api/campaigns?page=${page}&limit=${limit}`,
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

        const result: ApiResponse = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          throw new Error(result.message || 'Failed to fetch campaigns')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [page, limit, enabled])

  return {
    data,
    loading,
    error,
    refetch: () => {
      setData([])
    }
  }
}