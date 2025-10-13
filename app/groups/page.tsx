'use client'

import { useState, useMemo } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Users, Shield, Globe, Building2, TrendingUp, BarChart3, Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGroups } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface Group {
  id: string
  name: string
  type: 'public' | 'private' | 'closed'
  members: number
  posts: number
  platform: string
  description?: string
  avatar?: string
  created?: string
  lastActive?: string
  engagement?: number
  sentiment?: 'positive' | 'negative' | 'neutral'
  category?: string
}

function GroupCard({ group }: { group: Group }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-500'
      case 'private': return 'bg-orange-500'
      case 'closed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-600'
      case 'telegram': return 'bg-blue-500'
      case 'discord': return 'bg-indigo-600'
      case 'whatsapp': return 'bg-green-600'
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
              {group.avatar || group.name[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getPlatformColor(group.platform)} border-2 border-background`} />
            <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${getTypeColor(group.type)} border-2 border-background`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{group.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {group.type.toUpperCase()}
              </Badge>
              {group.category && (
                <Badge variant="outline" className="text-xs">
                  {group.category}
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {group.platform} Group
            </div>
            
            {group.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{group.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {group.members.toLocaleString()} members
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {group.posts.toLocaleString()} posts
              </span>
              {group.engagement && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {group.engagement.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {group.created && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    Created {group.created}
                  </span>
                )}
                {group.lastActive && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    Active {group.lastActive}
                  </span>
                )}
              </div>
              
              {group.sentiment && (
                <Badge className={`text-xs ${getSentimentColor(group.sentiment)}`}>
                  {group.sentiment}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GroupsPage() {
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
      case 'public':
        params.type = 'public'
        break
      case 'private':
        params.type = 'private'
        break
      case 'closed':
        params.type = 'closed'
        break
      case 'large':
        params.minMembers = 10000
        break
      case 'active':
        params.status = 'active'
        break
      case 'facebook':
        params.platform = 'facebook'
        break
      case 'telegram':
        params.platform = 'telegram'
        break
    }

    return params
  }, [searchQuery, activeFilter])

  const { data: groups, loading, error } = useGroups(apiParams)
  
  // Sample data for when API fails
  const sampleGroups: Group[] = [
    {
      id: '1',
      name: 'Bengaluru Police Community',
      type: 'public',
      members: 45000,
      posts: 1200,
      platform: 'Facebook',
      description: 'Official community for Bengaluru Police updates, safety tips, and citizen engagement.',
      created: '2 years ago',
      lastActive: '2 hours ago',
      engagement: 8900,
      sentiment: 'positive',
      category: 'Government'
    },
    {
      id: '2',
      name: 'Karnataka Traffic Updates',
      type: 'public',
      members: 32000,
      posts: 890,
      platform: 'Telegram',
      description: 'Real-time traffic updates and road condition reports for Karnataka state.',
      created: '1 year ago',
      lastActive: '30 minutes ago',
      engagement: 5600,
      sentiment: 'neutral',
      category: 'Transport'
    },
    {
      id: '3',
      name: 'Bellandur Residents Forum',
      type: 'private',
      members: 8500,
      posts: 2340,
      platform: 'WhatsApp',
      description: 'Private forum for Bellandur area residents to discuss local issues and community updates.',
      created: '3 years ago',
      lastActive: '1 hour ago',
      engagement: 2300,
      sentiment: 'negative',
      category: 'Community'
    },
    {
      id: '4',
      name: 'Whitefield Business Network',
      type: 'closed',
      members: 12000,
      posts: 1560,
      platform: 'Facebook',
      description: 'Exclusive network for Whitefield area business owners and entrepreneurs.',
      created: '1 year ago',
      lastActive: '4 hours ago',
      engagement: 4200,
      sentiment: 'positive',
      category: 'Business'
    },
    {
      id: '5',
      name: 'Karnataka Youth Forum',
      type: 'public',
      members: 78000,
      posts: 450,
      platform: 'Discord',
      description: 'Youth forum discussing politics, social issues, and opportunities in Karnataka.',
      created: '6 months ago',
      lastActive: '3 hours ago',
      engagement: 12000,
      sentiment: 'positive',
      category: 'Social'
    },
    {
      id: '6',
      name: 'Tech Professionals Bengaluru',
      type: 'private',
      members: 25000,
      posts: 890,
      platform: 'Telegram',
      description: 'Private group for tech professionals in Bengaluru to share opportunities and network.',
      created: '2 years ago',
      lastActive: '6 hours ago',
      engagement: 6800,
      sentiment: 'positive',
      category: 'Professional'
    }
  ]

  // Use API data if available and no error, otherwise use sample data
  const allGroups = (groups && groups.length > 0 && !error) ? groups : sampleGroups

  const filteredGroups = useMemo(() => {
    if (!allGroups || !Array.isArray(allGroups)) return []

    let filtered = [...allGroups]

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
  }, [allGroups, sortBy])

  const filterOptions = [
    { id: 'all', label: 'All Groups', count: allGroups.length },
    { id: 'public', label: 'Public Groups', count: allGroups.filter(g => g.type === 'public').length },
    { id: 'private', label: 'Private Groups', count: allGroups.filter(g => g.type === 'private').length },
    { id: 'closed', label: 'Closed Groups', count: allGroups.filter(g => g.type === 'closed').length },
    { id: 'large', label: 'Large Groups (10k+)', count: allGroups.filter(g => g.members > 10000).length },
    { id: 'active', label: 'Active', count: allGroups.filter(g => g.lastActive?.includes('hour')).length },
    { id: 'facebook', label: 'Facebook', count: allGroups.filter(g => g.platform === 'Facebook').length },
    { id: 'telegram', label: 'Telegram', count: allGroups.filter(g => g.platform === 'Telegram').length },
  ]

  if (loading && !error) {
    return (
      <PageLayout>
        <PageHeader
          title="Groups"
          description="Manage and analyze social media groups"
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
        title="Groups"
        description={error ? "Manage and analyze social media groups (showing sample data)" : "Manage and analyze social media groups"}
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
                placeholder="Search groups..."
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

        {/* Groups Grid */}
        <AnimatedGrid stagger={0.03} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredGroups || []).map((group) => (
            <AnimatedCard key={group.id}>
              <GroupCard group={group} />
            </AnimatedCard>
          ))}
        </AnimatedGrid>

        {filteredGroups.length === 0 && !loading && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="w-12 h-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No Groups Found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search criteria or filters to find more groups.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </PageLayout>
    </ProtectedRoute>
  )
}
