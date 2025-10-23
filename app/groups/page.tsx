'use client'

import { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Building2, TrendingUp, TrendingDown, BarChart3, Download, Filter, Users, MessageSquare, Calendar, Users2, Shield, Globe, Eye, EyeOff, Check, AlertTriangle, MapPin, Phone, Mail, ExternalLink, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGroups } from '@/hooks/use-api'
import { useToast } from '@/hooks/use-toast'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { GroupsSidebar } from '@/components/groups/groups-sidebar'
import { GroupsGridSkeleton } from '@/components/skeletons/groups-grid-skeleton'

interface Group {
  id: string
  name: string
  type: 'religious' | 'political' | 'social' | 'other'
  members: number
  platforms: string[]
  primaryPlatform: string
  description?: string
  riskLevel: 'high' | 'medium' | 'low'
  category: string
  location?: string
  contactInfo?: {
    phone?: string
    email?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  influencers?: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'monitored'
  monitoringEnabled: boolean
}

function GroupsPageContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewType, setViewType] = useState<'all' | 'monitored' | 'suspicious'>('all')
  const [sortBy, setSortBy] = useState<'members' | 'risk' | 'name' | 'created'>('members')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  // Mock data based on CSV analysis - replace with actual API call
  const mockGroups: Group[] = [
    {
      id: 'group_1',
      name: 'ಕಠೋರ ಹಿಂದುತ್ವವಾದಿಗಳು ಹಿಂದೂ ಜಾಗೃತಿ ಸೇನೆ',
      type: 'religious',
      members: 3543,
      platforms: ['facebook', 'instagram'],
      primaryPlatform: 'facebook',
      description: 'Group focused on Hindu organizations activities',
      riskLevel: 'high',
      category: 'Hindu Organizations',
      location: 'Yalahanka',
      contactInfo: {
        phone: '1919381307652',
        email: 'rg065726@gmail.com'
      },
      socialMedia: {
        facebook: 'https://www.facebook.com/groups/481726962295310/?ref=share',
        instagram: 'https://www.instagram.com/hindhu_jagruthii_sene/'
      },
      influencers: 'Shivbhagath Bhagathsingh, ಕೆಂಪೇಗೌಡ ಒಕ್ಕಲಿಗರ ಮೀಸಲಾತಿ ಹೋರಾಟ ಸಮಿತಿ(Admin), Vinaygowda',
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-10-23T14:58:21.051Z',
      status: 'active',
      monitoringEnabled: true
    },
    {
      id: 'group_2',
      name: 'ಅಖಿಲಾ ಕರ್ನಾಟಕ ಹಿಂದೂ ಸಾಮ್ರಾಟ್ ಶಿವಾಜಿ ಸೇನಾ',
      type: 'religious',
      members: 100,
      platforms: ['facebook'],
      primaryPlatform: 'facebook',
      description: 'Group focused on Hindu organizations activities',
      riskLevel: 'medium',
      category: 'Hindu Organizations',
      location: 'Yadagiri',
      contactInfo: {
        phone: '9449477555'
      },
      socialMedia: {
        facebook: 'https://www.facebook.com/groups/503501497182282/members'
      },
      influencers: 'Parashuram Segurkar (Admin1), Ambaresh Hindu (Admin2)',
      createdAt: '2024-02-10T00:00:00.000Z',
      updatedAt: '2024-10-23T14:58:21.051Z',
      status: 'active',
      monitoringEnabled: false
    },
    {
      id: 'group_3',
      name: 'ಬಲಿಷ್ಠ ಹಿಂದೂರಾಷ್ಟ್ರ',
      type: 'religious',
      members: 19905,
      platforms: ['facebook'],
      primaryPlatform: 'facebook',
      description: 'Group focused on Hindu organizations activities',
      riskLevel: 'low',
      category: 'Hindu Organizations',
      location: 'Bengaluru',
      socialMedia: {
        facebook: 'https://www.facebook.com/groups/126680487914954/members'
      },
      influencers: 'Sharath Chandra',
      createdAt: '2024-03-05T00:00:00.000Z',
      updatedAt: '2024-10-23T14:58:21.051Z',
      status: 'active',
      monitoringEnabled: true
    }
  ]

  // Build API params based on search and filter
  const groupsParams = useMemo(() => {
    const params: any = { limit: 50 }
    if (searchQuery) params.search = searchQuery
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'religious': params.type = 'religious'; break
        case 'political': params.type = 'political'; break
        case 'social': params.type = 'social'; break
        case 'high-risk': params.riskLevel = 'high'; break
        case 'medium-risk': params.riskLevel = 'medium'; break
        case 'low-risk': params.riskLevel = 'low'; break
        case 'monitored': params.monitoringEnabled = true; break
        case 'facebook': params.platform = 'facebook'; break
        case 'instagram': params.platform = 'instagram'; break
        case 'twitter': params.platform = 'twitter'; break
        case 'youtube': params.platform = 'youtube'; break
      }
    }
    return params
  }, [searchQuery, activeFilter])

  // Use mock data for now - replace with actual API call
  const { data: groups, loading: groupsLoading, error: groupsError } = useGroups(groupsParams)
  
  // Use mock data if API fails
  const allGroups = groups && groups.length > 0 && !groupsError ? groups : mockGroups

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let filtered = allGroups.filter(group => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          group.name.toLowerCase().includes(query) ||
          group.description?.toLowerCase().includes(query) ||
          group.category.toLowerCase().includes(query) ||
          group.location?.toLowerCase().includes(query)
        )
      }
      return true
    })

    // Apply view type filters
    if (viewType === 'monitored') {
      filtered = filtered.filter(group => group.monitoringEnabled)
    } else if (viewType === 'suspicious') {
      filtered = filtered.filter(group => group.riskLevel === 'high' || group.riskLevel === 'medium')
    }

    // Sort groups
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'members':
          aValue = a.members
          bValue = b.members
          break
        case 'risk':
          const riskOrder = { high: 3, medium: 2, low: 1 }
          aValue = riskOrder[a.riskLevel]
          bValue = riskOrder[b.riskLevel]
          break
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'created':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        default:
          aValue = a.members
          bValue = b.members
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [allGroups, searchQuery, viewType, sortBy, sortOrder])

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const toggleMonitor = (groupId: string) => {
    // Toggle monitoring status
    toast({
      title: "Monitoring Updated",
      description: "Group monitoring status has been updated.",
    })
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘'
      case 'twitter': return '🐦'
      case 'instagram': return '📷'
      case 'youtube': return '📺'
      default: return '🌐'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'religious': return 'bg-purple-100 text-purple-800'
      case 'political': return 'bg-blue-100 text-blue-800'
      case 'social': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <PageLayout>
      <div className="h-screen flex bg-background overflow-hidden">
        <GroupsSidebar
          onFilterChange={setActiveFilter}
          activeFilter={activeFilter}
          onViewTypeChange={setViewType}
          viewType={viewType}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <PageHeader
            title="Groups Monitoring"
            description="Monitor suspicious groups and communities"
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            }
          />

          <div className="flex-1 overflow-y-auto p-6">
            {/* Search and Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groups by name, category, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="members">Members</SelectItem>
                        <SelectItem value="risk">Risk Level</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="created">Created Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3"
                  >
                    {sortOrder === 'asc' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Groups</p>
                        <p className="text-2xl font-bold">{allGroups.length}</p>
                        {filteredGroups.length !== allGroups.length && (
                          <p className="text-xs text-muted-foreground">
                            {filteredGroups.length} filtered
                          </p>
                        )}
                      </div>
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                        <p className="text-2xl font-bold text-red-600">
                          {allGroups.filter(g => g.riskLevel === 'high').length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((allGroups.filter(g => g.riskLevel === 'high').length / allGroups.length) * 100)}% of total
                        </p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monitored</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {allGroups.filter(g => g.monitoringEnabled).length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((allGroups.filter(g => g.monitoringEnabled).length / allGroups.length) * 100)}% of total
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                        <p className="text-2xl font-bold">
                          {allGroups.reduce((sum, g) => sum + g.members, 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg: {Math.round(allGroups.reduce((sum, g) => sum + g.members, 0) / allGroups.length).toLocaleString()}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Groups Grid */}
            {groupsLoading ? (
              <GroupsGridSkeleton />
            ) : groupsError ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Error Loading Groups</EmptyTitle>
                  <EmptyDescription>
                    {groupsError}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(group.riskLevel)}`} />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold truncate">
                              {group.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={getTypeColor(group.type)}>
                                {group.type}
                              </Badge>
                              <Badge variant="outline">
                                {group.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleGroupSelection(group.id)}
                          >
                            {selectedGroups.includes(group.id) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMonitor(group.id)}
                          >
                            {group.monitoringEnabled ? (
                              <Eye className="w-4 h-4 text-blue-500" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Group Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{group.members.toLocaleString()} members</span>
                        </div>
                        {group.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{group.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="w-4 h-4" />
                          <span className="capitalize">{group.riskLevel} risk</span>
                        </div>
                      </div>

                      {/* Platforms */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Platforms:</span>
                        <div className="flex gap-1">
                          {group.platforms.map(platform => (
                            <span key={platform} className="text-lg" title={platform}>
                              {getPlatformIcon(platform)}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Social Media Links */}
                      {group.socialMedia && (
                        <div className="flex items-center gap-2">
                          {group.socialMedia.facebook && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={group.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Facebook
                              </a>
                            </Button>
                          )}
                          {group.socialMedia.instagram && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={group.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Instagram
                              </a>
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Contact Info */}
                      {group.contactInfo && (group.contactInfo.phone || group.contactInfo.email) && (
                        <div className="space-y-1">
                          {group.contactInfo.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{group.contactInfo.phone}</span>
                            </div>
                          )}
                          {group.contactInfo.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{group.contactInfo.email}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Influencers */}
                      {group.influencers && (
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Key Influencers:</span>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {group.influencers}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No Groups Found</EmptyTitle>
                  <EmptyDescription>
                    No groups match your current filters. Try adjusting your search criteria.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default function GroupsPage() {
  return <GroupsPageContent />
}
