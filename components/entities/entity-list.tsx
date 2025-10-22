'use client'

import { EntityCard } from './entity-card'
import { AnimatedGrid } from '@/components/ui/animated'

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

interface EntityListProps {
  entities: Entity[]
  onEntityClick: (entity: Entity) => void
  defaultView?: 'grid' | 'list'
}

export function EntityList({ entities, onEntityClick, defaultView = 'grid' }: EntityListProps) {
  if (defaultView === 'list') {
    return (
      <div className="space-y-4">
        {entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            onClick={() => onEntityClick(entity)}
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
      {entities.map((entity) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          onClick={() => onEntityClick(entity)}
        />
      ))}
    </AnimatedGrid>
  )
}
