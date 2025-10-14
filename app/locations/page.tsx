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
import { useLocationAnalytics, useTopLocations } from '@/hooks/use-api'
// import { AnimatedPage, div, Card } from '@/components/ui/animated'

interface Location {
  id: string
  name: string
  type: 'LOCATION'
  mentions: number
  lastSeen: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  trend?: 'up' | 'down' | 'stable'
  incidents?: number
  engagement?: number
  riskLevel?: 'low' | 'medium' | 'high'
}


function LocationCard({ location, onClick }: { location: Location; onClick: () => void }) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
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
            {location.mentions} mentions
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
              {location.sentiment.toUpperCase()}
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
          {location.lastSeen}
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
  count,
  submenuItems
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
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
              onClick={onClick}
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

  const handleLocationClick = (location: Location) => {
    // Convert location name to URL-friendly format
    const locationSlug = location.name.toLowerCase().replace(/\s+/g, '-')
    router.push(`/locations/${locationSlug}`)
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

    return params
  }, [searchQuery])

  const { data: apiLocations, loading, error } = useTopLocations(apiParams)

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

  const filterOptions = [
    { id: 'all-locations', label: 'All Locations', count: locationsForCounts.length },
    { id: 'high-impact', label: 'High Impact Locations', count: locationsForCounts.filter(l => l.mentions > 100).length },
    { id: 'trending', label: 'Trending Locations', count: locationsForCounts.filter(l => l.trend === 'up').length },
    { id: 'frequently-mentioned', label: 'Frequently Mentioned', count: locationsForCounts.filter(l => l.mentions > 50).length },
    { id: 'negative', label: 'Negative Locations', count: locationsForCounts.filter(l => l.sentiment === 'negative').length },
    { id: 'positive', label: 'Positive Locations', count: locationsForCounts.filter(l => l.sentiment === 'positive').length },
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
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
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
    </PageLayout>
  )
}