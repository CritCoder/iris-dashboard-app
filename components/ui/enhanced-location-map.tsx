'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapPin, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Users, MessageSquare, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

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

interface EnhancedLocationMapProps {
  locations: Location[]
  selectedLocation?: Location | null
  onLocationSelect?: (location: Location) => void
  className?: string
  height?: string
}

// Enhanced coordinate mapping for Indian locations
const getLocationCoordinates = (locationName: string): [number, number] => {
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
    
    // Additional locations for better coverage
    'Silk Board Junction': [12.9166, 77.6101],
    'Outer Ring Road': [12.9584, 77.6974],
    'Wipro Road': [12.9698, 77.7500],
    'Ecospace Junction': [12.9255, 77.6768],
  }
  
  // Try exact match first
  if (coordinates[locationName]) {
    return coordinates[locationName]
  }
  
  // Try partial matching for compound names
  for (const [key, coords] of Object.entries(coordinates)) {
    if (locationName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(locationName.toLowerCase())) {
      return coords
    }
  }
  
  // Default to Bangalore center
  return [12.9716, 77.5946]
}

const getMarkerColor = (riskLevel?: string) => {
  switch (riskLevel) {
    case 'high': return '#ef4444' // red
    case 'medium': return '#f97316' // orange
    default: return '#3b82f6' // blue
  }
}

const getMarkerSize = (mentions: number) => {
  if (mentions > 300) return 25
  if (mentions > 200) return 20
  if (mentions > 100) return 16
  if (mentions > 50) return 12
  return 8
}

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />
    case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />
    default: return <BarChart3 className="w-3 h-3 text-gray-500" />
  }
}

const getSentimentColor = (sentiment?: Location['sentiment']) => {
  if (!sentiment) return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
  const { positive = 0, negative = 0, neutral = 0 } = sentiment
  const max = Math.max(positive, negative, neutral)
  if (max === positive) return 'text-green-600 bg-green-50 dark:bg-green-950/20'
  if (max === negative) return 'text-red-600 bg-red-50 dark:bg-red-950/20'
  return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
}

const getDominantSentiment = (sentiment?: Location['sentiment']) => {
  if (!sentiment) return 'neutral'
  const { positive = 0, negative = 0, neutral = 0 } = sentiment
  const max = Math.max(positive, negative, neutral)
  if (max === positive) return 'positive'
  if (max === negative) return 'negative'
  return 'neutral'
}

export function EnhancedLocationMap({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  className = '',
  height = '600px'
}: EnhancedLocationMapProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate map center based on locations
  const mapCenter = useMemo(() => {
    if (locations.length === 0) return [12.9716, 77.5946] // Default to Bangalore
    
    const coordinates = locations.map(location => getLocationCoordinates(location.name))
    const avgLat = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length
    const avgLng = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length
    
    return [avgLat, avgLng] as [number, number]
  }, [locations])

  const handleLocationClick = (location: Location) => {
    if (onLocationSelect) {
      onLocationSelect(location)
    } else {
      router.push(`/locations/${location.id}`)
    }
  }

  if (!isClient) {
    return (
      <div className={`bg-muted/30 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-lg overflow-hidden border bg-background ${className}`} style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={locations.length > 1 ? 8 : 12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => {
          const coordinates = getLocationCoordinates(location.name)
          const markerColor = getMarkerColor(location.riskLevel)
          const markerSize = getMarkerSize(location.totalMentions)
          
          return (
            <Marker
              key={location.id}
              position={coordinates}
              eventHandlers={{
                click: () => handleLocationClick(location)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[280px] max-w-[320px]">
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
                        <h3 className="font-semibold text-foreground mb-1">{location.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">LOCATION</span>
                          {location.riskLevel && (
                            <Badge variant="secondary" className="text-xs">
                              {location.riskLevel.toUpperCase()} RISK
                            </Badge>
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
                  
                  {/* Metrics Grid */}
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
                        <Badge variant="outline" className={`text-xs ${getSentimentColor(location.sentiment)}`}>
                          {getDominantSentiment(location.sentiment).toUpperCase()}
                        </Badge>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => router.push(`/locations/${location.id}/profiles`)}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Profiles
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        onClick={() => router.push(`/locations/${location.id}/posts`)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Posts
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => router.push(`/locations/${location.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
        <h4 className="font-semibold text-sm mb-3">Legend</h4>
        
        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-xs mb-2 text-muted-foreground">Risk Levels</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Low Risk</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-xs mb-2 text-muted-foreground">Mention Volume</h5>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span className="text-xs">&lt; 50 mentions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-xs">50-100 mentions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <span className="text-xs">100-200 mentions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-500"></div>
                <span className="text-xs">&gt; 200 mentions</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            {locations.length} location{locations.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  )
}
