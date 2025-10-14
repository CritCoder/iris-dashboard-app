'use client'

import { useState, useEffect } from 'react'

interface TrendData {
  timestamp: string
  posts: number
  engagement: number
  likes: number
  shares: number
  comments: number
  views: number
  platforms: string[]
  sentiments: {
    POSITIVE: number
    NEGATIVE: number
    NEUTRAL: number
    MIXED: number
  }
  contentTypes: Record<string, number>
  mediaCount: number
  averageEngagement: number
}

interface CampaignTrends {
  campaignId: string
  campaignName: string
  timeRange: string
  granularity: string
  trends: {
    hourly: TrendData[]
  }
}

interface ApiResponse {
  success: boolean
  message: string
  data: CampaignTrends
}

interface UseCampaignTrendsParams {
  campaignId: string
  timeRange?: string
  granularity?: string
  enabled?: boolean
}

export function useCampaignTrends({
  campaignId,
  timeRange = '24h',
  granularity = 'hour',
  enabled = true
}: UseCampaignTrendsParams) {
  const [data, setData] = useState<CampaignTrends | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !campaignId) return

    const fetchTrends = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://irisnet.wiredleap.com/api/campaigns/${campaignId}/trends?timeRange=${timeRange}&granularity=${granularity}`,
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
          throw new Error(result.message || 'Failed to fetch campaign trends')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [campaignId, timeRange, granularity, enabled])

  return {
    data,
    loading,
    error,
    refetch: () => {
      if (campaignId) {
        // Trigger re-fetch by updating a dependency
        setData(null)
      }
    }
  }
}