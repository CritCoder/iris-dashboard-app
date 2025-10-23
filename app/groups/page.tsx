'use client'

import { useState, useMemo, useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, Building2, TrendingUp, TrendingDown, BarChart3, Download, Filter, Users, MessageSquare, Calendar, Users2, Shield, Globe, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGroups } from '@/hooks/use-api'
import { useToast } from '@/hooks/use-toast'
import { GroupsSidebar } from '@/components/groups/groups-sidebar'
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
  type: string
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
  sheet: string
  isFacebookOnly?: boolean
}

function GroupCard({
  group,
  onToggleMonitor
}: {
  group: Group
  onToggleMonitor: (id: string, currentStatus: boolean) => void
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'religious':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'political':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'social':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'professional':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cultural':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="w-3 h-3" />
      case 'medium':
        return <Shield className="w-3 h-3" />
      default:
        return <Check className="w-3 h-3" />
    }
  }

  const getInitials = (name: string) => {
    const words = name.split(' ')
    if (words.length >= 2) {
      return words[0][0] + words[1][0]
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/20 hover:border-l-primary/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(group.name)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base line-clamp-1">{group.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={`${getTypeColor(group.type)} text-xs`}>
                  {group.type}
                </Badge>
                <Badge variant="outline" className={`${getRiskLevelColor(group.riskLevel)} text-xs flex items-center gap-1`}>
                  {getRiskLevelIcon(group.riskLevel)}
                  {group.riskLevel} risk
                </Badge>
                {group.isFacebookOnly && (
                  <Badge variant="outline" className="text-xs">
                    FB Only
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant={group.monitoringEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleMonitor(group.id, group.monitoringEnabled)}
            className="flex items-center gap-1"
          >
            {group.monitoringEnabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {group.monitoringEnabled ? 'Monitoring' : 'Monitor'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {group.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{group.members.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">members</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {group.platforms.length > 0 ? group.platforms.join(', ') : 'No platforms'}
            </span>
          </div>
        </div>

        {(group.location || group.sheet) && (
          <div className="pt-3 border-t space-y-1">
            {group.sheet && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sheet:</span>
                <span className="font-medium text-xs">{group.sheet}</span>
              </div>
            )}
            {group.location && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-xs">{group.location}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function GroupsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [viewType, setViewType] = useState<'all' | 'monitored' | 'suspicious'>('all')
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)
  const { toast } = useToast()

  // Build params for API call
  const apiParams = useMemo(() => {
    const params: any = {
      page: 1,
      limit: 50
    }

    if (searchTerm) params.search = searchTerm

    // Handle sheet selection
    if (selectedSheet) {
      params.sheet = selectedSheet
    }

    // Handle view type
    if (viewType === 'monitored') {
      params.monitoringEnabled = true
    } else if (viewType === 'suspicious') {
      params.riskLevel = 'high'
    }

    // Handle other filters
    if (selectedType) params.type = selectedType
    if (selectedPlatform) params.platform = selectedPlatform
    if (selectedRiskLevel) params.riskLevel = selectedRiskLevel

    // Handle active filter from sidebar
    if (activeFilter && activeFilter !== 'all') {
      // Type filters
      if (['religious', 'political', 'social', 'professional', 'cultural', 'other'].includes(activeFilter)) {
        params.type = activeFilter
      }
      // Risk level filters
      if (activeFilter === 'high-risk') params.riskLevel = 'high'
      if (activeFilter === 'medium-risk') params.riskLevel = 'medium'
      if (activeFilter === 'low-risk') params.riskLevel = 'low'
      // Platform filters
      if (['facebook', 'twitter', 'instagram', 'youtube'].includes(activeFilter)) {
        params.platform = activeFilter
      }
    }

    return params
  }, [searchTerm, selectedType, selectedPlatform, selectedRiskLevel, selectedSheet, viewType, activeFilter])

  const {
    data: groups = [],
    loading,
    error,
    pagination,
    stats
  } = useGroups(apiParams)

  const handleToggleMonitor = async (groupId: string, currentStatus: boolean) => {
    try {
      // In a real app, this would call an API to update the monitoring status
      const response = await fetch(`/api/groups`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: groupId,
          monitoringEnabled: !currentStatus
        })
      })

      if (response.ok) {
        toast({
          title: currentStatus ? "Monitoring stopped" : "Monitoring started",
          description: currentStatus
            ? "Group is no longer being monitored."
            : "Group is now being monitored for activity.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update monitoring status.",
        variant: "destructive"
      })
    }
  }

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)

    // Check if it's a sheet filter
    const sheetFilters = [
      'right-hindu-groups', 'right-hindu-persons', 'right-wing-muslim-groups',
      'human-rights', 'all-farmers-org-karnataka', 'trade-unions', 'rrp',
      'students-org', 'christians-activist', 'kannadda', 'woman',
      'mixed', 'mixed-2', 'political'
    ]

    if (sheetFilters.includes(filter)) {
      const sheetMap: { [key: string]: string } = {
        'right-hindu-groups': 'Right Hindu Groups',
        'right-hindu-persons': 'Right Hindu Persons',
        'right-wing-muslim-groups': 'Right Wing Muslim Groups',
        'human-rights': 'Human Rights',
        'all-farmers-org-karnataka': 'ALL Farmers ORG Karnataka',
        'trade-unions': 'Trade Unions',
        'rrp': 'RRP',
        'students-org': 'Students ORG',
        'christians-activist': 'Christians Activist',
        'kannadda': 'Kannadda ',
        'woman': 'Woman',
        'mixed': 'Mixed',
        'mixed-2': 'Mixed 2',
        'political': 'Political'
      }
      setSelectedSheet(sheetMap[filter])
    } else {
      setSelectedSheet(null)
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="flex h-full">
          <GroupsSidebar
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            onViewTypeChange={setViewType}
            viewType={viewType}
          />
          <div className="flex-1 flex flex-col">
            <PageHeader
              title="Groups"
              description="Monitor and analyze social groups and communities"
            />
            <div className="flex-1 p-6">
              <div className="animate-pulse space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="h-10 bg-gray-100 rounded-md flex-1"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-100 rounded-md w-32"></div>
                    <div className="h-10 bg-gray-100 rounded-md w-32"></div>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-4">
                      <div className="h-20 bg-gray-100 rounded"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex h-full">
        <GroupsSidebar
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          onViewTypeChange={setViewType}
          viewType={viewType}
        />
        <div className="flex-1 flex flex-col">
          <PageHeader
            title="Groups"
            description="Monitor and analyze social groups and communities"
          />
          <div className="flex-1 p-6 overflow-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full">
              <div className="relative flex-1 max-w-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <select
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="">All Types</option>
                  <option value="religious">Religious</option>
                  <option value="political">Political</option>
                  <option value="social">Social</option>
                  <option value="professional">Professional</option>
                  <option value="cultural">Cultural</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={selectedRiskLevel || ''}
                  onChange={(e) => setSelectedRiskLevel(e.target.value || null)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>

                <select
                  value={selectedPlatform || ''}
                  onChange={(e) => setSelectedPlatform(e.target.value || null)}
                  className="px-3 py-2 border rounded-md text-sm bg-background"
                >
                  <option value="">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {error ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Building2 className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Error Loading Groups</EmptyTitle>
                  <EmptyDescription>{error}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : groups.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4 w-full">
                  <p className="text-sm text-muted-foreground">
                    {pagination?.total || groups.length} group{(pagination?.total || groups.length) !== 1 ? 's' : ''} found
                    {selectedSheet && ` in ${selectedSheet}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {groups.map((group: Group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onToggleMonitor={handleToggleMonitor}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Building2 className="w-12 h-12 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>No Groups Found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search criteria or filters.
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