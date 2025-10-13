'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, AlertTriangle, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

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
  coordinates?: [number, number] // [latitude, longitude]
}

interface LocationMapProps {
  locations: Location[]
  selectedLocation?: Location | null
  onLocationSelect?: (location: Location) => void
  className?: string
}

// Bangalore area coordinates for sample data
const getLocationCoordinates = (locationName: string): [number, number] => {
  const coordinates: Record<string, [number, number]> = {
    'Bengaluru': [12.9716, 77.5946],
    'Bellandur': [12.9255, 77.6768],
    'Bangalore': [12.9716, 77.5946],
    'Karnataka': [12.9716, 77.5946],
    'India': [20.5937, 78.9629],
    'Marathahalli': [12.9584, 77.6974],
    'BTM': [12.9166, 77.6101],
    'HSR': [12.9114, 77.6440],
    'Kadubeesanahalli': [12.9339, 77.6989],
    'HSR Layout': [12.9114, 77.6440],
    'Chintamani': [13.4004, 78.0566],
    'Sarjapur Road': [12.9029, 77.7843],
    'Koramangala': [12.9279, 77.6271],
    'Whitefield': [12.9698, 77.7500],
    'Sarjapur': [12.9029, 77.7843],
    'Yelahanka': [13.1007, 77.5963],
    'Green Glen Layout': [12.9339, 77.6989],
    'Mysuru': [12.2958, 76.6394],
    'Udupi': [13.3409, 74.7421],
    'Hebbal': [13.0392, 77.5974]
  }
  
  return coordinates[locationName] || [12.9716, 77.5946] // Default to Bangalore center
}

const getMarkerColor = (riskLevel?: string) => {
  switch (riskLevel) {
    case 'high': return '#ef4444' // red
    case 'medium': return '#f97316' // orange
    default: return '#3b82f6' // blue
  }
}

const getMarkerSize = (mentions: number) => {
  if (mentions > 200) return 20
  if (mentions > 100) return 16
  if (mentions > 50) return 12
  return 8
}

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up': return '↗'
    case 'down': return '↘'
    default: return '→'
  }
}

const getSentimentColor = (sentiment?: string) => {
  switch (sentiment) {
    case 'positive': return 'text-green-600'
    case 'negative': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

export function LocationMap({ locations, selectedLocation, onLocationSelect, className = '' }: LocationMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`bg-muted/30 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border ${className}`}>
      <MapContainer
        center={[12.9716, 77.5946]} // Bangalore center
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => {
          const coordinates = getLocationCoordinates(location.name)
          const markerColor = getMarkerColor(location.riskLevel)
          const markerSize = getMarkerSize(location.mentions)
          
          return (
            <Marker
              key={location.id}
              position={coordinates}
              eventHandlers={{
                click: () => onLocationSelect?.(location)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <span className={`font-medium ${
                        location.riskLevel === 'high' ? 'text-red-600' :
                        location.riskLevel === 'medium' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {location.riskLevel?.toUpperCase() || 'LOW'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mentions:</span>
                      <span className="font-medium">{location.mentions}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Incidents:</span>
                      <span className="font-medium">{location.incidents || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Engagement:</span>
                      <span className="font-medium">{location.engagement || 0}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Sentiment:</span>
                      <span className={`font-medium ${getSentimentColor(location.sentiment)}`}>
                        {location.sentiment?.toUpperCase() || 'NEUTRAL'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Trend:</span>
                      <span className="font-medium">
                        {getTrendIcon(location.trend)} {location.trend?.toUpperCase() || 'STABLE'}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-semibold text-sm mb-2">Risk Levels</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Low Risk</span>
          </div>
        </div>
        
        <h4 className="font-semibold text-sm mb-2 mt-3">Marker Size</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span>&lt; 50 mentions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>50-100 mentions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
            <span>100-200 mentions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-500"></div>
            <span>&gt; 200 mentions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
