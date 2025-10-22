'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, AlertTriangle, TrendingUp, TrendingDown, BarChart3, Users, MessageSquare, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Declare google maps types
declare global {
  interface Window {
    google: any
    googleMapsLoading?: boolean
    googleMapsLoaded?: boolean
  }
}

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

interface GoogleLocationMapProps {
  locations: Location[]
  selectedLocation?: Location | null
  onLocationSelect?: (location: Location) => void
  className?: string
  height?: string
}

// Enhanced coordinate mapping for Indian locations
const getLocationCoordinates = (locationName: string): { lat: number; lng: number } | null => {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    // Karnataka
    'Bengaluru': { lat: 12.9716, lng: 77.5946 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Bellandur': { lat: 12.9255, lng: 77.6768 },
    'Marathahalli': { lat: 12.9584, lng: 77.6974 },
    'BTM': { lat: 12.9166, lng: 77.6101 },
    'HSR': { lat: 12.9114, lng: 77.6440 },
    'HSR Layout': { lat: 12.9114, lng: 77.6440 },
    'Whitefield': { lat: 12.9698, lng: 77.7500 },
    'Koramangala': { lat: 12.9279, lng: 77.6271 },
    'Sarjapur': { lat: 12.9029, lng: 77.7843 },
    'Yelahanka': { lat: 13.1007, lng: 77.5963 },
    'Hebbal': { lat: 13.0392, lng: 77.5974 },
    'Mysuru': { lat: 12.2958, lng: 76.6394 },
    'Karnataka': { lat: 12.9716, lng: 77.5946 },
    
    // Other Indian cities
    'India': { lat: 20.5937, lng: 78.9629 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
  }
  
  // Try exact match first
  const normalizedName = locationName.trim()
  if (coordinates[normalizedName]) {
    return coordinates[normalizedName]
  }
  
  // Try partial match
  const lowerName = normalizedName.toLowerCase()
  for (const [key, coord] of Object.entries(coordinates)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return coord
    }
  }
  
  // Default to Bengaluru if no match
  return coordinates['Bengaluru']
}

