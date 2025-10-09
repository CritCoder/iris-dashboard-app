'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, Target, TrendingUp, AlertTriangle, ChevronRight, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Location {
  id: string
  name: string
  mentions: number
  lastSeen: string
  sentiment: 'positive' | 'negative' | 'neutral'
}

const sampleLocations: Location[] = [
  { id: '1', name: 'Bellandur', mentions: 1791, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '2', name: 'Bengaluru', mentions: 1071, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '3', name: 'Bangalore', mentions: 550, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '4', name: 'HSR Layout', mentions: 508, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '5', name: 'Sarjapur Road', mentions: 350, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '6', name: 'Kadubeesanahalli', mentions: 290, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '7', name: 'Sarjapur', mentions: 279, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '8', name: 'Marathahalli', mentions: 272, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '9', name: 'Whitefield', mentions: 265, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '10', name: 'HSR', mentions: 259, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '11', name: 'Karnataka', mentions: 227, lastSeen: '10/1/2025', sentiment: 'positive' },
  { id: '12', name: 'Koramangala', mentions: 166, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '13', name: 'Outer Ring Road', mentions: 148, lastSeen: '10/1/2025', sentiment: 'negative' },
  { id: '14', name: 'Marathalli', mentions: 119, lastSeen: '10/1/2025', sentiment: 'neutral' },
  { id: '15', name: 'Panathur', mentions: 118, lastSeen: '10/1/2025', sentiment: 'positive' },
  { id: '16', name: 'Green Glen Layout', mentions: 116, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '17', name: 'Mysuru', mentions: 112, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '18', name: 'Sarjapur main road', mentions: 109, lastSeen: '10/2/2025', sentiment: 'neutral' },
  { id: '19', name: 'BTM', mentions: 106, lastSeen: '10/2/2025', sentiment: 'positive' },
  { id: '20', name: 'Varthur', mentions: 105, lastSeen: '10/1/2025', sentiment: 'neutral' }
]

function LocationCard({ location, onClick }: { location: Location; onClick: () => void }) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500'
      case 'negative': return 'text-red-500'
      default: return 'text-zinc-500'
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/50 transition-colors cursor-pointer hover:bg-accent/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Target className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{location.name}</h3>
          <div className="text-xs text-muted-foreground mb-2">LOCATION</div>
          <div className="text-sm text-muted-foreground">Last seen: {location.lastSeen}</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
          Click to explore posts
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {location.mentions} mentions
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
  onClick 
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
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
      {hasSubmenu && <ChevronRight className="w-4 h-4" />}
    </button>
  )
}

export default function LocationsPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [activeFilter, setActiveFilter] = useState('all-locations')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = sampleLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Locations"
          description="Geographic intelligence and location-based insights"
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
                />
                <FilterItem 
                  label="High Impact Locations"
                  onClick={() => setActiveFilter('high-impact')}
                />
                <FilterItem 
                  label="Trending Locations"
                  onClick={() => setActiveFilter('trending')}
                />
                <FilterItem 
                  label="Frequently Mentioned"
                  onClick={() => setActiveFilter('frequent')}
                />
              </FilterSection>

              <FilterSection title="SENTIMENT BASED">
                <FilterItem 
                  label="Negative Locations"
                  onClick={() => setActiveFilter('negative')}
                />
                <FilterItem 
                  label="Positive Locations"
                  onClick={() => setActiveFilter('positive')}
                />
                <FilterItem 
                  label="Controversial"
                  onClick={() => setActiveFilter('controversial')}
                />
              </FilterSection>

              <FilterSection title="POLICE DIVISIONS">
                <FilterItem 
                  label="Whitefield Division"
                  onClick={() => setActiveFilter('whitefield')}
                />
                <FilterItem 
                  label="South East Division"
                  onClick={() => setActiveFilter('south-east')}
                />
                <FilterItem 
                  label="Central Division"
                  onClick={() => setActiveFilter('central')}
                />
                <FilterItem 
                  label="Northeast Division"
                  onClick={() => setActiveFilter('northeast')}
                />
                <FilterItem 
                  label="East Division"
                  onClick={() => setActiveFilter('east')}
                />
                <FilterItem 
                  label="North Division"
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
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <span className="text-sm text-muted-foreground">
                    {filteredLocations.length} found
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onClick={() => setSelectedLocation(location)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}