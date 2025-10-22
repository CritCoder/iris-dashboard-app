'use client'

import { MapPin, TrendingUp, MessageCircle, Eye, Users, Globe, Building, Home } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedCard } from '@/components/ui/animated'

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

interface LocationCardProps {
  location: Location
  onClick: () => void
}

export function LocationCard({ location, onClick }: LocationCardProps) {
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'CITY':
        return Building
      case 'STATE':
      case 'REGION':
        return MapPin
      case 'COUNTRY':
        return Globe
      case 'ADDRESS':
        return Home
      case 'LANDMARK':
        return MapPin
      default:
        return MapPin
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'CITY':
        return 'text-blue-500 bg-blue-500/10'
      case 'STATE':
      case 'REGION':
        return 'text-green-500 bg-green-500/10'
      case 'COUNTRY':
        return 'text-purple-500 bg-purple-500/10'
      case 'ADDRESS':
        return 'text-orange-500 bg-orange-500/10'
      case 'LANDMARK':
        return 'text-pink-500 bg-pink-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE':
        return 'text-green-500 bg-green-500/10'
      case 'NEGATIVE':
        return 'text-red-500 bg-red-500/10'
      case 'NEUTRAL':
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel?.toUpperCase()) {
      case 'HIGH':
        return 'text-red-500 bg-red-500/10'
      case 'MEDIUM':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'LOW':
        return 'text-green-500 bg-green-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks < 4) return `${diffWeeks}w ago`
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths}mo ago`
  }

  const formatLocationName = (location: Location) => {
    if (location.city && location.state && location.country) {
      return `${location.city}, ${location.state}, ${location.country}`
    } else if (location.state && location.country) {
      return `${location.state}, ${location.country}`
    } else if (location.country) {
      return location.country
    }
    return location.name
  }

  const Icon = getTypeIcon(location.type)

  return (
    <AnimatedCard>
      <Card 
        className="p-4 hover:bg-accent/5 transition-all cursor-pointer h-full flex flex-col group"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg ${getTypeColor(location.type)} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {formatLocationName(location)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {location.type && (
                <Badge variant="secondary" className="text-xs">
                  {location.type}
                </Badge>
              )}
              {location.coordinates && (
                <Badge variant="outline" className="text-xs">
                  {location.coordinates.lat.toFixed(2)}, {location.coordinates.lng.toFixed(2)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {location.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {location.description}
          </p>
        )}

        {/* Stats */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium text-foreground">
                {location.totalMentions?.toLocaleString() || 0}
              </span>
              <span>mentions</span>
            </div>
            {location.lastSeen && (
              <span className="text-xs">
                {formatRelativeTime(location.lastSeen)}
              </span>
            )}
          </div>
          
          {(location.postCount || location.uniqueUsers || location.engagement) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {location.postCount && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{location.postCount} posts</span>
                </div>
              )}
              {location.uniqueUsers && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{location.uniqueUsers} users</span>
                </div>
              )}
              {location.engagement && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{location.engagement.toLocaleString()} engagement</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sentiment & Risk */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {location.sentiment && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getSentimentColor(location.sentiment)}`}
              >
                {location.sentiment}
              </Badge>
            )}
            {location.riskLevel && location.riskLevel !== 'LOW' && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getRiskColor(location.riskLevel)}`}
              >
                {location.riskLevel} Risk
              </Badge>
            )}
          </div>
          
          {location.trendDirection && (
            <div className={`flex items-center gap-1 text-xs ${
              location.trendDirection === 'up' ? 'text-green-500' : 
              location.trendDirection === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              <TrendingUp className={`w-3 h-3 ${
                location.trendDirection === 'down' ? 'rotate-180' : ''
              }`} />
              {location.trendDirection}
            </div>
          )}
        </div>
      </Card>
    </AnimatedCard>
  )
}
