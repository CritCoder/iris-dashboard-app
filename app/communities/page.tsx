'use client'

import { useState, useMemo } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Building2, TrendingUp, TrendingDown, BarChart3, Download, Filter, Users, MessageSquare, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCommunities } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface Community {
  id: string
  name: string
  type: 'political' | 'social' | 'professional'
  members: number
  posts: number
  platform: string
  description?: string
  avatar?: string
  created?: string
  lastActive?: string
  engagement?: number
  sentiment?: 'positive' | 'negative' | 'neutral'
  activityLevel?: 'high' | 'moderate' | 'low'
}

function CommunityCard({ community }: { community: Community }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'political': return 'bg-blue-500'
      case 'social': return 'bg-green-500'
      case 'professional': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-600'
      case 'reddit': return 'bg-orange-600'
      case 'discord': return 'bg-indigo-600'
      case 'telegram': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getActivityColor = (activity?: string) => {
    switch (activity) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200'
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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
              {community.avatar || community.name[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getPlatformColor(community.platform)} border-2 border-background`} />
            <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${getTypeColor(community.type)} border-2 border-background`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{community.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {community.type.toUpperCase()}
              </Badge>
              {community.activityLevel && (
                <Badge className={`text-xs ${getActivityColor(community.activityLevel)}`}>
                  {community.activityLevel.toUpperCase()} ACTIVITY
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {community.platform} Community
            </div>
            
            {community.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{community.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {community.members.toLocaleString()} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {community.posts.toLocaleString()} posts
              </span>
              {community.engagement && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {community.engagement.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {community.created && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    Created {community.created}
                  </span>
                )}
                {community.lastActive && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Active {community.lastActive}
                  </span>
                )}
              </div>
              
              {community.sentiment && (
                <Badge className={`text-xs ${getSentimentColor(community.sentiment)}`}>
                  {community.sentiment}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('members')

  // Build API params based on search and filter
  const apiParams = useMemo(() => {
    const params: any = {
      limit: 50,
    }

    if (searchQuery) {
      params.search = searchQuery
    }

    // Apply filter-based params
    switch (activeFilter) {
      case 'political':
        params.type = 'political'
        break
      case 'social':
        params.type = 'social'
        break
      case 'professional':
        params.type = 'professional'
        break
      case 'high':
        params.activityLevel = 'high'
        break
      case 'active':
        params.status = 'active'
        break
      case 'facebook':
        params.platform = 'facebook'
        break
      case 'reddit':
        params.platform = 'reddit'
        break
    }

    return params
  }, [searchQuery, activeFilter])

  const { data: communities, loading, error } = useCommunities(apiParams)
  
  // Sample data for when API fails
  const sampleCommunities: Community[] = [
    {
      id: '1',
      name: 'Karnataka Politics Discussion',
      type: 'political',
      members: 125000,
      posts: 5600,
      platform: 'Reddit',
      description: 'Discussion forum for Karnataka state politics, elections, and governance issues.',
      created: '3 years ago',
      lastActive: '1 hour ago',
      engagement: 25000,
      sentiment: 'neutral',
      activityLevel: 'high'
    },
    {
      id: '2',
      name: 'Bengaluru Tech Community',
      type: 'professional',
      members: 89000,
      posts: 3200,
      platform: 'Discord',
      description: 'Professional community for tech workers in Bengaluru to network and share opportunities.',
      created: '2 years ago',
      lastActive: '2 hours ago',
      engagement: 18000,
      sentiment: 'positive',
      activityLevel: 'high'
    },
    {
      id: '3',
      name: 'Karnataka Social Issues',
      type: 'social',
      members: 67000,
      posts: 4800,
      platform: 'Facebook',
      description: 'Community discussing social issues, welfare programs, and citizen concerns in Karnataka.',
      created: '4 years ago',
      lastActive: '30 minutes ago',
      engagement: 15000,
      sentiment: 'negative',
      activityLevel: 'moderate'
    },
    {
      id: '4',
      name: 'Mysore Heritage Society',
      type: 'social',
      members: 34000,
      posts: 1200,
      platform: 'Telegram',
      description: 'Community dedicated to preserving and promoting Mysore\'s cultural heritage and traditions.',
      created: '1 year ago',
      lastActive: '4 hours ago',
      engagement: 8900,
      sentiment: 'positive',
      activityLevel: 'moderate'
    },
    {
      id: '5',
      name: 'Karnataka Farmers Forum',
      type: 'social',
      members: 156000,
      posts: 7800,
      platform: 'Facebook',
      description: 'Forum for Karnataka farmers to discuss agricultural issues, government policies, and market conditions.',
      created: '5 years ago',
      lastActive: '3 hours ago',
      engagement: 32000,
      sentiment: 'negative',
      activityLevel: 'high'
    },
    {
      id: '6',
      name: 'Bengaluru Startup Network',
      type: 'professional',
      members: 45000,
      posts: 2100,
      platform: 'Discord',
      description: 'Network for entrepreneurs and startup founders in Bengaluru to collaborate and share resources.',
      created: '1 year ago',
      lastActive: '6 hours ago',
      engagement: 12000,
      sentiment: 'positive',
      activityLevel: 'moderate'
    }
  ]

  // Use API data if available and no error, otherwise use sample data
  const allCommunities = (communities && communities.length > 0 && !error) ? communities : sampleCommunities

  const filteredCommunities = useMemo(() => {
    if (!allCommunities || !Array.isArray(allCommunities)) return []

    let filtered = [...allCommunities]

    // Apply sorting
    switch (sortBy) {
      case 'members':
        filtered.sort((a, b) => b.members - a.members)
        break
      case 'posts':
        filtered.sort((a, b) => b.posts - a.posts)
        break
      case 'engagement':
        filtered.sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [allCommunities, sortBy])

  const filterOptions = [
    { id: 'all', label: 'All Communities', count: allCommunities.length },
    { id: 'political', label: 'Political', count: allCommunities.filter(c => c.type === 'political').length },
    { id: 'social', label: 'Social', count: allCommunities.filter(c => c.type === 'social').length },
    { id: 'professional', label: 'Professional', count: allCommunities.filter(c => c.type === 'professional').length },
    { id: 'high', label: 'High Activity', count: allCommunities.filter(c => c.activityLevel === 'high').length },
    { id: 'active', label: 'Active', count: allCommunities.filter(c => c.lastActive?.includes('hour')).length },
    { id: 'facebook', label: 'Facebook', count: allCommunities.filter(c => c.platform === 'Facebook').length },
    { id: 'reddit', label: 'Reddit', count: allCommunities.filter(c => c.platform === 'Reddit').length },
  ]

  if (loading && !error) {
    return (
      <PageLayout>
        <PageHeader
          title="Communities"
          description="Manage and analyze social media communities"
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

  return (
    <ProtectedRoute>
      <PageLayout>
      <PageHeader
        title="Communities"
        description={error ? "Manage and analyze social media communities (showing sample data)" : "Manage and analyze social media communities"}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search communities..."
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
                <option value="members">Sort by Members</option>
                <option value="posts">Sort by Posts</option>
                <option value="engagement">Sort by Engagement</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <AnimatedGrid stagger={0.03} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredCommunities || []).map((community) => (
            <AnimatedCard key={community.id}>
              <CommunityCard community={community} />
            </AnimatedCard>
          ))}
        </AnimatedGrid>

        {filteredCommunities.length === 0 && !loading && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Building2 className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No Communities Found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search criteria or filters to find more communities.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </PageLayout>
    </ProtectedRoute>
  )
}
