import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  value: string
  label: string
  sublabel?: string
  trend?: number
  accent?: boolean
}

function StatCard({ value, label, sublabel, trend, accent = false }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 card-hover pressable">
      <div className="flex items-start justify-between mb-2">
        <div className="text-4xl font-bold text-foreground">{value}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
            trend > 0 ? 'bg-secondary text-muted-foreground border-border' : 'bg-secondary text-muted-foreground border-border'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground font-medium mb-1">{label}</div>
      {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
      {accent && (
        <div className="mt-4 h-1 bg-primary/20 rounded-full" />
      )}
    </div>
  )
}

function SentimentBar({ positive }: { positive: number }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 card-hover pressable">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-4xl font-bold text-foreground">{positive}%</div>
        <div className="text-sm text-muted-foreground font-medium">Positive Sentiment</div>
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary/60 rounded-full"
          style={{ width: `${positive}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  )
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard value="14.2K" label="Total Posts" trend={12} accent />
      <StatCard value="830.4K" label="Total Engagement" trend={24} accent />
      <SentimentBar positive={34} />
      <StatCard value="34" label="Active Campaigns" trend={8} accent />
    </div>
  )
}
