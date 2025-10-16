'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, TrendingUp, ChevronRight, X, Download, Eye, Users, MessageSquare, AlertTriangle, Calendar, TrendingDown, BarChart3, Map, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useLocationAnalytics } from '@/hooks/use-api'
// import { AnimatedPage, div, Card } from '@/components/ui/animated'

interface Location {
  id: string
  name: string
  type: string
  category?: string
  totalMentions: number
  lastSeen: string
  sentiment?: {
    positive: number
    negative: number
    neutral: number
    mixed?: number
  }
  trend?: 'up' | 'down' | 'stable'
  incidents?: number
  engagement?: number
  riskLevel?: 'low' | 'medium' | 'high'
}


function LocationCard({ location, onClick }: { location: Location; onClick: () => void }) {
  // Calculate dominant sentiment from sentiment object
  const getDominantSentiment = (sentiment?: Location['sentiment']) => {
    if (!sentiment) return 'neutral'
    const { positive = 0, negative = 0, neutral = 0 } = sentiment
    const max = Math.max(positive, negative, neutral)
    if (max === positive) return 'positive'
    if (max === negative) return 'negative'
    return 'neutral'
  }

  const getSentimentColor = (sentiment?: Location['sentiment']) => {
    const dominant = getDominantSentiment(sentiment)
    switch (dominant) {
      case 'positive': return 'text-green-600 bg-green-50 dark:bg-green-950/20'
      case 'negative': return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />
      default: return <BarChart3 className="w-3 h-3 text-gray-500" />
    }
  }

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
      default: return 'text-green-600 bg-green-50 dark:bg-green-950/20'
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/50 transition-all cursor-pointer hover:bg-accent/5 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            location.riskLevel === 'high' ? 'bg-red-500' : 
            location.riskLevel === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
          }`}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 truncate">{location.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">LOCATION</span>
              {location.riskLevel && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskColor(location.riskLevel)}`}>
                  {location.riskLevel.toUpperCase()} RISK
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon(location.trend)}
          <span className="text-xs text-muted-foreground">
            {location.totalMentions} mentions
          </span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/30 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            <span className="text-xs font-medium text-muted-foreground">INCIDENTS</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {location.incidents || 0}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <MessageSquare className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">ENGAGEMENT</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {location.engagement || 0}%
          </div>
        </div>
      </div>

      {/* Sentiment & Trend */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {location.sentiment && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentColor(location.sentiment)}`}>
              {getDominantSentiment(location.sentiment).toUpperCase()}
            </span>
          )}
          {location.trend && (
            <span className="text-xs text-muted-foreground">
              {location.trend === 'up' ? '↗ Trending Up' : 
               location.trend === 'down' ? '↘ Declining' : '→ Stable'}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(location.lastSeen).toLocaleDateString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <Users className="w-3 h-3 mr-1" />
            Profiles
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            Posts
          </Button>
        </div>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
          <Eye className="w-3 h-3 mr-1" />
          Analyze
        </Button>
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
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <span>{label}</span>
        <div className="flex items-center gap-2">
          {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
          {hasSubmenu && (
            <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </div>
      </button>
      
      {hasSubmenu && isOpen && submenuItems && (
        <div className="ml-4 mt-1 space-y-1">
          {submenuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onSelect ? onSelect(item.value) : onClick && onClick()}
              className="w-full flex items-start px-3 py-1.5 rounded-lg text-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LocationsPage() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all-locations')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const handleLocationClick = (location: Location) => {
    // Use location ID for navigation
    router.push(`/locations/${location.id}`)
  }

  // Build API params based on search and filter
  const apiParams = useMemo(() => {
    const params: any = {}

    // Add search query if present
    if (searchQuery) params.q = searchQuery
    if (activeFilters.query) params.q = activeFilters.query

    // Add active filters to params
    Object.keys(activeFilters).forEach(key => {
      if (activeFilters[key]) {
        params[key] = activeFilters[key]
      }
    })

    return params
  }, [searchQuery, activeFilters])

  const { data: apiLocations, loading, error, refetch } = useLocationAnalytics(apiParams)

  const filteredLocations = useMemo(() => {
    // Use API data only
    const locations = apiLocations || []

    // Apply client-side filtering
    return locations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [apiLocations, searchQuery])

  // Show loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading locations...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  const locationsForCounts = apiLocations || []

  // Calculate dominant sentiment for filtering
  const getDominantSentimentForLocation = (location: Location) => {
    if (!location.sentiment) return 'neutral'
    const { positive = 0, negative = 0, neutral = 0 } = location.sentiment
    const max = Math.max(positive, negative, neutral)
    if (max === positive) return 'positive'
    if (max === negative) return 'negative'
    return 'neutral'
  }

  const filterOptions = [
    { id: 'all-locations', label: 'All Locations', count: locationsForCounts.length },
    { id: 'high-impact', label: 'High Impact Locations', count: locationsForCounts.filter(l => l.totalMentions > 100).length },
    { id: 'trending', label: 'Trending Locations', count: locationsForCounts.filter(l => l.trend === 'up').length },
    { id: 'frequently-mentioned', label: 'Frequently Mentioned', count: locationsForCounts.filter(l => l.totalMentions > 50).length },
    { id: 'negative', label: 'Negative Locations', count: locationsForCounts.filter(l => getDominantSentimentForLocation(l) === 'negative').length },
    { id: 'positive', label: 'Positive Locations', count: locationsForCounts.filter(l => getDominantSentimentForLocation(l) === 'positive').length },
    { id: 'controversial', label: 'Controversial', count: 0 }
  ]

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Locations"
          description="Location Explorer"
        actions={
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredLocations.length} locations found
              </span>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        }
      />

        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-2">
                    All Locations
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>

                  {/* Platform filter */}
                  <div className="relative">
                    <FilterItem
                      label={activeFilters.platform ? `Platform: ${activeFilters.platform}` : 'Platform'}
                      hasSubmenu
                      onSelect={(value?: string) => {
                        setActiveFilters(prev => ({ ...prev, platform: value || '' }))
                        setActiveFilter('platform')
                      }}
                      submenuItems={[
                        { label: 'All', value: '' },
                        { label: 'twitter', value: 'twitter' },
                        { label: 'facebook', value: 'facebook' },
                        { label: 'instagram', value: 'instagram' },
                        { label: 'youtube', value: 'youtube' },
                      ]}
                    />
                  </div>

                  {/* Sentiment filter */}
                  <div className="relative">
                    <FilterItem
                      label={activeFilters.sentiment ? `Sentiment: ${activeFilters.sentiment}` : 'Sentiment'}
                      hasSubmenu
                      onSelect={(value?: string) => {
                        setActiveFilters(prev => ({ ...prev, sentiment: value || '' }))
                        setActiveFilter('sentiment')
                      }}
                      submenuItems={[
                        { label: 'All', value: '' },
                        { label: 'POSITIVE', value: 'POSITIVE' },
                        { label: 'NEGATIVE', value: 'NEGATIVE' },
                        { label: 'NEUTRAL', value: 'NEUTRAL' },
                        { label: 'MIXED', value: 'MIXED' },
                      ]}
                    />
                  </div>
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
              />
                </div>
                {/* Mobile Filters */}
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[85%] max-w-sm">
                      <div className="p-4 sm:p-6 overflow-y-auto h-full">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                          <FilterSection title="PRIMARY">
                            <FilterItem label="All Locations" isActive={activeFilter === 'all-locations'} onClick={() => { setActiveFilter('all-locations'); setActiveFilters({}) }} />
                            <FilterItem label="High Impact Locations" isActive={activeFilter === 'high-impact'} onClick={() => { setActiveFilter('high-impact'); setActiveFilters({ minMentions: '100' }) }} />
                            <FilterItem label="Trending Locations" isActive={activeFilter === 'trending'} onClick={() => { setActiveFilter('trending'); setActiveFilters({ timeRange: '24h' }) }} />
                            <FilterItem label="Frequently Mentioned" isActive={activeFilter === 'frequently-mentioned'} onClick={() => { setActiveFilter('frequently-mentioned'); setActiveFilters({ sortBy: 'totalMentions', order: 'desc' }) }} />
                          </FilterSection>

                          <FilterSection title="SENTIMENT BASED">
                            <FilterItem label="Negative Locations" isActive={activeFilter === 'negative'} onClick={() => { setActiveFilter('negative'); setActiveFilters({ sentiment: 'NEGATIVE' }) }} />
                            <FilterItem label="Positive Locations" isActive={activeFilter === 'positive'} onClick={() => { setActiveFilter('positive'); setActiveFilters({ sentiment: 'POSITIVE' }) }} />
                            <FilterItem label="Controversial" isActive={activeFilter === 'controversial'} onClick={() => { setActiveFilter('controversial'); setActiveFilters({ sentiment: 'MIXED' }) }} />
                          </FilterSection>

                          <FilterSection title="POLICE DIVISIONS">
                            {['Whitefield Division','South East Division','Central Division','Northeast Division','East Division','North Division'].map((division) => (
                              <FilterItem key={division} label={division} onClick={() => { setActiveFilter(division); setActiveFilters({ division }) }} />
                            ))}
                          </FilterSection>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
                {/* Left Sidebar Filters */}
                <div className="hidden lg:block border-r border-border overflow-y-auto p-4 pt-2">
                  <div className="space-y-6">
                    <FilterSection title="PRIMARY">
                      <FilterItem 
                        label="All Locations" 
                        isActive={activeFilter === 'all-locations'}
                        onClick={() => {
                          setActiveFilter('all-locations')
                          setActiveFilters({})
                        }}
                      />
                      <FilterItem 
                        label="High Impact Locations"
                        isActive={activeFilter === 'high-impact'}
                        onClick={() => {
                          setActiveFilter('high-impact')
                          setActiveFilters({ minMentions: '100' })
                        }}
                      />
                      <FilterItem 
                        label="Trending Locations"
                        isActive={activeFilter === 'trending'}
                        onClick={() => {
                          setActiveFilter('trending')
                          setActiveFilters({ timeRange: '24h' })
                        }}
                      />
                      <FilterItem 
                        label="Frequently Mentioned"
                        isActive={activeFilter === 'frequently-mentioned'}
                        onClick={() => {
                          setActiveFilter('frequently-mentioned')
                          setActiveFilters({ sortBy: 'totalMentions' })
                        }}
                      />
                    </FilterSection>

                    <FilterSection title="SENTIMENT BASED">
                      <FilterItem 
                        label="Negative Locations"
                        isActive={activeFilter === 'negative'}
                        onClick={() => {
                          setActiveFilter('negative')
                          setActiveFilters({ sentiment: 'NEGATIVE' })
                        }}
                      />
                      <FilterItem 
                        label="Positive Locations"
                        isActive={activeFilter === 'positive'}
                        onClick={() => {
                          setActiveFilter('positive')
                          setActiveFilters({ sentiment: 'POSITIVE' })
                        }}
                      />
                      <FilterItem 
                        label="Controversial"
                        isActive={activeFilter === 'controversial'}
                        onClick={() => {
                          setActiveFilter('controversial')
                          setActiveFilters({ sentiment: 'MIXED' })
                        }}
                      />
                    </FilterSection>

                    <FilterSection title="POLICE DIVISIONS">
                      {[
                        'Whitefield Division',
                        'South East Division',
                        'Central Division',
                        'Northeast Division',
                        'East Division',
                        'North Division',
                      ].map((division) => (
                        <FilterItem
                          key={division}
                          label={division}
                          onClick={() => {
                            setActiveFilter(division)
                            setActiveFilters({ division })
                          }}
                        />
                      ))}
                    </FilterSection>
                  </div>
                </div>

                {/* Main grid */}
                <div className="overflow-y-auto p-3 sm:p-4 lg:p-6">
              {filteredLocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MapPin className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No locations found</h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchQuery 
                      ? `No locations match "${searchQuery}". Try adjusting your search.`
                      : 'No locations available at the moment. Check back later.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                  {filteredLocations.map((location) => (
                    <Card key={location.id}>
                      <LocationCard
                        location={location}
                        onClick={() => handleLocationClick(location)}
                      />
                    </Card>
                  ))}
                </div>
              )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </PageLayout>
  )
}