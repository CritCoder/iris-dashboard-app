import { AlertTriangle, Lightbulb, Hash } from 'lucide-react'

interface InsightCardProps {
  icon: React.ElementType
  type: 'warning' | 'info'
  message: string
}

function InsightCard({ icon: Icon, type, message }: InsightCardProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg card-hover">
      <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center bg-secondary`}>
        <Icon className={`w-3 h-3 text-muted-foreground`} />
      </div>
      <div className="text-[10px] text-foreground leading-relaxed">{message}</div>
    </div>
  )
}

export function TopicSentimentHeatmap() {
  // Using static data directly to avoid API dependency issues
  const topics = [
    { name: 'Police Reforms', sentiment: 75, posts: 1250, trend: 'up' },
    { name: 'Traffic Management', sentiment: 45, posts: 890, trend: 'down' },
    { name: 'Crime Prevention', sentiment: 82, posts: 2100, trend: 'up' },
    { name: 'Community Outreach', sentiment: 68, posts: 1560, trend: 'stable' },
    { name: 'Digital Initiatives', sentiment: 55, posts: 720, trend: 'up' },
    { name: 'Public Safety', sentiment: 78, posts: 1890, trend: 'up' }
  ]
  
  const avgSentiment = 68

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'bg-green-500'
    if (sentiment >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 list-animate-in h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-foreground">Topic Sentiment Heatmap</h2>
          </div>
          <p className="text-xs text-muted-foreground">Track sentiment across {topics.length} key issues</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-foreground">{avgSentiment}%</div>
          <div className="text-[10px] text-muted-foreground">Avg Sentiment</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="flex-1 overflow-y-auto mb-3 min-h-0">
        <div className="grid grid-cols-2 gap-2">
          {(topics || []).map((topic, index) => (
            <div key={index} className="p-2 bg-muted/30 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground">{topic.name}</span>
                <span className="text-[10px] text-muted-foreground">{getTrendIcon(topic.trend)}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getSentimentColor(topic.sentiment)} transition-all duration-300`}
                    style={{ width: `${topic.sentiment}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-foreground">{topic.sentiment}%</span>
              </div>
              <div className="text-[10px] text-muted-foreground">{topic.posts} posts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="flex-shrink-0">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">Key Insights</h3>
        <div className="space-y-2">
          <InsightCard
            icon={Lightbulb}
            type="info"
            message="Crime Prevention showing strongest positive sentiment"
          />
        </div>
      </div>
    </div>
  )
}
