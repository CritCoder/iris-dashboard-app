'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Search, MapPin, Hash, User, Building, AlertTriangle, TrendingUp, MessageSquare, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

function EntityCard({ entity }: { entity: Entity }) {
  const Icon = entity.icon
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TOPIC':
        return 'text-blue-400 bg-blue-900/20 border-blue-800/30'
      case 'LOCATION':
        return 'text-green-400 bg-green-900/20 border-green-800/30'
      case 'ENTITY':
        return 'text-purple-400 bg-purple-900/20 border-purple-800/30'
      case 'PERSON':
        return 'text-orange-400 bg-orange-900/20 border-orange-800/30'
      case 'ORGANIZATION':
        return 'text-red-400 bg-red-900/20 border-red-800/30'
      default:
        return 'text-zinc-400 bg-zinc-900/20 border-zinc-800/30'
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors cursor-pointer">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm mb-1 truncate">{entity.name}</h3>
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTypeColor(entity.type)}`}>
            {entity.type}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Mentions</span>
          <span className="text-sm font-semibold text-white">{entity.mentions.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Last Seen</span>
          <span className="text-xs text-zinc-400">{entity.lastSeen}</span>
        </div>
      </div>
    </div>
  )
}

export default function EntitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredEntities = sampleEntities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filterOptions = [
    { id: 'all', label: 'All Entities', count: sampleEntities.length },
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
      <div className="h-screen flex flex-col bg-black overflow-hidden">
      <PageHeader 
          title="Entity Explorer"
          description="20 entities found"
          centerContent={
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search entities, topics, people, organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 pl-10 pr-4 py-2 text-sm w-full"
              />
            </div>
          }
        actions={
            <Button className="gap-2" size="sm">
              <Share2 className="w-4 h-4" />
              Share via WhatsApp
          </Button>
        }
      />
      
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-80 border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
            <div className="p-6">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3">PRIMARY</h3>
                  <div className="space-y-1">
                    {filterOptions.slice(0, 4).map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFilter === filter.id
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.label}</span>
                          <span className="text-xs text-zinc-500">{filter.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3">ENGAGEMENT & IMPACT</h3>
                  <div className="space-y-1">
                    {filterOptions.slice(4, 7).map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFilter === filter.id
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.label}</span>
                          <span className="text-xs text-zinc-500">{filter.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3">SENTIMENT BASED</h3>
                  <div className="space-y-1">
                    {filterOptions.slice(7, 10).map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFilter === filter.id
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.label}</span>
                          <span className="text-xs text-zinc-500">{filter.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3">ENTITY TYPES</h3>
                  <div className="space-y-1">
                    {filterOptions.slice(10).map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFilter === filter.id
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{filter.label}</span>
                          <span className="text-xs text-zinc-500">{filter.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-black p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredEntities.map((entity) => (
                  <EntityCard key={entity.id} entity={entity} />
                ))}
          </div>
          </div>
          </div>
        </div>
        </div>
    </PageLayout>
  )
}