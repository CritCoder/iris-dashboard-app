'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

interface OSMLocationMapProps {
  locations: Location[]
  selectedLocation?: Location | null
  onLocationSelect?: (location: Location) => void
  className?: string
  height?: string
}

// Enhanced coordinate mapping for Indian locations
const getLocationCoordinates = (locationName: string): [number, number] | null => {
  const coordinates: Record<string, [number, number]> = {
    // Karnataka
    'Bengaluru': [12.9716, 77.5946],
    'Bangalore': [12.9716, 77.5946],
    'Bellandur': [12.9255, 77.6768],
    'Marathahalli': [12.9584, 77.6974],
    'BTM': [12.9166, 77.6101],
    'HSR': [12.9114, 77.6440],
    'HSR Layout': [12.9114, 77.6440],
    'Kadubeesanahalli': [12.9339, 77.6989],
    'Chintamani': [13.4004, 78.0566],
    'Sarjapur Road': [12.9029, 77.7843],
    'Koramangala': [12.9279, 77.6271],
    'Whitefield': [12.9698, 77.7500],
    'Sarjapur': [12.9029, 77.7843],
    'Yelahanka': [13.1007, 77.5963],
    'Green Glen Layout': [12.9339, 77.6989],
    'Mysuru': [12.2958, 76.6394],
    'Udupi': [13.3409, 74.7421],
    'Hebbal': [13.0392, 77.5974],
    'Hebbal Junction': [13.0392, 77.5974],
    'Silk Board Junction': [12.9166, 77.6101],
    'Outer Ring Road': [12.9584, 77.6974],
    'Wipro Road': [12.9698, 77.7500],
    'Ecospace Junction': [12.9255, 77.6768],
    'Karnataka': [12.9716, 77.5946],
    
    // Other Indian states
    'India': [20.5937, 78.9629],
    'Telangana': [18.1124, 79.0193],
    'Hyderabad': [17.3850, 78.4867],
    'Andhra Pradesh': [15.9129, 79.7400],
    'Vizag': [17.6868, 83.2185],
    'Bihar': [25.0961, 85.3131],
    'Haryana': [29.0588, 76.0856],
    'Mumbai': [19.0760, 72.8777],
    'Delhi': [28.7041, 77.1025],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639],
    'Pune': [18.5204, 73.8567],
    
    // International
    'Russia': [61.5240, 105.3188],
    'Moscow': [55.7558, 37.6176],
    
    // Highways and Roads
    'Mumbai-Ahmedabad Highway': [19.0760, 72.8777],
  }
  
  // Try exact match first
  const exactMatch = coordinates[locationName]
  if (exactMatch) {
    return exactMatch
  }

  // Try partial match for common areas
  for (const key in coordinates) {
    if (locationName.includes(key)) {
      return coordinates[key]
    }
  }
  
  // Default to Bengaluru if no match
  return coordinates['Bengaluru']
}

// Custom marker icons
const createMarkerIcon = (riskLevel?: string) => {
  let color = '#3B82F6' // blue
  let ringColor = '#93C5FD' // blue ring
  
  if (riskLevel === 'high') {
    color = '#EF4444' // red
    ringColor = '#FCA5A5' // red ring
  } else if (riskLevel === 'medium') {
    color = '#F97316' // orange
    ringColor = '#FDBA74' // orange ring
  }

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: ${ringColor};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

// Component to auto-fit bounds
function MapBounds({ locations }: { locations: Location[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds: [number, number][] = []
      locations.forEach(location => {
        const coords = getLocationCoordinates(location.name)
        if (coords) bounds.push(coords)
      })
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      }
    }
  }, [locations, map])
  
  return null
}

