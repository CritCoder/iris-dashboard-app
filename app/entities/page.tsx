'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, Hash, User, Building, AlertTriangle, TrendingUp, MessageSquare, Share2, ChevronRight, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Entity {
  id: string
  name: string
  type: 'TOPIC' | 'LOCATION' | 'ENTITY' | 'PERSON' | 'ORGANIZATION'
  mentions: number
  lastSeen: string
  icon: React.ElementType
}

const sampleEntities: Entity[] = [
  {
    id: '1',
    name: 'Real Estate',
    type: 'TOPIC',
    mentions: 2151,
    lastSeen: '11h ago',
    icon: Hash
  },
  {
    id: '2',
    name: 'Bellandur',
    type: 'LOCATION',
    mentions: 1784,
    lastSeen: '9h ago',
    icon: MapPin
  },
  {
    id: '3',
    name: 'Bellandur',
    type: 'ENTITY',
    mentions: 1530,
    lastSeen: '9h ago',
    icon: Building
  },
  {
    id: '4',
    name: 'rental property',
    type: 'TOPIC',
    mentions: 1388,
    lastSeen: '9h ago',
    icon: Hash
  },
  {
    id: '5',
    name: 'Bengaluru',
    type: 'LOCATION',
    mentions: 1064,
    lastSeen: '9h ago',
    icon: MapPin
  },
  {
    id: '6',
    name: 'Accommodation',
    type: 'TOPIC',
    mentions: 624,
    lastSeen: '11h ago',
    icon: Hash
  },
  {
    id: '7',
    name: 'Bangalore',
    type: 'LOCATION',
    mentions: 553,
    lastSeen: 'Just now',
    icon: MapPin
  },
  {
    id: '8',
    name: 'housing',
    type: 'TOPIC',
    mentions: 530,
    lastSeen: '9h ago',
    icon: Hash
  },
  {
    id: '9',
    name: 'HSR Layout',
    type: 'LOCATION',
    mentions: 507,
    lastSeen: '12h ago',
    icon: MapPin
  },
  {
    id: '10',
    name: 'Bangalore',
    type: 'ENTITY',
    mentions: 434,
    lastSeen: 'Just now',
    icon: Building
  },
  {
    id: '11',
    name: 'Bengaluru',
    type: 'ENTITY',
    mentions: 427,
    lastSeen: '9h ago',
    icon: Building
  },
  {
    id: '12',
    name: 'HSR Layout',
    type: 'ENTITY',
    mentions: 423,
    lastSeen: '12h ago',
    icon: Building
  },
  {
    id: '13',
    name: 'Flatmate Search',
    type: 'TOPIC',
    mentions: 396,
    lastSeen: '11h ago',
    icon: Hash
  },
  {
    id: '14',
    name: '2BHK',
    type: 'ENTITY',
    mentions: 374,
    lastSeen: '9h ago',
    icon: Building
  },
  {
    id: '15',
    name: 'Sarjapur Road',
    type: 'LOCATION',
    mentions: 350,
    lastSeen: '12h ago',
    icon: MapPin
  },
  {
    id: '16',
    name: 'Ecospace',
    type: 'ENTITY',
    mentions: 315,
    lastSeen: '13h ago',
    icon: Building
  },
  {
    id: '17',
    name: 'Apartment Listing',
    type: 'TOPIC',
    mentions: 299,
    lastSeen: '12h ago',
    icon: Hash
  },
  {
    id: '18',
    name: 'Kadubeesanahalli',
    type: 'ENTITY',
    mentions: 290,
    lastSeen: '12h ago',
    icon: Building
  },
  {
    id: '19',
    name: 'Kadubeesanahalli',
    type: 'LOCATION',
    mentions: 290,
    lastSeen: '12h ago',
    icon: MapPin
  },
  {
    id: '20',
    name: 'Sarjapur',
    type: 'LOCATION',
    mentions: 277,
    lastSeen: '12h ago',
    icon: MapPin
  }
]

