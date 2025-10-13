'use client'

import { useState, useEffect } from 'react'

interface SocialProfile {
  id: string
  personId: string
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'reddit' | 'tiktok'
  platformUserId: string
  username: string
  profileUrl?: string
  profileImageUrl?: string
  profileBannerUrl?: string
  displayName?: string
  bio?: string
  location?: string
  website?: string
  isVerified: boolean
  isBlueVerified: boolean
  verifiedType?: string
  followerCount: number
  followingCount: number
  postCount: number
  mediaCount?: number
  favouritesCount?: number
  listsCount?: number
  accountCreatedAt?: string
  accountType: string
  canDm: boolean
  canMediaTag: boolean
  hasCustomTimelines: boolean
  isAutomated: boolean
  automatedBy?: string
  pinnedPostIds: string[]
  language?: string
  timezone?: string
  lastPostAt?: string
  lastChecked: string
  metadata: {
    postCount?: number
    originalData?: any
    lastProfileUpdate?: string
    profileScrapeData?: any
  }
}

interface ProfilesApiResponse {
  success: boolean
  message: string
  data: {
    data: SocialProfile[]
    total?: number
    page?: number
    limit?: number
  }
}

interface UseProfilesParams {
  campaignId?: string
  page?: number
  limit?: number
  platform?: string
  minFollowers?: number
  maxFollowers?: number
  minPosts?: number
  maxPosts?: number
  isVerified?: boolean
  accountType?: string
  enabled?: boolean
}

export function useProfiles({
  campaignId,
  page = 1,
  limit = 50,
  platform,
  minFollowers,
  maxFollowers,
  minPosts,
  maxPosts,
  isVerified,
  accountType,
  enabled = true
}: UseProfilesParams) {
  const [data, setData] = useState<SocialProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (!enabled) return

    const fetchProfiles = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams({
          limit: limit.toString(),
        })

        // Add optional filters
        if (page > 1) params.append('page', page.toString())
        if (campaignId) params.append('campaignId', campaignId)
        if (platform) params.append('platform', platform)
        if (minFollowers) params.append('minFollowers', minFollowers.toString())
        if (maxFollowers) params.append('maxFollowers', maxFollowers.toString())
        if (minPosts) params.append('minPosts', minPosts.toString())
        if (maxPosts) params.append('maxPosts', maxPosts.toString())
        if (isVerified !== undefined) params.append('isVerified', isVerified.toString())
        if (accountType) params.append('accountType', accountType)

        const response = await fetch(
          `https://irisnet.wiredleap.com/api/social/profiles?${params.toString()}`,
          {
            headers: {
              'Accept': '*/*',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWY1Mmx5NWQwMDAyejI2aHBjYTd6aHQ1Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYwMzQ4MTkwLCJleHAiOjE3NjA0MzQ1OTB9.WKfvPuN6NEtedZQlS4tdDCzPjj_yTkSfnoJYgCzcwsk',
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: ProfilesApiResponse = await response.json()

        if (result.success) {
          setData(result.data.data || [])
          setTotal(result.data.total || result.data.data?.length || 0)
        } else {
          throw new Error(result.message || 'Failed to fetch profiles')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [
    campaignId,
    page,
    limit,
    platform,
    minFollowers,
    maxFollowers,
    minPosts,
    maxPosts,
    isVerified,
    accountType,
    enabled
  ])

  return {
    data,
    loading,
    error,
    total,
    refetch: () => {
      setData([])
      setTotal(0)
    }
  }
}

// Helper function to convert API profile to ProfileCard format
export function convertToProfileCardFormat(apiProfile: SocialProfile) {
  return {
    id: apiProfile.id,
    username: apiProfile.username,
    displayName: apiProfile.displayName || apiProfile.username,
    platform: apiProfile.platform,
    profileImageUrl: apiProfile.profileImageUrl,
    bio: apiProfile.bio || '',
    followerCount: apiProfile.followerCount || 0,
    followingCount: apiProfile.followingCount || 0,
    postCount: apiProfile.postCount || 0,
    isVerified: apiProfile.isVerified || false,
    isBlueVerified: apiProfile.isBlueVerified || false,
    accountType: apiProfile.accountType || 'personal',
    lastPostAt: apiProfile.lastPostAt,
    website: apiProfile.website,
    location: apiProfile.location
  }
}