'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Users, MapPin, Calendar, MessageSquare, Heart, Share2, Eye, Download, Filter, ArrowRight, ChevronRight, X, TrendingUp, CheckCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
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
import { ProfileTabBar } from '@/components/profiles/profile-tab-bar'
import { ProfileDetailView } from '@/components/profiles/profile-detail-view'

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
  personStatus?: string
}

interface ProfileTab {
  id: string
  title: string
  profileData?: Profile
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

function FilterItem({ 
  label, 
  isActive = false, 
  hasSubmenu = false, 
  onClick,
  onSelect,
  count,
  submenuItems
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
  onSelect?: (value?: string) => void
  count?: number
  submenuItems?: { label: string; value: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (hasSubmenu && submenuItems) {
      setIsOpen(!isOpen)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive 
            ? 'bg-gray-700/50 text-white' 
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/60'
        }`}
      >
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {count !== undefined && <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{count}</span>}
          {hasSubmenu && (
            <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''} ${isActive ? 'text-gray-300' : 'text-gray-500'}`} />
          )}
        </div>
      </button>
      
      {hasSubmenu && isOpen && submenuItems && (
        <div className="ml-4 mt-1 space-y-1">
          {submenuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelect ? onSelect(item.value) : onClick && onClick()}
              className="w-full flex items-start px-3 py-1.5 rounded-lg text-xs transition-colors text-gray-400 hover:text-gray-300 hover:bg-gray-800/60"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileCard({ profile, onClick }: { profile: Profile; onClick?: (profile: Profile) => void }) {
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

  const handleClick = () => {
    if (onClick) {
      onClick(profile)
    }
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all hover:border-primary/50 group cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-foreground font-bold text-lg border-2 border-primary/20">
                {profile.avatar || profile.displayName[0].toUpperCase()}
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
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  
  // Tab management for profile detail views
  const [tabs, setTabs] = useState<ProfileTab[]>([{ id: 'profiles-grid', title: 'All Profiles' }])
  const [activeTabId, setActiveTabId] = useState('profiles-grid')

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

    // Add active filters to params (these come from clicking sidebar items)
    Object.keys(activeFilters).forEach(key => {
      if (activeFilters[key]) {
        params[key] = activeFilters[key]
      }
    })

    console.log('🔍 Profiles API Params:', params)
    console.log('Active Filter:', activeFilter)
    console.log('Active Filters Object:', activeFilters)

    return params
  }, [searchQuery, activeFilter, activeFilters])

  const { data: profiles, loading, error } = useProfiles(apiParams)
  
  // Log API params changes
  useEffect(() => {
    console.log('📡 API Params changed, should trigger new request:', apiParams)
  }, [apiParams])
  
  // Log for debugging
  useEffect(() => {
    if (error) {
      console.error('Profiles error:', error)
    }
  }, [error])
  
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
        personStatus: p?.personStatus,
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

  const profilesForCounts = allProfiles || []

  // Handle profile click - open in new tab
  const handleProfileClick = (profile: Profile) => {
    const tabExists = tabs.find(tab => tab.id === profile.id)
    if (!tabExists) {
      setTabs([...tabs, { id: profile.id, title: profile.username, profileData: profile }])
    }
    setActiveTabId(profile.id)
  }

  // Handle tab close
  const handleTabClose = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1]?.id || 'profiles-grid')
    }
  }

  // Get active profile data
  const activeProfile = tabs.find(tab => tab.id === activeTabId)?.profileData

  const filterOptions = [
    { id: 'all', label: 'All Profiles', count: profilesForCounts.length },
    { id: 'verified', label: 'Verified', count: profilesForCounts.filter(p => p.verified).length },
    { id: 'blue-verified', label: 'Blue Verified', count: profilesForCounts.filter(p => p.blueVerified).length },
    { id: 'high-followers', label: 'High Followers (10K+)', count: profilesForCounts.filter(p => p.followers > 10000).length },
    { id: 'active', label: 'Active', count: profilesForCounts.filter(p => p.personStatus === 'active').length },
    { id: 'twitter', label: 'Twitter', count: profilesForCounts.filter(p => p.platform === 'twitter').length },
    { id: 'facebook', label: 'Facebook', count: profilesForCounts.filter(p => p.platform === 'facebook').length },
    { id: 'instagram', label: 'Instagram', count: profilesForCounts.filter(p => p.platform === 'instagram').length },
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
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          <PageHeader
            title="Social Profiles"
            description="Profile Explorer"
            actions={
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProfiles.length} profiles found
                </span>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            }
          />

          {/* Tab Bar */}
          {tabs.length > 1 && (
            <ProfileTabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onTabClick={setActiveTabId}
              onTabClose={handleTabClose}
            />
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search profiles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                
                {/* Sort Dropdown */}
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

                {/* Mobile Filters */}
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[85%] max-w-sm">
                      <div className="p-4 sm:p-6 overflow-y-auto h-full">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                          <FilterSection title="PRIMARY">
                            <FilterItem
                              label="All Authors"
                              isActive={activeFilter === 'all'}
                              onClick={() => {
                                setActiveFilter('all')
                                setActiveFilters({})
                              }}
                            />
                          </FilterSection>

                          <FilterSection title="ENGAGEMENT & IMPACT">
                            <FilterItem
                              label="High Impact Authors"
                              isActive={activeFilter === 'high-impact'}
                              onClick={() => {
                                setActiveFilter('high-impact')
                                setActiveFilters({ minFollowers: '500000' })
                              }}
                            />
                            <FilterItem
                              label="High Reach Authors"
                              isActive={activeFilter === 'high-reach'}
                              onClick={() => {
                                setActiveFilter('high-reach')
                                setActiveFilters({ minFollowers: '100000' })
                              }}
                            />
                            <FilterItem
                              label="Frequent Posters"
                              isActive={activeFilter === 'frequent-posters'}
                              onClick={() => {
                                setActiveFilter('frequent-posters')
                                setActiveFilters({ minPosts: '1000' })
                              }}
                            />
                          </FilterSection>

                          <FilterSection title="SENTIMENT BASED">
                            <FilterItem
                              label="Negative Influencers"
                              isActive={activeFilter === 'negative'}
                              onClick={() => {
                                setActiveFilter('negative')
                                setActiveFilters({ personStatus: 'SUSPICIOUS' })
                              }}
                            />
                            <FilterItem
                              label="Positive Influencers"
                              isActive={activeFilter === 'positive'}
                              onClick={() => {
                                setActiveFilter('positive')
                                setActiveFilters({ personStatus: 'WHOLESOME' })
                              }}
                            />
                          </FilterSection>

                          <FilterSection title="PLATFORMS">
                            <FilterItem
                              label="Twitter Influencers"
                              isActive={activeFilter === 'twitter'}
                              onClick={() => {
                                setActiveFilter('twitter')
                                setActiveFilters({ platform: 'twitter' })
                              }}
                            />
                            <FilterItem
                              label="Facebook Pages"
                              isActive={activeFilter === 'facebook'}
                              onClick={() => {
                                setActiveFilter('facebook')
                                setActiveFilters({ platform: 'facebook' })
                              }}
                            />
                            <FilterItem
                              label="Instagram Influencers"
                              isActive={activeFilter === 'instagram'}
                              onClick={() => {
                                setActiveFilter('instagram')
                                setActiveFilters({ platform: 'instagram' })
                              }}
                            />
                          </FilterSection>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {activeTabId === 'profiles-grid' ? (
                <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
                  {/* Left Sidebar Filters - Desktop */}
                  <div className="hidden lg:block border-r border-border overflow-y-auto p-4 pt-2">
                  <div className="space-y-6">
                    <FilterSection title="PRIMARY">
                      <FilterItem
                        label="All Authors"
                        isActive={activeFilter === 'all'}
                        onClick={() => {
                          setActiveFilter('all')
                          setActiveFilters({})
                        }}
                      />
                    </FilterSection>

                    <FilterSection title="ENGAGEMENT & IMPACT">
                      <FilterItem
                        label="High Impact Authors"
                        isActive={activeFilter === 'high-impact'}
                        onClick={() => {
                          setActiveFilter('high-impact')
                          setActiveFilters({ minFollowers: '500000' })
                        }}
                      />
                      <FilterItem
                        label="High Reach Authors"
                        isActive={activeFilter === 'high-reach'}
                        onClick={() => {
                          setActiveFilter('high-reach')
                          setActiveFilters({ minFollowers: '100000' })
                        }}
                      />
                      <FilterItem
                        label="Frequent Posters"
                        isActive={activeFilter === 'frequent-posters'}
                        onClick={() => {
                          setActiveFilter('frequent-posters')
                          setActiveFilters({ minPosts: '1000' })
                        }}
                      />
                    </FilterSection>

                    <FilterSection title="SENTIMENT BASED">
                      <FilterItem
                        label="Negative Influencers"
                        isActive={activeFilter === 'negative'}
                        onClick={() => {
                          setActiveFilter('negative')
                          setActiveFilters({ personStatus: 'SUSPICIOUS' })
                        }}
                      />
                      <FilterItem
                        label="Positive Influencers"
                        isActive={activeFilter === 'positive'}
                        onClick={() => {
                          setActiveFilter('positive')
                          setActiveFilters({ personStatus: 'WHOLESOME' })
                        }}
                      />
                    </FilterSection>

                    <FilterSection title="PLATFORMS">
                      <FilterItem
                        label="Twitter Influencers"
                        isActive={activeFilter === 'twitter'}
                        onClick={() => {
                          setActiveFilter('twitter')
                          setActiveFilters({ platform: 'twitter' })
                        }}
                      />
                      <FilterItem
                        label="Facebook Pages"
                        isActive={activeFilter === 'facebook'}
                        onClick={() => {
                          setActiveFilter('facebook')
                          setActiveFilters({ platform: 'facebook' })
                        }}
                      />
                      <FilterItem
                        label="Instagram Influencers"
                        isActive={activeFilter === 'instagram'}
                        onClick={() => {
                          setActiveFilter('instagram')
                          setActiveFilters({ platform: 'instagram' })
                        }}
                      />
                    </FilterSection>
                  </div>
                </div>

                {/* Main Grid */}
                <div className="overflow-y-auto p-3 sm:p-4 lg:p-6">
                  {filteredProfiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No profiles found</h3>
                      <p className="text-muted-foreground max-w-md">
                        {searchQuery
                          ? `No profiles match "${searchQuery}". Try adjusting your search.`
                          : 'No profiles available at the moment. Check back later.'}
                      </p>
                    </div>
                  ) : (
                    <AnimatedGrid
                      staggerDelay={0.03}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4"
                    >
                      {filteredProfiles.map((profile) => (
                        <AnimatedCard key={profile.id}>
                          <ProfileCard 
                            profile={profile} 
                            onClick={handleProfileClick}
                          />
                        </AnimatedCard>
                      ))}
                    </AnimatedGrid>
                  )}
                </div>
              </div>
            ) : (
              <ProfileDetailView 
                profile={activeProfile}
                onClose={() => handleTabClose(activeTabId)}
              />
            )}
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  )
}