function EntityCard({ entity, onClick }: { entity: Entity; onClick: () => void }) {
  const Icon = entity.icon
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TOPIC':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'LOCATION':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'ENTITY':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'PERSON':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'ORGANIZATION':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-muted-foreground bg-secondary border-border'
    }
  }

  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/50 transition-colors cursor-pointer hover:bg-accent/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{entity.name}</h3>
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(entity.type)}`}>
            {entity.type}
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
          Click to explore posts
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {entity.mentions.toLocaleString()} mentions
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
  onClick,
  count
}: { 
  label: string
  isActive?: boolean
  hasSubmenu?: boolean
  onClick?: () => void
  count?: number
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
      <div className="flex items-center gap-2">
        {count !== undefined && <span className="text-xs text-muted-foreground">{count}</span>}
        {hasSubmenu && <ChevronRight className="w-4 h-4" />}
      </div>
    </button>
  )
}

export default function EntitiesPage() {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all-entities')

  const filteredEntities = sampleEntities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filterOptions = [
    { id: 'all-entities', label: 'All Entities', count: sampleEntities.length },
    { id: 'topics', label: 'All Topics', count: sampleEntities.filter(e => e.type === 'TOPIC').length },
    { id: 'people', label: 'All People', count: sampleEntities.filter(e => e.type === 'PERSON').length },
    { id: 'organizations', label: 'All Organizations', count: sampleEntities.filter(e => e.type === 'ORGANIZATION').length },
    { id: 'high-impact', label: 'High Impact Entities', count: sampleEntities.filter(e => e.mentions > 1000).length },
    { id: 'trending', label: 'Trending Topics', count: sampleEntities.filter(e => e.lastSeen === 'Just now').length },
    { id: 'frequently-mentioned', label: 'Frequently Mentioned', count: sampleEntities.filter(e => e.mentions > 500).length },
    { id: 'negative', label: 'Negative Entities', count: 0 },
    { id: 'positive', label: 'Positive Entities', count: 0 },
    { id: 'controversial', label: 'Controversial', count: 0 },
    { id: 'locations', label: 'Locations', count: sampleEntities.filter(e => e.type === 'LOCATION').length },
    { id: 'threats', label: 'Threats', count: 0 },
    { id: 'keywords', label: 'Keywords', count: 0 }
  ]

  return (
    <PageLayout>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <PageHeader 
          title="Entities"
          description="Entity intelligence and relationship insights"
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-80 border-r border-border bg-muted/30 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Entities</h2>
              
              <FilterSection title="PRIMARY">
                <FilterItem 
                  label="All Entities" 
                  isActive={activeFilter === 'all-entities'}
                  onClick={() => setActiveFilter('all-entities')}
                  count={sampleEntities.length}
                />
                <FilterItem 
                  label="High Impact Entities"
                  onClick={() => setActiveFilter('high-impact')}
                  count={sampleEntities.filter(e => e.mentions > 1000).length}
                />
                <FilterItem 
                  label="Trending Topics"
                  onClick={() => setActiveFilter('trending')}
                  count={sampleEntities.filter(e => e.lastSeen === 'Just now').length}
                />
                <FilterItem 
                  label="Frequently Mentioned"
                  onClick={() => setActiveFilter('frequent')}
                  count={sampleEntities.filter(e => e.mentions > 500).length}
                />
              </FilterSection>

              <FilterSection title="ENTITY TYPES">
                <FilterItem 
                  label="All Topics"
                  onClick={() => setActiveFilter('topics')}
                  count={sampleEntities.filter(e => e.type === 'TOPIC').length}
                />
                <FilterItem 
                  label="All People"
                  onClick={() => setActiveFilter('people')}
                  count={sampleEntities.filter(e => e.type === 'PERSON').length}
                />
                <FilterItem 
                  label="All Organizations"
                  onClick={() => setActiveFilter('organizations')}
                  count={sampleEntities.filter(e => e.type === 'ORGANIZATION').length}
                />
                <FilterItem 
                  label="Locations"
                  onClick={() => setActiveFilter('locations')}
                  count={sampleEntities.filter(e => e.type === 'LOCATION').length}
                />
              </FilterSection>

              <FilterSection title="SENTIMENT BASED">
                <FilterItem 
                  label="Negative Entities"
                  onClick={() => setActiveFilter('negative')}
                  count={0}
                />
                <FilterItem 
                  label="Positive Entities"
                  onClick={() => setActiveFilter('positive')}
                  count={0}
                />
                <FilterItem 
                  label="Controversial"
                  onClick={() => setActiveFilter('controversial')}
                  count={0}
                />
              </FilterSection>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-2">
                    All Entities
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                </div>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search entities, topics, people, organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {filteredEntities.length} entities found
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEntities.map((entity) => (
                  <EntityCard 
                    key={entity.id} 
                    entity={entity} 
                    onClick={() => setSelectedEntity(entity)}
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