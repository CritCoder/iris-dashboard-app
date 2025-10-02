import { AlertTriangle, Lightbulb } from 'lucide-react'

interface InsightCardProps {
  icon: React.ElementType
  type: 'warning' | 'info'
  message: string
}

function InsightCard({ icon: Icon, type, message }: InsightCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg card-hover">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-secondary`}>
        <Icon className={`w-4 h-4 text-muted-foreground`} />
      </div>
      <div className="text-sm text-foreground leading-relaxed">{message}</div>
    </div>
  )
}

export function TopicSentimentHeatmap() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8 list-animate-in">
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-1">Topic Sentiment Heatmap</h2>
          <p className="text-sm text-muted-foreground">Track sentiment across 0 key issues</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Key Insights</h3>
        <div className="space-y-3 max-w-lg mx-auto">
          <InsightCard 
            icon={AlertTriangle}
            type="warning"
            message="Sentiment declining over time: 33 to 13 (-20 point change)"
          />
          <InsightCard 
            icon={Lightbulb}
            type="info"
            message="Highest sentiment on 2025-09-25: 37 score with 2586 posts"
          />
        </div>
      </div>
    </div>
  )
}