export function GoogleLocationMap({ 
  locations, 
  selectedLocation, 
  onLocationSelect, 
  className = '',
  height = '600px'
}: GoogleLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const router = useRouter()

  // Debug logging
  useEffect(() => {
    console.log('[GoogleLocationMap] Component state:', {
      locationsCount: locations.length,
      isLoaded,
      loadError,
      hasMapRef: !!mapRef.current,
      hasGoogleMap: !!googleMapRef.current,
      googleMapsAvailable: !!window.google?.maps
    })
  }, [locations, isLoaded, loadError])

  // Load Google Maps script
  useEffect(() => {
    // Check if already loaded
    if (window.googleMapsLoaded && window.google?.maps) {
      console.log('✅ Google Maps already loaded')
      setIsLoaded(true)
      return
    }

    // Check if currently loading
    if (window.googleMapsLoading) {
      console.log('⏳ Google Maps already loading, waiting...')
      
      // Wait for the script to load
      const checkLoaded = setInterval(() => {
        if (window.googleMapsLoaded && window.google?.maps) {
          console.log('✅ Google Maps finished loading')
          setIsLoaded(true)
          clearInterval(checkLoaded)
        }
      }, 100)
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded)
        if (!window.googleMapsLoaded) {
          console.error('❌ Google Maps took too long to load')
          setLoadError('Google Maps took too long to load')
          setIsLoaded(true)
          window.googleMapsLoading = false
        }
      }, 10000)
      
      return () => clearInterval(checkLoaded)
    }

    // Mark as loading
    window.googleMapsLoading = true
    console.log('🔄 Starting to load Google Maps...')

    // Get API key from environment variable or use fallback
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCB6N-qTKl-7sAByqi4_EnukJ8zBKHN4zQ'
    
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.id = 'google-maps-script'
    
    script.onload = () => {
      console.log('✅ Google Maps script loaded successfully')
      window.googleMapsLoaded = true
      window.googleMapsLoading = false
      setIsLoaded(true)
    }
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Google Maps script:', error)
      window.googleMapsLoading = false
      setLoadError('Failed to load Google Maps. Check API key and network connection.')
      setIsLoaded(true)
    }
    
    document.head.appendChild(script)

    return () => {
      // Don't remove the script on unmount
      // But if it's still loading and component unmounts, we keep the flag
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      console.log('Map initialization skipped:', { isLoaded, hasMapRef: !!mapRef.current })
      return
    }

    // Check if Google Maps loaded successfully
    if (!window.google?.maps) {
      console.error('Google Maps API not available')
      setLoadError('Google Maps failed to load')
      return
    }

    console.log('Initializing Google Map...')

    try {
      // Create map centered on Bengaluru
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 },
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      googleMapRef.current = map
      infoWindowRef.current = new google.maps.InfoWindow()
      
      console.log('Map initialized successfully')
    } catch (error) {
      console.error('Error initializing map:', error)
      setLoadError('Failed to initialize map')
    }

  }, [isLoaded])

  const updateMarkers = () => {
    if (!googleMapRef.current || !window.google?.maps) {
      console.log('updateMarkers skipped - map not ready')
      return
    }

    console.log('Updating markers for', locations.length, 'locations')

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    const bounds = new google.maps.LatLngBounds()

    locations.forEach(location => {
      const coords = getLocationCoordinates(location.name)
      if (!coords) return

      // Determine marker color based on risk level
      let markerColor = '#3B82F6' // blue
      if (location.riskLevel === 'high') markerColor = '#EF4444' // red
      else if (location.riskLevel === 'medium') markerColor = '#F97316' // orange

      const marker = new google.maps.Marker({
        position: coords,
        map: googleMapRef.current,
        title: location.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: markerColor,
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      })

      // Add click listener
      marker.addListener('click', () => {
        if (onLocationSelect) onLocationSelect(location)
        showInfoWindow(marker, location)
      })

      markersRef.current.push(marker)
      bounds.extend(coords)
    })

    // Fit map to show all markers
    if (locations.length > 0 && googleMapRef.current) {
      googleMapRef.current.fitBounds(bounds)
      
      // Don't zoom in too much for single location
      google.maps.event.addListenerOnce(googleMapRef.current, 'bounds_changed', () => {
        const zoom = googleMapRef.current?.getZoom()
        if (zoom && zoom > 15) {
          googleMapRef.current?.setZoom(15)
        }
      })
    }
  }

  const showInfoWindow = (marker: google.maps.Marker, location: Location) => {
    if (!infoWindowRef.current) return

    const getDominantSentiment = (sentiment?: Location['sentiment']) => {
      if (!sentiment) return 'neutral'
      const { positive = 0, negative = 0, neutral = 0 } = sentiment
      const max = Math.max(positive, negative, neutral)
      if (max === positive) return 'positive'
      if (max === negative) return 'negative'
      return 'neutral'
    }

    const sentimentColors: Record<string, string> = {
      positive: 'bg-green-500',
      negative: 'bg-red-500',
      neutral: 'bg-gray-500'
    }

    const sentiment = getDominantSentiment(location.sentiment)
    
    const content = `
      <div class="p-4 min-w-[280px]">
        <div class="flex items-start gap-3 mb-3">
          <div class="flex-1">
            <h3 class="font-bold text-base mb-1">${location.name}</h3>
            <span class="inline-block px-2 py-1 rounded text-xs ${sentimentColors[sentiment]} text-white">
              ${sentiment.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="bg-gray-50 rounded p-2">
            <div class="text-xs text-gray-500">Incidents</div>
            <div class="font-semibold">${location.incidents || 0}</div>
          </div>
          <div class="bg-gray-50 rounded p-2">
            <div class="text-xs text-gray-500">Mentions</div>
            <div class="font-semibold">${location.totalMentions}</div>
          </div>
        </div>
        
        <button 
          onclick="window.location.href='/locations/${location.id}'"
          class="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          View Details
        </button>
      </div>
    `

    infoWindowRef.current.setContent(content)
    infoWindowRef.current.open(googleMapRef.current, marker)
  }

  // Update markers when locations change
  useEffect(() => {
    updateMarkers()
  }, [locations])

  // Loading state
  if (!isLoaded) {
    return (
      <div 
        className={`relative bg-muted rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground mb-2">Loading Google Maps...</p>
          <p className="text-xs text-muted-foreground">
            Please wait...
          </p>
        </div>
      </div>
    )
  }

  // Error state - show fallback list
  if (loadError) {
    return (
      <div 
        className={`relative bg-muted rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <MapPin className="w-12 h-12 text-destructive mb-4" />
          <p className="text-foreground mb-2 font-semibold">Map Loading Failed</p>
          <p className="text-xs text-muted-foreground mb-4">
            {loadError}
          </p>
          
          {/* Simple list view as fallback */}
          <div className="mt-6 w-full max-w-md max-h-96 overflow-y-auto px-4">
            {locations.map(location => (
              <div 
                key={location.id}
                className="bg-background p-3 rounded-lg mb-2 cursor-pointer hover:bg-accent"
                onClick={() => router.push(`/locations/${location.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {location.totalMentions} mentions • {location.incidents || 0} incidents
                    </div>
                  </div>
                  {location.riskLevel && (
                    <Badge variant={location.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                      {location.riskLevel}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold mb-2">Risk Level</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Location count */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <div className="text-xs text-muted-foreground">Locations</div>
        <div className="text-lg font-bold">{locations.length}</div>
      </div>
    </div>
  )
}

