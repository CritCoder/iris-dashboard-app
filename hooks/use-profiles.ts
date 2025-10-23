'use client'

import { useState, useEffect } from 'react'
import { profileApi } from '@/lib/api'

interface SocialProfile {
  id: string
  personId: string
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'tiktok'
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
        const params = {
          page,
          limit,
          campaignId,
          platform,
          minFollowers,
          maxFollowers,
          minPosts,
          maxPosts,
          isVerified,
          accountType,
        }

        const result = await profileApi.getAll(params)

        if (result.success) {
          const responseData = result.data as { data: SocialProfile[], total: number }
          const profiles = responseData.data || []

          // Debug log to check for duplicates
          console.log('📊 Profiles API response:', {
            totalProfiles: profiles.length,
            profileIds: profiles.map(p => p.id),
            duplicateCheck: profiles.length !== new Set(profiles.map(p => p.id)).size
          })

          // Deduplicate profiles by ID to prevent showing same profile multiple times
          const uniqueProfiles = profiles.filter((profile, index, array) =>
            array.findIndex(p => p.id === profile.id) === index
          )

          if (uniqueProfiles.length !== profiles.length) {
            console.warn('⚠️ Found duplicate profiles, deduplicating:', {
              original: profiles.length,
              unique: uniqueProfiles.length,
              duplicates: profiles.length - uniqueProfiles.length
            })
          }

          setData(uniqueProfiles)
          setTotal(responseData.total || uniqueProfiles.length || 0)
        } else {
          console.warn('⚠️ Profiles API returned unsuccessful response:', result)
          // If no profiles found, set empty data instead of throwing error
          if (result.message?.includes('No profiles found') || result.message?.includes('not found')) {
            setData([])
            setTotal(0)
          } else {
            throw new Error(result.message || 'Failed to fetch profiles')
          }
        }
      } catch (err) {
        console.error('❌ Error fetching profiles:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        // Set empty data on error
        setData([])
        setTotal(0)
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