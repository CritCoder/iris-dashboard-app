'use client'

import { Hash, MapPin, User, Building, AlertTriangle, TrendingUp, MessageCircle, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedCard } from '@/components/ui/animated'

interface Entity {
  id: string
  name: string
  type: 'TOPIC' | 'LOCATION' | 'ENTITY' | 'PERSON' | 'ORGANIZATION' | 'THREAT' | 'KEYWORD'
  category?: string
  totalMentions?: number
  lastSeen?: string
  sentiment?: string
  description?: string
  riskLevel?: string
  sentimentScore?: number
  trendDirection?: 'up' | 'down' | 'stable'
}

interface EntityCardProps {
  entity: Entity
  onClick: () => void
}

export function EntityCard({ entity, onClick }: EntityCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TOPIC':
      case 'KEYWORD':
        return Hash
      case 'LOCATION':
        return MapPin
      case 'PERSON':
        return User
      case 'ORGANIZATION':
        return Building
      case 'THREAT':
        return AlertTriangle
      default:
        return Hash
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TOPIC':
      case 'KEYWORD':
        return 'text-blue-500 bg-blue-500/10'
      case 'LOCATION':
        return 'text-green-500 bg-green-500/10'
      case 'PERSON':
        return 'text-purple-500 bg-purple-500/10'
      case 'ORGANIZATION':
        return 'text-orange-500 bg-orange-500/10'
      case 'THREAT':
        return 'text-red-500 bg-red-500/10'
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

  const Icon = getTypeIcon(entity.type)

  return (
    <AnimatedCard>
      <Card 
        className="p-4 hover:bg-accent/5 transition-all cursor-pointer h-full flex flex-col group"
        onClick={onClick}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg ${getTypeColor(entity.type)} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {entity.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {entity.type}
              </Badge>
              {entity.category && (
                <Badge variant="outline" className="text-xs">
                  {entity.category.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {entity.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {entity.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium text-foreground">
              {entity.totalMentions?.toLocaleString() || 0}
            </span>
            <span>mentions</span>
          </div>
          {entity.lastSeen && (
            <span className="text-xs">
              {formatRelativeTime(entity.lastSeen)}
            </span>
          )}
        </div>

        {/* Sentiment & Risk */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {entity.sentiment && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getSentimentColor(entity.sentiment)}`}
              >
                {entity.sentiment}
              </Badge>
            )}
            {entity.riskLevel && entity.riskLevel !== 'LOW' && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getRiskColor(entity.riskLevel)}`}
              >
                {entity.riskLevel} Risk
              </Badge>
            )}
          </div>
          
          {entity.trendDirection && (
            <div className={`flex items-center gap-1 text-xs ${
              entity.trendDirection === 'up' ? 'text-green-500' : 
              entity.trendDirection === 'down' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              <TrendingUp className={`w-3 h-3 ${
                entity.trendDirection === 'down' ? 'rotate-180' : ''
              }`} />
              {entity.trendDirection}
            </div>
          )}
        </div>
      </Card>
    </AnimatedCard>
  )
}
