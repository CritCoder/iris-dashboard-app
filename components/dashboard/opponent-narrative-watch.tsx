import { Target } from 'lucide-react'

export function OpponentNarrativeWatch() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 list-animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Opponent Narrative Watch</h2>
          <p className="text-sm text-muted-foreground">0 parties tracked · 0 total mentions</p>
        </div>
        <Target className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-foreground font-semibold mb-2">No Opponents Tracked</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          No opponent parties are currently being monitored. Set up tracking to monitor political opponents and their narratives.
        </p>
        <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors">
          Set Up Tracking
        </button>
      </div>
    </div>
  )
}
