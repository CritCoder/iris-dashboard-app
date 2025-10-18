'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Users, MapPin, Calendar, MessageSquare, Heart, Share2, Eye, Download, Filter, ArrowRight, TrendingUp, ThumbsDown, ThumbsUp, Twitter, Facebook, Instagram } from 'lucide-react'
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
import { ProfilesGridSkeleton } from '@/components/skeletons/profile-card-skeleton'

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
  const router = useRouter()
  
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return 'bg-sky-500'
      case 'facebook': return 'bg-blue-600'
      case 'instagram': return 'bg-pink-600'
      case 'youtube': return 'bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return '𝕏'
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      case 'youtube': return '▶️'
      default: return '🌐'
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
      case 'negative': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
      case 'neutral': return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30'
    }
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all hover:border-primary/50 group cursor-pointer"
      onClick={() => router.push(`/profiles/${profile.id}`)}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-foreground font-bold text-lg border-2 border-primary/20 overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // Fallback to initials on image error
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      if (target.parentElement) {
                        target.parentElement.innerHTML = profile.displayName[0].toUpperCase()
                      }
                    }}
                  />
                ) : (
                  profile.displayName[0].toUpperCase()
                )}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full ${getPlatformColor(profile.platform)} border-2 border-background flex items-center justify-center text-[10px]`}>
                {getPlatformIcon(profile.platform)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-semibold text-foreground truncate text-sm">{profile.displayName}</h3>
                {profile.verified && (
                  <span className="text-blue-500 flex-shrink-0" title="Verified">✓</span>
                )}
                {profile.blueVerified && (
                  <Badge variant="default" className="text-[10px] h-4 px-1">Blue</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">@{profile.username}</div>
            </div>
          </div>

          {profile.sentiment && (
            <Badge variant="outline" className={`text-[10px] h-5 px-1.5 flex-shrink-0 ${getSentimentColor(profile.sentiment)}`}>
              {profile.sentiment}
            </Badge>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Stats Grid - Compact 3 columns */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
            <div className="text-xs font-semibold text-foreground">{profile.followers.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
            <div className="text-xs font-semibold text-foreground">{profile.posts.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">Posts</div>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
            <div className="text-xs font-semibold text-foreground">{(profile.engagement || 0).toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">Engagement</div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {profile.location && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {profile.location}
              </span>
            )}
            {profile.lastActive && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {profile.lastActive}
              </span>
            )}
          </div>
          
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            View
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
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
  
  // Log for debugging
  useEffect(() => {
    if (error) {
      console.error('Profiles error:', error)
    }
    if (profiles) {
      console.log('Profiles data sample:', profiles?.slice?.(0, 2) || profiles)
    }
  }, [error, profiles])
  
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
    return list.map((p: any, index: number) => {
      const platformGuess = p?.platform
        || (p?.twitterUrl ? 'twitter'
            : p?.facebookUrl ? 'facebook'
            : p?.instagramUrl ? 'instagram'
            : 'twitter')

      const avatarUrl = p?.avatar || p?.profileImageUrl || p?.profile_image_url || p?.image
      
      // Debug log for first 3 profiles to check avatar URLs
      if (index < 3) {
        console.log(`Profile ${index} avatar check:`, {
          username: p?.username,
          hasAvatar: !!avatarUrl,
          avatarUrl: avatarUrl,
          rawFields: {
            avatar: p?.avatar,
            profileImageUrl: p?.profileImageUrl,
            profile_image_url: p?.profile_image_url,
            image: p?.image
          }
        })
      }

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
        avatar: avatarUrl,
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
          description="Loading profiles..."
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <ProfilesGridSkeleton count={12} />
        </div>
      </PageLayout>
    )
  }

  // Show error state with retry option
  if (error) {
    return (
      <PageLayout>
        <PageHeader
          title="Social Profiles"
          description="Unable to load profiles"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load profiles</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error.includes('401') ? 'Authentication failed. Please try logging in again.' : error}
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
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

          {/* Horizontal Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              All Authors
            </Button>
            <Button
              variant={activeFilter === 'high-impact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('high-impact')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <TrendingUp className="w-4 h-4" />
              High Impact
            </Button>
            <Button
              variant={activeFilter === 'high-reach' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('high-reach')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Eye className="w-4 h-4" />
              High Reach
            </Button>
            <Button
              variant={activeFilter === 'engaged' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('engaged')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              Engaged Posters
            </Button>
            <Button
              variant={activeFilter === 'negative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('negative')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ThumbsDown className="w-4 h-4" />
              Negative
            </Button>
            <Button
              variant={activeFilter === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('positive')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ThumbsUp className="w-4 h-4" />
              Positive
            </Button>
            <Button
              variant={activeFilter === 'twitter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('twitter')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button
              variant={activeFilter === 'facebook' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('facebook')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button
              variant={activeFilter === 'instagram' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('instagram')}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
          </div>
        </div>

        {/* Profiles Grid */}
        <AnimatedGrid staggerDelay={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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