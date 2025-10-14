'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, Hash, User, Building, AlertTriangle, TrendingUp, MessageSquare, Share2, ChevronRight, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEntities, useEntityAnalytics } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'

interface Entity {
  id: string
  name: string
  type: 'TOPIC' | 'LOCATION' | 'ENTITY' | 'PERSON' | 'ORGANIZATION'
  mentions?: number
  lastSeen?: string
  icon: React.ElementType
}


function EntityCard({ entity, onClick }: { entity: Entity; onClick: () => void }) {
  const Icon = entity.icon
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TOPIC':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'LOCATION':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'ENTITY':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'PERSON':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'ORGANIZATION':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-muted-foreground bg-secondary border-border'
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/50 transition-colors cursor-pointer hover:bg-accent/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{entity.name}</h3>
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(entity.type)}`}>
            {entity.type}
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
          Click to explore posts
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {(entity.mentions || 0).toLocaleString()} mentions
        </div>
        <div className="text-sm text-muted-foreground">
          Click to view →
        </div>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
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
  count
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
        {hasSubmenu && <ChevronRight className="w-4 h-4" />}
      </div>
    </button>
  )
}

export default function EntitiesPage() {
  const router = useRouter()
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all-entities')

  const handleEntityClick = (entity: Entity) => {
    // Convert entity name to URL-friendly format
    const entitySlug = entity.name.toLowerCase().replace(/\s+/g, '-')

    // Navigate based on entity type
    switch (entity.type) {
      case 'LOCATION':
        router.push(`/locations/${entitySlug}`)
        break
      case 'PERSON':
        // Navigate to profiles or person detail page
        router.push(`/profiles?search=${encodeURIComponent(entity.name)}`)
        break
      case 'ORGANIZATION':
        // Navigate to organizations page with search
        router.push(`/organizations?search=${encodeURIComponent(entity.name)}`)
        break
      case 'TOPIC':
        // Navigate to social feed with topic filter
        router.push(`/social-feed?search=${encodeURIComponent(entity.name)}`)
        break
      default:
        // Default: search in social feed
        router.push(`/social-feed?search=${encodeURIComponent(entity.name)}`)
        break
    }
  }

  // Build API params based on search and filter
  const apiParams = useMemo(() => {
    const params: any = {
      limit: 50,
      timeRange: '7d', // Default to 7 days
    }

    if (searchQuery) {
      params.q = searchQuery
    }

    // Apply filter-based params
    switch (activeFilter) {
      case 'topics':
        params.type = 'TOPIC'
        break
      case 'people':
        params.type = 'PERSON'
        break
      case 'organizations':
        params.type = 'ORGANIZATION'
        break
      case 'locations':
        params.type = 'LOCATION'
        break
      case 'high-impact':
        params.category = 'high_impact'
        break
      case 'trending':
        params.category = 'trending'
        break
    }

    return params
  }, [searchQuery, activeFilter])

  const { data: apiEntities, loading, error } = useEntities(apiParams)

  const filteredEntities = useMemo(() => {
    // Use API data only and map to add icons
    const entities = (apiEntities || []).map(entity => ({
      ...entity,
      icon: entity.type === 'TOPIC' ? Hash :
            entity.type === 'LOCATION' ? MapPin :
            entity.type === 'PERSON' ? User :
            entity.type === 'ORGANIZATION' ? Building :
            Hash
    }))

    // Apply client-side filtering based on activeFilter
    let filtered = entities

    // Apply filter-based filtering
    switch (activeFilter) {
      case 'topics':
        filtered = filtered.filter(e => e.type === 'TOPIC')
        break
      case 'people':
        filtered = filtered.filter(e => e.type === 'PERSON')
        break
      case 'organizations':
        filtered = filtered.filter(e => e.type === 'ORGANIZATION')
        break
      case 'locations':
        filtered = filtered.filter(e => e.type === 'LOCATION')
        break
      case 'high-impact':
        filtered = filtered.filter(e => (e.mentions || 0) > 1000)
        break
      case 'trending':
        filtered = filtered.filter(e => e.lastSeen && (e.lastSeen.includes('hour') || e.lastSeen.includes('minute')))
        break
      case 'frequent':
        filtered = filtered.filter(e => (e.mentions || 0) > 500)
        break
      case 'negative':
        // TODO: Add sentiment filtering when available
        filtered = []
        break
      case 'positive':
        // TODO: Add sentiment filtering when available
        filtered = []
        break
      case 'controversial':
        // TODO: Add sentiment filtering when available
        filtered = []
        break
    }

    // Apply search query filtering
    if (searchQuery) {
      filtered = filtered.filter(entity =>
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entity.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [apiEntities, searchQuery, activeFilter])

  // Show loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading entities...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  const entitiesForCounts = (apiEntities || []).map(entity => ({
    ...entity,
    icon: entity.type === 'TOPIC' ? Hash :
          entity.type === 'LOCATION' ? MapPin :
          entity.type === 'PERSON' ? User :
          entity.type === 'ORGANIZATION' ? Building :
          Hash
  }))

  const filterOptions = [
    { id: 'all-entities', label: 'All Entities', count: entitiesForCounts.length },
    { id: 'topics', label: 'All Topics', count: entitiesForCounts.filter(e => e.type === 'TOPIC').length },
    { id: 'people', label: 'All People', count: entitiesForCounts.filter(e => e.type === 'PERSON').length },
    { id: 'organizations', label: 'All Organizations', count: entitiesForCounts.filter(e => e.type === 'ORGANIZATION').length },
    { id: 'high-impact', label: 'High Impact Entities', count: entitiesForCounts.filter(e => (e.mentions || 0) > 1000).length },
    { id: 'trending', label: 'Trending Topics', count: entitiesForCounts.filter(e => e.lastSeen && (e.lastSeen.includes('hour') || e.lastSeen.includes('minute'))).length },
    { id: 'frequently-mentioned', label: 'Frequently Mentioned', count: entitiesForCounts.filter(e => (e.mentions || 0) > 500).length },
    { id: 'negative', label: 'Negative Entities', count: 0 },
    { id: 'positive', label: 'Positive Entities', count: 0 },
    { id: 'controversial', label: 'Controversial', count: 0 },
    { id: 'locations', label: 'Locations', count: entitiesForCounts.filter(e => e.type === 'LOCATION').length },
    { id: 'threats', label: 'Threats', count: 0 },
    { id: 'keywords', label: 'Keywords', count: 0 }
  ]

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Entities"
          description="Entity intelligence and relationship insights"
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="hidden xl:block xl:w-80 2xl:w-96 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Entities</h2>
              
              <FilterSection title="PRIMARY">
                <FilterItem 
                  label="All Entities" 
                  isActive={activeFilter === 'all-entities'}
                  onClick={() => setActiveFilter('all-entities')}
                  count={entitiesForCounts.length}
                />
                <FilterItem 
                  label="High Impact Entities"
                  onClick={() => setActiveFilter('high-impact')}
                  count={entitiesForCounts.filter(e => (e.mentions || 0) > 1000).length}
                />
                <FilterItem 
                  label="Trending Topics"
                  onClick={() => setActiveFilter('trending')}
                  count={entitiesForCounts.filter(e => e.lastSeen === 'Just now').length}
                />
                <FilterItem 
                  label="Frequently Mentioned"
                  onClick={() => setActiveFilter('frequent')}
                  count={entitiesForCounts.filter(e => (e.mentions || 0) > 500).length}
                />
              </FilterSection>

              <FilterSection title="ENTITY TYPES">
                <FilterItem 
                  label="All Topics"
                  onClick={() => setActiveFilter('topics')}
                  count={entitiesForCounts.filter(e => e.type === 'TOPIC').length}
                />
                <FilterItem 
                  label="All People"
                  onClick={() => setActiveFilter('people')}
                  count={entitiesForCounts.filter(e => e.type === 'PERSON').length}
                />
                <FilterItem 
                  label="All Organizations"
                  onClick={() => setActiveFilter('organizations')}
                  count={entitiesForCounts.filter(e => e.type === 'ORGANIZATION').length}
                />
                <FilterItem 
                  label="Locations"
                  onClick={() => setActiveFilter('locations')}
                  count={entitiesForCounts.filter(e => e.type === 'LOCATION').length}
                />
              </FilterSection>

              <FilterSection title="SENTIMENT BASED">
                <FilterItem 
                  label="Negative Entities"
                  onClick={() => setActiveFilter('negative')}
                  count={0}
                />
                <FilterItem 
                  label="Positive Entities"
                  onClick={() => setActiveFilter('positive')}
                  count={0}
                />
                <FilterItem 
                  label="Controversial"
                  onClick={() => setActiveFilter('controversial')}
                  count={0}
                />
              </FilterSection>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-2">
                    All Entities
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search entities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-sm text-muted-foreground">
                    {filteredEntities.length} found
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
              {filteredEntities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Hash className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No entities found</h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchQuery 
                      ? `No entities match "${searchQuery}". Try adjusting your search or filters.`
                      : 'No entities available at the moment. Check back later.'}
                  </p>
                </div>
              ) : (
                <AnimatedGrid stagger={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                  {filteredEntities.map((entity) => (
                    <AnimatedCard key={entity.id}>
                      <EntityCard
                        entity={entity}
                        onClick={() => handleEntityClick(entity)}
                      />
                    </AnimatedCard>
                  ))}
                </AnimatedGrid>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}