'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { MapPin, TrendingUp, ChevronRight, X, Download, Eye, Users, MessageSquare, AlertTriangle, Calendar, TrendingDown, BarChart3, Map, Grid3X3 } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { OSMLocationMap } from '@/components/ui/osm-location-map'
import { responsive } from '@/lib/performance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useLocationAnalytics } from '@/hooks/use-api'
import { SanitizedSearchInput } from '@/components/ui/sanitized-input'
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
    <div>
      <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">{title}</h3>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  )
}

function FilterItem({ 
  label, 
  isActive = false, 
  hasSubmenu = false, 
  isOpen = false,
  onClick,
  onSelect,
  count,
  submenuItems
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  isOpen?: boolean
  onClick?: () => void
  onSelect?: (value?: string) => void
  count?: number
  submenuItems?: { label: string; value: string }[]
}) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div>
      <motion.button
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
          hasSubmenu 
            ? isActive
              ? 'bg-primary text-primary-foreground font-semibold' 
              : 'text-foreground hover:text-foreground hover:bg-accent font-semibold'
            : isActive 
              ? 'bg-primary/80 text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`truncate ${hasSubmenu ? 'flex items-center gap-1.5' : ''}`}>
          {hasSubmenu && <span className="text-xs">📍</span>}
          {label}
        </span>
        <motion.div 
          className="flex items-center gap-1 flex-shrink-0"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {count !== undefined && <span className="text-[10px] text-muted-foreground">{count}</span>}
          {hasSubmenu && (
            <ChevronRight className="w-3 h-3" />
          )}
        </motion.div>
      </motion.button>
      
      <AnimatePresence initial={false}>
        {hasSubmenu && isOpen && submenuItems && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.25, ease: 'easeOut' }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.2, ease: 'easeIn' }
              }
            }}
            className="overflow-hidden"
          >
            <div className="ml-3 mt-0.5 space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent border-l border-border/50 pl-2">
              {submenuItems.map((item, index) => (
                <motion.button
                  key={item.value}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    transition: {
                      delay: index * 0.03,
                      duration: 0.2,
                      ease: 'easeOut'
                    }
                  }}
                  exit={{ 
                    x: -10, 
                    opacity: 0,
                    transition: {
                      duration: 0.15,
                      ease: 'easeIn'
                    }
                  }}
                  whileHover={{ x: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect && onSelect(item.value)}
                  className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors text-muted-foreground hover:text-foreground text-left"
                >
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0"></span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LocationsPage() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all-locations')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('map')
  const [expandedDivision, setExpandedDivision] = useState<string>('Whitefield Division')

  // Police Divisions with their areas
  const policeDivisions = {
    'Whitefield Division': [
      'Whitefield', 'Kadugodi', 'Avalahalli', 'Mahadevapura', 'Krishnarajapura',
      'Marathahalli', 'Bellandur', 'Varthur', 'HAL'
    ],
    'South East Division': [
      'HSR Layout', 'Koramangala', 'Madivala', 'Adugodi', 'Bommanahalli',
      'Sudduguntepalya', 'Thilakanagara', 'South East Woman', 'Mico Layout'
    ],
    'Central Division': [
      'Halsurugate', 'S.R.Nagar', 'SJ.Park', 'Wilsongarden', 'Vidhansoudha',
      'Viveknagar', 'Ashoknagar', 'Sheshadripuram', 'Vyalikaval', 'Highground',
      'Shadashivnagar'
    ],
    'Northeast Division': [
      'Amruthahalli', 'Bagaluru', 'Chikkajala', 'Devanahalli',
      'Kempegowda International Airport', 'Kothanur', 'Kodigehalli',
      'Sampigehalli', 'Vidyaranyapura', 'Yelahanka', 'Yelahanka New Town',
      'Tindlu', 'Manyata Tech Park', 'Sahakar Nagara', 'Hegade nagara', 'M S Palya'
    ],
    'East Division': [
      'Shivaji nagar', 'Bharati nagar', 'Commercial street', 'Pulikeshi nagar',
      'Ram murthy nagar', 'Banasawadi', 'Kg halli', 'Dg halli', 'Halasuru',
      'Indira Nagar', 'Jb nagar', 'Baiyappanahalli'
    ],
    'North Division': [
      'Hebbal', 'Jalahalli', 'JC Nagar', 'Mahalakshmi Layout', 'Malleshwaram',
      'Nandini layout', 'Rajaji nagar', 'RMC Yard', 'RT Nagar', 'Sanjaynagar',
      'Srirapura', 'Subramanya nagar', 'Yeshwanthapura'
    ]
  }

  const handleLocationClick = (location: Location) => {
    // Use location ID for navigation
    router.push(`/locations/${location.id}`)
  }

  const handleExport = () => {
    try {
      // Create CSV content
      const csvContent = [
        // Header row
        ['Location Name', 'Type', 'Category', 'Total Mentions', 'Last Seen', 'Sentiment', 'Trend', 'Incidents', 'Engagement', 'Risk Level'].join(','),
        // Data rows
        ...filteredLocations.map(location => [
          `"${location.name}"`,
          `"${location.type}"`,
          `"${location.category || 'N/A'}"`,
          location.totalMentions,
          `"${new Date(location.lastSeen).toLocaleDateString()}"`,
          `"${location.sentiment ? `${location.sentiment.positive}% positive, ${location.sentiment.negative}% negative, ${location.sentiment.neutral}% neutral` : 'N/A'}"`,
          `"${location.trend || 'N/A'}"`,
          location.incidents || 0,
          location.engagement || 0,
          `"${location.riskLevel || 'N/A'}"`
        ].join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `locations-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('Locations exported successfully:', filteredLocations.length, 'locations')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
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

  // Show error state
  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Locations</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
        {/* Custom Header aligned with content area */}
        <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-border bg-background">
          <h1 className="text-xl font-bold text-foreground">Locations</h1>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid3X3 className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredLocations.length} locations found
            </span>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

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
                <div className="flex-1">
                  <SearchInput
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* Mobile Filters */}
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="md:hidden">Filters</Button>
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
                            {Object.entries(policeDivisions).map(([division, areas]) => (
                              <FilterItem
                                key={division}
                                label={division}
                                hasSubmenu
                                isOpen={expandedDivision === division}
                                isActive={activeFilter === division}
                                onClick={() => {
                                  if (expandedDivision === division) {
                                    setExpandedDivision('')
                                  } else {
                                    setExpandedDivision(division)
                                  }
                                }}
                                onSelect={(area?: string) => {
                                  if (area) {
                                    setActiveFilter(area)
                                    setActiveFilters({ location: area })
                                  }
                                }}
                                submenuItems={areas.map(area => ({
                                  label: area,
                                  value: area
                                }))}
                              />
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
              <div className="h-full w-full grid grid-cols-1 md:grid-cols-[288px_1fr] lg:grid-cols-[280px_1fr] gap-0">
                {/* Left Sidebar Filters */}
                <div className="hidden md:flex flex-col border-r border-border overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-3 pt-2 space-y-4">
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
                      {Object.entries(policeDivisions).map(([division, areas]) => (
                        <FilterItem
                          key={division}
                          label={division}
                          hasSubmenu
                          isOpen={expandedDivision === division}
                          isActive={activeFilter === division}
                          onClick={() => {
                            if (expandedDivision === division) {
                              setExpandedDivision('')
                            } else {
                              setExpandedDivision(division)
                            }
                          }}
                          onSelect={(area?: string) => {
                            if (area) {
                              setActiveFilter(area)
                              setActiveFilters({ location: area })
                            }
                          }}
                          submenuItems={areas.map(area => ({
                            label: area,
                            value: area
                          }))}
                        />
                      ))}
                    </FilterSection>
                  </div>
                </div>

                {/* Main content area */}
                <div className="overflow-hidden p-3 sm:p-4 lg:p-6">
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
                  ) : viewMode === 'map' ? (
                    <OSMLocationMap
                      locations={filteredLocations}
                      selectedLocation={selectedLocation}
                      onLocationSelect={setSelectedLocation}
                      height="100%"
                      className="w-full"
                    />
                  ) : (
                    <div className="overflow-y-auto h-full">
                      <div className={responsive.getGrid('cards', 'medium')}>
                        {filteredLocations.map((location) => (
                          <Card key={location.id}>
                            <LocationCard
                              location={location}
                              onClick={() => handleLocationClick(location)}
                            />
                          </Card>
                        ))}
                      </div>
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
