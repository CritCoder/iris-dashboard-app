'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, TrendingUp, ChevronRight, X, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLocationAnalytics, useTopLocations } from '@/hooks/use-api'
import { AnimatedPage, AnimatedGrid, AnimatedCard } from '@/components/ui/animated'

interface Location {
  id: string
  name: string
  type: 'LOCATION'
  mentions: number
  lastSeen: string
}

// Sample data for when API fails
const sampleLocations: Location[] = [
  { id: '1', name: 'Bengaluru', type: 'LOCATION', mentions: 387, lastSeen: '10/10/2025' },
  { id: '2', name: 'Bellandur', type: 'LOCATION', mentions: 359, lastSeen: '10/10/2025' },
  { id: '3', name: 'Bangalore', type: 'LOCATION', mentions: 176, lastSeen: '10/11/2025' },
  { id: '4', name: 'Karnataka', type: 'LOCATION', mentions: 161, lastSeen: '10/10/2025' },
  { id: '5', name: 'India', type: 'LOCATION', mentions: 86, lastSeen: '10/10/2025' },
  { id: '6', name: 'Marathahalli', type: 'LOCATION', mentions: 83, lastSeen: '10/7/2025' },
  { id: '7', name: 'BTM', type: 'LOCATION', mentions: 69, lastSeen: '10/8/2025' },
  { id: '8', name: 'HSR', type: 'LOCATION', mentions: 63, lastSeen: '10/7/2025' },
  { id: '9', name: 'Kadubeesanahalli', type: 'LOCATION', mentions: 61, lastSeen: '10/8/2025' },
  { id: '10', name: 'HSR Layout', type: 'LOCATION', mentions: 59, lastSeen: '10/10/2025' },
  { id: '11', name: 'Chintamani', type: 'LOCATION', mentions: 52, lastSeen: '10/6/2025' },
  { id: '12', name: 'Sarjapur Road', type: 'LOCATION', mentions: 49, lastSeen: '10/10/2025' },
  { id: '13', name: 'Koramangala', type: 'LOCATION', mentions: 49, lastSeen: '10/7/2025' },
  { id: '14', name: 'Whitefield', type: 'LOCATION', mentions: 48, lastSeen: '10/9/2025' },
  { id: '15', name: 'Sarjapur', type: 'LOCATION', mentions: 44, lastSeen: '10/9/2025' },
  { id: '16', name: 'Yelahanka', type: 'LOCATION', mentions: 44, lastSeen: '10/7/2025' },
  { id: '17', name: 'Green Glen Layout', type: 'LOCATION', mentions: 44, lastSeen: '10/9/2025' },
  { id: '18', name: 'Mysuru', type: 'LOCATION', mentions: 44, lastSeen: '10/8/2025' },
  { id: '19', name: 'Udupi', type: 'LOCATION', mentions: 43, lastSeen: '10/9/2025' },
  { id: '20', name: 'Hebbal', type: 'LOCATION', mentions: 43, lastSeen: '10/8/2025' }
]

function LocationCard({ location, onClick }: { location: Location; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/50 transition-colors cursor-pointer hover:bg-accent/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{location.name}</h3>
          <div className="text-xs text-muted-foreground mb-2">LOCATION</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-muted-foreground">
          {location.mentions} mentions
        </div>
        <div className="text-sm text-muted-foreground">
          Last seen: {location.lastSeen}
          </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
          Click to explore posts
      </div>
        </div>

      <div className="flex items-center justify-end">
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Eye className="w-3 h-3 mr-1" />
          View
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
    }

    if (searchQuery) {
      params.q = searchQuery
    }

    return params
  }, [searchQuery])

  const { data: apiLocations, loading, error } = useTopLocations(apiParams)

  const filteredLocations = useMemo(() => {
    // Use API data if available, otherwise use sample data
    const locations = apiLocations && apiLocations.length > 0 ? apiLocations : sampleLocations

    // Apply client-side filtering
    return locations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [apiLocations, searchQuery])

  // Use sample data for filter counts when API data is not available
  const locationsForCounts = apiLocations && apiLocations.length > 0 ? apiLocations : sampleLocations

  const filterOptions = [
    { id: 'all-locations', label: 'All Locations', count: locationsForCounts.length },
    { id: 'high-impact', label: 'High Impact Locations', count: locationsForCounts.filter(l => l.mentions > 100).length },
    { id: 'trending', label: 'Trending Locations', count: locationsForCounts.filter(l => l.lastSeen === '10/10/2025').length },
    { id: 'frequently-mentioned', label: 'Frequently Mentioned', count: locationsForCounts.filter(l => l.mentions > 50).length },
    { id: 'negative', label: 'Negative Locations', count: 0 },
    { id: 'positive', label: 'Positive Locations', count: 0 },
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

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block lg:w-80 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Locations</h2>
              
              <FilterSection title="PRIMARY">
                <FilterItem 
                  label="All Locations" 
                  isActive={activeFilter === 'all-locations'}
                  onClick={() => setActiveFilter('all-locations')}
                  count={locationsForCounts.length}
                />
                <FilterItem 
                  label="High Impact Locations"
                  onClick={() => setActiveFilter('high-impact')}
                  count={locationsForCounts.filter(l => l.mentions > 100).length}
                />
                <FilterItem 
                  label="Trending Locations"
                  onClick={() => setActiveFilter('trending')}
                  count={locationsForCounts.filter(l => l.lastSeen === '10/10/2025').length}
                />
                <FilterItem 
                  label="Frequently Mentioned"
                  onClick={() => setActiveFilter('frequent')}
                  count={locationsForCounts.filter(l => l.mentions > 50).length}
                />
              </FilterSection>

              <FilterSection title="SENTIMENT BASED">
                <FilterItem 
                  label="Negative Locations"
                  onClick={() => setActiveFilter('negative')}
                  count={0}
                />
                <FilterItem 
                  label="Positive Locations"
                  onClick={() => setActiveFilter('positive')}
                  count={0}
                />
                <FilterItem 
                  label="Controversial"
                  onClick={() => setActiveFilter('controversial')}
                  count={0}
                />
              </FilterSection>

              <FilterSection title="POLICE DIVISIONS">
                <FilterItem 
                  label="Whitefield Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('whitefield')}
                />
                <FilterItem 
                  label="South East Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('south-east')}
                />
                <FilterItem 
                  label="Central Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('central')}
                />
                <FilterItem 
                  label="Northeast Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('northeast')}
                />
                <FilterItem 
                  label="East Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('east')}
                />
                <FilterItem 
                  label="North Division"
                  hasSubmenu
                  onClick={() => setActiveFilter('north')}
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

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatedGrid stagger={0.03} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {(filteredLocations || []).map((location) => (
                  <AnimatedCard key={location.id}>
                    <LocationCard
                      location={location}
                      onClick={() => handleLocationClick(location)}
                    />
                  </AnimatedCard>
                ))}
              </AnimatedGrid>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}