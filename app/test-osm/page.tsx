'use client'

import { OSMLocationMap } from '@/components/ui/osm-location-map'

const testLocations = [
  {
    id: '1',
    name: 'Bengaluru',
    type: 'city',
    totalMentions: 1547,
    lastSeen: '2025-10-17',
    incidents: 23,
    engagement: 8945,
    riskLevel: 'medium' as const,
    sentiment: { positive: 856, negative: 423, neutral: 268 }
  },
  {
    id: '2',
    name: 'Koramangala',
    type: 'area',
    totalMentions: 892,
    lastSeen: '2025-10-17',
    incidents: 8,
    engagement: 5234,
    riskLevel: 'low' as const,
    sentiment: { positive: 634, negative: 123, neutral: 135 }
  },
  {
    id: '3',
    name: 'Whitefield',
    type: 'area',
    totalMentions: 1234,
    lastSeen: '2025-10-17',
    incidents: 45,
    engagement: 6789,
    riskLevel: 'high' as const,
    sentiment: { positive: 234, negative: 789, neutral: 211 }
  },
  {
    id: '4',
    name: 'HSR Layout',
    type: 'area',
    totalMentions: 756,
    lastSeen: '2025-10-17',
    incidents: 15,
    engagement: 4567,
    riskLevel: 'medium' as const,
    sentiment: { positive: 423, negative: 189, neutral: 144 }
  },
  {
    id: '5',
    name: 'Marathahalli',
    type: 'area',
    totalMentions: 645,
    lastSeen: '2025-10-17',
    incidents: 6,
    engagement: 3890,
    riskLevel: 'low' as const,
    sentiment: { positive: 489, negative: 89, neutral: 67 }
  },
  {
    id: '6',
    name: 'Bellandur',
    type: 'area',
    totalMentions: 523,
    lastSeen: '2025-10-17',
    incidents: 12,
    engagement: 3124,
    riskLevel: 'medium' as const,
    sentiment: { positive: 267, negative: 156, neutral: 100 }
  },
  {
    id: '7',
    name: 'Indiranagar',
    type: 'area',
    totalMentions: 934,
    lastSeen: '2025-10-17',
    incidents: 7,
    engagement: 5678,
    riskLevel: 'low' as const,
    sentiment: { positive: 678, negative: 134, neutral: 122 }
  },
  {
    id: '8',
    name: 'Electronic City',
    type: 'area',
    totalMentions: 1089,
    lastSeen: '2025-10-17',
    incidents: 32,
    engagement: 6234,
    riskLevel: 'high' as const,
    sentiment: { positive: 312, negative: 567, neutral: 210 }
  }
]

export default function TestOSMPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">OpenStreetMap Test</h1>
          <p className="text-muted-foreground">
            Testing OpenStreetMap with Leaflet - No API key required! 🎉
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Locations - Detailed Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {testLocations.map(loc => (
              <div key={loc.id} className="bg-muted p-4 rounded-lg border border-border">
                <div className="font-bold text-sm mb-2">{loc.name}</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Mentions:</span>
                    <span className="font-semibold">{loc.totalMentions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Incidents:</span>
                    <span className="font-semibold">{loc.incidents}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Engagement:</span>
                    <span className="font-semibold">{loc.engagement?.toLocaleString()}</span>
                  </div>
                  <div className="pt-1 border-t border-border">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-500">Positive:</span>
                      <span className="font-semibold">{loc.sentiment.positive}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-500">Negative:</span>
                      <span className="font-semibold">{loc.sentiment.negative}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Neutral:</span>
                      <span className="font-semibold">{loc.sentiment.neutral}</span>
                    </div>
                  </div>
                  <div className={`text-xs mt-2 font-bold text-center py-1 rounded ${
                    loc.riskLevel === 'high' ? 'bg-red-500/20 text-red-500' :
                    loc.riskLevel === 'medium' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {loc.riskLevel.toUpperCase()} RISK
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <OSMLocationMap
            locations={testLocations}
            height="600px"
          />
        </div>

        <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-green-400">✅ Benefits of OpenStreetMap:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>No API key required - completely free!</li>
            <li>No billing or credit card needed</li>
            <li>No usage limits or quotas</li>
            <li>Open source and community maintained</li>
            <li>Works offline if tiles are cached</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

