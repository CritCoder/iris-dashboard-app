'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Users, MapPin, Calendar, MessageSquare, Heart, Share2, Eye, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfiles } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface Profile {
  id: string
  username: string
  displayName: string
  platform: string
  followers: number
  following: number
  posts: number
  verified: boolean
  blueVerified: boolean
  location?: string
  bio?: string
  avatar?: string
  lastActive?: string
  engagement?: number
  sentiment?: 'positive' | 'negative' | 'neutral'
}

function ProfileCard({ profile }: { profile: Profile }) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'bg-sky-500'
      case 'facebook': return 'bg-blue-600'
      case 'instagram': return 'bg-pink-600'
      case 'youtube': return 'bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
              {profile.avatar || profile.displayName[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getPlatformColor(profile.platform)} border-2 border-background`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{profile.displayName}</h3>
              {profile.verified && (
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
              )}
              {profile.blueVerified && (
                <Badge variant="default" className="text-xs">
                  Blue
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              @{profile.username} · {profile.platform}
            </div>
            
            {profile.bio && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{profile.bio}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {profile.followers.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {profile.posts.toLocaleString()}
              </span>
              {profile.engagement && (
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {profile.engagement.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {profile.location && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {profile.location}
                  </span>
                )}
                {profile.lastActive && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {profile.lastActive}
                  </span>
                )}
              </div>
              
              {profile.sentiment && (
                <Badge className={`text-xs ${getSentimentColor(profile.sentiment)}`}>
                  {profile.sentiment}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProfilesPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('followers')

  // Read filter and platform from URL params
  useEffect(() => {
    const filterParam = searchParams.get('filter')
    const platformParam = searchParams.get('platform')
    
    if (filterParam) {
      setActiveFilter(filterParam)
    } else if (platformParam) {
      setActiveFilter(platformParam)
    } else {
      setActiveFilter('all')
    }
  }, [searchParams])

  // Build API params based on search and filter
  const apiParams = useMemo(() => {
    const params: any = {
      limit: 50,
    }

    if (searchQuery) {
      params.search = searchQuery
    }

    // Apply filter-based params from sidebar
    switch (activeFilter) {
      case 'high-impact':
        params.minFollowers = 50000
        params.minEngagement = 5000
        break
      case 'high-reach':
        params.minFollowers = 100000
        break
      case 'engaged':
        params.minEngagement = 10000
        break
      case 'negative':
        params.sentiment = 'NEGATIVE'
        break
      case 'positive':
        params.sentiment = 'POSITIVE'
        break
      case 'twitter':
        params.platform = 'twitter'
        break
      case 'facebook':
        params.platform = 'facebook'
        break
      case 'instagram':
        params.platform = 'instagram'
        break
      case 'verified':
        params.isVerified = true
        break
      case 'blue-verified':
        params.isBlueVerified = true
        break
      case 'high-followers':
        params.minFollowers = 10000
        break
      case 'active':
        params.personStatus = 'active'
        break
    }

    return params
  }, [searchQuery, activeFilter])

  const { data: profiles, loading, error } = useProfiles(apiParams)
  
  // Normalize API response into a flat array of Profile objects
  const allProfiles: Profile[] = useMemo(() => {
    const raw: any = profiles

    // Extract list from common shapes
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.profiles)
        ? raw.profiles
        : Array.isArray(raw?.data)
          ? raw.data
          : []

    // Best-effort field normalization
    return list.map((p: any) => {
      const platformGuess = p?.platform
        || (p?.twitterUrl ? 'twitter'
            : p?.facebookUrl ? 'facebook'
            : p?.instagramUrl ? 'instagram'
            : 'twitter')

      return {
        id: String(p?.id || p?._id || p?.username || p?.userName || Math.random()),
        username: p?.username || p?.userName || '',
        displayName: p?.displayName || p?.name || p?.username || p?.userName || 'Unknown',
        platform: platformGuess,
        followers: p?.followers ?? p?.followersCount ?? 0,
        following: p?.following ?? p?.followingCount ?? 0,
        posts: p?.posts ?? p?.mediaCount ?? p?.postsCount ?? 0,
        verified: !!(p?.verified ?? p?.isVerified),
        blueVerified: !!(p?.blueVerified ?? p?.isBlueVerified),
        location: p?.location,
        bio: p?.bio || p?.description || p?.profile_bio,
        avatar: p?.avatar,
        lastActive: p?.lastActive,
        engagement: p?.engagement,
        sentiment: p?.sentiment,
      } as Profile
    })
  }, [profiles])

  const filteredProfiles = useMemo(() => {
    if (!allProfiles || !Array.isArray(allProfiles)) return []

    let filtered = [...allProfiles]

    // Apply sorting
    switch (sortBy) {
      case 'followers':
        filtered.sort((a, b) => b.followers - a.followers)
        break
      case 'posts':
        filtered.sort((a, b) => b.posts - a.posts)
        break
      case 'engagement':
        filtered.sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
        break
      case 'name':
        filtered.sort((a, b) => a.displayName.localeCompare(b.displayName))
        break
    }

    return filtered
  }, [allProfiles, sortBy])

  const filterOptions = [
    { id: 'all', label: 'All Profiles', count: allProfiles.length },
    { id: 'verified', label: 'Verified', count: allProfiles.filter(p => p.verified).length },
    { id: 'blue-verified', label: 'Blue Verified', count: allProfiles.filter(p => p.blueVerified).length },
    { id: 'high-followers', label: 'High Followers', count: allProfiles.filter(p => p.followers > 10000).length },
    { id: 'active', label: 'Active', count: allProfiles.filter(p => p.personStatus === 'active').length },
    { id: 'twitter', label: 'Twitter', count: allProfiles.filter(p => p.platform === 'twitter').length },
    { id: 'facebook', label: 'Facebook', count: allProfiles.filter(p => p.platform === 'facebook').length },
    { id: 'instagram', label: 'Instagram', count: allProfiles.filter(p => p.platform === 'instagram').length },
  ]

  if (loading && !error) {
    return (
      <PageLayout>
        <PageHeader
          title="Social Profiles"
          description="Manage and analyze social media profiles"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-secondary rounded" />
                      <div className="h-3 w-1/2 bg-secondary rounded" />
                      <div className="h-3 w-full bg-secondary rounded" />
                      <div className="h-3 w-2/3 bg-secondary rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageLayout>
    )
  }

  // Get filter label for display
  const getFilterLabel = () => {
    const filterLabels: Record<string, string> = {
      'all': 'All Authors',
      'high-impact': 'High Impact',
      'high-reach': 'High Reach',
      'engaged': 'Engaged Posters',
      'negative': 'Negative Influencers',
      'positive': 'Positive Influencers',
      'twitter': 'Twitter Profiles',
      'facebook': 'Facebook Profiles',
      'instagram': 'Instagram Profiles',
      'verified': 'Verified Profiles',
      'blue-verified': 'Blue Verified',
      'high-followers': 'High Followers',
      'active': 'Active Profiles'
    }
    return filterLabels[activeFilter] || 'All Authors'
  }

  return (
    <ProtectedRoute>
      <PageLayout>
      <div className="h-screen flex flex-col overflow-hidden">
      <PageHeader
        title={`${getFilterLabel()} (${filteredProfiles.length})`}
          description={error ? "Unable to load profiles from the API" : "Manage and analyze social media profiles"}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        }
      />

        <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-accent/20 transition-colors"
              >
                {(filterOptions || []).map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 cursor-pointer hover:bg-accent/20 transition-colors"
              >
                <option value="followers">Sort by Followers</option>
                <option value="posts">Sort by Posts</option>
                <option value="engagement">Sort by Engagement</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <AnimatedGrid stagger={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {(filteredProfiles || []).map((profile) => (
            <AnimatedCard key={profile.id}>
              <ProfileCard profile={profile} />
            </AnimatedCard>
          ))}
        </AnimatedGrid>

        {filteredProfiles.length === 0 && !loading && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No Profiles Found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search criteria or filters to find more profiles.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        </div>
        </div>
      </div>
    </PageLayout>
    </ProtectedRoute>
  )
}