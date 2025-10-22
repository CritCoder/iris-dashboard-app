'use client'

import { LocationCard } from './location-card'
import { AnimatedGrid } from '@/components/ui/animated'

interface Location {
  id: string
  name: string
  type?: 'CITY' | 'STATE' | 'COUNTRY' | 'REGION' | 'ADDRESS' | 'LANDMARK'
  country?: string
  state?: string
  city?: string
  totalMentions?: number
  lastSeen?: string
  sentiment?: string
  description?: string
  riskLevel?: string
  sentimentScore?: number
  trendDirection?: 'up' | 'down' | 'stable'
  coordinates?: {
    lat: number
    lng: number
  }
  postCount?: number
  uniqueUsers?: number
  engagement?: number
}

interface LocationListProps {
  locations: Location[]
  onLocationClick: (location: Location) => void
  defaultView?: 'grid' | 'list'
}

export function LocationList({ locations, onLocationClick, defaultView = 'grid' }: LocationListProps) {
  if (defaultView === 'list') {
    return (
      <div className="space-y-4">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onClick={() => onLocationClick(location)}
          />
        ))}
      </div>
    )
  }

  return (
    <AnimatedGrid 
      speed="fast" 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onClick={() => onLocationClick(location)}
        />
      ))}
    </AnimatedGrid>
  )
}
