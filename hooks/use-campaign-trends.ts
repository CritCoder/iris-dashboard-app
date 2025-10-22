'use client'

import { useState, useEffect } from 'react'
import { campaignApi } from '@/lib/api'

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
        const result = await campaignApi.getTrends(campaignId, { timeRange, granularity })

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