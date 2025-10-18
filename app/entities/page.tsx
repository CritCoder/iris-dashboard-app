'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, Hash, User, Building, AlertTriangle, TrendingUp, MessageSquare, ChevronRight, Clock, BarChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEntities, useEntityAnalytics } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'
import { EntityDetailView } from '@/components/entities/entity-detail-view'

interface Entity {
  id: string
  name: string
  type: 'TOPIC' | 'LOCATION' | 'ENTITY' | 'PERSON' | 'ORGANIZATION' | 'THREAT' | 'KEYWORD'
  category?: string
  totalMentions?: number
  lastSeen?: string
  sentiment?: string
  description?: string
  riskLevel?: string
  icon: React.ElementType
}


function EntityCard({ entity, onClick }: { entity: Entity; onClick: () => void }) {
  const Icon = entity.icon
  
  const getCategoryIcon = (category?: string) => {
    if (!category) return null
    switch (category) {
      case 'POLITICAL_PARTY':
        return User
      case 'POLITICIAN':
        return User
      case 'NEWS_OUTLET':
        return MessageSquare
      case 'GOVERNMENT_AGENCY':
        return Building
      default:
        return null
    }
  }

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths}m ago`
  }

  const CategoryIcon = getCategoryIcon(entity.category)

  return (
    <div 
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      {/* Header with Icons */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-cyan-400" />
          {CategoryIcon && (
            <CategoryIcon className="h-4 w-4 text-blue-400" />
          )}
        </div>
      </div>

      {/* Entity Name */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {entity.name}
      </h3>

      {/* Entity Type and Category */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="px-2 py-1 bg-gray-700/50 text-xs font-medium text-gray-300 rounded">
          {entity.type}
        </span>
        {entity.category && (
          <span className="px-2 py-1 bg-blue-900/30 text-xs font-medium text-blue-300 rounded">
            {entity.category.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-400">
            <BarChart className="h-4 w-4" />
            <span>Mentions</span>
          </div>
          <span className="font-semibold text-white">{(entity.totalMentions || 0).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Last Seen</span>
          </div>
          <span className="text-gray-300">{formatTimeAgo(entity.lastSeen)}</span>
        </div>
      </div>

      {/* Description */}
      {entity.description && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-sm text-gray-400 line-clamp-2">
            {entity.description}
          </p>
        </div>
      )}

      {/* Risk Level */}
      {entity.riskLevel && entity.riskLevel !== 'LOW' && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className={`text-xs font-medium ${
              entity.riskLevel === 'HIGH' ? 'text-red-400' :
              entity.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
              'text-orange-400'
            }`}>
              {entity.riskLevel} Risk
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
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
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-white text-black' 
            : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
        }`}
      >
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {count !== undefined && <span className={`text-xs ${isActive ? 'text-gray-600' : 'text-gray-500'}`}>{count}</span>}
          {hasSubmenu && <ChevronRight className={`w-4 h-4 ${isOpen ? 'rotate-90' : ''}`} />}
        </div>
      </button>

      {hasSubmenu && isOpen && submenuItems && (
        <div className="ml-4 mt-1 space-y-1">
          {submenuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelect ? onSelect(item.value) : onClick && onClick()}
              className="w-full flex items-start px-3 py-1.5 rounded-md text-xs transition-colors text-gray-300 hover:text-white hover:bg-gray-800/60"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EntitiesPage() {
  const router = useRouter()
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all-entities')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const handleEntityClick = (entity: Entity) => {
    // Show entity detail view with related posts
    setSelectedEntity(entity)
  }

  const handleBackToGrid = () => {
    setSelectedEntity(null)
  }

  // Build API params based on search and filter
  const apiParams = useMemo(() => {
    const params: any = {}

    if (searchQuery) params.q = searchQuery
    if (activeFilters.query) params.q = activeFilters.query

    // Merge all active API filters
    Object.keys(activeFilters).forEach(key => {
      const value = activeFilters[key]
      if (value !== undefined && value !== '') params[key] = value
    })

    // Ensure correct types for numeric filters
    if (params.minMentions && typeof params.minMentions === 'string') {
      const n = Number(params.minMentions)
      if (!Number.isNaN(n)) params.minMentions = n
    }

    return params
  }, [searchQuery, activeFilters])

  const { data: apiEntities, loading, error } = useEntities(apiParams)

  const filteredEntities = useMemo(() => {
    // Use API data only and map to add icons
    const entities = (apiEntities || []).map((entity: any) => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      category: entity.category,
      totalMentions: entity.totalMentions ?? entity.mentions ?? 0,
      lastSeen: entity.lastSeen,
      sentiment: entity.sentiment,
      description: entity.description,
      riskLevel: entity.riskLevel,
      icon: entity.type === 'TOPIC' ? Hash :
            entity.type === 'LOCATION' ? MapPin :
            entity.type === 'PERSON' ? User :
            entity.type === 'ORGANIZATION' ? Building :
            entity.type === 'THREAT' ? AlertTriangle :
            entity.type === 'KEYWORD' ? Hash :
            Hash
    } as Entity))

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
      case 'threats':
        filtered = filtered.filter(e => e.type === 'THREAT')
        break
      case 'keywords':
        filtered = filtered.filter(e => e.type === 'KEYWORD')
        break
      case 'high-impact':
        filtered = filtered.filter(e => (e.totalMentions || 0) > 100)
        break
      case 'trending':
        filtered = filtered.filter(e => e.lastSeen && (e.lastSeen.includes('hour') || e.lastSeen.includes('minute')))
        break
      case 'frequently-mentioned':
        filtered = filtered.filter(e => (e.totalMentions || 0) > 50)
        break
      case 'political-parties':
        filtered = filtered.filter(e => e.category === 'POLITICAL_PARTY')
        break
      case 'politicians':
        filtered = filtered.filter(e => e.category === 'POLITICIAN')
        break
      case 'news-outlets':
        filtered = filtered.filter(e => e.category === 'NEWS_OUTLET')
        break
      case 'government-agencies':
        filtered = filtered.filter(e => e.category === 'GOVERNMENT_AGENCY')
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

  const entitiesForCounts = (apiEntities || []).map((entity: any) => ({
    id: entity.id,
    name: entity.name,
    type: entity.type,
    category: entity.category,
    totalMentions: entity.totalMentions ?? entity.mentions ?? 0,
    lastSeen: entity.lastSeen,
    sentiment: entity.sentiment,
    description: entity.description,
    riskLevel: entity.riskLevel,
    icon: entity.type === 'TOPIC' ? Hash :
          entity.type === 'LOCATION' ? MapPin :
          entity.type === 'PERSON' ? User :
          entity.type === 'ORGANIZATION' ? Building :
          entity.type === 'THREAT' ? AlertTriangle :
          entity.type === 'KEYWORD' ? Hash :
          Hash
  } as Entity))

  const filterOptions = [
    { id: 'all-entities', label: 'All Entities', count: entitiesForCounts.length },
    { id: 'topics', label: 'All Topics', count: entitiesForCounts.filter(e => e.type === 'TOPIC').length },
    { id: 'people', label: 'All People', count: entitiesForCounts.filter(e => e.type === 'PERSON').length },
    { id: 'organizations', label: 'All Organizations', count: entitiesForCounts.filter(e => e.type === 'ORGANIZATION').length },
    { id: 'high-impact', label: 'High Impact Entities', count: entitiesForCounts.filter(e => (e.totalMentions || 0) > 100).length },
    { id: 'trending', label: 'Trending Topics', count: entitiesForCounts.filter(e => e.lastSeen && e.lastSeen.includes('hour')).length },
    { id: 'frequently-mentioned', label: 'Frequently Mentioned', count: entitiesForCounts.filter(e => (e.totalMentions || 0) > 50).length },
    { id: 'locations', label: 'Locations', count: entitiesForCounts.filter(e => e.type === 'LOCATION').length },
    { id: 'threats', label: 'Threats', count: entitiesForCounts.filter(e => e.type === 'THREAT').length },
    { id: 'keywords', label: 'Keywords', count: entitiesForCounts.filter(e => e.type === 'KEYWORD').length }
  ]

  // Show entity detail view if an entity is selected
  if (selectedEntity) {
    return (
      <PageLayout>
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          <EntityDetailView entity={selectedEntity} onBack={handleBackToGrid} />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Entities"
          description="Entity intelligence and relationship insights"
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="hidden md:block md:w-72 lg:w-80 2xl:w-96 border-r border-border bg-card/30 backdrop-blur-xl sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Entities</h2>
              
              <FilterSection title="PRIMARY">
                <FilterItem 
                  label="All Entities" 
                  isActive={activeFilter === 'all-entities'}
                  onClick={() => { setActiveFilter('all-entities'); setActiveFilters({}) }}
                />
                <FilterItem 
                  label="High Impact Entities"
                  onClick={() => { setActiveFilter('high-impact'); setActiveFilters({ minMentions: '100' }) }}
                />
                <FilterItem 
                  label="Trending Topics"
                  onClick={() => { setActiveFilter('trending'); setActiveFilters({ type: 'TOPIC', timeRange: '24h' }) }}
                />
                <FilterItem 
                  label="Frequently Mentioned"
                  onClick={() => { setActiveFilter('frequently-mentioned'); setActiveFilters({ sortBy: 'totalMentions', order: 'desc' }) }}
                />
              </FilterSection>

              <FilterSection title="ENTITY TYPES">
                <FilterItem 
                  label="Topics"
                  onClick={() => { setActiveFilter('topics'); setActiveFilters({ type: 'TOPIC' }) }}
                />
                <FilterItem 
                  label="People"
                  onClick={() => { setActiveFilter('people'); setActiveFilters({ type: 'PERSON' }) }}
                />
                <FilterItem 
                  label="Organizations"
                  onClick={() => { setActiveFilter('organizations'); setActiveFilters({ type: 'ORGANIZATION' }) }}
                />
                <FilterItem 
                  label="Locations"
                  onClick={() => { setActiveFilter('locations'); setActiveFilters({ type: 'LOCATION' }) }}
                />
                <FilterItem 
                  label="Threats"
                  onClick={() => { setActiveFilter('threats'); setActiveFilters({ type: 'THREAT' }) }}
                />
                <FilterItem 
                  label="Keywords"
                  onClick={() => { setActiveFilter('keywords'); setActiveFilters({ type: 'KEYWORD' }) }}
                />
              </FilterSection>

              <FilterSection title="CATEGORIES">
                <FilterItem 
                  label="Political Parties"
                  onClick={() => { setActiveFilter('political-parties'); setActiveFilters({ category: 'POLITICAL_PARTY' }) }}
                />
                <FilterItem 
                  label="Politicians"
                  onClick={() => { setActiveFilter('politicians'); setActiveFilters({ category: 'POLITICIAN' }) }}
                />
                <FilterItem 
                  label="News Outlets"
                  onClick={() => { setActiveFilter('news-outlets'); setActiveFilters({ category: 'NEWS_OUTLET' }) }}
                />
                <FilterItem 
                  label="Government Agencies"
                  onClick={() => { setActiveFilter('government-agencies'); setActiveFilters({ category: 'GOVERNMENT_AGENCY' }) }}
                />
              </FilterSection>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-700/50 bg-gray-900/50">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search entities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  {/* Mobile Filters */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="xl:hidden">Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[85%] max-w-sm">
                      <div className="p-4 sm:p-6 overflow-y-auto h-full">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                          <h2 className="text-lg font-semibold text-foreground mb-6">Entities</h2>
                          {/* Reuse same filter sections */}
                          <FilterSection title="PRIMARY">
                            <FilterItem 
                              label="All Entities" 
                              isActive={activeFilter === 'all-entities'}
                              onClick={() => { setActiveFilter('all-entities'); setActiveFilters({}) }}
                            />
                            <FilterItem 
                              label="High Impact Entities"
                              onClick={() => { setActiveFilter('high-impact'); setActiveFilters({ minMentions: 100 as any }) }}
                            />
                            <FilterItem 
                              label="Trending Topics"
                              onClick={() => { setActiveFilter('trending'); setActiveFilters({ type: 'TOPIC', timeRange: '24h' }) }}
                            />
                            <FilterItem 
                              label="Frequently Mentioned"
                              onClick={() => { setActiveFilter('frequently-mentioned'); setActiveFilters({ sortBy: 'totalMentions', order: 'desc' }) }}
                            />
                          </FilterSection>

                          <FilterSection title="ENTITY TYPES">
                            <FilterItem label="Topics" onClick={() => { setActiveFilter('topics'); setActiveFilters({ type: 'TOPIC' }) }} />
                            <FilterItem label="People" onClick={() => { setActiveFilter('people'); setActiveFilters({ type: 'PERSON' }) }} />
                            <FilterItem label="Organizations" onClick={() => { setActiveFilter('organizations'); setActiveFilters({ type: 'ORGANIZATION' }) }} />
                            <FilterItem label="Locations" onClick={() => { setActiveFilter('locations'); setActiveFilters({ type: 'LOCATION' }) }} />
                            <FilterItem label="Threats" onClick={() => { setActiveFilter('threats'); setActiveFilters({ type: 'THREAT' }) }} />
                            <FilterItem label="Keywords" onClick={() => { setActiveFilter('keywords'); setActiveFilters({ type: 'KEYWORD' }) }} />
                          </FilterSection>

                          <FilterSection title="CATEGORIES">
                            <FilterItem label="Political Parties" onClick={() => { setActiveFilter('political-parties'); setActiveFilters({ category: 'POLITICAL_PARTY' }) }} />
                            <FilterItem label="Politicians" onClick={() => { setActiveFilter('politicians'); setActiveFilters({ category: 'POLITICIAN' }) }} />
                            <FilterItem label="News Outlets" onClick={() => { setActiveFilter('news-outlets'); setActiveFilters({ category: 'NEWS_OUTLET' }) }} />
                            <FilterItem label="Government Agencies" onClick={() => { setActiveFilter('government-agencies'); setActiveFilters({ category: 'GOVERNMENT_AGENCY' }) }} />
                          </FilterSection>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <span className="text-sm text-gray-400">
                    {filteredEntities.length} entities found
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredEntities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Hash className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No entities found</h3>
                  <p className="text-gray-400 max-w-md">
                    {searchQuery 
                      ? `No entities match "${searchQuery}". Try adjusting your search or filters.`
                      : 'No entities available at the moment. Check back later.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredEntities.map((entity) => (
                    <EntityCard
                      key={entity.id}
                      entity={entity}
                      onClick={() => handleEntityClick(entity)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
