'use client'

import { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Building2, TrendingUp, TrendingDown, BarChart3, Download, Filter, Users, MessageSquare, Calendar, Users2, Shield, Globe, Eye, EyeOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCommunities, useGroups } from '@/hooks/use-api'
import { useToast } from '@/hooks/use-toast'
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
  category?: 'community'
}

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

type SocialEntity = Community | Group

function SocialEntityCard({ 
  entity, 
  isMonitored, 
  onToggleMonitor 
}: { 
  entity: SocialEntity
  isMonitored: boolean
  onToggleMonitor: (id: string) => void
}) {
  const getTypeColor = (type: string, category?: string) => {
    if (category === 'community') {
      switch (type) {
        case 'political': return 'bg-blue-500'
        case 'social': return 'bg-green-500'
        case 'professional': return 'bg-purple-500'
        default: return 'bg-gray-500'
      }
    } else {
      switch (type) {
        case 'public': return 'bg-green-500'
        case 'private': return 'bg-orange-500'
        case 'closed': return 'bg-red-500'
        default: return 'bg-gray-500'
      }
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return 'bg-blue-600'
      case 'reddit': return 'bg-orange-600'
      case 'discord': return 'bg-indigo-600'
      case 'telegram': return 'bg-blue-500'
      case 'whatsapp': return 'bg-green-600'
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

  const isCommunity = 'activityLevel' in entity
  const entityType = isCommunity ? 'Community' : 'Group'

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold">
              {entity.avatar || entity.name[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getPlatformColor(entity.platform)} border-2 border-background`} />
            <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${getTypeColor(entity.type, entity.category)} border-2 border-background`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{entity.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {entity.type.toUpperCase()}
              </Badge>
              {isCommunity && entity.activityLevel && (
                <Badge className={`text-xs ${getActivityColor(entity.activityLevel)}`}>
                  {entity.activityLevel.toUpperCase()} ACTIVITY
                </Badge>
              )}
              {!isCommunity && entity.category && (
                <Badge variant="outline" className="text-xs">
                  {entity.category}
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {entity.platform} {entityType}
            </div>
            
            {entity.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{entity.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {entity.members.toLocaleString()} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {entity.posts.toLocaleString()} posts
              </span>
              {entity.engagement && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {entity.engagement.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {entity.created && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    Created {entity.created}
                  </span>
                )}
                {entity.lastActive && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Active {entity.lastActive}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {entity.sentiment && (
                  <Badge className={`text-xs ${getSentimentColor(entity.sentiment)}`}>
                    {entity.sentiment}
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant={isMonitored ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleMonitor(entity.id)
                  }}
                  className="h-7 px-3 gap-1.5 text-xs"
                >
                  {isMonitored ? (
                    <>
                      <Check className="w-3 h-3" />
                      Monitoring
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      Monitor
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CommunitiesGroupsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('members')
  const [viewType, setViewType] = useState<'all' | 'communities' | 'groups'>('all')
  const [monitoredIds, setMonitoredIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Load monitored groups from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('monitored-groups')
    if (saved) {
      try {
        const ids = JSON.parse(saved)
        setMonitoredIds(new Set(ids))
      } catch (e) {
        console.error('Failed to load monitored groups:', e)
      }
    }
  }, [])

  // Save monitored groups to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('monitored-groups', JSON.stringify(Array.from(monitoredIds)))
  }, [monitoredIds])

  const toggleMonitor = (id: string) => {
    setMonitoredIds(prev => {
      const newSet = new Set(prev)
      const isAdding = !newSet.has(id)
      
      if (isAdding) {
        newSet.add(id)
        toast({
          title: "Added to Watchlist",
          description: "This group is now being monitored.",
        })
      } else {
        newSet.delete(id)
        toast({
          title: "Removed from Watchlist",
          description: "This group is no longer being monitored.",
          variant: "destructive"
        })
      }
      
      return newSet
    })
  }

  // Build API params based on search and filter
  const communitiesParams = useMemo(() => {
    const params: any = { limit: 50 }
    if (searchQuery) params.search = searchQuery
    if (viewType === 'communities' || viewType === 'all') {
      switch (activeFilter) {
        case 'political': params.type = 'political'; break
        case 'social': params.type = 'social'; break
        case 'professional': params.type = 'professional'; break
        case 'high': params.activityLevel = 'high'; break
        case 'active': params.status = 'active'; break
        case 'facebook': params.platform = 'facebook'; break
        case 'reddit': params.platform = 'reddit'; break
      }
    }
    return params
  }, [searchQuery, activeFilter, viewType])

  const groupsParams = useMemo(() => {
    const params: any = { limit: 50 }
    if (searchQuery) params.search = searchQuery
    if (viewType === 'groups' || viewType === 'all') {
      switch (activeFilter) {
        case 'public': params.type = 'public'; break
        case 'private': params.type = 'private'; break
        case 'closed': params.type = 'closed'; break
        case 'large': params.minMembers = 10000; break
        case 'active': params.status = 'active'; break
        case 'facebook': params.platform = 'facebook'; break
        case 'telegram': params.platform = 'telegram'; break
      }
    }
    return params
  }, [searchQuery, activeFilter, viewType])

  const { data: communities, loading: communitiesLoading, error: communitiesError } = useCommunities(communitiesParams)
  const { data: groups, loading: groupsLoading, error: groupsError } = useGroups(groupsParams)

  // Use API data if available, otherwise use empty arrays
  const allCommunities = (communities && communities.length > 0 && !communitiesError) ? communities.map(c => ({ ...c, category: 'community' })) : []
  const allGroups = (groups && groups.length > 0 && !groupsError) ? groups : []

  // Combine all entities
  const allEntities: SocialEntity[] = useMemo(() => {
    if (viewType === 'communities') return allCommunities
    if (viewType === 'groups') return allGroups
    return [...allCommunities, ...allGroups]
  }, [allCommunities, allGroups, viewType])

  const filteredEntities = useMemo(() => {
    if (!allEntities || !Array.isArray(allEntities)) return []

    let filtered = [...allEntities]

    // Apply monitored filter
    if (activeFilter === 'monitored') {
      filtered = filtered.filter(e => monitoredIds.has(e.id))
    } else if (activeFilter !== 'all') {
      // Apply other filters (existing logic)
      // Filter by type, platform, etc.
    }

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
  }, [allEntities, sortBy, activeFilter, monitoredIds])

  const filterOptions = [
    { id: 'all', label: 'All', count: allEntities.length },
    { id: 'monitored', label: '👁️ Watchlist', count: allEntities.filter(e => monitoredIds.has(e.id)).length },
    { id: 'communities', label: 'Communities', count: allCommunities.length },
    { id: 'groups', label: 'Groups', count: allGroups.length },
    { id: 'political', label: 'Political', count: allEntities.filter(e => e.type === 'political').length },
    { id: 'social', label: 'Social', count: allEntities.filter(e => e.type === 'social').length },
    { id: 'professional', label: 'Professional', count: allEntities.filter(e => e.type === 'professional').length },
    { id: 'public', label: 'Public', count: allEntities.filter(e => e.type === 'public').length },
    { id: 'private', label: 'Private', count: allEntities.filter(e => e.type === 'private').length },
    { id: 'high', label: 'High Activity', count: allEntities.filter(e => 'activityLevel' in e && e.activityLevel === 'high').length },
    { id: 'active', label: 'Active', count: allEntities.filter(e => e.lastActive?.includes('hour')).length },
    { id: 'facebook', label: 'Facebook', count: allEntities.filter(e => e.platform === 'Facebook').length },
    { id: 'telegram', label: 'Telegram', count: allEntities.filter(e => e.platform === 'Telegram').length },
  ]

  const loading = communitiesLoading || groupsLoading
  const error = communitiesError || groupsError

  if (loading && !error) {
    return (
      <PageLayout>
        <PageHeader
          title="Communities & Groups"
          description="Manage and analyze social media communities and groups"
        />
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
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
          title="Communities & Groups"
          description="Manage and analyze social media communities and groups"
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

        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-200px)] flex flex-col">
          {/* View Type Toggle */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Button
                variant={viewType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('all')}
              >
                All ({allEntities.length})
              </Button>
              <Button
                variant={viewType === 'communities' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('communities')}
              >
                Communities ({allCommunities.length})
              </Button>
              <Button
                variant={viewType === 'groups' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewType('groups')}
              >
                Groups ({allGroups.length})
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities and groups..."
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

          {/* Content Area */}
          {filteredEntities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredEntities || []).map((entity, index) => (
                <SocialEntityCard 
                  key={`${entity.id}-${index}`} 
                  entity={entity} 
                  isMonitored={monitoredIds.has(entity.id)}
                  onToggleMonitor={toggleMonitor}
                />
              ))}
            </div>
          ) : !loading && (
            <div className="flex-1 flex items-center justify-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Users2 className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Communities or Groups Found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search criteria or filters to find more communities and groups.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  )
}