export function OSMLocationMap({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  className = '',
  height = '600px'
}: OSMLocationMapProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getDominantSentiment = (sentiment?: Location['sentiment']) => {
    if (!sentiment) return 'neutral'
    const { positive = 0, negative = 0, neutral = 0 } = sentiment
    const max = Math.max(positive, negative, neutral)
    if (max === positive) return 'positive'
    if (max === negative) return 'negative'
    return 'neutral'
  }

  const getSentimentBadgeVariant = (sentiment: string) => {
    if (sentiment === 'positive') return 'default'
    if (sentiment === 'negative') return 'destructive'
    return 'secondary'
  }

  if (!isClient) {
    return (
      <div 
        className={`relative bg-muted rounded-lg overflow-hidden flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="flex flex-col items-center">
          <MapPin className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds locations={locations} />

        {locations.map(location => {
          const coords = getLocationCoordinates(location.name)
          if (!coords) return null

          const sentiment = getDominantSentiment(location.sentiment)

          return (
            <Marker
              key={location.id}
              position={coords}
              icon={createMarkerIcon(location.riskLevel)}
              eventHandlers={{
                click: () => {
                  if (onLocationSelect) onLocationSelect(location)
                }
              }}
            >
              <Popup
                className="custom-popup"
                closeButton={true}
              >
                <div className="p-1">
                  <h4 className="font-bold text-base mb-3 text-foreground">{location.name}</h4>
                  
                  <div className="mb-3">
                    <Badge 
                      variant={getSentimentBadgeVariant(sentiment)} 
                      className="text-xs font-medium px-2.5 py-1"
                    >
                      {sentiment.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-background border border-border rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Incidents</div>
                      <div className="text-lg font-bold text-foreground">{location.incidents || 0}</div>
                    </div>
                    <div className="bg-background border border-border rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Mentions</div>
                      <div className="text-lg font-bold text-foreground">{location.totalMentions}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/locations/${location.id}`)}
                    className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-[1000] backdrop-saturate-150">
        <div className="text-xs font-bold mb-3 text-white uppercase tracking-wide">Risk Level</div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs text-gray-200">
            <div className="relative w-4 h-4 flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
            </div>
            <span className="font-medium">High Risk</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-200">
            <div className="relative w-4 h-4 flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
            </div>
            <span className="font-medium">Medium Risk</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-200">
            <div className="relative w-4 h-4 flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
            </div>
            <span className="font-medium">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Analytics Card */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-[1000] min-w-[280px] backdrop-saturate-150">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">Map Analytics</div>
          <div className="text-2xl font-bold text-white">{locations.length} <span className="text-sm font-normal text-gray-400">Locations</span></div>
        </div>
        
        {/* Sentiment Breakdown */}
        <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
          <div className="text-xs font-semibold text-white mb-2">Sentiment Analysis</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-300">Positive</span>
            </div>
            <span className="text-sm font-bold text-white">
              {locations.filter(loc => {
                if (!loc.sentiment) return false
                const { positive = 0, negative = 0, neutral = 0 } = loc.sentiment
                return positive > Math.max(negative, neutral)
              }).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-300">Negative</span>
            </div>
            <span className="text-sm font-bold text-white">
              {locations.filter(loc => {
                if (!loc.sentiment) return false
                const { positive = 0, negative = 0, neutral = 0 } = loc.sentiment
                return negative > Math.max(positive, neutral)
              }).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span className="text-xs text-gray-300">Neutral</span>
            </div>
            <span className="text-sm font-bold text-white">
              {locations.filter(loc => {
                if (!loc.sentiment) return true
                const { positive = 0, negative = 0, neutral = 0 } = loc.sentiment
                return neutral >= Math.max(positive, negative)
              }).length}
            </span>
          </div>
        </div>

        {/* Total Stats */}
        <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
          <div className="text-xs font-semibold text-white mb-2">Total Metrics</div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Total Mentions</span>
            <span className="text-sm font-bold text-white">
              {locations.reduce((sum, loc) => sum + loc.totalMentions, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Total Incidents</span>
            <span className="text-sm font-bold text-white">
              {locations.reduce((sum, loc) => sum + (loc.incidents || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Avg Engagement</span>
            <span className="text-sm font-bold text-white">
              {locations.length > 0 
                ? Math.round(locations.reduce((sum, loc) => sum + (loc.engagement || 0), 0) / locations.length)
                : 0}
            </span>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-white mb-2">Risk Distribution</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-300">High Risk</span>
            </div>
            <span className="text-sm font-bold text-white">
              {locations.filter(loc => loc.riskLevel === 'high').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-xs text-gray-300">Medium Risk</span>
            </div>
            <span className="text-sm font-bold text-white">
              {locations.filter(loc => loc.riskLevel === 'medium').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-300">Low Risk</span>
            </div>
            <span className="text-sm font-bold text-white">
              {locations.filter(loc => loc.riskLevel === 'low').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

